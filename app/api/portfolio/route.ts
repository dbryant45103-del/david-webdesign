import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("portfolio")
    .select("id, title, description, image_url, link")
    .order("id", { ascending: true });

  if (error) {
    console.error("Supabase portfolio fetch error:", error);
    return NextResponse.json({ error: "Failed to load portfolio." }, { status: 500 });
  }

  return NextResponse.json(data);
}
