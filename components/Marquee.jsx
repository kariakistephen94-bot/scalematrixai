const WORDS = [
  ["Lead generation", true],
  ["Personalized outreach", false],
  ["Booked meetings", true],
  ["On autopilot", false],
];

const Row = ({ hidden }) => (
  <div className="marquee-row" aria-hidden={hidden || undefined}>
    {WORDS.map(([word, solid]) => (
      <span key={word} className={solid ? "solid" : "outline"}>
        {word}
        <i className="star" aria-hidden="true">
          ✦
        </i>
      </span>
    ))}
  </div>
);

/** Velocity-reactive type band: speed and skew follow the scroll. */
export default function Marquee() {
  return (
    <section
      className="marquee"
      data-marquee
      data-dir="-1"
      aria-label="What we do"
    >
      <div className="marquee-track">
        <Row />
        <Row hidden />
        <Row hidden />
        <Row hidden />
      </div>
    </section>
  );
}
