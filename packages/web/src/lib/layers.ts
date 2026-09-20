import type { DeviceCategory, HouseSystem, LayerId } from "@pulse/shared";

/** Which device categories each data layer surfaces. Empty = structural layer. */
const LAYER_CATEGORY_MAP: Record<LayerId, DeviceCategory[] | "all"> = {
  devices: "all",
  electrical: ["electrical", "solar"],
  plumbing: ["hot_water", "gas_heating"],
  hvac: ["gas_heating"],
  irrigation: ["garden_irrigation"],
  solar: ["solar"],
  security: ["security"],
  underground: [],
};

/** Filter devices to those relevant for the active layer. */
export function devicesForLayer(devices: HouseSystem[], layer: LayerId): HouseSystem[] {
  const spec = LAYER_CATEGORY_MAP[layer];
  if (spec === "all") return devices;
  return devices.filter((d) => spec.includes(d.category));
}
