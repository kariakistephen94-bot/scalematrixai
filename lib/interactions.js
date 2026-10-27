export function initializeLanding() {
  const controller = new AbortController();
  const listen = (target, type, handler) =>
    target.addEventListener(type, handler, { signal: controller.signal });
  const form = document.querySelector("#apply");
  const steps = [...document.querySelectorAll(".formstep")];
  const progress = [...document.querySelectorAll(".formprogress>span")];
  let current = 0;
  function showStep(index) {
    current = index;
    document.querySelector("#application").dataset.booking = String(
      index === 1,
    );
    steps.forEach((s, i) => {
      s.hidden = i !== index;
      s.querySelectorAll("input,select").forEach(
        (el) => (el.disabled = i !== index),
      );
    });
    progress.forEach((p, i) => p.classList.toggle("active", i <= index));
    if (index === 1) {
      window.dispatchEvent(
        new CustomEvent("scalematrix:booking", {
          detail: {
            name: form.elements.name.value.trim(),
            email: form.elements.email.value.trim(),
          },
        }),
      );
      document.querySelector("#application").scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
      const name = form.elements.name.value.trim().split(" ")[0];
      document.querySelector("#greeting").textContent =
        `Thanks, ${name}. The next step is a conversation about your lead generation and outreach pipeline.`;
    }
  }
  let pending = false;
  let submittedPayload = "";
  const status = document.querySelector("#application-status");
  listen(form, "submit", async (event) => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    status.textContent = "";
    if (current !== 0) return;
    const fields = ["name", "email", "phone", "company"];
    const payload = JSON.stringify(
      Object.fromEntries(
        fields.map((key) => [key, form.elements[key].value.trim()]),
      ),
    );
    if (payload === submittedPayload) {
      showStep(1);
      return;
    }
    pending = true;
    const button = event.submitter;
    const original = button.innerHTML;
    button.disabled = true;
    form.setAttribute("aria-busy", "true");
    button.textContent = "Preparing booking…";
    // Booking stays available even when email delivery is unavailable.
    showStep(1);
    status.textContent = "Choose a time below to complete your booking.";
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        signal: AbortSignal.any([
          controller.signal,
          AbortSignal.timeout(20000),
        ]),
      });
      const result = await response.json();
      if (!response.ok || !result.success)
        throw new Error(result.error || "Please try again.");
      submittedPayload = payload;
      status.textContent =
        "Your details have been sent. Choose a time below to book your call.";
    } catch (error) {
      if (!controller.signal.aborted)
        status.textContent = "Choose a time below to book your call.";
    } finally {
      pending = false;
      button.disabled = false;
      button.innerHTML = original;
      form.removeAttribute("aria-busy");
    }
  });
  document.querySelectorAll(".back").forEach((b) =>
    listen(b, "click", () => {
      if (!pending) {
        status.textContent = "";
        showStep(current - 1);
      }
    }),
  );
  showStep(0);
  const video = document.querySelector("#videomodal");
  listen(document.querySelector("#play"), "click", () => video.showModal());
  listen(document.querySelector("#videoapply"), "click", () => video.close());
  document.querySelectorAll("dialog").forEach((d) => {
    listen(d.querySelector(".close"), "click", () => d.close());
    listen(d, "click", (e) => {
      if (e.target === d) {
        const r = d.getBoundingClientRect();
        if (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
          d.close();
      }
    });
  });
  document.querySelectorAll("[data-policy]").forEach((b) =>
    listen(b, "click", () => {
      document.querySelector("#policytitle").textContent =
        b.dataset.policy === "privacy" ? "Privacy Policy" : "Terms of Service";
      document.querySelector("#policy").showModal();
    }),
  );

  return () => controller.abort();
}
