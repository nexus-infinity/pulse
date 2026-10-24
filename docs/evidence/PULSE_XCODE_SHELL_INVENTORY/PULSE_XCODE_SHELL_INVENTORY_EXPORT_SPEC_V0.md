# PULSE Xcode Shell Inventory — Export Specification V0

**Status:** specification only · candidate record shape · not a promoted schema  
**Residence:** `nexus-infinity/pulse`  
**Path:** `docs/evidence/PULSE_XCODE_SHELL_INVENTORY/PULSE_XCODE_SHELL_INVENTORY_EXPORT_SPEC_V0.md`  
**Purpose:** define a fact-preserving export from an observed Xcode shell/project into a structured PULSE evidence artifact.

## 1. Purpose and authority

This specification defines how a bounded Xcode inventory is observed, represented, and exported. It does not assert that an Xcode project, provider, integration, entitlement, command route, or runtime is present.

The designated GitHub repository is the durable residence for the resulting evidence artifact. Notion carries development narrative, Caddyshack carries coordination/projection, and Linear carries gate/execution tracking. These surfaces link to the GitHub artifact; they do not replace it or silently become additional evidence residences.

This document is a specification, not an exporter, JSON Schema admission, provider implementation, Xcode change, or runtime authorization. The field names below are a candidate record contract. A machine-enforced schema or status vocabulary requires its own explicit admission.

## 2. Export invariant

```text
bounded Xcode observation
→ structured inventory preserving source facts and uncertainty
→ versioned evidence artifact in the designated PULSE GitHub residence
```

The exporter may transform representation and normalize formatting. It must not upgrade the truth level of a claim. Every material assertion must retain an evidence anchor, observation time, scope, and source identity.

Source absence is reportable only for the exact scope actually checked. A search miss, unavailable source, omitted file, or unrun test is not proof of absence.

## 3. Scope and non-goals

An inventory may describe:

- Xcode project/workspace, schemes, targets, build configurations, product types, SDK/deployment settings, and their source locations.
- Dependency declarations and resolved versions/revisions found in the inspected manifests or lockfiles.
- Declared entitlement files and, when directly observed, effective entitlement/build-setting output. Distinguish declarations from signed/runtime entitlements.
- Provider-adapter source, configuration references, wiring, invocation evidence, and runtime evidence as separate states.
- Observation surfaces and command surfaces, including their owner, target, scope, permissions, and evidence of execution.
- Files inspected, files changed during the observed work window, and the evidence supporting each statement.
- Gate A–D status as recorded by its authoritative source, with definition and evidence pointers.

The inventory does **not** acquire SDKs, modify Xcode or project files, implement adapters, connect Google Home, issue provider commands, admit runtime, promote a schema, or modify provider/device state. Inventory export itself is read-only with respect to the Xcode source. It writes only the authorized evidence artifact in the PULSE residence.

## 4. Record identity and capture envelope

Each export has a unique inventory identifier. Identity describes this observation record; it does not replace the identity of the Xcode project or source repository.

Required top-level record fields:

| Field | Meaning |
|---|---|
| `inventory_id` | Unique identifier for this capture record. |
| `record_kind` | Fixed label `PULSE_XCODE_SHELL_INVENTORY`. |
| `record_version` | Version of the record contract used; not a promotion claim. |
| `captured_at` | ISO 8601 timestamp with UTC offset. Preserve source-local time when relevant. |
| `observer` | Seat/tool identity and version; host/device identity; macOS and Xcode versions when witnessed. |
| `authority` | Exact read-only scope and the authorized evidence destination. |
| `source_context` | Xcode project/workspace path, source repository identity, branch, commit, and dirty-state witness where available. |
| `capture_method` | UI, read-only command, file parse, or other method; command/tool and exact scope where applicable. |
| `inventory` | Project, targets, dependencies, entitlements, adapters, surfaces, gates, files, and findings. |
| `evidence_refs` | Stable references to the observations supporting claims. |
| `limitations` | Unavailable sources, unsearched scope, redactions, failures, and other evidence gaps. |
| `publication` | GitHub artifact path and optional pointer destinations/statuses for Notion, Caddyshack, and Linear. |

Do not infer a project path, repository, branch, commit, Xcode version, or host from a plan or a prior capture. If it cannot be read in the current observation, record `UNKNOWN` with a reason.

## 5. Inventory units

### 5.1 Xcode project and targets

For each project/workspace record its observed path and kind, source identity, schemes, targets, configurations, product type, SDK, deployment target, and the method used to discover them. Preserve the distinction between a declared target and a built, signed, launched, or runtime-witnessed product.

Record build-setting values only when needed for the inventory. Apply the redaction rules in §9.

### 5.2 Dependencies

For each dependency record package/library identity, declared range or requirement, resolved version/revision when available, source/registry, manifest or lockfile path, and observation status. A declaration is not proof of successful resolution, installation, linkage, or runtime use.

Do not fetch, install, resolve, or update dependencies during inventory capture.

### 5.3 Entitlements

Record entitlement-file path and hash when inspected; list observed entitlement keys and safe values; state whether the evidence is source-declared, build-setting-derived, signed-product-derived, or runtime-derived. Do not describe a declared entitlement as granted or effective without the corresponding witness.

Redact provisioning profiles, signing credentials, private keys, tokens, account identifiers, and sensitive values. Preserve a redaction marker and reason instead of silently omitting the field.

### 5.4 Provider adapters

Represent each provider/adaptor candidate with separate evidence states:

- `NOT_SEARCHED`
- `SOURCE_PRESENT`
- `REFERENCED_OR_CONFIGURED`
- `WIRED_IN_SOURCE`
- `INVOCATION_WITNESSED`
- `RUNTIME_WITNESSED`
- `NOT_EVIDENCED`
- `UNKNOWN`

These are evidence descriptions, not an automatic promotion ladder. Record the source anchor and time for each state. A placeholder, type, package, configuration key, mock, test fixture, or documentation claim does not prove provider connectivity or authority. In particular, do not invent Google Home integration or convert a candidate field into a runtime claim.

### 5.5 Observation and command surfaces

Keep observation and command capabilities distinct. For each surface record its identity, owner, input/output, target, permissions, side-effect class, and evidence status. Separate:

- a UI/control or API declaration;
- source-level wiring;
- a user-visible invocation;
- a provider request;
- a confirmed external effect.

A command handler or reachable endpoint is not proof of permission, provider acceptance, successful effect, or runtime admission.

## 6. Evidence-state vocabulary

Use the source's exact words where possible. Keep these states distinct:

| State | Use |
|---|---|
| `OBSERVED_PRESENT` | Direct evidence shows the object/property in the named scope and time. |
| `OBSERVED_ABSENT` | The defined search was completed and the object/property was absent within that exact scope. Include method and coverage. |
| `NOT_SEARCHED` | No search was performed. |
| `NOT_EVIDENCED` | The claim may be true, but this export contains no supporting witness. |
| `UNKNOWN` | The observer cannot determine the state; include the reason. |
| `OMITTED` | Deliberately excluded from the export; include the reason and scope. |
| `REDACTED` | A value was observed but withheld under the no-secret rule; retain the field/key and reason. |

Never collapse these states into a Boolean. Do not turn an inaccessible file, missing permission, truncated response, or failed probe into `OBSERVED_ABSENT`.

## 7. Files inspected and changed

Maintain an append-only file observation list for the capture:

- path relative to its native repository/home where possible;
- role in the inventory;
- observation method and time;
- size and content hash when safely available;
- result and coverage;
- whether the file changed during this work window;
- if changed, exact path, reason, authorization, before/after evidence, and receipt pointer.

The exporter must not alter Xcode project files, source, settings, signing material, or provider state. If a change is detected but cannot be attributed to this work window, record it as pre-existing/unknown rather than claiming the exporter changed or did not change it.

## 8. Gate A–D accounting

Record Gates A, B, C, and D individually. Each gate entry must preserve:

- gate identifier;
- definition/source pointer;
- source-reported status exactly as written;
- status observation time and source revision;
- evidence references;
- explicit gaps or blockers.

Do not define or reinterpret a gate from its letter, neighboring gate, dashboard color, or narrative. If the gate definition or current status source is unavailable, record `UNKNOWN` / `NOT_EVIDENCED` and state the missing pin. Do not infer C or D from A or B, and do not advance a gate by creating this inventory.

If another tracking system supplies a status, label it as a reported status and retain its native pointer. It does not become a direct Xcode witness.

## 9. Provenance, privacy, and no-secret rule

Every material claim must point to one or more evidence references containing, as available:

- source path or stable URI and source type;
- capture timestamp and timezone;
- observer/tool identity and version;
- repository branch/commit and dirty state;
- file hash or source object identifier;
- exact command/query or UI scope;
- result, coverage, and limitation.

Never export secret values, credentials, access/refresh tokens, private keys, signing secrets, provisioning-profile payloads, cookies, or environment-variable values. Do not include raw logs or full configuration dumps when a minimal fact-and-pointer suffices. If a sensitive value is encountered, exclude it and record `REDACTED`; never hash a secret as a substitute for excluding it.

A hash establishes byte identity only. It does not prove origin, authorization, correctness, or runtime use.

## 10. GitHub artifact and publication

The durable artifact path for this specification is:

```text
docs/evidence/PULSE_XCODE_SHELL_INVENTORY/
```

A future inventory instance should use a unique filename under that directory and include a pointer to this specification version. Do not overwrite a prior evidence artifact; corrections produce a linked successor with an explicit correction reason.

Publication fields for other surfaces are pointers only:

- **Notion:** narrative and decision link to the GitHub artifact.
- **Caddyshack:** coordination/dashboard pointer and current movement.
- **Linear:** gate/execution tracking linked to the same evidence artifact.

Do not write to these surfaces as an implicit exporter side effect. Each remains in its native role and any publication/update needs its own authorized route. A GitHub commit does not update Notion, Caddyshack, or Linear automatically.

## 11. Acceptance criteria for a future export

An export is internally reviewable when:

1. Its Xcode project/source identity, capture time, observer, and exact scope are stated.
2. Project/target, dependency, entitlement, provider-adapter, and observation/command findings are each anchored or explicitly marked unknown/not searched.
3. Gate A–D statuses retain source wording, definition pointers, and evidence; missing gate pins remain visible.
4. File inspection and any changes during the capture window are accounted for.
5. No secrets or credentials appear.
6. The artifact distinguishes declaration, source wiring, invocation, external effect, and runtime evidence.
7. The record passes structural validation against the separately admitted machine contract, if one exists. Until then, structural validation is a human review of this specification and the export; no schema is implicitly promoted.
8. GitHub stores the durable evidence artifact, and other surfaces carry only authorized pointers.

Failure of an acceptance criterion yields a scoped `HOLD`; it does not authorize repair, provider action, or gate advancement.

## 12. Current boundary

This document creates only the export specification. It does not claim that an Xcode inventory has been captured or that Gate A–D has changed. SDK acquisition, Xcode modification, provider-adapter implementation, Google Home connection, provider commands, runtime admission, schema promotion, and publication to Notion/Caddyshack/Linear remain outside this artifact's authority.
