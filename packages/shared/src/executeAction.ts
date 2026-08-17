// PULSE executeAction — the typed action engine shared by every surface.
// Every action returns a ProofReceipt: a sovereign, verifiable record of what
// happened. No external API calls here; side effects that touch hardware live
// in surface packages that consume these receipts.

import { flagUnaligned, observe, type HouseSystem } from "./deviceRegistry";
import type { LayerId, VeneerId, ZoneId } from "./spatial/SpatialTypes";

/** Payload shape for each action type. */
export interface ActionPayloadMap {
  observe: { deviceId: string };
  flag_unaligned: { deviceId: string; reason: string };
  cast: { surface: string; zoneId?: ZoneId };
  arrival_prep: { etaMinutes: number };
  set_veneer: { veneer: VeneerId };
  toggle_layer: { layer: LayerId; enabled: boolean };
}

export type ActionType = keyof ActionPayloadMap;

/** A fully-typed action: its type discriminates its payload. */
export type ActionPayload<T extends ActionType = ActionType> = {
  type: T;
  payload: ActionPayloadMap[T];
};

/** A verifiable record of an executed action. */
export interface ProofReceipt {
  /** Unique receipt id. */
  id: string;
  action: ActionType;
  ok: boolean;
  /** ISO timestamp of execution. */
  at: string;
  /** Human-readable summary of the effect. */
  detail: string;
  /** Structured result data, when applicable. */
  data?: unknown;
}

function receiptId(action: ActionType, at: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `rcpt_${action}_${Date.parse(at)}_${rand}`;
}

/**
 * Dispatch a typed action and return a proof receipt. Unknown devices and
 * malformed payloads produce an `ok: false` receipt rather than throwing, so
 * callers always get an auditable record.
 */
export function executeAction<T extends ActionType>(
  action: ActionPayload<T>,
  at: string = new Date().toISOString(),
): ProofReceipt {
  const base = { id: receiptId(action.type, at), action: action.type, at };

  if (!action.payload) {
    return { ...base, ok: false, detail: "Missing action payload" };
  }

  switch (action.type) {
    case "observe": {
      const { deviceId } = action.payload as ActionPayloadMap["observe"];
      const device = observe(deviceId, at);
      return device
        ? { ...base, ok: true, detail: `Observed ${device.name}`, data: summarise(device) }
        : { ...base, ok: false, detail: `Unknown device: ${deviceId}` };
    }

    case "flag_unaligned": {
      const { deviceId, reason } = action.payload as ActionPayloadMap["flag_unaligned"];
      const device = flagUnaligned(deviceId, reason);
      return device
        ? { ...base, ok: true, detail: `Flagged ${device.name}: ${reason}`, data: summarise(device) }
        : { ...base, ok: false, detail: `Unknown device: ${deviceId}` };
    }

    case "cast": {
      const { surface, zoneId } = action.payload as ActionPayloadMap["cast"];
      const where = zoneId ? ` (${zoneId})` : "";
      return {
        ...base,
        ok: true,
        detail: `Cast dispatched to ${surface}${where}`,
        data: { surface, zoneId },
      };
    }

    case "arrival_prep": {
      const { etaMinutes } = action.payload as ActionPayloadMap["arrival_prep"];
      const ok = Number.isFinite(etaMinutes) && etaMinutes >= 0;
      return {
        ...base,
        ok,
        detail: ok
          ? `Arrival prep armed — ETA ${etaMinutes} min`
          : `Invalid ETA: ${etaMinutes}`,
        data: { etaMinutes },
      };
    }

    case "set_veneer": {
      const { veneer } = action.payload as ActionPayloadMap["set_veneer"];
      return { ...base, ok: true, detail: `Veneer set to ${veneer}`, data: { veneer } };
    }

    case "toggle_layer": {
      const { layer, enabled } = action.payload as ActionPayloadMap["toggle_layer"];
      return {
        ...base,
        ok: true,
        detail: `Layer ${layer} ${enabled ? "enabled" : "disabled"}`,
        data: { layer, enabled },
      };
    }

    default: {
      const exhaustive: never = action.type;
      return { ...base, ok: false, detail: `Unsupported action: ${String(exhaustive)}` };
    }
  }
}

function summarise(device: HouseSystem) {
  return {
    id: device.id,
    status: device.status,
    aligned: device.aligned,
    lastObservedAt: device.lastObservedAt,
  };
}
