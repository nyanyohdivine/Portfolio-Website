
import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import Image from "next/image";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Nyanyoh Divine | Computer Engineer",
  description:
    "Engineering portfolio showcasing networking, software development, embedded systems and practical engineering projects.",
};

function formatDate(date: string | null) {
  if (!date) return null;

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

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

async function HomeContent() {
  await connection();

  const supabase = await createClient();

  // Fetch published projects from Supabase.
  const { data: projectRows, error: projectsError } = await supabase
    .from("projects")
    .select(
      "id, title, slug, summary, description, category, technologies, github_url, live_demo_url, cover_image_path, is_featured, published_at",
    )
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("published_at", { ascending: false });

  if (projectsError) {
    console.error("PUBLIC PROJECTS FETCH ERROR:", projectsError);
  }

  const publishedProjects = projectsError ? [] : (projectRows ?? []);

  // Fetch additional images for the published projects.
  let projectImages: {
    id: string;
    project_id: string;
    image_path: string;
    alt_text: string | null;
    sort_order: number;
  }[] = [];

  if (publishedProjects.length > 0) {
    const projectIds = publishedProjects.map((project) => project.id);

    const { data: imageRows, error: imagesError } = await supabase
      .from("project_images")
      .select("id, project_id, image_path, alt_text, sort_order")
      .in("project_id", projectIds)
      .order("sort_order", { ascending: true });

    if (imagesError) {
      console.error("PUBLIC PROJECT IMAGES FETCH ERROR:", imagesError);
    } else {
      projectImages = imageRows ?? [];
    }
  }

  // Fetch published certifications.
  const { data: certifications, error: certificationError } = await supabase
    .from("certifications")
    .select(
      "id, title, issuing_organization, description, issue_date, expiry_date, credential_id, credential_url, file_path, file_type",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (certificationError) {
    console.error("PUBLIC CERTIFICATIONS FETCH ERROR:", certificationError);
  }

  const publishedCertifications = certificationError
    ? []
    : (certifications ?? []);

  return (
    <main>
      {/* HERO */}
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
              Engineering and Software Development. I enjoy designing practical
              technology solutions and turning ideas into working systems.
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

      {/* ABOUT */}
      <section className="section section-alt" id="about">
        <div className="section-container about-grid">
          <div>
            <span className="eyebrow">01 / ABOUT ME</span>
            <h2 className="section-heading">Technology with a purpose.</h2>
          </div>

          <div>
            <p className="about-copy">
              I am a Computer Engineering student at the University of Buea with
              a strong interest in computer networks, infrastructure, software
              development and embedded systems.
            </p>

            <p className="about-copy">
              My learning combines practical networking labs, hardware projects
              and software development. I enjoy understanding how systems work,
              troubleshooting technical challenges and building solutions that
              address real-world problems.
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

      {/* DYNAMIC PROJECTS */}
      <section className="section" id="projects">
        <div className="section-container">
          <SectionHeading
            eyebrow="02 / SELECTED WORK"
            title="Projects & practical experience."
            description="Explore my engineering work across networking, embedded systems and software development."
          />

          {publishedProjects.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <h3 className="text-xl font-semibold text-slate-900">
                Projects coming soon
              </h3>
              <p className="mt-2 text-slate-600">
                New engineering projects will be published here as they become
                available.
              </p>
            </div>
          ) : (
            <div className="project-grid">
              {publishedProjects.map((project, projectIndex) => {
                const additionalImages = projectImages.filter(
                  (image) => image.project_id === project.id,
                );

                const mainImagePath =
                  project.cover_image_path ||
                  additionalImages[0]?.image_path ||
                  null;

                const mainImageUrl = mainImagePath
                  ? supabase.storage
                      .from("portfolio-public")
                      .getPublicUrl(mainImagePath).data.publicUrl
                  : null;

                const galleryImages = additionalImages.filter(
                  (image) => image.image_path !== mainImagePath,
                );

                return (
                  <article
                    key={project.id}
                    className="project-card overflow-hidden"
                  >
                    {mainImageUrl && (
                      <div className="mb-5 overflow-hidden rounded-lg">
                        <div className="relative h-52 w-full">
                          <Image
                            src={mainImageUrl}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            loading={projectIndex === 0 ? "eager" : "lazy"}
                            className="rounded-lg object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="project-number">{project.category}</span>

                      {project.is_featured && (
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                          Featured
                        </span>
                      )}
                    </div>

                    <h3>{project.title}</h3>

                    <p>{project.summary}</p>

                    {project.technologies &&
                      project.technologies.length > 0 && (
                        <div className="project-tags">
                          {project.technologies.map(
                            (technology: string, index: number) => (
                              <span key={`${technology}-${index}`}>
                                {technology}
                              </span>
                            ),
                          )}
                        </div>
                      )}

                    {galleryImages.length > 0 && (
                      <div className="mt-5 grid grid-cols-3 gap-2">
                        {galleryImages.map((image) => {
                          const imageUrl = supabase.storage
                            .from("portfolio-public")
                            .getPublicUrl(image.image_path).data.publicUrl;

                          return (
                            <div
                              key={image.id}
                              className="relative h-20 w-full"
                            >
                              <Image
                                src={imageUrl}
                                alt={image.alt_text || project.title}
                                fill
                                sizes="(max-width: 768px) 33vw, 16vw"
                                className="rounded-md object-cover"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-6 flex flex-wrap gap-3">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                          GitHub ↗
                        </a>
                      )}

                      {project.live_demo_url && (
                        <a
                          href={project.live_demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Live Demo ↗
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* SKILLS */}
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
                Programming, application development, Python and problem-solving
                through software.
              </p>
            </article>

            <article className="skill-card">
              <h3>Embedded Systems & IoT</h3>
              <p>
                ESP32 projects, microcontrollers, sensors, device communication
                and automation.
              </p>
            </article>

            <article className="skill-card">
              <h3>Network Platforms</h3>
              <p>
                Cisco Packet Tracer, Huawei eNSP, GNS3 and practical device
                configuration.
              </p>
            </article>

            <article className="skill-card">
              <h3>Systems & Linux</h3>
              <p>
                Ubuntu, Linux administration fundamentals, virtualization and
                network services.
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

      {/* DYNAMIC CERTIFICATIONS */}
      {publishedCertifications.length > 0 && (
        <section className="section" id="certifications">
          <div className="section-container">
            <SectionHeading
              eyebrow="04 / PROFESSIONAL DEVELOPMENT"
              title="Certifications & credentials."
              description="Professional certifications and credentials that support my ongoing engineering development."
            />

            <div className="grid gap-6 md:grid-cols-2">
              {publishedCertifications.map((certification) => {
                const certificateFileUrl = certification.file_path
                  ? supabase.storage
                      .from("portfolio-public")
                      .getPublicUrl(certification.file_path).data.publicUrl
                  : null;

                return (
                  <article
                    key={certification.id}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900">
                          {certification.title}
                        </h3>

                        <p className="mt-2 text-sm font-medium text-blue-700">
                          {certification.issuing_organization}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Published
                      </span>
                    </div>

                    {certification.description && (
                      <p className="mt-4 text-sm leading-6 text-slate-600">
                        {certification.description}
                      </p>
                    )}

                    <div className="mt-5 space-y-2 text-sm text-slate-600">
                      {certification.issue_date && (
                        <p>
                          <span className="font-medium text-slate-800">
                            Issued:
                          </span>{" "}
                          {formatDate(certification.issue_date)}
                        </p>
                      )}

                      {certification.expiry_date && (
                        <p>
                          <span className="font-medium text-slate-800">
                            Expires:
                          </span>{" "}
                          {formatDate(certification.expiry_date)}
                        </p>
                      )}

                      {certification.credential_id && (
                        <p className="break-all">
                          <span className="font-medium text-slate-800">
                            Credential ID:
                          </span>{" "}
                          {certification.credential_id}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {certificateFileUrl && (
                        <a
                          href={certificateFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          View Certificate ↗
                        </a>
                      )}

                      {certification.credential_url && (
                        <a
                          href={certification.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        >
                          Verify Credential ↗
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <Link href="/certifications" className="secondary-button">
                View all certifications →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section className="section" id="contact">
        <div className="section-container">
          <div className="contact-panel">
            <div>
              <h2>Lets build something meaningful.</h2>
              <p>
                Interested in engineering, technology or collaboration? I would
                be glad to connect.
              </p>
            </div>

            <a className="primary-button" href="mailto:">
              Get in touch <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="section-container footer-content">
          <span>© {new Date().getFullYear()} Nyanyoh Divine</span>
          <span>Computer Engineer | Network Engineering</span>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen">
          <p className="sr-only">Loading portfolio...</p>
        </main>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
