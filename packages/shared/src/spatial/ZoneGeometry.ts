// PULSE Zone Geometry — room polygons from the 1988 Christopher Lawrence
// floor plan of 10 Watts Parade, normalised to 0–1.
//
// The full plan defines 36 zones; this module models a representative subset
// covering the main dwelling, garden, outbuildings, and utility nodes. Each
// polygon is a normalised footprint; centroids are derived via centroidOf() so
// there is a single source of truth for zone geometry.

import {
  centroidOf,
  type LevelTag,
  type Point,
  type ZoneGeometry,
  type ZoneId,
} from "./SpatialTypes";

/** Axis-aligned rectangle helper: builds a 4-point polygon (clockwise). */
function rect(x0: number, y0: number, x1: number, y1: number): Point[] {
  return [
    { x: x0, y: y0 },
    { x: x1, y: y0 },
    { x: x1, y: y1 },
    { x: x0, y: y1 },
  ];
}

interface ZoneSeed {
  id: ZoneId;
  label: string;
  level: LevelTag;
  polygon: Point[];
}

// Layout (normalised, y grows downward as in SVG):
//   Left bedroom column   x[0.06, 0.24]
//   Hall corridor         x[0.24, 0.30]
//   Central rooms column  x[0.30, 0.44]
//   Living column         x[0.44, 0.60]
//   Garden strip          x[0.62, 0.96]
//   Outbuildings/utility  bottom strip y[0.82, 0.96]
const ZONE_SEEDS: ZoneSeed[] = [
  // Left bedroom column
  { id: "INDOOR_MASTER", label: "Master Bedroom", level: "ground", polygon: rect(0.06, 0.1, 0.24, 0.3) },
  { id: "INDOOR_BED2", label: "Bedroom 2", level: "ground", polygon: rect(0.06, 0.3, 0.24, 0.48) },
  { id: "INDOOR_BED3", label: "Bedroom 3", level: "ground", polygon: rect(0.06, 0.48, 0.24, 0.64) },
  { id: "INDOOR_LAUNDRY", label: "Laundry", level: "ground", polygon: rect(0.06, 0.64, 0.24, 0.78) },

  // Hall corridor
  { id: "INDOOR_HALL", label: "Hall", level: "ground", polygon: rect(0.24, 0.1, 0.3, 0.78) },

  // Central rooms column
  { id: "INDOOR_BATH", label: "Bathroom", level: "ground", polygon: rect(0.3, 0.1, 0.44, 0.24) },
  { id: "INDOOR_ENTRY", label: "Entry", level: "ground", polygon: rect(0.3, 0.24, 0.44, 0.4) },
  { id: "INDOOR_STUDY", label: "Study / Den", level: "ground", polygon: rect(0.3, 0.4, 0.44, 0.58) },
  { id: "INDOOR_DINING", label: "Dining", level: "ground", polygon: rect(0.3, 0.58, 0.44, 0.78) },

  // Living column
  { id: "INDOOR_KITCHEN", label: "Kitchen", level: "ground", polygon: rect(0.44, 0.1, 0.6, 0.3) },
  { id: "INDOOR_FAMILY", label: "Family Room", level: "ground", polygon: rect(0.44, 0.3, 0.6, 0.54) },
  { id: "INDOOR_ENDROOM", label: "End Room", level: "ground", polygon: rect(0.44, 0.54, 0.6, 0.78) },

  // Garden strip
  { id: "GARDEN_FRONT", label: "Front Garden", level: "outdoor", polygon: rect(0.62, 0.1, 0.96, 0.44) },
  { id: "GARDEN_REAR", label: "Rear Garden", level: "outdoor", polygon: rect(0.62, 0.44, 0.96, 0.78) },

  // Outbuildings + utility nodes (bottom strip)
  { id: "OUTBUILD_GARAGE", label: "Garage", level: "outdoor", polygon: rect(0.06, 0.82, 0.3, 0.96) },
  { id: "OUTBUILD_STUDIO", label: "Studio", level: "outdoor", polygon: rect(0.32, 0.82, 0.52, 0.96) },
  { id: "UTILITY_METER", label: "Meter Node", level: "outdoor", polygon: rect(0.54, 0.82, 0.68, 0.96) },
  { id: "UTILITY_SOLAR", label: "Solar / DB Node", level: "outdoor", polygon: rect(0.7, 0.82, 0.96, 0.96) },
];

/** All modelled zones, each with a derived centroid. */
export const ZONES: ZoneGeometry[] = ZONE_SEEDS.map((seed) => ({
  ...seed,
  centroid: centroidOf(seed.polygon),
}));

/** O(1) lookup of a zone by its ZoneId. */
export const ZONE_POLYGON_MAP: Record<ZoneId, ZoneGeometry> = Object.fromEntries(
  ZONES.map((zone) => [zone.id, zone]),
) as Record<ZoneId, ZoneGeometry>;

/** Convenience accessor returning undefined for unmodelled ids. */
export function getZone(id: ZoneId): ZoneGeometry | undefined {
  return ZONE_POLYGON_MAP[id];
}
