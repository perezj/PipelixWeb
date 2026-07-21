"use client";
import { useEffect } from "react";
type ContactPayload = Record<string, FormDataEntryValue | string | null>;
declare global { interface Window { dataLayer?: unknown[] } }

export function ContactFormBridge() {
  useEffect(() => {
    async function submitContactForm(event: SubmitEvent) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.closest("#contact")) return;
      event.preventDefault();
      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const status = form.querySelector<HTMLElement>('[role="status"]');
      const original = button?.innerHTML;
      if (button) { button.disabled = true; button.textContent = "Sending…"; }
      try {
        const params = new URLSearchParams(window.location.search);
        const payload: ContactPayload = Object.fromEntries(new FormData(form).entries());
        for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"]) payload[key] = params.get(key);
        payload.landingPage = window.location.pathname;
        const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error("Contact request failed");
        form.reset();
        if (status) { status.textContent = "Thanks — your workflow-review request has been sent."; status.classList.add("sent"); }
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "generate_lead", form_name: "workflow_review" });
      } catch {
        if (status) { status.textContent = "We could not send your request. Please try again or email hello@pipelix.ai."; status.classList.remove("sent"); }
      } finally {
        if (button) { button.disabled = false; button.innerHTML = original ?? "Request a workflow review"; }
      }
    }
    document.addEventListener("submit", submitContactForm);
    return () => document.removeEventListener("submit", submitContactForm);
  }, []);
  return null;
}
