# PULSE — Sovereign Home OS

**Location:** 10 Watts Parade, Mount Eliza, VIC  
**Hub device:** Samsung Galaxy S22 (PULSE-Android)  
**Philosophy:** Sovereign-first. No cloud dependencies for core function. All data stays on LAN.

---

## What is PULSE?

PULSE is the operating system for a home — not a smart-home app, not a dashboard.  
It knows where things are, what state they're in, and what needs attention.  
It runs everywhere the resident is: phone, TV, browser, car, server.

---

## Surface Map

```
PULSE-Android (Samsung S22)
│
│  ← sovereign hub · always-on controller · cast dispatcher
│
├── Google Cast ─────────── Chromecast, Android TV, Cast-enabled displays
├── AirPlay 2 ───────────── Samsung TV (Study/Den), Apple TV (End Room + Family Room)
├── PULSE-web ───────────── Browser dashboard — any screen, any device
│
├── [post-DOJO] NixOS ───── BearsiMac (iMac 2019) — always-on LAN server
│                           PULSE demotes Android to controller; server becomes hub
│
├── [future] PULSE-tvOS ─── Native SwiftUI app, Apple TV remote UX, 10-foot interface
└── [future] PULSE-car ──── Apple CarPlay + Android Auto — driving profile, alerts, nav
```

---

## Packages

| Package | Status | Role |
|---------|--------|------|
| [`packages/shared`](./packages/shared) | 🔨 Active | Types, device registry, zone geometry, action contracts |
| [`packages/android`](./packages/android) | 🔨 Active | Samsung S22 hub app (React Native) |
| [`packages/web`](./packages/web) | 🔨 Active | Browser dashboard (Next.js) |
| [`packages/nixos`](./packages/nixos) | 📋 Stub | NixOS module — BearsiMac sovereign server (post Field-MacOS-DOJO) |
| [`packages/tvos`](./packages/tvos) | 📋 Stub | Native Apple TV app (SwiftUI) |
| [`packages/car`](./packages/car) | 📋 Stub | CarPlay + Android Auto driving profile |

---

## Active Repositories (pre-monorepo migration)

During the scaffolding phase, active development lives in:
- **Android hub:** [nexus-infinity/PULSE-Android](https://github.com/nexus-infinity/PULSE-Android)
- **Web dashboard:** [nexus-infinity/v0-Pulse-web](https://github.com/nexus-infinity/v0-Pulse-web)
- **NixOS config:** [nexus-infinity/Field-NixOS-SOMA](https://github.com/nexus-infinity/Field-NixOS-SOMA) (SOMA / BearsiMac)

Migration to this monorepo happens when Field-MacOS-DOJO reaches completion.

---

## Spatial Architecture

The house is modelled as **36 named zones** from the 1988 Christopher Lawrence floor plan.  
Each zone has a polygon (normalised 0–1 coords), level tag, and device pins.

Zones drive everything: BLE presence, heating zones, irrigation sectors, AV routing, security.

Visual rendering uses a **Veneer × Layer** system:
- **Veneer** = visual style (`flat_plan`, `isometric`, `watercolour`, `ar`)  
- **Layer** = data overlay (`devices`, `electrical`, `plumbing`, `hvac`, `irrigation`, `solar`, `security`, `underground`)

---

## Device Registry (source of truth)

All known systems at 10 Watts Parade live in `packages/shared/src/deviceRegistry.ts`.  
Categories: solar, electrical, gas/heating, hot water, AV, security, networking, garden/irrigation.

Key systems registered:
- SOFAR Solar 21kVA 3-phase inverter
- Landis+Gyr gas meter  
- Samsung TV (AirPlay 2, Study/Den)
- Apple TV x2 (End Room + Family Room)
- Sony Bravia LCD (Family Room — display only)
- Sonos Ray (optical, sovereign LAN API)
- B&O BeoPlay 8

---

## Surface Interaction Profiles

| Surface | Interaction model | PULSE profile |
|---------|-------------------|---------------|
| Android (S22) | Touch, full control | Full — hub mode |
| TV (Cast / AirPlay) | 10-foot, passive | Ambient display — zone state, alerts |
| Web | Mouse / keyboard | Dashboard + admin + layer editor |
| NixOS server | Headless daemon | Always-on brain — polling, persistence, API |
| tvOS native | Remote + Siri | Rich 10-foot — room nav, device control |
| CarPlay / Auto | Voice + minimal tap | Alert + ETA-aware home mode triggers |

---

## Development Phases

| Phase | Condition | Work |
|-------|-----------|------|
| 1 — Active now | PULSE-Android as hub | Spatial renderer, layer data, cast output |
| 2 — Post Field-MacOS-DOJO | NixOS BearsiMac live | Migrate hub to server, Android becomes controller |
| 3 — Mature | Phase 2 stable | tvOS native, CarPlay/Auto driving profile |

---

## Naming Conventions

- Zones: `INDOOR_<ROOM>`, `OUTBUILD_<NAME>`, `GARDEN_<AREA>`, `UTILITY_<NODE>`
- Devices: `HouseSystem` type — see `packages/shared/src/deviceRegistry.ts`
- Veneers: lowercase snake_case (`flat_plan`, `isometric`, `ar`)
- Layers: lowercase snake_case (`electrical`, `plumbing`, `hvac`)

---

*PULSE is part of the FIELD sovereign AI stack. Field-MacOS-DOJO is the parent intelligence layer.*
