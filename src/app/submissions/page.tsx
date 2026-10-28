import { Suspense } from "react";
import SubmissionsView from "@/views/SubmissionsView";
export const metadata = { title: "Submissions" };
export default function Page() { return <Suspense><SubmissionsView /></Suspense>; }
