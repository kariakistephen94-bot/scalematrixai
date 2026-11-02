import HeroCanvas from "./HeroCanvas";
import Console from "./Console";

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-sticky">
          <HeroCanvas />
          <div className="hero-vignette"></div>
        </div>
      </div>
      <div className="wrap hero-inner">
        <div className="eyebrow" data-reveal>
          <span>⚡</span>
          AI LEAD GENERATION &amp; OUTREACH FOR GROWING BUSINESSES
        </div>
        <h1 data-reveal="lines">
          <span className="ln">
            <span className="li" style={{ "--i": 0 }}>
              Book <span className="nb">10–15</span> Qualified
            </span>
          </span>{" "}
          <span className="ln">
            <span className="li" style={{ "--i": 1 }}>
              Sales Meetings
            </span>
          </span>{" "}
          <span className="ln">
            <span className="li" style={{ "--i": 2 }}>
              Every Month On <em className="shimmer">Autopilot.</em>
            </span>
          </span>
        </h1>
        <p className="lede" data-reveal style={{ "--d": "420ms" }}>
          We build automated AI outbound engines that connect your business with
          high-value prospects and book qualified sales conversations without
          hiring extra sales reps or spending a dollar on ads.
        </p>
        <div className="benefits" data-reveal style={{ "--d": "520ms" }}>
          <span>✓ No cold calling</span>
          <span>✓ No ad spend</span>
          <span>✓ Built for your territory</span>
        </div>
        <div className="cta" data-reveal style={{ "--d": "620ms" }}>
          <a href="#application" className="button primary" data-magnetic>
            Apply For A Custom AI Engine Build
            <span>→</span>
          </a>
          <p className="micro">
            <span className="tinygreen"></span>
            Only 3 client spots available this month.
            <span className="separator">|</span>
            100% Risk-Free Guarantee.
          </p>
        </div>
        <Console />
        <p className="watch" data-reveal>
          <span className="red"></span>
          Watch: How ScaleMatrix AI Books Qualified Meetings in 14 Days
          <span className="muted">(4 Min)</span>
        </p>
      </div>
    </section>
  );
}
