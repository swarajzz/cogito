import Workspace from "@/src/components/Workspace";
import { QUERIES } from "@/src/server/db/queries";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const page = (await searchParams).page ?? 1;

  const paginatedMaps = await QUERIES.getUserMaps(+page);

  return <Workspace paginatedMaps={paginatedMaps} />;
}
