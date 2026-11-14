const capabilities = [
  'Frontend',
  'Backend',
  'Data',
  'Creative Tech',
  'Product Thinking',
];

export default function Capabilities() {
  return (
    <section id="capabilities" className="capabilities-section">
      <div className="content-wrap capabilities-shell">
        <div className="capabilities-intro">
          <p className="eyebrow eyebrow-dark">Capabilities</p>
          <h2 className="section-title section-title-dark">
            What I
            <span>bring to the table.</span>
          </h2>
          <p className="capabilities-description">
            From full-stack development to creative problem solving, I build experiences that are practical, scalable and memorable.
          </p>
          <a href="#capability-grid" className="inline-link inline-link-dark">
            Explore Skills
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div id="capability-grid" className="capability-grid">
          {capabilities.map((item, index) => (
            <div key={item} className="capability-card">
              <span className="capability-index">0{index + 1}</span>
              <h3>{item}</h3>
              <p>
                {index === 0 && 'Crafting interfaces that feel intuitive and precise.'}
                {index === 1 && 'Designing systems that scale with real business needs.'}
                {index === 2 && 'Turning complexity into clear, informed decisions.'}
                {index === 3 && 'Using technology as a creative medium for expression.'}
                {index === 4 && 'Connecting strategy, design and engineering in one flow.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
