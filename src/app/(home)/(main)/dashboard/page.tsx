import Workspace from "@/src/components/Workspace";
import { QUERIES } from "@/src/server/db/queries";

export default async function DashboardPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;

  const page = searchParams?.page ?? 1;
  const query = searchParams?.query ?? "";

  const paginatedMaps = await QUERIES.getUserMaps(query, +page);

  return <Workspace paginatedMaps={paginatedMaps} />;
}
