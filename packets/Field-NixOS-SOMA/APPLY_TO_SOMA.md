# Apply this packet to nexus-infinity/Field-NixOS-SOMA

Cloud agent token could **read** Field-NixOS-SOMA but got **403 on push** (2026-08-15).
This packet is the seated SOMA Suite Android home — apply on a seat with write access (Mac Studio / green desk with gh auth as JB).

```bash
cd /path/to/Field-NixOS-SOMA
git checkout -b cursor/soma-android-suite-home-684b
cp -R /path/to/pulse/packets/Field-NixOS-SOMA/suite/android ./suite/
# append AGENTS snippet from AGENTS.md.APPEND_SNIPPET.md (SOMA Suite section only)
mkdir -p .vscode && cp packets/.../vscode.settings.json .vscode/settings.json
# allow .vscode/settings.json in .gitignore via negation
chmod +x suite/android/migration/studio_android_to_soma_weaver.sh
git add suite .vscode AGENTS.md .gitignore
git commit -m "feat(suite/android): seat SOMA Suite home for Mac Studio Android migration"
git push -u origin cursor/soma-android-suite-home-684b
# then run weaver on Studio:
./suite/android/migration/studio_android_to_soma_weaver.sh
```

Residence: teal SOMA. Mandela lines stay open.
