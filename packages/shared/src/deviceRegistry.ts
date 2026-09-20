// PULSE Device Registry — canonical record of all known systems at
// 10 Watts Parade. Sovereign-first: this module holds data and pure-ish
// in-memory helpers only. Network/persistence side effects live in surface
// packages (Android, web API routes, NixOS services).

import type { ZoneId } from "./spatial/SpatialTypes";

export type DeviceCategory =
  | "solar"
  | "electrical"
  | "gas_heating"
  | "hot_water"
  | "av"
  | "security"
  | "networking"
  | "garden_irrigation";

export type DeviceStatus = "online" | "offline" | "attention" | "unknown";

/** A device or system record — the shape every surface reads and writes. */
export interface HouseSystem {
  id: string;
  name: string;
  category: DeviceCategory;
  zone: ZoneId;
  status: DeviceStatus;
  /** Transport/discovery protocol, e.g. "AirPlay 2", "mDNS + HTTP". */
  protocol?: string;
  /** Whether the system's observed state matches expected state. */
  aligned: boolean;
  /** ISO timestamp of the last successful observation. */
  lastObservedAt?: string;
  /** Why the system is currently flagged, when unaligned. */
  reason?: string;
  notes?: string;
}

/** A renovation / upgrade project attached to one or more zones. */
export interface HouseProject {
  id: string;
  name: string;
  zone: ZoneId;
  status: "planned" | "active" | "blocked" | "done";
  notes?: string;
}

/** Seed registry — the source of truth until the monorepo migration sprint. */
export const DEVICE_REGISTRY: HouseSystem[] = [
  {
    id: "solar.sofar.inverter",
    name: "SOFAR 21kVA 3-phase Inverter",
    category: "solar",
    zone: "UTILITY_SOLAR",
    status: "online",
    protocol: "Modbus TCP (LAN)",
    aligned: true,
    notes: "Primary generation. 3-phase export monitored.",
  },
  {
    id: "electrical.db.board",
    name: "Main Distribution Board",
    category: "electrical",
    zone: "UTILITY_SOLAR",
    status: "online",
    aligned: true,
    notes: "Solar conduit + household circuits.",
  },
  {
    id: "gas.landisgyr.meter",
    name: "Landis+Gyr Gas Meter",
    category: "gas_heating",
    zone: "UTILITY_METER",
    status: "unknown",
    aligned: false,
    reason: "No sovereign read path yet — manual read only.",
  },
  {
    id: "heating.gas.furnace",
    name: "Ducted Gas Furnace",
    category: "gas_heating",
    zone: "INDOOR_HALL",
    status: "online",
    aligned: true,
    notes: "Slated for electric redesign (Phase 2).",
  },
  {
    id: "hotwater.gas.hwu",
    name: "Gas Hot Water Unit",
    category: "hot_water",
    zone: "OUTBUILD_GARAGE",
    status: "online",
    aligned: true,
  },
  {
    id: "av.samsung.tv.study",
    name: "Samsung TV (Study/Den)",
    category: "av",
    zone: "INDOOR_STUDY",
    status: "online",
    protocol: "AirPlay 2",
    aligned: true,
    notes: "2019+ Samsung — native AirPlay 2, no SmartThings needed.",
  },
  {
    id: "av.appletv.endroom",
    name: "Apple TV 4K (End Room)",
    category: "av",
    zone: "INDOOR_ENDROOM",
    status: "online",
    protocol: "AirPlay 2",
    aligned: true,
  },
  {
    id: "av.appletv.family",
    name: "Apple TV (Family Room)",
    category: "av",
    zone: "INDOOR_FAMILY",
    status: "online",
    protocol: "AirPlay 2",
    aligned: true,
  },
  {
    id: "av.sony.bravia.family",
    name: "Sony Bravia LCD (Family Room)",
    category: "av",
    zone: "INDOOR_FAMILY",
    status: "offline",
    aligned: false,
    reason: "Display-only via Apple TV HDMI — no direct integration.",
  },
  {
    id: "av.sonos.ray.family",
    name: "Sonos Ray",
    category: "av",
    zone: "INDOOR_FAMILY",
    status: "online",
    protocol: "mDNS + HTTP (LAN API)",
    aligned: true,
    notes: "Optical from Apple TV. Zone-aware audio alerts.",
  },
  {
    id: "av.bo.beoplay8",
    name: "B&O BeoPlay 8",
    category: "av",
    zone: "INDOOR_MASTER",
    status: "unknown",
    aligned: false,
    reason: "Discovery path not yet implemented.",
  },
  {
    id: "net.router.core",
    name: "Core LAN Router",
    category: "networking",
    zone: "INDOOR_STUDY",
    status: "online",
    protocol: "Ethernet",
    aligned: true,
    notes: "Sovereign LAN backbone — all surfaces route through here.",
  },
  {
    id: "security.frontdoor.sensor",
    name: "Front Door Sensor",
    category: "security",
    zone: "INDOOR_ENTRY",
    status: "online",
    aligned: true,
  },
  {
    id: "garden.irrigation.controller",
    name: "Irrigation Controller",
    category: "garden_irrigation",
    zone: "GARDEN_REAR",
    status: "attention",
    aligned: false,
    reason: "Sector schedule undefined — garden microcosmos pending.",
  },
];

/** Seed project list — renovation/upgrade tracking. */
export const HOUSE_PROJECTS: HouseProject[] = [
  {
    id: "proj.heating.electrify",
    name: "Electrify heating (gas → electric)",
    zone: "INDOOR_HALL",
    status: "planned",
    notes: "Zone-by-zone. Concrete slab constraints to assess.",
  },
  {
    id: "proj.irrigation.microcosmos",
    name: "Garden microcosmos irrigation",
    zone: "GARDEN_REAR",
    status: "blocked",
    notes: "Awaiting soil moisture + flow sensor selection.",
  },
];

// --- In-memory registry helpers -------------------------------------------
// A minimal store so surfaces have a consistent alignment model. In the
// Android app this merges AsyncStorage; here it operates on cloned seed data.

let _registry: HouseSystem[] = [];

/** Load (and clone) the registry. Optionally merge a persisted overlay. */
export function initRegistry(
  seed: HouseSystem[] = DEVICE_REGISTRY,
  overlay: Partial<Record<string, Partial<HouseSystem>>> = {},
): HouseSystem[] {
  _registry = seed.map((device) => {
    const patch = overlay[device.id];
    return patch ? { ...device, ...patch } : { ...device };
  });
  return getRegistry();
}

/** Current registry, initialising lazily from the seed if untouched. */
export function getRegistry(): HouseSystem[] {
  if (_registry.length === 0) {
    initRegistry();
  }
  return _registry;
}

/** Find a single system by id. */
export function getDevice(id: string): HouseSystem | undefined {
  return getRegistry().find((device) => device.id === id);
}

/**
 * Mark a device observed: record the timestamp, bring it online, and run an
 * alignment check (an online device with no outstanding reason is aligned).
 * Returns the updated device, or undefined if the id is unknown.
 */
export function observe(
  id: string,
  at: string = new Date().toISOString(),
): HouseSystem | undefined {
  const device = getDevice(id);
  if (!device) {
    return undefined;
  }
  device.lastObservedAt = at;
  if (!device.reason) {
    device.status = "online";
    device.aligned = true;
  }
  return device;
}

/**
 * Flag a system as needing attention. Returns the updated device, or
 * undefined if the id is unknown.
 */
export function flagUnaligned(id: string, reason: string): HouseSystem | undefined {
  const device = getDevice(id);
  if (!device) {
    return undefined;
  }
  device.aligned = false;
  device.status = "attention";
  device.reason = reason;
  return device;
}

/** Count of systems currently needing attention (unaligned). */
export function unalignedCount(registry: HouseSystem[] = getRegistry()): number {
  return registry.filter((device) => !device.aligned).length;
}
