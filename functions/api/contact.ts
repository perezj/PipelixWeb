interface Env {
  RESEND_API_KEY: string;
  RESEND_FROM_EMAIL: string;
  CONTACT_TO_EMAIL: string;
}

interface PagesContext<TEnv> {
  request: Request;
  env: TEnv;
}

type ContactRequest = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  team?: unknown;
  message?: unknown;
  website?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength ? trimmed : null;
}

export const onRequestPost = async ({ request, env }: PagesContext<Env>): Promise<Response> => {
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }

  let payload: ContactRequest;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (typeof payload.website === "string" && payload.website.trim()) {
    return Response.json({ ok: true });
  }

  const name = text(payload.name, 120);
  const email = text(payload.email, 254);
  const company = text(payload.company, 160);
  const team = text(payload.team, 80);
  const message = text(payload.message, 4_000);

  if (!name || !email || !emailPattern.test(email) || !company || !team || !message) {
    return Response.json({ error: "Please complete all fields with valid information." }, { status: 400 });
  }

  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL || !env.CONTACT_TO_EMAIL) {
    return Response.json({ error: "Contact form is not configured." }, { status: 500 });
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.RESEND_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `Pipelix workflow review — ${company}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nTeam size: ${team}\n\nMessage:\n${message}`,
    }),
  });

  if (!resendResponse.ok) {
    return Response.json({ error: "Unable to send your request." }, { status: 502 });
  }

  return Response.json({ ok: true }, { status: 201 });
};
