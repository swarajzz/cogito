import { ConceptMap } from "@/src/components/concept-map";
import { getMapData } from "@/src/server/db/queries";

export default async function Map({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const map = await getMapData(id);

  if (!map) return null;

  return <ConceptMap data={map} />;
}
