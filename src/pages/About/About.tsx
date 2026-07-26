import './About.css';

function About() {
  return (
    <div className="about-page">
      <h1>About Poki Land</h1>
      <p>
        Poki Land is a Pokémon search app built while learning React, from class
        components to hooks and routing.
      </p>
      <p>
        Built as part of the{' '}
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noreferrer"
        >
          RS School React course
        </a>
        .
      </p>
    </div>
  );
}

export default About;
