import { Suspense } from "react";
import ProblemsView from "@/views/ProblemsView";
export const metadata = { title: "Problems" };
export default function Page() { return <Suspense><ProblemsView /></Suspense>; }
