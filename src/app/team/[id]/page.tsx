import { redirect } from "next/navigation";

export default async function TeamPageRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/league/cts/team/${id}`);
}
