# packages/web — PULSE-web

**Status:** 🔨 Active  
**Repo:** [nexus-infinity/v0-Pulse-web](https://github.com/nexus-infinity/v0-Pulse-web)  
**Stack:** Next.js (TypeScript)  
**Deployment:** Vercel (preview) → LAN-served from NixOS (Phase 2)

---

## Role: Browser Dashboard + AirPlay Cast Target

PULSE-web serves two purposes:

1. **Admin dashboard** — full layer editor, device management, zone config, project tracking
2. **Cast target** — PULSE-Android casts this to Samsung TV or Apple TVs via AirPlay 2

The 10-foot TV experience is the same web app, styled for ambient/read-only display mode.

---

## Key design decisions

- **AirPlay path to Samsung TV:** Samsung 2019+ supports AirPlay 2 natively. No SmartThings.  
  Cast PULSE-web from phone → AirPlay → Samsung TV. Zero cloud, sovereign, already approved in Apple ecosystem.
- **Vercel for now, LAN later:** Phase 2 (NixOS) serves this on local network. No external dependency at home.
- **Shared types from packages/shared** — same registry, same zone geometry, same action contracts as Android.

---

## Planned surfaces

| Mode | Trigger | Layout |
|------|---------|--------|
| Dashboard | Browser direct | Full admin — layers, devices, projects |
| Ambient TV | Cast from Android | 10-foot read-only — zone state, active alerts, solar |
| Demo mode | Manual | Simplified house map — for showing Susan on den TV |

---

## What's needed

- Consume `packages/shared` types (post-migration)
- Implement `FlatPlanVeneer` equivalent (React, not React Native)
- Layer toggle panel
- Cast-mode detection (hide controls when on TV)
- Real-time sync with NixOS API (Phase 2)
