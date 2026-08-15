# Apply Android → SOMA (overall intention)

**Why:** seat Android development in Sovereign SOMA (GitHub-accurate) so **Mac Studio DOJO / local FIELD (`/Users/field`) frees disk** — not so Studio keeps two full trees forever.

**Governor does not need to babysit steps.** On Mac Studio (green desk), run one script.

## Two phases (matrix open until both have receipts)

| Phase | Command effect | Disk |
|-------|----------------|------|
| 1 Weave | Copy PRESENT units into SOMA clone + push branch | Still doubled until phase 2 |
| 2 Reclaim | `MOVE_MODE=replace` after SOMA PR merge + verify | Old FIELD trees → backup + stub → **space freed** |

Do not claim “DOJO freed” without a `RECLAIM_*` receipt.

## Resume — publish flattened PULSE tree (cycle 084007Z local commit ready)

Local SOMA already has the good normal-tree commit; remote still has the gitlink tip. Publish:

```bash
cd ~/FIELD-SOMA-WORK/Field-NixOS-SOMA
git checkout cursor/soma-android-content-move-684b
git push --force-with-lease origin cursor/soma-android-content-move-684b
```

Then open: https://github.com/nexus-infinity/Field-NixOS-SOMA/pull/new/cursor/soma-android-content-move-684b

(Or pull latest packet and re-run `WEAVE_ONLY=1` — weaver now grounds on content-move tip and force-with-leases on non-ff.)

## Resume — repair PULSE-Android gitlink (cycle 2026-08-15T083735Z)

```bash
cd ~/FIELD-SOMA-WORK/pulse
git pull --ff-only origin cursor/soma-android-suite-packet-684b
WEAVE_ONLY=1 ./packets/Field-NixOS-SOMA/ONE_SHOT_STUDIO_APPLY_AND_WEAVE.sh
```

Do **not** run `MOVE_MODE=replace` until PULSE-Android shows as a normal directory tree on the SOMA branch (not a submodule).
## First run (already done 2026-08-15 on macstudio.local as `field`)

```bash
mkdir -p ~/FIELD-SOMA-WORK
git clone https://github.com/nexus-infinity/pulse.git ~/FIELD-SOMA-WORK/pulse
cd ~/FIELD-SOMA-WORK/pulse
git fetch && git checkout cursor/soma-android-suite-packet-684b
chmod +x packets/Field-NixOS-SOMA/ONE_SHOT_STUDIO_APPLY_AND_WEAVE.sh
./packets/Field-NixOS-SOMA/ONE_SHOT_STUDIO_APPLY_AND_WEAVE.sh
```

## Phase 2 — reclaim Studio space (after content tip verified on GitHub)

Content tip `207a113` is on GitHub. Run reclaim from the **pulse packet weaver** (SOMA clone may still carry an older script), after hard-reset to the content-move tip:

```bash
cd ~/FIELD-SOMA-WORK/pulse
git pull --ff-only origin cursor/soma-android-suite-packet-684b

cd ~/FIELD-SOMA-WORK/Field-NixOS-SOMA
git fetch origin
git checkout cursor/soma-android-content-move-684b
git reset --hard origin/cursor/soma-android-content-move-684b

MOVE_MODE=replace \
  ~/FIELD-SOMA-WORK/pulse/packets/Field-NixOS-SOMA/suite/android/migration/studio_android_to_soma_weaver.sh
```

Only reclaim paths under `/Users/field`. jbear leftovers stay unless `FORCE_JBEAR_RECLAIM=1`.  
`~/Library/Android` (~7.1G SDK) is a separate pin — not auto-deleted.

Do **not** run `./suite/android/migration/...` from an outdated SOMA working tree that still resets onto suite-home.
## Studio receipt (open matrix — do not collapse)

| Line | State |
|------|-------|
| Suite home push | PASS (`cursor/soma-android-suite-home-684b`) |
| Content move tip | PASS `207a113` on `cursor/soma-android-content-move-684b` (force-with-lease over gitlink) |
| PULSE-Android on GitHub | PASS normal tree (`App.tsx` present; 0 gitlinks) |
| Sonoc on GitHub | PASS real lab tree |
| Local FIELD desk | `/Users/field/` (LOCKED — jbear is NOT FIELD) |
| KITT under `/Users/field` | ABSENT → HOLD |
| DOJO disk freed | **Not claimed** until PR merge + `MOVE_MODE=replace` RECLAIM receipt |

## Why cloud agent cannot finish content move / reclaim

- Cloud = office across town; no Studio FS
- Soft HOLD weaver ships via `pulse` packet; Studio executes weave + reclaim

## Linear

- Epic: BER-63
- Mandela: FIELD Mandela Highest Residence V0
