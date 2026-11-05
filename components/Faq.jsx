import { FAQ } from "../lib/seo.js";

// Answer-first, plain server-rendered text: readable by search crawlers and AI answer engines without JS.
export default function Faq() {
  return (
    <section className="faq wrap" id="faq" aria-labelledby="faq-title">
      <div className="sectionlabel">QUESTIONS, ANSWERED</div>
      <h2 id="faq-title">What is ScaleMatrix AI, and how does it work?</h2>
      <p className="sectionintro">
        ScaleMatrix AI is an AI lead generation and outreach agency that builds
        automated outbound engines to book qualified sales meetings for growing
        businesses.
      </p>
      <div className="faq-list">
        {FAQ.map(({ q, a }) => (
          <article key={q}>
            <h3>{q}</h3>
            <p>{a}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
