import { projects } from '@/lib/projects';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';

export default function WorkPage() {
  return (
    <>
      <Navigation />
      <main className="work-page">
        <section className="work-hero" aria-labelledby="work-title">
          <div className="content-wrap">
            <div className="work-hero__content">
              <div className="work-hero__project">
                <h1 id="work-title" className="work-hero__title">
                  <span className="work-hero__title-mask">
                    <span className="work-hero__title-line">
                      <span className="font-rox">S</span>elected Work
                    </span>
                  </span>
                  <span className="work-hero__title-mask">
                    <span className="work-hero__title-line">
                      <span className="font-rox">P</span>rojects
                    </span>
                  </span>
                </h1>
                <div className="work-hero__meta">
                  <p className="work-hero__description">
                    <span className="work-hero__line-mask text-reveal-mask">
                      <span className="work-hero__description-line">A selection of projects exploring</span>
                    </span>
                    <span className="work-hero__line-mask text-reveal-mask">
                      <span className="work-hero__description-line">web design, development, and digital experiences.</span>
                    </span>
                  </p>
                </div>
              </div>
              <div className="work-hero__rail">
                <div className="work-hero__track">
                  {projects.map((project) => (
                    <div key={project.slug} className="work-hero__card">
                      <Image
                        src={`/images/${project.slug}.webp`}
                        alt={project.title}
                        width={1254}
                        height={1254}
                        className="work-hero__media"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="work-list">
          <div className="content-wrap">
            {projects.map((project, index) => (
              <article key={project.slug} className="work-list__item">
                <div className="work-list__header">
                  <div className="work-list__heading">
                    <h2 className="work-list__title">
                      <span className="work-list__title-mask">
                        <span className="work-list__title-line">
                          <span className="font-rox">{project.title.charAt(0)}</span>{project.title.slice(1)}
                        </span>
                      </span>
                    </h2>
                    <div className="work-list__intro">
                      <p className="work-list__description">{project.description}</p>
                      <p className="work-list__status">({project.status})</p>
                    </div>
                  </div>
                  <div className="work-list__counter">{index + 1}/{projects.length}</div>
                </div>

                <div className="work-list__bottom">
                  <dl className="work-list__details">
                    <div className="work-list__detail">
                      <dt>Category</dt>
                      <dd>{project.category}</dd>
                    </div>
                    <div className="work-list__detail">
                      <dt>Role</dt>
                      <dd>{project.role}</dd>
                    </div>
                    <div className="work-list__detail">
                      <dt>Stack</dt>
                      <dd>{project.stack.join(', ')}</dd>
                    </div>
                  </dl>

                  <figure className="work-list__media">
                    <Image
                      src={`/images/${project.slug}.webp`}
                      alt={project.title}
                      width={1917}
                      height={927}
                    />
                  </figure>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}