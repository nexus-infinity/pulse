# packages/nixos — PULSE-NixOS

**Status:** 📋 Stub — activates post Field-MacOS-DOJO  
**Target system:** BearsiMac (iMac 2019 running NixOS) at 10 Watts Parade  
**NixOS config repo:** [nexus-infinity/Field-NixOS-SOMA](https://github.com/nexus-infinity/Field-NixOS-SOMA)

---

## Role: Always-On Sovereign Server (Phase 2 Hub)

When Field-MacOS-DOJO completes, BearsiMac becomes the **permanent brain of PULSE**.  
PULSE-Android demotes from hub to controller. The iMac runs 24/7, phones are optional.

This is the correct architecture for a home OS — not dependent on a phone being home and awake.

---

## What the NixOS node does

| Service | Description |
|---------|-------------|
| `pulse-api` | HTTP/WS API on LAN — all surfaces talk to this |
| `device-poller` | Cron-based polling: SOFAR solar, gas meter, Sonos Ray, network devices |
| `zone-state` | Persistent zone state (SQLite or Postgres) — who's where, what's on |
| `ble-hub` | BLE scanner daemon (USB dongle or built-in) — presence detection without phone |
| `pulse-web-server` | Serves `packages/web` on LAN — no Vercel needed at home |
| `irrigation-brain` | Garden microcosmos controller — soil sensors, weather, zone scheduling |
| `sonos-bridge` | Wraps Sonos LAN API — room-aware audio alerts from any surface |
| `security-watcher` | Camera feed aggregation, door/window sensors |

---

## Nix module structure (target)

```
packages/nixos/
  pulse.nix                  ← Top-level NixOS module (import into BearsiMac flake)
  services/
    pulse-api.nix            ← PULSE API service definition
    device-poller.nix        ← Polling daemon (solar, gas, network)
    zone-state.nix           ← SQLite/Postgres zone persistence
    ble-hub.nix              ← BLE presence scanner
    pulse-web-server.nix     ← Serve packages/web on LAN
    irrigation-brain.nix     ← Garden zone controller
    sonos-bridge.nix         ← Sonos LAN API wrapper service
  config/
    devices.nix              ← Device addresses + credentials (gitignored values)
    zones.nix                ← Zone-to-network mapping
    hardware.nix             ← BearsiMac hardware specifics
```

---

## Integration with Field-NixOS-SOMA

`Field-NixOS-SOMA` is the BearsiMac system config (chakra architecture, dot-hive modules).  
`pulse.nix` from this package gets imported into that flake as a new chakra module.

```nix
# In Field-NixOS-SOMA/dot-hive/default.nix (future)
imports = [
  ./chakras/networking.nix
  ./chakras/display.nix
  # ... existing chakras ...
  "${pulse-nixos}/pulse.nix"   # ← PULSE sovereign server
];
```

---

## PULSE API contract (LAN)

```
GET  /api/zones              → all zone states
GET  /api/zones/:id          → single zone + devices
GET  /api/devices            → all known systems
GET  /api/devices/:id        → single device + alignment state
POST /api/action             → executeAction() — same contract as packages/shared
WS   /api/events             → real-time zone/device state stream
GET  /api/solar              → current SOFAR inverter data
GET  /api/weather            → local weather (feeds irrigation-brain)
```

---

## Phase boundary

**Do not start this package until:**
- [ ] Field-MacOS-DOJO training complete + models validated (6/6 geometric gates)
- [ ] PULSE-Android Phase 1 complete (spatial renderer, layer data, cast output)
- [ ] NixOS BearsiMac stable and online at 10 Watts Parade

**First task when returning:**
1. Read `Field-NixOS-SOMA/COPILOT-ARCHITECTURE-GUIDE.md` — understand chakra module pattern
2. Read `Field-NixOS-SOMA/dot-hive/` — find correct import location for pulse.nix
3. Start with `pulse-api.nix` (simplest service, establishes the LAN API contract)
4. Wire device registry data from `packages/shared` into the poller

---

## Open questions (to resolve at Phase 2 start)

- **BLE hardware:** Does BearsiMac have built-in BLE? If not, USB dongle needed.
- **Database:** SQLite (simpler) vs Postgres (better for time-series solar/sensor data)?
- **Irrigation:** What sensors are installed in the garden? Capacitive soil moisture? Flow meters?
- **Heating redesign:** Gas furnace → electric system. What zones? Concrete slab constraints?
- **Cellar:** Server room candidate — temperature stable, power available. Measure humidity first.
