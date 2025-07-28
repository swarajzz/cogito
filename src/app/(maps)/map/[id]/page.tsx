import { ConceptMap } from "@/src/components/concept-map";
import { QUERIES } from "@/src/server/db/queries";

export default async function Map({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const map = await QUERIES.getMapData(id);

  if (!map) return null;

  return <ConceptMap data={map} />;
}
