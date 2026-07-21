"use client";

import { FormEvent, useState } from "react";

type FormStatus = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: formData.get("name"), email: formData.get("email"), company: formData.get("company"), team: formData.get("team"), message: formData.get("message"), website: formData.get("website") }) });
      if (!response.ok) throw new Error("Contact request failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return <form onSubmit={submit}>
    <div className="form-row"><label>Name<input name="name" required placeholder="Your name" /></label><label>Work email<input type="email" name="email" required placeholder="you@company.com" /></label></div>
    <div className="form-row"><label>Company<input name="company" required placeholder="Company name" /></label><label>Development team size<select name="team" defaultValue="" required><option value="" disabled>Select team size</option><option>1–5 engineers</option><option>6–20 engineers</option><option>21–50 engineers</option><option>51+ engineers</option></select></label></div>
    <label style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0, 0, 0, 0)" }} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <label>What would you like Pipelix to help with?<textarea name="message" required placeholder="Tell us about your backlog, workflow, or a task your team repeats..." /></label>
    <button className="btn" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Request a workflow review"} <span>↗</span></button>
    <small className={status === "success" ? "sent" : ""} role="status">{status === "success" ? "Thanks — your workflow-review request has been sent." : status === "error" ? "We could not send your request. Please try again or email hello@pipelix.ai." : "We’ll use this information only to respond to your request."}</small>
  </form>;
}
