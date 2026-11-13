import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="about-page">
        {/* Hero Section */}
        <section className="ah is-intro" aria-labelledby="about-title">
          <div className="content-wrap">
            <div className="ah__c">
              <h1 id="about-title" className="ah__t">
                <span>
                  <span className="font-rox">D</span>ouglus
                  <span className="font-rox">N</span>guyen
                </span>
              </h1>

              <div className="ah__b">
                <p className="ah__p">
                  <span>
                    <span>Web designer based in Ho Chi Minh City, Vietnam.</span>
                    <span>Focused on web design, interaction design, and creative development.</span>
                  </span>

                  <span>
                    <span>
                      I enjoy putting <span className="font-rox">ideas</span>,
                      <span className="font-rox">visuals</span>,
                    </span>
                    <span>
                      <span className="font-rox">motion</span> and
                      <span className="font-rox">typography</span> together
                    </span>
                    <span>into things people like to use.</span>
                  </span>
                </p>

                <div className="ah__ap">
                  <div className="ah__ar" aria-hidden="true">
                    <span>
                      <span>
                        <Image src="/images/arrow.svg" alt="" width={45} height={45} />
                        <Image src="/images/arrow.svg" alt="" width={45} height={45} />
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Off the Clock Gallery */}
        <section className="off">
          <div className="content-wrap">
            <div className="off__in">
              <div className="off__gal off__gal--t">
                <div className="off__m off__m--1">
                  <Image src="/images/about-img-1.webp" alt="" width={1200} height={600} />
                </div>
                <div className="off__m off__m--2">
                  <Image src="/images/about-img-2.webp" alt="" width={650} height={400} />
                </div>
              </div>

              <div className="off__px">
                <h2 className="off__t">
                  <span>
                    <span className="font-rox">Off</span>
                  </span>
                  <span>
                    <span>the clock</span>
                  </span>
                </h2>
              </div>

              <div className="off__gal off__gal--b">
                <div className="off__m off__m--3">
                  <Image src="/images/about-img-3.webp" alt="" width={1084} height={650} />
                </div>
                <div className="off__m off__m--4">
                  <Image src="/images/about-img-4.webp" alt="" width={800} height={500} />
                </div>
              </div>

              <p className="off__desc">
                <span>Most weekends, </span>
                <span>I take time out with friends, </span>
                <span>following quieter roads just to see where they lead.</span>
              </p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="svc">
          <Image src="/images/light.webp" alt="" width={1044} height={1604} className="svc__light" />

          <div className="content-wrap">
            <div className="svc__eb">
              <p>Mostly, I work on...</p>
            </div>

            <h2 className="svc__t">
              <span className="svc__tp">
                <span><span>DESIGN</span></span>
                <span><span>DEVELOPMENT</span></span>
              </span>
            </h2>
          </div>
        </section>

        {/* Service Cards - Design & Development */}
        <div className="srvs" id="srv-stack">
          <section className="srv" data-service-section="design">
            <div className="srv__in">
              <div className="srv__hd">
                <div className="srv__lb"><span>(My Services)</span></div>
                <div className="srv__t"><h2>Design</h2></div>
              </div>

              <div className="srv__art" aria-hidden="true">
                <span>(</span>
                <Image src="/images/arrow.svg" width={45} height={45} alt="" />
                <span>)</span>
              </div>

              <div className="srv__v">
                <Image
                  src="/images/service-1-3000.webp"
                  alt="Design Services"
                  width={3000}
                  height={1200}
                />
              </div>

              <p className="srv__p">
                <span>
                  <span>Just trying to make websites that are clear, useful, and good to look at. Keeping things</span>
                </span>
                <span>
                  <span>simple, giving ideas enough room, and making sure everything works the way it should.</span>
                </span>
              </p>
            </div>

            <div className="srv__sh" aria-hidden="true"></div>
          </section>

          <section className="srv srv--dev" data-service-section="development">
            <div className="srv__in">
              <div className="srv__hd">
                <div className="srv__lb"><span>(My Services)</span></div>
                <div className="srv__t"><h2>Development</h2></div>
              </div>

              <div className="srv__art" aria-hidden="true">
                <span>(</span>
                <Image src="/images/arrow.svg" width={45} height={45} alt="" />
                <span>)</span>
              </div>

              <div className="srv__v">
                <Image
                  src="/images/service-2-3000.webp"
                  alt="Development Services"
                  width={3000}
                  height={1200}
                />
              </div>

              <p className="srv__p">
                <span>
                  <span>Just trying to build websites that feel fast, smooth, and work well. Keeping the code</span>
                </span>
                <span>
                  <span>clean, the interactions thoughtful, and staying true to the design.</span>
                </span>
              </p>
            </div>
          </section>
        </div>

        {/* My Craft - Circular List */}
        <div className="cirs" id="cir-track">
          <section className="cir" data-cir>
            <span className="cir__trg" aria-hidden="true"></span>

            <ul className="cir__ls" data-cir-list>
              <li><span><span>Motion Design</span></span></li>
              <li><span><span>Typography</span></span></li>
              <li><span><span>Art Direction</span></span></li>
              <li><span><span>Creative Dev</span></span></li>
              <li><span><span>GSAP Motion</span></span></li>
              <li><span><span>WebGL / Three.js</span></span></li>
              <li><span><span>CSS Animation</span></span></li>
              <li><span><span>Micro-interaction</span></span></li>
            </ul>

            <div className="cir__dt">
              <p className="cir__p" data-cir-copy>
                <span><span>A small collection of tools I use,</span></span>
                <span><span>from motion and typography to creative development.</span></span>
              </p>

              <div className="cir__lb">
                <span><span>My Craft</span></span>
                <span className="cir__dot" aria-hidden="true"></span>
              </div>
            </div>
          </section>
        </div>

        {/* Project Showcase - VetClaim Advantage */}
        <section className="pv pv--vet">
          <div className="content-wrap">
            <div className="pv__in">
              <div className="pv__c">
                <h2 className="pv__t">
                  <span><span>VetClaim</span></span>
                  <span><span>Advantage</span></span>
                </h2>

                <p className="pv__p">
                  <span><span>A VA disability law firm that needed to look</span></span>
                  <span><span>as serious as the work they do.</span></span>
                </p>
              </div>

              <div className="pv__v">
                <div className="pv__cmp">
                  <div className="pv__b pv__b--l">
                    <div className="ripple">
                      <Image src="/images/vetclaim-about-01.webp" alt="VetClaim Advantage" width={1350} height={1032} />
                    </div>
                  </div>

                  <div className="pv__b pv__b--s">
                    <div className="ripple">
                      <Image src="/images/vetclaim-about-02.webp" alt="VetClaim Advantage" width={812} height={612} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Showcase - Folio Vol. 01 */}
        <section className="pv pv--folio">
          <div className="content-wrap">
            <div className="pv__in">
              <div className="pv__c">
                <h2 className="pv__t">
                  <span><span>Folio</span></span>
                  <span><span>Vol. 01</span></span>
                </h2>

                <p className="pv__p">
                  <span><span>An earlier version of my portfolio,</span></span>
                  <span><span>designed and built from the ground up.</span></span>
                </p>
              </div>

              <div className="pv__v">
                <div className="pv__cmp">
                  <div className="pv__b pv__b--l">
                    <div className="ripple">
                      <Image src="/images/folio-about-01.webp" alt="Folio Vol. 01" width={1350} height={1032} />
                    </div>
                  </div>

                  <div className="pv__b pv__b--s">
                    <div className="ripple">
                      <Image src="/images/folio-about-02.webp" alt="Folio Vol. 01" width={812} height={612} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Break Image - From Kenya With Code */}
        <section className="brk">
          <Image
            src="/images/break-img-2560.webp"
            width={2560}
            height={1655}
            alt="From Kenya"
            className="brk__img"
          />

          <div className="content-wrap">
            <div className="brk__c">
              <div className="brk__in">
                <div className="brk__a"></div>

                <h2 className="brk__t">
                  <span>From Kenya</span>
                  <span>With Code</span>
                </h2>
              </div>
            </div>
          </div>

          <p className="brk__cr">Photo by me</p>
        </section>

        {/* Minimalism Section */}
        <section className="mh" id="process">
          <div className="content-wrap">
            <div className="mh__in">
              <div className="mh__hd">
                <div className="mh__eb">
                  <span><span>Simple</span></span>
                  <span><span>Or at least I try</span></span>
                  <span><span>It usually gets complicated</span></span>
                </div>

                <h2 className="mh__t" aria-label="Minimalism">
                  <span>Minim</span>

                  <span className="mh__m">
                    <Image src="/images/geometry.webp" alt="" className="mh__geometry" width={100} height={100} />
                    <svg viewBox="0 0 1000 320" preserveAspectRatio="none" aria-hidden="true" className="mh__svg">
                      <path d="M 70 0 C 20 70, 20 250, 70 320" />
                      <path d="M 930 0 C 980 70, 980 250, 930 320" />
                    </svg>
                  </span>

                  <span>lism</span>
                </h2>

                <div className="mh__ap">
                  <span><span>Then I remove things</span></span>
                  <span><span>Probably a few too many</span></span>
                  <span><span>And put some of them back</span></span>
                </div>
              </div>
            </div>

            <div className="mh__cp">
              <p>
                &ldquo;I like keeping things simple,<br />
                making things that feel clear and work well.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="footer ft" data-footer>
          <div className="content-wrap">
            <div className="ft__in">
              <div className="ft__em">
                <div>
                  <a href="mailto:hello@douglus.co" data-footer-email aria-label="hello@douglus.co">
                    <span aria-hidden="true">h</span><span aria-hidden="true">e</span><span aria-hidden="true">l</span><span aria-hidden="true">l</span><span aria-hidden="true">o</span><span aria-hidden="true">@</span><span aria-hidden="true">d</span><span aria-hidden="true">o</span><span aria-hidden="true">u</span><span aria-hidden="true">g</span><span aria-hidden="true">l</span><span aria-hidden="true">u</span><span aria-hidden="true">s</span><span aria-hidden="true">.</span><span aria-hidden="true">c</span><span aria-hidden="true">o</span>
                  </a>
                </div>
              </div>

              <div className="ft__c">
                <div className="ft__tx">
                  <div>
                    <p>Have a project that needs to move forward?</p>
                  </div>

                  <div>
                    <p>
                      Let&apos;s talk. No pitch, no pressure<br />
                      just a conversation about what you need.
                    </p>
                  </div>
                </div>

                <div className="ft__dn" aria-hidden="true" data-dino>
                  <div className="ft__pl ft__pl--g" data-dino-layer="ghost">
                    <Image src="/images/dino.png" alt="" width={100} height={100} />
                  </div>

                  <div className="ft__pl ft__pl--m" data-dino-layer="main">
                    <Image src="/images/dino.png" alt="" width={100} height={100} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
      <Footer />
    </>
  );
}