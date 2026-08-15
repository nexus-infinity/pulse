# Migration weaver — Android → SOMA Suite

## Intention

Move Mac Studio Android estate into `Field-NixOS-SOMA/suite/android/` so **local FIELD DOJO can reclaim disk**, without collapsing Mandela matrix lines into a fake “done.”

Phase 1 = weave to SOMA (GitHub). Phase 2 = `MOVE_MODE=replace` stubs old `/Users/field` trees (backup first). Sync alone does **not** free space.

## Soft HOLD law

Missing **one** unit (e.g. KITT) must **not** abort the cycle. Emit HOLD receipts; weave every PRESENT unit under local FIELD.

## Local FIELD desk (LOCKED)

```text
/Users/field/     ← local FIELD
/Users/jbear/     ← NOT local FIELD (optional leftover scan only)
```

Weaver requires `/Users/field`. Set `SCAN_JBEAR_LEFTOVERS=0` to skip the foreign account entirely.

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

# After PR merged + backup verified — reclaim Studio DOJO disk:
MOVE_MODE=replace ./suite/android/migration/studio_android_to_soma_weaver.sh
```

Clear `HOLD.DojoDiskReclaimPending` only when `migration/receipts/RECLAIM_*` shows replaced FIELD trees.

Dry run:

```bash
DRY_RUN=1 ./suite/android/migration/studio_android_to_soma_weaver.sh
```

## Env overrides (optional)

```bash
FIELD_HOME=/Users/field \
KITT_SRC=/Users/field/path/to/kitt-arkadas-android \
SONOC_SRC=/Users/field/path/to/SonocScrewDriver \
PULSE_ANDROID_SRC=/Users/field/StudioProjects/PULSE-Android \
SCAN_JBEAR_LEFTOVERS=0 \
./suite/android/migration/studio_android_to_soma_weaver.sh
```

## Destinations

| Unit | Destination |
|------|-------------|
| KITT | `suite/android/apps/kitt-arkadas-android/` |
| Sonoc | `suite/android/lab/SonocScrewDriver/` |
| PULSE-Android (local) | `suite/android/apps/PULSE-Android/` |

## What remains open

See `../UNKNOWN_HOLD_REGISTER.md` — especially `HOLD.KittSourceMissing` until KITT is found under `/Users/field` or ruled out.
