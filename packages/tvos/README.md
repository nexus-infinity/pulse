# packages/tvos — PULSE-tvOS

**Status:** 📋 Stub — future native Apple TV app  
**Devices:** Apple TV 4K End Room (modern, A15) + Apple TV Family Room (older)  
**Stack:** SwiftUI (tvOS)  
**Today's path:** AirPlay 2 cast from PULSE-Android (no native app needed yet)

---

## Role: 10-Foot Native Interface

A native tvOS app gives PULSE full access to the Apple TV remote, Siri,  
focus engine, and system-level integration.

AirPlay 2 from PULSE-Android works perfectly for now — build native when  
the cast experience hits its limits (e.g., remote navigation, Siri triggers).

---

## Why native tvOS eventually

| Capability | AirPlay cast | Native tvOS |
|-----------|-------------|-------------|
| Display PULSE map | ✅ | ✅ |
| Apple TV remote navigation | ❌ (phone drives) | ✅ Full focus engine |
| Siri "show kitchen" | ❌ | ✅ |
| Ambient always-on (no phone) | ❌ | ✅ |
| Low-power screensaver mode | ❌ | ✅ |

---

## Target devices

| Device | Location | Generation | Notes |
|--------|----------|------------|-------|
| Apple TV 4K (modern) | End Room | Gen 2/3, A15 chip | Primary target |
| Apple TV (older) | Family Room | Earlier gen | Secondary — lighter render profile |

Family Room Apple TV feeds Sony Bravia LCD via HDMI.  
Sonos Ray connected via optical cable — PULSE-tvOS controls room audio.

---

## Planned structure

```
packages/tvos/
  App.swift
  Scenes/
    AmbientScene.swift       ← Screensaver / always-on zone map
    DashboardScene.swift     ← Rooms, Devices, Projects, Solar
    RoomScene.swift          ← Room detail + device state
    AlertScene.swift         ← Full-screen alert (door, solar, irrigation)
  Services/
    PulseAPIClient.swift     ← Talks to NixOS PULSE API
    AudioAlertService.swift  ← Triggers Sonos Ray via PULSE API
```

---

## Phase boundary

**Do not start until:**
- [ ] PULSE-Android cast experience working and used daily
- [ ] NixOS PULSE API live (Phase 2) — tvOS needs a stable API
- [ ] AirPlay limitations felt in real use

**First task when returning:**
1. Create Xcode project (tvOS target)
2. `PulseAPIClient.swift` → NixOS PULSE API
3. `AmbientScene` — floor plan + zone states (screensaver mode)
4. Sonos Ray audio alerts via API

---

## Open questions

- Two app profiles or one? (modern A15 End Room vs older Family Room)
- Shared Swift package for zone geometry?
- HomeKit accessory bridge integration?
- TV remote volume → Sonos Ray via PULSE API?
