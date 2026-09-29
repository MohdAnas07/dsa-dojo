import { notFound } from "next/navigation";
import { PROBLEMS } from "@/content/problems";
import { PROB } from "@/lib/data";
import ProblemView from "@/views/ProblemView";

export function generateStaticParams() { return PROBLEMS.map(p => ({ id: p.id })); }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const p = PROB[id];
  return p ? { title: p.t, description: p.s } : {};
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!PROB[id]) notFound();
  return <ProblemView id={id} />;
}
