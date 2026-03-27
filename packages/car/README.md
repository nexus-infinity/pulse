# packages/car — PULSE-Car

**Status:** 📋 Stub — future CarPlay + Android Auto driving profile  
**Platforms:** Apple CarPlay + Android Auto (both phone-tethered via PULSE-Android)  
**Stack:** React Native + `react-native-carplay` / Android Auto extensions

---

## Role: Driving Profile — Home Awareness on the Road

PULSE-Car is not navigation. It's the home-aware layer while driving:  
ETA-triggered home prep, sovereign alerts, and voice-accessible home status.

Both CarPlay and Android Auto are phone-tethered — PULSE-Android (S22) is already  
the right hub. The car surface is a constrained projection of the same state.

---

## Key use cases

| Scenario | PULSE-Car action |
|----------|-----------------|
| Arriving home (ETA < 10 min) | Warm house, unlock gate, pathway lights |
| Leaving home | Check doors/windows, solar curtailment alert |
| Solar export alert | "Exporting 8kW — run dishwasher when home" |
| Security alert | "Front door opened" + quick confirm |
| Voice: "PULSE, home status" | Spoken summary: solar, temp, open doors |

---

## Design constraints

- **Voice-first** — Siri (CarPlay) + Google Assistant (Auto) are primary input
- **Glance-safe** — icons + status only, no text walls
- **Minimal taps** — 1–2 max; complex tasks wait until parked
- **Shared logic** — same `executeAction()` + device registry as all other surfaces

---

## ETA trigger flow

```
PULSE-Android (polling location while driving)
  → ETA to home < 10 min
  → POST /api/action { type: 'arrival_prep', eta_minutes: N }
  → NixOS PULSE API fans out:
      HVAC: warm to set point
      Lighting: pathway on at dusk
      Notification: CarPlay alert "Home prep triggered"
```

---

## Planned structure

```
packages/car/
  src/
    CarplayApp.tsx        ← CarPlay template screens (react-native-carplay)
    AndroidAutoApp.ts     ← Android Auto descriptor
    DrivingProfile.ts     ← ETA triggers, arrival/departure logic
    VoiceSummary.ts       ← "Home status" spoken response
    ArrivalTriggers.ts    ← What fires when ETA < N minutes
  templates/
    HomeStatusTemplate    ← Grid: solar, security, climate
    AlertTemplate         ← Full-screen alert + confirm/dismiss
    QuickActionTemplate   ← 2-button confirm
```

---

## Phase boundary

**Do not start until:**
- [ ] NixOS PULSE API live (Phase 2) — car triggers need reliable backend
- [ ] PULSE-Android Phase 1 stable
- [ ] CarPlay or Android Auto vehicle available for testing

**First task when returning:**
1. `react-native-carplay` install in PULSE-Android
2. `DrivingProfile.ts` — ETA detection + arrival triggers
3. `HomeStatusTemplate` — glance-safe home state
4. `VoiceSummary.ts` — spoken status via Siri/Google Assistant

---

## Open questions

- **CarPlay needs iOS app** — PULSE-Android is Android-only. Options:
  - (a) PULSE-iOS companion (separate package)
  - (b) PWA in Safari
  - (c) Android Auto only for now (S22 = zero friction, start here)
- **ETA source:** Google Maps API (cloud) vs device GPS + local calc (sovereign)?
- **Gate automation:** Is there a gate at 10 Watts Parade to automate?
