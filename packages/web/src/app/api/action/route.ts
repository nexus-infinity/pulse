import { NextResponse } from "next/server";
import { executeAction, getRegistry, type ActionPayload } from "@pulse/shared";

// POST /api/action → executeAction() with a proof receipt.
// Same typed contract as packages/shared, exposed over the LAN API surface.
export async function POST(request: Request) {
  let body: ActionPayload;
  try {
    body = (await request.json()) as ActionPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body.type !== "string") {
    return NextResponse.json({ error: "Missing action type" }, { status: 400 });
  }

  const receipt = executeAction(body);
  return NextResponse.json(
    { receipt, devices: getRegistry() },
    { status: receipt.ok ? 200 : 422 },
  );
}
