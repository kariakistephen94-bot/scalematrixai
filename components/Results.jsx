export default function Results() {
  return (
    <section className="results wrap" id="results">
      <div className="sectionlabel">THE OUTCOME THAT MATTERS</div>
      <h2>
        Real Sales Opportunities.
        <br />
        <span>Zero Cold Calling.</span>
      </h2>
      <p className="sectionintro">
        {
          "Less chasing leads. More conversations with the right decision-makers."
        }
      </p>
      <div className="stats">
        <article>
          <span className="statmark">↗</span>
          <strong>
            $45,000
            <span>+</span>
          </strong>
          <p>Average Annual Contract Value Added</p>
        </article>
        <article>
          <span className="statmark">◷</span>
          <strong>
            14
            <span>Days</span>
          </strong>
          <p>Time To First Qualified Meeting</p>
        </article>
        <article>
          <span className="statmark">✧</span>
          <strong>
            100
            <span>%</span>
          </strong>
          <p>Automated Prospecting &amp; Follow-Up</p>
        </article>
      </div>
      <div className="resultnote">
        {
          "Illustrative results supplied for this preview. Client results and testimonials require verification."
        }
      </div>
      <div className="stories">
        <article>
          <div className="storyimage one">
            <span className="storylabel">WEEK ONE</span>
            <div className="number">
              4<span>walkthroughs booked</span>
            </div>
            <span className="storyarrow">↗</span>
          </div>
          <div className="storycopy">
            <small>EXAMPLE CLIENT STORY</small>
            <h3>How Apex Cleaning booked 4 office walkthroughs in week 1.</h3>
            <p>From outreach to opportunity.</p>
          </div>
        </article>
        <article>
          <div className="storyimage two">
            <span className="storylabel">60-DAY MOMENTUM</span>
            <div className="number">
              12
              <span>commercial contracts</span>
            </div>
            <span className="storyarrow">↗</span>
          </div>
          <div className="storycopy">
            <small>EXAMPLE CLIENT STORY</small>
            <h3>
              12 commercial contracts closed in 60 days using AI outreach.
            </h3>
            <p>A pipeline that keeps moving.</p>
          </div>
        </article>
        <article>
          <div className="storyimage three">
            <span className="storylabel">RECURRING REVENUE</span>
            <div className="number">
              $12k
              <span>monthly contract value</span>
            </div>
            <span className="storyarrow">↗</span>
          </div>
          <div className="storycopy">
            <small>EXAMPLE CLIENT STORY</small>
            <h3>Added $12k/mo in recurring facility management contracts.</h3>
            <p>Built for long-term growth.</p>
          </div>
        </article>
      </div>
    </section>
  );
}
