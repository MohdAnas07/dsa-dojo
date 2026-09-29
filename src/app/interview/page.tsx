"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getState, randomUnsolved } from "@/lib/store";

/** Sends you to a random unsolved problem. */
export default function Interview() {
  const router = useRouter();
  useEffect(() => { router.replace(`/problems/${randomUnsolved(getState())}`); }, [router]);
  return <p className="muted">Picking a problem…</p>;
}
