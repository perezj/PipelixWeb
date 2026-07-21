"use client";

import { useEffect } from "react";

type ContactPayload = Record<string, FormDataEntryValue>;

export function ContactFormBridge() {
  useEffect(() => {
    async function submitContactForm(event: SubmitEvent) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.closest("#contact")) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      const status = form.querySelector<HTMLElement>("small");
      const originalButtonText = button?.textContent;
      if (button) {
        button.disabled = true;
        button.textContent = "Sending…";
      }

      try {
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries()) as ContactPayload;
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Contact request failed");

        form.reset();
        if (status) {
          status.textContent = "Thanks — your workflow-review request has been sent.";
          status.classList.add("sent");
        }
      } catch {
        if (status) {
          status.textContent = "We could not send your request. Please try again or email hello@pipelix.ai.";
          status.classList.remove("sent");
        }
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = originalButtonText ?? "Request a workflow review";
        }
      }
    }

    document.addEventListener("submit", submitContactForm, true);
    return () => document.removeEventListener("submit", submitContactForm, true);
  }, []);

  return null;
}
