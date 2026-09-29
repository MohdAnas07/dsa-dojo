import { Suspense } from "react";
import MistakesView from "@/views/MistakesView";
export const metadata = { title: "Mistake notebook" };
export default function Page() { return <Suspense><MistakesView /></Suspense>; }
