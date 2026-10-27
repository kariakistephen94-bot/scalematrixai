import CalendlyBooking from "./CalendlyBooking";

export default function Application() {
  return (
    <section className="application wrap" id="application">
      <div className="applicationcopy">
        <div className="sectionlabel">LET’S BUILD YOUR NEXT CHAPTER</div>
        <h2>
          Your market.
          <br />
          Your next clients.
          <br />
          <span>Your AI engine.</span>
        </h2>
        <p>
          {
            "Tell us a little about your business. We\u2019ll map out what an automated lead generation and outreach pipeline could look like for you."
          }
        </p>
        <ul>
          <li>Custom strategy for your local market</li>
          <li>A clear plan to launch your outbound engine</li>
          <li>No pressure. Just a conversation about growth.</li>
        </ul>
        <div className="limited">
          <i></i>3 implementation spots available this month
        </div>
      </div>
      <div className="formcard">
        <div className="formprogress">
          <span className="active">
            1<b>Your details</b>
          </span>
          <em></em>
          <span>
            2<b>Book a call</b>
          </span>
        </div>
        <p
          id="application-status"
          className="application-status"
          role="status"
          aria-live="polite"
        ></p>
        <form id="apply">
          <div className="formstep" data-step="0">
            <span className="formkicker">STEP 01 OF 02</span>
            <h3>Let’s get acquainted.</h3>
            <p>Your next stage of growth starts here.</p>
            <label>
              Full name
              <input
                name="name"
                maxLength={200}
                autoComplete="name"
                placeholder="Alex Johnson"
                required
              />
            </label>
            <label>
              Work email
              <input
                name="email"
                maxLength={200}
                type="email"
                autoComplete="email"
                placeholder="alex@yourcompany.com"
                required
              />
            </label>
            <div className="formrow">
              <label>
                Phone number
                <input
                  name="phone"
                  inputMode="tel"
                  pattern={"[+0-9\\s\\(\\).\\-]{7,40}"}
                  minLength={7}
                  maxLength={40}
                  type="tel"
                  autoComplete="tel"
                  placeholder="(555) 000-0000"
                  required
                />
              </label>
              <label>
                Company name
                <input
                  name="company"
                  maxLength={200}
                  autoComplete="organization"
                  placeholder="Your company"
                  required
                />
              </label>
            </div>
            <button className="button next" type="submit">
              Continue to booking
              <span>→</span>
            </button>
            <small className="formprivacy">
              We’ll use your details to prepare for your call. Choose a time on
              the next step.
            </small>
          </div>
          <div className="formstep" data-step="1" hidden>
            <span className="formkicker">STEP 02 OF 02</span>
            <h3>Your strategy call.</h3>
            <p id="greeting"></p>
            <CalendlyBooking />
            <button className="back" type="button">
              ← Edit your details
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
