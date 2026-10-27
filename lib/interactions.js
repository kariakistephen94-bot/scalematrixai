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
    steps.forEach((s, i) => {
      s.hidden = i !== index;
      s.querySelectorAll("input,select").forEach(
        (el) => (el.disabled = i !== index),
      );
    });
    progress.forEach((p, i) => p.classList.toggle("active", i <= index));
    if (index === 2) {
      const name = form.elements.name.value.trim().split(" ")[0];
      document.querySelector("#greeting").textContent =
        `Thanks, ${name}. The next step is a conversation about your commercial pipeline.`;
    }
  }
  listen(form, "submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    showStep(Math.min(current + 1, 2));
  });
  document
    .querySelectorAll(".back")
    .forEach((b) => listen(b, "click", () => showStep(current - 1)));
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
