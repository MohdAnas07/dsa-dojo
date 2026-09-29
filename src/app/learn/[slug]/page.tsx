import { notFound } from "next/navigation";
import { TOPICS } from "@/content/roadmap";
import { TOPIC } from "@/lib/data";
import LessonView from "@/views/LessonView";

export function generateStaticParams() { return TOPICS.map(t => ({ slug: t.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const t = TOPIC[slug];
  return t ? { title: t.title, description: t.blurb } : {};
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!TOPIC[slug]) notFound();
  return <LessonView slug={slug} />;
}
