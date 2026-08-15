# Apply Android → SOMA (overall intention)

**Governor does not need to babysit steps.** On Mac Studio (green desk), run one script:

```bash
mkdir -p ~/FIELD-SOMA-WORK
git clone https://github.com/nexus-infinity/pulse.git ~/FIELD-SOMA-WORK/pulse
cd ~/FIELD-SOMA-WORK/pulse
git fetch && git checkout cursor/soma-android-suite-packet-684b
chmod +x packets/Field-NixOS-SOMA/ONE_SHOT_STUDIO_APPLY_AND_WEAVE.sh
./packets/Field-NixOS-SOMA/ONE_SHOT_STUDIO_APPLY_AND_WEAVE.sh
```

That script:
1. Clones/updates Field-NixOS-SOMA
2. Copies `suite/android/` home + teal Cursor colours + AGENTS snippet
3. Pushes branch `cursor/soma-android-suite-home-684b`
4. Runs Do–Re–Mi weaver (Gate1 re-witness + rsync KITT/Sonoc + receipts + DOJO pointer)

Optional later (after PR merge + backup check):

```bash
MOVE_MODE=replace ./suite/android/migration/studio_android_to_soma_weaver.sh
```

## Why cloud agent stopped at seating

- Cloud = office across town; no `/Users/jbear`
- Token can push `pulse`, **403** on `Field-NixOS-SOMA`
- Matrix law: do not claim content move DONE without Studio receipts

## Linear

- Epic: BER-63
- Mandela: FIELD Mandela Highest Residence V0
