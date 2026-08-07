import { HOUSE_PROJECTS, ZONES, getRegistry } from "@pulse/shared";
import Dashboard from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export default function Home() {
  const devices = getRegistry().map((d) => ({ ...d }));
  return <Dashboard initialDevices={devices} zones={ZONES} projects={HOUSE_PROJECTS} />;
}
