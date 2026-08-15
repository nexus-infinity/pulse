#!/usr/bin/env bash
# ONE green-desk script: apply packet into Field-NixOS-SOMA + run Android weaver.
# Overall intention: Mac Studio Android → Sovereign SOMA Field (teal).
set -euo pipefail
PULSE_PACKET="${PULSE_PACKET:-$HOME/FIELD-SOMA-WORK/pulse/packets/Field-NixOS-SOMA}"
SOMA_CLONE="${SOMA_CLONE:-$HOME/FIELD-SOMA-WORK/Field-NixOS-SOMA}"
SOMA_REMOTE="${SOMA_REMOTE:-https://github.com/nexus-infinity/Field-NixOS-SOMA.git}"
PULSE_REMOTE="${PULSE_REMOTE:-https://github.com/nexus-infinity/pulse.git}"
BRANCH="${BRANCH:-cursor/soma-android-suite-home-684b}"

mkdir -p "$(dirname "$SOMA_CLONE")" "$(dirname "$PULSE_PACKET")"

if [[ ! -d "$SOMA_CLONE/.git" ]]; then
  git clone "$SOMA_REMOTE" "$SOMA_CLONE"
fi
if [[ ! -d "$(dirname "$PULSE_PACKET")/../.git" ]] && [[ ! -f "$PULSE_PACKET/APPLY_TO_SOMA.md" ]]; then
  git clone "$PULSE_REMOTE" "$(dirname "$(dirname "$PULSE_PACKET")")"
  git -C "$(dirname "$(dirname "$PULSE_PACKET")")" fetch origin
  git -C "$(dirname "$(dirname "$PULSE_PACKET")")" checkout cursor/soma-android-suite-packet-684b || true
fi

# Resolve packet path if cloned via pulse root
if [[ ! -f "$PULSE_PACKET/APPLY_TO_SOMA.md" ]]; then
  CAND="$HOME/FIELD-SOMA-WORK/pulse/packets/Field-NixOS-SOMA"
  [[ -f "$CAND/APPLY_TO_SOMA.md" ]] && PULSE_PACKET="$CAND"
fi
[[ -f "$PULSE_PACKET/APPLY_TO_SOMA.md" ]] || { echo "HOLD: packet not found at $PULSE_PACKET"; exit 1; }

cd "$SOMA_CLONE"
git fetch origin
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

echo "=== Suite home pushed. Starting content weaver ==="
./suite/android/migration/studio_android_to_soma_weaver.sh

echo "=== NEW GROUND ==="
echo "Open PR on Field-NixOS-SOMA branch $BRANCH, merge, then optional MOVE_MODE=replace."
