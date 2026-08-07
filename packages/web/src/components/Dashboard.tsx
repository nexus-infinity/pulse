"use client";

import { useMemo, useState } from "react";
import type {
  HouseProject,
  HouseSystem,
  LayerId,
  ProofReceipt,
  ZoneGeometry,
  ZoneId,
} from "@pulse/shared";
import { LAYER_IDS, VENEER_LAYER_SUPPORT } from "@pulse/shared";
import FlatPlanVeneer from "./FlatPlanVeneer";
import { devicesForLayer } from "@/lib/layers";

interface Props {
  initialDevices: HouseSystem[];
  zones: ZoneGeometry[];
  projects: HouseProject[];
}

export default function Dashboard({ initialDevices, zones, projects }: Props) {
  const [devices, setDevices] = useState<HouseSystem[]>(initialDevices);
  const [layer, setLayer] = useState<LayerId>("devices");
  const [selectedZone, setSelectedZone] = useState<ZoneId | undefined>(undefined);
  const [receipts, setReceipts] = useState<ProofReceipt[]>([]);
  const [busy, setBusy] = useState(false);

  const supportedLayers = VENEER_LAYER_SUPPORT.flat_plan;
  const unaligned = devices.filter((d) => !d.aligned).length;

  const visibleDevices = useMemo(() => devicesForLayer(devices, layer), [devices, layer]);
  const zoneDevices = useMemo(
    () => (selectedZone ? visibleDevices.filter((d) => d.zone === selectedZone) : visibleDevices),
    [visibleDevices, selectedZone],
  );

  async function dispatch(body: unknown) {
    setBusy(true);
    try {
      const res = await fetch("/api/action", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { receipt: ProofReceipt; devices: HouseSystem[] };
      setReceipts((prev) => [json.receipt, ...prev].slice(0, 20));
      if (json.devices) setDevices(json.devices);
    } catch (err) {
      setReceipts((prev) => [
        {
          id: `rcpt_error_${Date.now()}`,
          action: "observe",
          ok: false,
          at: new Date().toISOString(),
          detail: `Request failed: ${(err as Error).message}`,
        },
        ...prev,
      ]);
    } finally {
      setBusy(false);
    }
  }

  const selectedZoneLabel = selectedZone
    ? zones.find((z) => z.id === selectedZone)?.label ?? selectedZone
    : "All zones";

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <h1>PULSE</h1>
          <span className="sub">Sovereign Home OS · 10 Watts Parade, Mount Eliza</span>
        </div>
        <span className="badge">
          <span className="dot" />
          {unaligned} system{unaligned === 1 ? "" : "s"} need attention
        </span>
      </header>

      <div className="layout">
        <section className="panel">
          <h2>Flat Plan · {layer} layer</h2>
          <div className="layer-toggles">
            {LAYER_IDS.map((l) => (
              <button
                key={l}
                className={`chip ${l === layer ? "active" : ""}`}
                disabled={!supportedLayers.includes(l)}
                onClick={() => setLayer(l)}
              >
                {l}
              </button>
            ))}
          </div>
          <FlatPlanVeneer
            zones={zones}
            devices={devices}
            layer={layer}
            activeZoneId={selectedZone}
            onZoneSelect={(id) => setSelectedZone((cur) => (cur === id ? undefined : id))}
          />
        </section>

        <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <section className="panel">
            <h2>
              Devices · {selectedZoneLabel}
              {selectedZone ? (
                <button
                  className="chip"
                  style={{ marginLeft: 10 }}
                  onClick={() => setSelectedZone(undefined)}
                >
                  clear
                </button>
              ) : null}
            </h2>
            <div className="device-list">
              {zoneDevices.length === 0 ? (
                <div className="empty">No devices on the {layer} layer here.</div>
              ) : (
                zoneDevices.map((d) => (
                  <div
                    key={d.id}
                    className="device"
                    onClick={() => dispatch({ type: "observe", payload: { deviceId: d.id } })}
                    title="Click to observe (records a proof receipt)"
                  >
                    <div>
                      <div className="name">{d.name}</div>
                      <div className="meta">
                        {d.category}
                        {d.protocol ? ` · ${d.protocol}` : ""}
                        {d.reason ? ` · ⚠ ${d.reason}` : ""}
                      </div>
                    </div>
                    <span className={`status-dot status-${d.status}`} title={d.status} />
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="panel">
            <h2>Action Console</h2>
            <div className="console">
              <div className="btn-row">
                <button
                  className="btn"
                  disabled={busy}
                  onClick={() =>
                    dispatch({
                      type: "cast",
                      payload: { surface: "Samsung TV (Study/Den)", zoneId: "INDOOR_STUDY" },
                    })
                  }
                >
                  Cast to Samsung TV
                </button>
                <button
                  className="btn secondary"
                  disabled={busy}
                  onClick={() => dispatch({ type: "arrival_prep", payload: { etaMinutes: 8 } })}
                >
                  Arm arrival prep
                </button>
                <button
                  className="btn secondary"
                  disabled={busy}
                  onClick={() =>
                    dispatch({ type: "observe", payload: { deviceId: "solar.sofar.inverter" } })
                  }
                >
                  Observe solar inverter
                </button>
              </div>

              <div className="receipts">
                {receipts.length === 0 ? (
                  <div className="empty">Proof receipts appear here as actions run.</div>
                ) : (
                  receipts.map((r) => (
                    <div key={r.id} className={`receipt ${r.ok ? "ok" : "fail"}`}>
                      <div>{r.detail}</div>
                      <div className="rid">{r.id}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="panel">
            <h2>Projects</h2>
            <div className="device-list">
              {projects.map((p) => (
                <div key={p.id} className="device" style={{ cursor: "default" }}>
                  <div>
                    <div className="name">{p.name}</div>
                    <div className="meta">
                      {p.zone} · {p.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
