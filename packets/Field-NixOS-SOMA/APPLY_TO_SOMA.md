# Apply Android → SOMA (overall intention)

**Governor does not need to babysit steps.** On Mac Studio (green desk), run one script.

## Resume (after first cycle HOLD.KittSourceMissing)

Suite home already pushed. Pull fixed soft-HOLD weaver and weave PRESENT units (Sonoc + local PULSE-Android):

```bash
cd ~/FIELD-SOMA-WORK/pulse
git fetch origin && git checkout cursor/soma-android-suite-packet-684b
git pull --ff-only origin cursor/soma-android-suite-packet-684b
WEAVE_ONLY=1 ./packets/Field-NixOS-SOMA/ONE_SHOT_STUDIO_APPLY_AND_WEAVE.sh
```

## First run (already done 2026-08-15 on macstudio.local as `field`)

```bash
mkdir -p ~/FIELD-SOMA-WORK
git clone https://github.com/nexus-infinity/pulse.git ~/FIELD-SOMA-WORK/pulse
cd ~/FIELD-SOMA-WORK/pulse
git fetch && git checkout cursor/soma-android-suite-packet-684b
chmod +x packets/Field-NixOS-SOMA/ONE_SHOT_STUDIO_APPLY_AND_WEAVE.sh
./packets/Field-NixOS-SOMA/ONE_SHOT_STUDIO_APPLY_AND_WEAVE.sh
```

That script:
1. Pulls latest pulse packet branch
2. Copies `suite/android/` home + teal Cursor colours + AGENTS snippet
3. Pushes branch `cursor/soma-android-suite-home-684b`
4. Runs Do–Re–Mi weaver with **soft HOLD** — missing KITT does not abort; Sonoc + local PULSE-Android weave when PRESENT

Optional later (after PR merge + backup check):

```bash
MOVE_MODE=replace ./suite/android/migration/studio_android_to_soma_weaver.sh
```

## Studio receipt (open matrix — do not collapse)

| Line | State |
|------|-------|
| Suite home push | PASS (`cursor/soma-android-suite-home-684b`) |
| Local FIELD desk | `/Users/field/` (LOCKED — jbear is NOT FIELD) |
| KITT under `/Users/field` | ABSENT → HOLD |
| PULSE-Android under `/Users/field/StudioProjects` | PRESENT |
| Sonoc under `/Users/field` | not witnessed; leftover under jbear is cross-account only |
| Content move DONE | **Not claimed** until weave receipts + PR |

## Why cloud agent cannot finish content move

- Cloud = office across town; no Studio FS
- Soft HOLD weaver ships via `pulse` packet; Studio executes

## Linear

- Epic: BER-63
- Mandela: FIELD Mandela Highest Residence V0
