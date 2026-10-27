export default function Application() {
  return (
    <section className="application wrap" id="application">
      <div className="applicationcopy">
        <div className="sectionlabel">LET’S BUILD YOUR NEXT CHAPTER</div>
        <h2>
          Your territory.
          <br />
          Your next contracts.
          <br />
          <span>Your AI engine.</span>
        </h2>
        <p>
          {
            "Tell us a little about your business. We\u2019ll map out what an automated commercial pipeline could look like for you."
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
            2<b>Your business</b>
          </span>
          <em></em>
          <span>
            3<b>Book a call</b>
          </span>
        </div>
        <form id="apply">
          <div className="formstep" data-step="0">
            <span className="formkicker">STEP 01 OF 03</span>
            <h3>Let’s get acquainted.</h3>
            <p>Your next stage of growth starts here.</p>
            <label>
              Full name
              <input
                name="name"
                autoComplete="name"
                placeholder="Alex Johnson"
                required
              />
            </label>
            <label>
              Work email
              <input
                name="email"
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
                  autoComplete="organization"
                  placeholder="Your company"
                  required
                />
              </label>
            </div>
            <button className="button next" type="submit">
              Continue to your business
              <span>→</span>
            </button>
            <small className="formprivacy">
              {
                "\u2311 Your information stays in this preview. Nothing is submitted."
              }
            </small>
          </div>
          <div className="formstep" data-step="1" hidden>
            <span className="formkicker">STEP 02 OF 03</span>
            <h3>A little about your business.</h3>
            <p>Help us understand where you are today.</p>
            <label>
              What is your current monthly revenue?
              <select name="revenue" required>
                <option value="">Select monthly revenue</option>
                <option>Under $10,000</option>
                <option>$10,000–$30,000</option>
                <option>$30,000–$75,000</option>
                <option>$75,000–$150,000</option>
                <option>$150,000+</option>
              </select>
            </label>
            <label>
              Do you handle commercial or residential?
              <select name="market" required>
                <option value="">Select your service focus</option>
                <option>Commercial</option>
                <option>Residential</option>
                <option>Both commercial and residential</option>
              </select>
            </label>
            <button className="button next" type="submit">
              Continue to booking
              <span>→</span>
            </button>
            <button className="back" type="button">
              ← Back
            </button>
          </div>
          <div className="formstep" data-step="2" hidden>
            <span className="formkicker">STEP 03 OF 03</span>
            <h3>Your strategy call.</h3>
            <p id="greeting"></p>
            <div className="calendarplaceholder">
              <span>▣</span>
              <h4>Calendar integration ready</h4>
              <p>
                {
                  "Your Cal.com or Calendly booking widget will appear here once connected."
                }
              </p>
              <small>Preview only · No appointment has been booked.</small>
            </div>
            <button className="back" type="button">
              ← Back to your business
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
