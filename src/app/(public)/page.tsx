
function EngineeringIllustration() {
  return (
    <div className="hero-visual" aria-label="Animated engineering illustration">
      <div className="visual-grid" />

      <span className="floating-label label-network">NETWORK SYSTEMS</span>
      <span className="floating-label label-software">SOFTWARE & IoT</span>

      <svg
        className="engineering-art"
        viewBox="0 0 340 300"
        role="img"
        aria-label="Illustration of connected engineering systems"
      >
        <path className="art-line" d="M75 85 L145 125 L250 70" />
        <path className="art-line" d="M145 125 L230 205 L285 155" />
        <path className="art-line" d="M75 85 L85 220 L230 205" />

        <rect className="art-card" x="100" y="75" width="145" height="155" rx="14" />

        <rect className="art-blue" x="125" y="100" width="95" height="13" rx="4" />
        <rect className="art-light" x="125" y="126" width="65" height="7" rx="3" />
        <rect className="art-light" x="125" y="143" width="80" height="7" rx="3" />

        <rect className="art-card" x="125" y="170" width="95" height="38" rx="6" />
        <circle className="art-blue" cx="141" cy="189" r="6" />
        <circle className="art-light" cx="161" cy="189" r="6" />
        <circle className="art-light" cx="181" cy="189" r="6" />

        <circle className="art-blue" cx="75" cy="85" r="12" />
        <circle className="art-light" cx="250" cy="70" r="12" />
        <circle className="art-blue" cx="285" cy="155" r="12" />
        <circle className="art-light" cx="230" cy="205" r="12" />
        <circle className="art-blue" cx="85" cy="220" r="12" />

        <text className="art-text" x="170" y="255" textAnchor="middle">
          CONNECT · BUILD · INNOVATE
        </text>
      </svg>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <section className="hero" id="home">
        <div className="section-container hero-grid">
          <div>
            <div className="eyebrow">
              <span className="status-dot" />
              COMPUTER ENGINEERING PORTFOLIO
            </div>

            <h1>
              Engineering ideas.
              <br />
              Building <span>solutions.</span>
            </h1>

            <p className="hero-description">
              I am Nyanyoh Divine, a Computer Engineer focused on Network
              Engineering and Software Development. I enjoy designing
              practical technology solutions and turning ideas into working
              systems.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#projects">
                Explore my projects <span aria-hidden="true">↗</span>
              </a>

              <a className="secondary-button" href="#about">
                More about me <span aria-hidden="true">→</span>
              </a>
            </div>

            <p className="hero-note">
              Computer Engineer <span>·</span> Network Engineering
            </p>
          </div>

          <EngineeringIllustration />
        </div>
      </section>

      <section className="section section-alt" id="about">
        <div className="section-container about-grid">
          <div>
            <span className="eyebrow">01 / ABOUT ME</span>
            <h2 className="section-heading">
              Technology with a purpose.
            </h2>
          </div>

          <div>
            <p className="about-copy">
              I am a Computer Engineering student at the University of Buea
              with a strong interest in computer networks, infrastructure,
              software development and embedded systems.
            </p>

            <p className="about-copy">
              My learning combines practical networking labs, hardware
              projects and software development. I enjoy understanding how
              systems work, troubleshooting technical challenges and building
              solutions that address real-world problems.
            </p>

            <div className="about-highlight">
              <strong>My approach</strong>
              <span>
                Learn through practice, build with purpose and keep improving
                through real engineering challenges.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="section-container">
          <SectionHeading
            eyebrow="02 / SELECTED WORK"
            title="Projects & practical experience."
            description="A selection of engineering work across networking, embedded systems and software. These examples will later be managed through your private admin dashboard."
          />

          <div className="project-grid">
            <article className="project-card">
              <span className="project-number">PROJECT 01</span>
              <h3>Smart Traffic Priority System</h3>
              <p>
                An ESP32-CAM and YOLO-based prototype designed to detect
                vehicles, identify emergency vehicles and adjust traffic
                light priority using MQTT communication.
              </p>
              <div className="project-tags">
                <span>ESP32</span>
                <span>Python</span>
                <span>YOLOv8</span>
                <span>MQTT</span>
              </div>
            </article>

            <article className="project-card">
              <span className="project-number">PROJECT 02</span>
              <h3>Network Infrastructure Labs</h3>
              <p>
                Practical networking exercises involving VLANs, routing,
                switching, IP addressing and network services using
                simulation and configuration tools.
              </p>
              <div className="project-tags">
                <span>Cisco</span>
                <span>Huawei eNSP</span>
                <span>GNS3</span>
                <span>Packet Tracer</span>
              </div>
            </article>

            <article className="project-card">
              <span className="project-number">EXPERIENCE 03</span>
              <h3>Network Troubleshooting</h3>
              <p>
                Practical troubleshooting experience during a SOCATEL
                internship, investigating connectivity issues involving
                DHCP addressing, switch ports and network access.
              </p>
              <div className="project-tags">
                <span>DHCP</span>
                <span>Windows</span>
                <span>Networking</span>
              </div>
            </article>

            <article className="project-card">
              <span className="project-number">MORE COMING</span>
              <h3>More engineering work</h3>
              <p>
                This portfolio will grow as new software, networking and
                embedded systems projects are completed and published.
              </p>
              <div className="project-tags">
                <span>Engineering</span>
                <span>Development</span>
                <span>Innovation</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="skills">
        <div className="section-container">
          <SectionHeading
            eyebrow="03 / TECHNICAL INTERESTS"
            title="Areas I work with."
            description="My current technical focus areas and the tools I use while learning and building."
          />

          <div className="skills-grid">
            <article className="skill-card">
              <h3>Network Engineering</h3>
              <p>
                Routing, switching, VLANs, IP addressing, network
                troubleshooting and infrastructure labs.
              </p>
            </article>

            <article className="skill-card">
              <h3>Software Development</h3>
              <p>
                Programming, application development, Python and
                problem-solving through software.
              </p>
            </article>

            <article className="skill-card">
              <h3>Embedded Systems & IoT</h3>
              <p>
                ESP32 projects, microcontrollers, sensors, device
                communication and automation.
              </p>
            </article>

            <article className="skill-card">
              <h3>Network Platforms</h3>
              <p>
                Cisco Packet Tracer, Huawei eNSP, GNS3 and practical
                device configuration.
              </p>
            </article>

            <article className="skill-card">
              <h3>Systems & Linux</h3>
              <p>
                Ubuntu, Linux administration fundamentals, virtualization
                and network services.
              </p>
            </article>

            <article className="skill-card">
              <h3>AI & Computer Vision</h3>
              <p>
                YOLO-based object detection, OpenCV and applying machine
                learning to engineering prototypes.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="section-container">
          <div className="contact-panel">
            <div>
              <h2>Lets build something meaningful.</h2>
              <p>
                Interested in engineering, technology or collaboration?
                I would be glad to connect.
              </p>
            </div>

            <a className="primary-button" href="mailto:">
              Get in touch <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="section-container footer-content">
          <span>© 2026 Nyanyoh Divine</span>
          <span>Computer Engineer | Network Engineering</span>
        </div>
      </footer>
    </main>
  );
}
