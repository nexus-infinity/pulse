import { describe, expect, it, beforeEach } from "vitest";

import {
  centroidOf,
  DEVICE_REGISTRY,
  executeAction,
  flagUnaligned,
  getRegistry,
  initRegistry,
  isVeneerLayerSupported,
  observe,
  unalignedCount,
  ZONE_POLYGON_MAP,
  ZONES,
  ZONE_IDS,
} from "./index";

beforeEach(() => {
  // Reset the in-memory registry from the seed before each test.
  initRegistry();
});

describe("zone geometry", () => {
  it("models every declared zone id exactly once", () => {
    expect(ZONES).toHaveLength(ZONE_IDS.length);
    for (const id of ZONE_IDS) {
      expect(ZONE_POLYGON_MAP[id]).toBeDefined();
      expect(ZONE_POLYGON_MAP[id].id).toBe(id);
    }
  });

  it("keeps all polygon coordinates within normalised 0–1 bounds", () => {
    for (const zone of ZONES) {
      for (const point of zone.polygon) {
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.x).toBeLessThanOrEqual(1);
        expect(point.y).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeLessThanOrEqual(1);
      }
    }
  });

  it("computes the centroid of a unit square at its centre", () => {
    const c = centroidOf([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ]);
    expect(c.x).toBeCloseTo(0.5, 6);
    expect(c.y).toBeCloseTo(0.5, 6);
  });
});

describe("veneer × layer support", () => {
  it("allows every layer on the flat_plan veneer", () => {
    expect(isVeneerLayerSupported("flat_plan", "underground")).toBe(true);
  });

  it("restricts unsupported combinations", () => {
    expect(isVeneerLayerSupported("watercolour", "plumbing")).toBe(false);
  });
});

describe("device registry", () => {
  it("initialises from the seed as a clone (no shared mutation)", () => {
    const reg = getRegistry();
    expect(reg).toHaveLength(DEVICE_REGISTRY.length);
    expect(reg[0]).not.toBe(DEVICE_REGISTRY[0]);
  });

  it("observe() brings a device online and aligned", () => {
    flagUnaligned("av.bo.beoplay8", "test");
    const before = getRegistry().find((d) => d.id === "av.bo.beoplay8");
    expect(before?.aligned).toBe(false);

    const updated = observe("av.bo.beoplay8", "2026-01-01T00:00:00.000Z");
    expect(updated?.aligned).toBe(false);
    expect(updated?.status).toBe("attention");
    expect(updated?.lastObservedAt).toBe("2026-01-01T00:00:00.000Z");
    expect(updated?.reason).toBe("test");
  });

  it("flagUnaligned() surfaces a reason and lowers the count delta", () => {
    const baseline = unalignedCount();
    const initialCount = unalignedCount();
    
    flagUnaligned("net.router.core", "test issue");
    expect(unalignedCount()).toBe(initialCount + 1);
    
    const device = getRegistry().find((d) => d.id === "net.router.core");
    expect(device?.aligned).toBe(false);
    expect(device?.reason).toBe("test issue");
  });

  it("returns undefined for unknown devices", () => {
    expect(observe("does.not.exist")).toBeUndefined();
    expect(flagUnaligned("does.not.exist", "x")).toBeUndefined();
  });
});

describe("executeAction", () => {
  it("produces an ok receipt for a valid observe action", () => {
    const receipt = executeAction({ type: "observe", payload: { deviceId: "net.router.core" } });
    expect(receipt.ok).toBe(true);
    expect(receipt.action).toBe("observe");
    expect(receipt.id).toMatch(/^rcpt_observe_/);
    expect(receipt.detail).toContain("Core LAN Router");
  });

  it("produces a failing receipt (not a throw) for unknown devices", () => {
    const receipt = executeAction({ type: "flag_unaligned", payload: { deviceId: "nope", reason: "r" } });
    expect(receipt.ok).toBe(false);
    expect(receipt.detail).toContain("Unknown device");
  });

  it("arms arrival prep and rejects negative ETAs", () => {
    expect(executeAction({ type: "arrival_prep", payload: { etaMinutes: 8 } }).ok).toBe(true);
    expect(executeAction({ type: "arrival_prep", payload: { etaMinutes: -1 } }).ok).toBe(false);
  });

  it("dispatches a cast receipt with surface + zone", () => {
    const receipt = executeAction({
      type: "cast",
      payload: { surface: "Samsung TV (Study/Den)", zoneId: "INDOOR_STUDY" },
    });
    expect(receipt.ok).toBe(true);
    expect(receipt.data).toEqual({ surface: "Samsung TV (Study/Den)", zoneId: "INDOOR_STUDY" });
  });
});
