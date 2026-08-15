# Migration weaver — Android → SOMA Suite

## Intention

Move Mac Studio Android estate into `Field-NixOS-SOMA/suite/android/` without collapsing Mandela matrix lines into a fake “done.”

## Soft HOLD law

Missing **one** unit (e.g. KITT) must **not** abort the cycle. Emit HOLD receipts; weave every PRESENT unit (Sonoc, local PULSE-Android, …).

## Desk users

Studio may run as `field` (daily) or use historical `jbear` paths. Weaver searches both.

## Do–Re–Mi (preferred: via packet ONE_SHOT)

```bash
cd ~/FIELD-SOMA-WORK/pulse
git pull --ff-only origin cursor/soma-android-suite-packet-684b
WEAVE_ONLY=1 ./packets/Field-NixOS-SOMA/ONE_SHOT_STUDIO_APPLY_AND_WEAVE.sh
```

Or direct:

```bash
cd ~/FIELD-SOMA-WORK/Field-NixOS-SOMA
chmod +x suite/android/migration/studio_android_to_soma_weaver.sh
./suite/android/migration/studio_android_to_soma_weaver.sh

# After PR merged + backup verified — optional replace DOJO tree with stub only:
MOVE_MODE=replace ./suite/android/migration/studio_android_to_soma_weaver.sh
```

Dry run:

```bash
DRY_RUN=1 ./suite/android/migration/studio_android_to_soma_weaver.sh
```

## Env overrides (optional)

```bash
KITT_SRC=/path/to/kitt-arkadas-android \
SONOC_SRC=/path/to/SonocScrewDriver \
PULSE_ANDROID_SRC=/path/to/PULSE-Android \
./suite/android/migration/studio_android_to_soma_weaver.sh
```

## Destinations

| Unit | Destination |
|------|-------------|
| KITT | `suite/android/apps/kitt-arkadas-android/` |
| Sonoc | `suite/android/lab/SonocScrewDriver/` |
| PULSE-Android (local) | `suite/android/apps/PULSE-Android/` |

## What remains open

See `../UNKNOWN_HOLD_REGISTER.md` — especially `HOLD.KittSourceMissing` until KITT is found or ruled out.
