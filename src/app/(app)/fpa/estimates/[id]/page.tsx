import { EstimateDetailManager } from "@/presentation/views/FPA/EstimateDetailManager";

export default async function EstimateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EstimateDetailManager estimateId={id} />;
}
