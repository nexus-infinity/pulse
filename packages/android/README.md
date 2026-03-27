# packages/android — PULSE-Android

**Status:** 🔨 Active development  
**Repo:** [nexus-infinity/PULSE-Android](https://github.com/nexus-infinity/PULSE-Android)  
**Device:** Samsung Galaxy S22  
**Stack:** React Native (TypeScript)

---

## Role: Sovereign Hub (Phase 1)

In Phase 1, PULSE-Android is the **hub** — it owns the device registry state, dispatches  
cast/AirPlay output to TV surfaces, polls LAN devices, and runs the spatial renderer.

When the NixOS server (Phase 2) is live, Android **demotes to controller** —  
it becomes a rich remote with BLE presence awareness, but state lives on the server.

---

## Active capabilities

- **BLE scanner** — detects device proximity, feeds `observe()` + `executeAction()`
- **Device registry** — all 10 Watts Parade systems, zone-mapped, alignment-tracked
- **Spatial renderer** — Veneer × Layer map of the house (36 zones, SVG overlays)
  - FlatPlanVeneer: floor plan image + react-native-svg polygon overlays
  - SpatialRenderer: veneer switcher + layer toggle (in progress)
- **Cast dispatcher** — Google Cast + AirPlay 2 output to TV surfaces
- **executeAction()** — typed action engine with proof receipts

---

## Key files

```
App.tsx                          ← Root: initRegistry on mount, BLE scan loop
src/
  deviceRegistry.ts              ← All known systems (canonical until shared migration)
  executeAction.ts               ← Action dispatcher
  spatial/
    SpatialTypes.ts              ← Veneer/layer type contracts
    ZoneGeometry.ts              ← 36 zone polygons from 1988 floor plan
    SpatialRenderer.tsx          ← Veneer switcher (TODO)
    veneers/
      FlatPlanVeneer.tsx         ← Floor plan + SVG overlays (complete)
      IsometricVeneer.tsx        ← (stub)
      ARVeneer.tsx               ← (stub)
    layers/
      ElectricalLayerData.ts     ← (stub — seed: SOFAR, DB board, solar conduit)
      PlumbingLayerData.ts       ← (stub — seed: gas HWU, furnace, booster)
      HVACLayerData.ts           ← (stub — heating system redesign needed)
      IrrigationLayerData.ts     ← (stub — garden microcosmos)
assets/
  floorplans/
    IMG_9254.jpeg                ← 1988 proposed floor plan (1:100 scale, source of truth)
  utilities/
    INDEX.md                     ← 24 utility photos mapped to equipment + integration notes
```

---

## Cast / AirPlay output surfaces

| Display | Protocol | Status |
|---------|----------|--------|
| Samsung TV (Study/Den) | AirPlay 2 | ✅ Ready — already Apple-approved |
| Apple TV (End Room, modern 4K) | AirPlay 2 / PULSE-tvOS | ✅ AirPlay now, native later |
| Apple TV (Family Room, older) | AirPlay 2 / PULSE-tvOS | ✅ AirPlay now, native later |
| Sony Bravia (Family Room) | via Apple TV | Display-only, no direct integration |
| Sonos Ray (Family Room) | LAN API (mDNS + HTTP) | Zone-aware audio alerts |

---

## What's next (YOLO phases)

- **P2b:** SpatialRenderer.tsx — veneer switcher + layer toggles
- **P3a:** ElectricalLayerData.ts — SOFAR solar, DB board, conduit nodes
- **P3b:** PlumbingLayerData.ts — gas HWU, furnace, booster
- **P4a:** Wire SpatialRenderer into App.tsx
- **P5:** OAW External Observer Seal
