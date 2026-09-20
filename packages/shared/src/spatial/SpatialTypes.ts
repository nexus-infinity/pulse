// PULSE Spatial — type contracts for the Veneer × Layer renderer.
//
// Design decisions (see packages/shared/README.md):
//  - All polygon coordinates are normalised to 0–1 relative to the floor-plan
//    bounding box. Scale to any veneer size at render time using width/height.
//  - Veneer (visual style) is orthogonal to Layer (data overlay). The
//    VENEER_LAYER_SUPPORT matrix constrains which combinations are valid.

/** A point in normalised floor-plan space. Both axes are 0–1. */
export interface Point {
  x: number;
  y: number;
}

/** Which physical level of the property a zone belongs to. */
export type LevelTag = "ground" | "upper" | "outdoor" | "underground";

/**
 * Canonical zone identifiers. Naming convention (see README):
 *   INDOOR_<ROOM>, OUTBUILD_<NAME>, GARDEN_<AREA>, UTILITY_<NODE>
 *
 * This is the full universe of ids the renderer and device registry may
 * reference. The 1988 floor plan defines 36 zones; a representative subset is
 * geometrically modelled in ZoneGeometry.ts.
 */
export const ZONE_IDS = [
  "INDOOR_MASTER",
  "INDOOR_BED2",
  "INDOOR_BED3",
  "INDOOR_LAUNDRY",
  "INDOOR_HALL",
  "INDOOR_BATH",
  "INDOOR_ENTRY",
  "INDOOR_STUDY",
  "INDOOR_DINING",
  "INDOOR_KITCHEN",
  "INDOOR_FAMILY",
  "INDOOR_ENDROOM",
  "GARDEN_FRONT",
  "GARDEN_REAR",
  "OUTBUILD_GARAGE",
  "OUTBUILD_STUDIO",
  "UTILITY_METER",
  "UTILITY_SOLAR",
] as const;

export type ZoneId = (typeof ZONE_IDS)[number];

/** A single room/zone: its polygon, level, and precomputed centroid. */
export interface ZoneGeometry {
  id: ZoneId;
  /** Human-readable label for display. */
  label: string;
  level: LevelTag;
  /** Ordered polygon vertices in normalised 0–1 space. */
  polygon: Point[];
  /** Centroid in normalised space — precomputed via centroidOf(). */
  centroid: Point;
}

/** Visual style of the spatial map. */
export type VeneerId = "flat_plan" | "isometric" | "watercolour" | "ar";

/** Data overlay drawn on top of a veneer. */
export type LayerId =
  | "devices"
  | "electrical"
  | "plumbing"
  | "hvac"
  | "irrigation"
  | "solar"
  | "security"
  | "underground";

export const VENEER_IDS: readonly VeneerId[] = [
  "flat_plan",
  "isometric",
  "watercolour",
  "ar",
];

export const LAYER_IDS: readonly LayerId[] = [
  "devices",
  "electrical",
  "plumbing",
  "hvac",
  "irrigation",
  "solar",
  "security",
  "underground",
];

/**
 * Which layers each veneer is able to render. Veneer and layer are otherwise
 * orthogonal — this matrix only encodes rendering feasibility.
 */
export const VENEER_LAYER_SUPPORT: Record<VeneerId, LayerId[]> = {
  flat_plan: [...LAYER_IDS],
  isometric: [
    "devices",
    "electrical",
    "plumbing",
    "hvac",
    "irrigation",
    "solar",
    "security",
  ],
  watercolour: ["devices", "solar", "security"],
  ar: ["devices", "electrical", "plumbing", "hvac"],
};

/** True if a (veneer, layer) combination is renderable. */
export function isVeneerLayerSupported(veneer: VeneerId, layer: LayerId): boolean {
  return VENEER_LAYER_SUPPORT[veneer].includes(layer);
}

/** Props contract shared by every veneer renderer across all surfaces. */
export interface SpatialMapProps {
  veneer: VeneerId;
  layer: LayerId;
  /** Render width in px — polygons are scaled from normalised space. */
  width: number;
  /** Render height in px. */
  height: number;
  zones: ZoneGeometry[];
  activeZoneId?: ZoneId;
  onZoneSelect?: (id: ZoneId) => void;
}

/**
 * Area-weighted centroid of a polygon in normalised space.
 * Falls back to the vertex average for degenerate (zero-area) polygons.
 */
export function centroidOf(polygon: Point[]): Point {
  if (polygon.length === 0) {
    return { x: 0, y: 0 };
  }
  if (polygon.length < 3) {
    return averageOf(polygon);
  }

  let areaAcc = 0;
  let cx = 0;
  let cy = 0;

  for (let i = 0; i < polygon.length; i++) {
    const current = polygon[i]!;
    const next = polygon[(i + 1) % polygon.length]!;
    const cross = current.x * next.y - next.x * current.y;
    areaAcc += cross;
    cx += (current.x + next.x) * cross;
    cy += (current.y + next.y) * cross;
  }

  const area = areaAcc / 2;
  if (area === 0) {
    return averageOf(polygon);
  }

  return {
    x: cx / (6 * area),
    y: cy / (6 * area),
  };
}

function averageOf(points: Point[]): Point {
  const sum = points.reduce(
    (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
    { x: 0, y: 0 },
  );
  return { x: sum.x / points.length, y: sum.y / points.length };
}
