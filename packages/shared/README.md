# packages/shared — PULSE Shared Core

**Status:** 🔨 Active (types living in PULSE-Android, migrating here)

The single source of truth for all PULSE surfaces.  
Every package — Android, web, NixOS, tvOS, car — imports from here.

---

## What lives here

### Types & Contracts
- `HouseSystem` — device/system record shape
- `HouseProject` — renovation / upgrade project shape
- `ZoneGeometry` — room polygon + level + centroid
- `ZoneId` — canonical zone identifier enum
- `SpatialMapProps` — veneer/layer renderer contract
- `VeneerId`, `LayerId` — surface rendering identifiers
- `ActionPayload` — typed `executeAction()` contract

### Data
- `deviceRegistry.ts` — all known systems at 10 Watts Parade
- `ZoneGeometry.ts` — 36 room polygons from 1988 floor plan (normalised 0–1)
- `ZONE_POLYGON_MAP` — O(1) zone lookup by ZoneId

### Utilities
- `centroidOf(polygon)` — compute polygon centroid
- `initRegistry()` — load + merge AsyncStorage state
- `observe(device)` — mark device observed, fire alignment check
- `flagUnaligned(id, reason)` — surface a system needing attention
- `executeAction(type, payload)` — typed action dispatcher with proof receipts

---

## Migration plan

Currently in: `nexus-infinity/PULSE-Android/src/`  
Target: this package  
Trigger: Field-MacOS-DOJO completion → monorepo migration sprint

Until migration, treat `PULSE-Android/src/deviceRegistry.ts` and  
`PULSE-Android/src/spatial/SpatialTypes.ts` as the canonical source.

---

## Key design decisions

**Normalised 0–1 zone coordinates** — all polygons are relative to floor plan bounding box.  
Scale to any veneer size at render time using `width` / `height` from `SpatialMapProps`.

**Veneer × Layer orthogonality** — visual style is independent of data layer.  
`VENEER_LAYER_SUPPORT` matrix in `SpatialTypes.ts` constrains valid combinations.

**Sovereign-first** — no external API calls from shared. Side effects live in surface packages.
