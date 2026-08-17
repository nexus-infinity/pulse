"use client";

import type { HouseSystem, LayerId, ZoneGeometry, ZoneId } from "@pulse/shared";
import { devicesForLayer } from "@/lib/layers";

const VIEW_W = 1000;
const VIEW_H = 750;

interface Props {
  zones: ZoneGeometry[];
  devices: HouseSystem[];
  layer: LayerId;
  activeZoneId?: ZoneId;
  onZoneSelect: (id: ZoneId) => void;
}

/**
 * FlatPlanVeneer — the web equivalent of the Android FlatPlanVeneer.
 * Renders the 1988 floor-plan zones as SVG polygons (scaled from normalised
 * 0–1 coordinates) and pins the devices relevant to the active layer.
 */
export default function FlatPlanVeneer({
  zones,
  devices,
  layer,
  activeZoneId,
  onZoneSelect,
}: Props) {
  const layerDevices = devicesForLayer(devices, layer);
  const devicesByZone = new Map<ZoneId, HouseSystem[]>();
  for (const d of layerDevices) {
    const list = devicesByZone.get(d.zone) ?? [];
    list.push(d);
    devicesByZone.set(d.zone, list);
  }

  return (
    <div className="veneer-frame">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        width="100%"
        height="100%"
        role="img"
        aria-label="PULSE floor plan"
      >
        {zones.map((zone) => {
          const zoneDevices = devicesByZone.get(zone.id) ?? [];
          const hasDevices = zoneDevices.length > 0;
          const needsAttention = zoneDevices.some((d) => !d.aligned);
          const isActive = zone.id === activeZoneId;

          const points = zone.polygon
            .map((p) => `${p.x * VIEW_W},${p.y * VIEW_H}`)
            .join(" ");

          const fill = isActive
            ? "rgba(53, 208, 186, 0.28)"
            : hasDevices
              ? needsAttention
                ? "rgba(242, 106, 90, 0.16)"
                : "rgba(53, 208, 186, 0.12)"
              : "rgba(34, 48, 68, 0.35)";

          const stroke = isActive ? "#35d0ba" : "#2c3d55";

          return (
            <g key={zone.id} style={{ cursor: "pointer" }} onClick={() => onZoneSelect(zone.id)}>
              <polygon
                points={points}
                fill={fill}
                stroke={stroke}
                strokeWidth={isActive ? 3 : 1.5}
              />
              <text
                className="zone-label"
                x={zone.centroid.x * VIEW_W}
                y={zone.centroid.y * VIEW_H - (hasDevices ? 10 : 0)}
              >
                {zone.label}
              </text>
              {hasDevices && (
                <>
                  <circle
                    cx={zone.centroid.x * VIEW_W}
                    cy={zone.centroid.y * VIEW_H + 10}
                    r={7}
                    fill={needsAttention ? "#f26a5a" : "#35d0ba"}
                  />
                  <text
                    x={zone.centroid.x * VIEW_W}
                    y={zone.centroid.y * VIEW_H + 14}
                    textAnchor="middle"
                    fontSize={10}
                    fill="#04120f"
                    fontWeight={700}
                    pointerEvents="none"
                  >
                    {zoneDevices.length}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
