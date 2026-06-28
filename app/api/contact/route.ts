import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, business, email, message } = await req.json();

  if (!name || !business || !email || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const [emailResult, dbResult] = await Promise.all([
    resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      replyTo: email,
      subject: `New inquiry from ${name} at ${business}`,
      text: `Name: ${name}\nBusiness: ${business}\nEmail: ${email}\n\n${message}`,
    }),
    supabase.from("leads").insert({ name, business, email, message }),
  ]);

  if (emailResult.error) {
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }

  if (dbResult.error) {
    console.error("Supabase insert error:", dbResult.error);
  }

  return NextResponse.json({ success: true });
}
