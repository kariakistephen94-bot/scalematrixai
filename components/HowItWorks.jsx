export default function HowItWorks() {
  return (
    <section className="system wrap">
      <div className="sectionlabel">ONE ENGINE. THREE SIMPLE STEPS.</div>
      <h2>
        The ScaleMatrix AI
        <br />
        <span>Outbound System</span>
      </h2>
      <p className="sectionintro">
        We build the engine. You show up for the conversation.
      </p>
      <div className="steps">
        <article>
          <div className="stephead">
            <span className="stepicon">⌕</span>
            <small>01 / SOURCE</small>
          </div>
          <h3>
            Hyper-Targeted <br />
            Sourcing
          </h3>
          <p>
            {
              "We find decision-makers who match your ideal customer profile, industry, and market. The right companies. The right people. Your next opportunities."
            }
          </p>
          <div className="steptag">
            <i></i>
            Your ideal customers, precisely mapped
          </div>
        </article>
        <article>
          <div className="stephead">
            <span className="stepicon">✧</span>
            <small>02 / CONNECT</small>
          </div>
          <h3>
            AI Personalization <br />
            Engine
          </h3>
          <p>
            {
              "Tailored outreach crafted dynamically for each prospect\u2019s company size and location. Personal conversations, at scale."
            }
          </p>
          <div className="steptag">
            <i></i>
            Built around each prospect
          </div>
        </article>
        <article>
          <div className="stephead">
            <span className="stepicon">▣</span>
            <small>03 / BOOK</small>
          </div>
          <h3>
            Instant Inbound <br />
            Booking
          </h3>
          <p>
            {
              "AI handles replies and places booked meetings straight into your Google or Outlook calendar. Your next step: show up."
            }
          </p>
          <div className="steptag">
            <i></i>
            Straight into your calendar
          </div>
        </article>
      </div>
    </section>
  );
}
