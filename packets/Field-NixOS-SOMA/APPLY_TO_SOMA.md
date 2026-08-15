# Apply Android → SOMA (overall intention)

**Why:** seat Android development in Sovereign SOMA (GitHub-accurate) so **Mac Studio DOJO / local FIELD (`/Users/field`) frees disk** — not so Studio keeps two full trees forever.

**Governor does not need to babysit steps.** On Mac Studio (green desk), run one script.

## Two phases (matrix open until both have receipts)

| Phase | Command effect | Disk |
|-------|----------------|------|
| 1 Weave | Copy PRESENT units into SOMA clone + push branch | Still doubled until phase 2 |
| 2 Reclaim | `MOVE_MODE=replace` after SOMA PR merge + verify | Old FIELD trees → backup + stub → **space freed** |

Do not claim “DOJO freed” without a `RECLAIM_*` receipt.

## Resume — repair PULSE-Android gitlink (cycle 2026-08-15T083735Z)

Weave completed, but `suite/android/apps/PULSE-Android` was committed as **embedded gitlink** (`160000`) — GitHub does not hold the file tree. Sonoc lab tree is real. Re-pull packet and re-weave (strips `.git`, re-adds normal files):

```bash
cd ~/FIELD-SOMA-WORK/pulse
git pull --ff-only origin cursor/soma-android-suite-packet-684b
WEAVE_ONLY=1 ./packets/Field-NixOS-SOMA/ONE_SHOT_STUDIO_APPLY_AND_WEAVE.sh
```

Do **not** run `MOVE_MODE=replace` until PULSE-Android shows as a normal directory tree on the SOMA branch (not a submodule).

## Resume (after dirty-SOMA checkout abort or HOLD.KittSourceMissing)

```bash
cd ~/FIELD-SOMA-WORK/pulse
git fetch origin && git checkout cursor/soma-android-suite-packet-684b
git pull --ff-only origin cursor/soma-android-suite-packet-684b
WEAVE_ONLY=1 ./packets/Field-NixOS-SOMA/ONE_SHOT_STUDIO_APPLY_AND_WEAVE.sh
```

If SOMA is still dirty from a failed attempt, the weaver stashes it automatically before branch switch.
## First run (already done 2026-08-15 on macstudio.local as `field`)

```bash
mkdir -p ~/FIELD-SOMA-WORK
git clone https://github.com/nexus-infinity/pulse.git ~/FIELD-SOMA-WORK/pulse
cd ~/FIELD-SOMA-WORK/pulse
git fetch && git checkout cursor/soma-android-suite-packet-684b
chmod +x packets/Field-NixOS-SOMA/ONE_SHOT_STUDIO_APPLY_AND_WEAVE.sh
./packets/Field-NixOS-SOMA/ONE_SHOT_STUDIO_APPLY_AND_WEAVE.sh
```

## Phase 2 — reclaim Studio space (after content PR merged + spot-check)

```bash
cd ~/FIELD-SOMA-WORK/Field-NixOS-SOMA
MOVE_MODE=replace ./suite/android/migration/studio_android_to_soma_weaver.sh
```

Only reclaim paths under `/Users/field`. jbear leftovers stay unless `FORCE_JBEAR_RECLAIM=1`.  
`~/Library/Android` (~7.1G SDK) is a separate pin — not auto-deleted.

## Studio receipt (open matrix — do not collapse)

| Line | State |
|------|-------|
| Suite home push | PASS (`cursor/soma-android-suite-home-684b`) |
| Local FIELD desk | `/Users/field/` (LOCKED — jbear is NOT FIELD) |
| KITT under `/Users/field` | ABSENT → HOLD |
| PULSE-Android under `/Users/field/StudioProjects` | PRESENT |
| Sonoc under `/Users/field` | not witnessed; leftover under jbear is cross-account only |
| Content move DONE | **Not claimed** until weave receipts + PR |
| DOJO disk freed | **Not claimed** until `MOVE_MODE=replace` RECLAIM receipt |

## Why cloud agent cannot finish content move / reclaim

- Cloud = office across town; no Studio FS
- Soft HOLD weaver ships via `pulse` packet; Studio executes weave + reclaim

## Linear

- Epic: BER-63
- Mandela: FIELD Mandela Highest Residence V0
