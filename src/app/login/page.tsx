import { Suspense } from "react";
import LoginView from "@/views/LoginView";
export const metadata = { title: "Sign in" };
export default function Page() { return <Suspense><LoginView /></Suspense>; }
