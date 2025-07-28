import Workspace from "@/src/components/Workspace";
import { QUERIES } from "@/src/server/db/queries";

export default async function DashboardPage() {
  const userMaps = await QUERIES.getUserMaps();

  return <Workspace userMaps={userMaps} />;
}
