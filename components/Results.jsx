const Lines = ({ children }) =>
  children.map((line, i) => (
    <span key={i}>
      <span className="ln">
        <span className="li" style={{ "--i": i }}>
          {line}
        </span>
      </span>{" "}
    </span>
  ));

const STATS = [
  {
    mark: "↗",
    count: 45000,
    prefix: "$",
    shown: "$45,000",
    unit: "+",
    label: "Average Annual Contract Value Added",
  },
  {
    mark: "◷",
    count: 14,
    shown: "14",
    unit: "Days",
    label: "Time To First Qualified Meeting",
  },
  {
    mark: "✧",
    count: 100,
    shown: "100",
    unit: "%",
    label: "Automated Prospecting & Follow-Up",
  },
];

/* Illustrative charts: pure SVG, drawn on reveal by CSS. */
const BarsChart = () => (
  <svg className="chart" viewBox="0 0 160 90" aria-hidden="true">
    {[22, 38, 30, 62, 50, 84, 74].map((h, i) => (
      <rect
        key={i}
        className="bar"
        style={{ "--i": i }}
        x={8 + i * 21}
        y={88 - h}
        width="12"
        height={h}
        rx="3"
      />
    ))}
  </svg>
);
const LineChart = () => (
  <svg className="chart" viewBox="0 0 160 90" aria-hidden="true">
    <path
      className="area"
      d="M4 84 C 30 80 40 70 62 58 S 100 50 118 30 S 146 14 156 8 V90 H4Z"
    />
    <path
      className="stroke"
      pathLength="1"
      d="M4 84 C 30 80 40 70 62 58 S 100 50 118 30 S 146 14 156 8"
    />
    <circle className="tip" cx="156" cy="8" r="3.4" />
  </svg>
);
const StepChart = () => (
  <svg className="chart" viewBox="0 0 160 90" aria-hidden="true">
    <path
      className="area"
      d="M4 80 H36 V64 H68 V50 H100 V34 H132 V16 H156 V90 H4Z"
    />
    <path
      className="stroke"
      pathLength="1"
      d="M4 80 H36 V64 H68 V50 H100 V34 H132 V16 H156"
    />
    <circle className="tip" cx="156" cy="16" r="3.4" />
  </svg>
);

const STORIES = [
  {
    cls: "one",
    label: "WEEK ONE",
    count: 4,
    shown: "4",
    unit: "walkthroughs booked",
    title: "How Apex Cleaning booked 4 office walkthroughs in week 1.",
    text: "From outreach to opportunity.",
    Chart: BarsChart,
  },
  {
    cls: "two",
    label: "60-DAY MOMENTUM",
    count: 12,
    shown: "12",
    unit: "commercial contracts",
    title: "12 commercial contracts closed in 60 days using AI outreach.",
    text: "A pipeline that keeps moving.",
    Chart: LineChart,
  },
  {
    cls: "three",
    label: "RECURRING REVENUE",
    count: 12,
    prefix: "$",
    suffix: "k",
    shown: "$12k",
    unit: "monthly contract value",
    title: "Added $12k/mo in recurring facility management contracts.",
    text: "Built for long-term growth.",
    Chart: StepChart,
  },
];

export default function Results() {
  return (
    <section className="results wrap" id="results">
      <div className="sectionlabel" data-reveal>
        THE OUTCOME THAT MATTERS
      </div>
      <h2 data-reveal="lines">
        <Lines>
          {["Real Sales Opportunities.", <em key="z">Zero Cold Calling.</em>]}
        </Lines>
      </h2>
      <p className="sectionintro" data-reveal>
        Less chasing leads. More conversations with the right decision-makers.
      </p>
      <div className="stats" data-stagger>
        {STATS.map((s) => (
          <article key={s.label} data-reveal data-spot>
            <span className="statmark">{s.mark}</span>
            <strong>
              <span data-count={s.count} data-prefix={s.prefix}>
                {s.shown}
              </span>
              <span className="unit">{s.unit}</span>
            </strong>
            <p>{s.label}</p>
          </article>
        ))}
      </div>
      <div className="resultnote" data-reveal>
        Illustrative results supplied for this preview. Client results and
        testimonials require verification.
      </div>
      <div className="stories" data-stagger>
        {STORIES.map((s) => (
          <article key={s.title} data-reveal data-spot>
            <div className={`storyimage ${s.cls}`}>
              <span className="storylabel">{s.label}</span>
              <div className="number">
                <span
                  data-count={s.count}
                  data-prefix={s.prefix}
                  data-suffix={s.suffix}
                >
                  {s.shown}
                </span>
                <span className="numunit">{s.unit}</span>
              </div>
              <s.Chart />
            </div>
            <div className="storycopy">
              <small>EXAMPLE CLIENT STORY</small>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
