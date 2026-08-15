#!/usr/bin/env bash
# ONE green-desk script: apply packet into Field-NixOS-SOMA + run Android weaver.
# Overall intention: Mac Studio Android → Sovereign SOMA Field (teal).
#
# Modes:
#   (default)     refresh packet from pulse branch → apply suite home → weave content
#   WEAVE_ONLY=1  skip suite-home commit; refresh weaver script + run content move
set -euo pipefail
PULSE_ROOT="${PULSE_ROOT:-$HOME/FIELD-SOMA-WORK/pulse}"
PULSE_PACKET="${PULSE_PACKET:-$PULSE_ROOT/packets/Field-NixOS-SOMA}"
SOMA_CLONE="${SOMA_CLONE:-$HOME/FIELD-SOMA-WORK/Field-NixOS-SOMA}"
SOMA_REMOTE="${SOMA_REMOTE:-https://github.com/nexus-infinity/Field-NixOS-SOMA.git}"
PULSE_REMOTE="${PULSE_REMOTE:-https://github.com/nexus-infinity/pulse.git}"
PACKET_BRANCH="${PACKET_BRANCH:-cursor/soma-android-suite-packet-684b}"
BRANCH="${BRANCH:-cursor/soma-android-suite-home-684b}"
WEAVE_ONLY="${WEAVE_ONLY:-0}"

mkdir -p "$(dirname "$SOMA_CLONE")" "$(dirname "$PULSE_ROOT")"

# --- ensure pulse packet is latest ---
if [[ ! -d "$PULSE_ROOT/.git" ]]; then
  git clone "$PULSE_REMOTE" "$PULSE_ROOT"
fi
git -C "$PULSE_ROOT" fetch origin
git -C "$PULSE_ROOT" checkout "$PACKET_BRANCH"
git -C "$PULSE_ROOT" pull --ff-only origin "$PACKET_BRANCH" || true

PULSE_PACKET="$PULSE_ROOT/packets/Field-NixOS-SOMA"
[[ -f "$PULSE_PACKET/APPLY_TO_SOMA.md" ]] || { echo "HOLD: packet not found at $PULSE_PACKET"; exit 1; }

if [[ ! -d "$SOMA_CLONE/.git" ]]; then
  git clone "$SOMA_REMOTE" "$SOMA_CLONE"
fi

cd "$SOMA_CLONE"
git fetch origin

if [[ "$WEAVE_ONLY" != "1" ]]; then
  git checkout main
  git pull --ff-only origin main || true
  git checkout -B "$BRANCH"

  mkdir -p suite
  cp -a "$PULSE_PACKET/suite/android" suite/
  mkdir -p .vscode
  cp "$PULSE_PACKET/vscode.settings.json" .vscode/settings.json
  if ! grep -q 'SOMA Suite — Android' AGENTS.md 2>/dev/null; then
    printf '\n' >> AGENTS.md
    cat "$PULSE_PACKET/AGENTS.md.APPEND_SNIPPET.md" >> AGENTS.md
  fi
  if ! grep -q '!.vscode/settings.json' .gitignore 2>/dev/null; then
    printf '\n!.vscode/\n!.vscode/settings.json\n' >> .gitignore
  fi
  chmod +x suite/android/migration/studio_android_to_soma_weaver.sh

  git add suite .vscode AGENTS.md .gitignore
  git status -sb
  git commit -m "feat(suite/android): seat SOMA Suite home for Mac Studio Android migration" || true
  git push -u origin "$BRANCH"
  echo "=== Suite home pushed ==="
else
  echo "=== WEAVE_ONLY=1 — refresh weaver from packet, skip suite-home commit ==="
  mkdir -p suite/android/migration
  cp -a "$PULSE_PACKET/suite/android/migration/studio_android_to_soma_weaver.sh" \
    suite/android/migration/studio_android_to_soma_weaver.sh
  cp -a "$PULSE_PACKET/suite/android/UNKNOWN_HOLD_REGISTER.md" \
    suite/android/UNKNOWN_HOLD_REGISTER.md 2>/dev/null || true
  chmod +x suite/android/migration/studio_android_to_soma_weaver.sh
fi

echo "=== Starting content weaver ==="
./suite/android/migration/studio_android_to_soma_weaver.sh

echo "=== NEW GROUND ==="
echo "Open PR: https://github.com/nexus-infinity/Field-NixOS-SOMA/pull/new/cursor/soma-android-content-move-684b"
echo "Also suite-home PR if not merged: https://github.com/nexus-infinity/Field-NixOS-SOMA/pull/new/$BRANCH"
echo "Matrix: KITT may still be HOLD — Sonoc + local PULSE-Android should weave if PRESENT."
