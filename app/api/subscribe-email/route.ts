import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { email, tramite, firstName } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const server = process.env.MAILCHIMP_SERVER;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const apiKey = process.env.MAILCHIMP_API_KEY;

  if (!server || !audienceId || !apiKey) {
    return NextResponse.json({ error: "Missing Mailchimp env" }, { status: 500 });
  }

  const response = await fetch(
    `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`any:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status_if_new: "subscribed",
        merge_fields: {
          FNAME: firstName || "",
          TRAMITE: tramite || "general",
        },
      }),
    }
  );

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}