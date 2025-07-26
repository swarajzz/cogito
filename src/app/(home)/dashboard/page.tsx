import Workspace from "@/src/components/Workspace";
import { getUserMaps } from "@/src/server/db/queries";

export default async function DashboardPage() {
  const userMaps = await getUserMaps();

  return <Workspace userMaps={userMaps} />;
}
