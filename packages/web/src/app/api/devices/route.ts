import { NextResponse } from "next/server";
import { getRegistry, unalignedCount } from "@pulse/shared";

// GET /api/devices → all known systems + alignment summary.
// Mirrors the PULSE LAN API contract described in packages/nixos/README.md.
export function GET() {
  const devices = getRegistry();
  return NextResponse.json({
    count: devices.length,
    unaligned: unalignedCount(devices),
    devices,
  });
}
