import { Code, Coffee, Lightbulb } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="overflow-x-clip bg-background-secondary py-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-6xl">
          <h2
            className="mb-16 text-center text-3xl font-bold tracking-tight text-foreground-primary sm:text-4xl"
            data-aos="fade-up"
          >
            About <span className="text-accent">me</span>
          </h2>

          <div className="grid min-w-0 md:grid-cols-2 md:items-center gap-12 items-start">
            <div data-aos="fade-right" data-aos-delay="200" className="flex min-w-0 justify-center md:justify-start">
              <div className="relative isolate mx-auto box-border aspect-square h-72 w-72 max-h-[min(100%,18rem)] max-w-[min(100%,18rem)] p-3 sm:h-80 sm:w-80 sm:max-h-none sm:max-w-none sm:p-4">
                <div className="about-blob-frame relative z-[1] h-full w-full overflow-hidden shadow-soft [transform:translateZ(0)]">
                  <div className="absolute inset-[3px] overflow-hidden sm:inset-[6px]">
                    <div
                      role="img"
                      aria-label="Rahat Chowdhury"
                      className="about-blob-inner-photo about-blob-inner-morph h-full min-h-full w-full min-w-full overflow-hidden [transform:translateZ(0)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <p
                className="text-base leading-relaxed text-foreground-secondary"
                data-aos="fade-left"
                data-aos-delay="300"
              >
                I'm a full-stack developer with years of experience shipping web applications end to
                end—from databases and APIs to polished, responsive interfaces.
              </p>

              <p
                className="text-base leading-relaxed text-foreground-secondary"
                data-aos="fade-left"
                data-aos-delay="400"
              >
                I keep up with tooling and patterns that help teams move faster without sacrificing
                quality, and I care about code that the next person can read and extend.
              </p>

              <div className="grid grid-cols-3 gap-6 mt-8">
                <div
                  className="text-center"
                  data-aos="fade-in"
                  data-aos-delay="500"
                >
                  <div className="ui-card ui-card--interactive mb-3 p-4">
                    <Code className="text-accent mx-auto" size={32} />
                  </div>
                  <h3 className="text-foreground-primary font-semibold">Clean Code</h3>
                  <p className="text-foreground-secondary text-sm">Writing maintainable code</p>
                </div>

                <div
                  className="text-center"
                  data-aos="fade-in"
                  data-aos-delay="600"
                >
                  <div className="ui-card ui-card--interactive mb-3 p-4">
                    <Lightbulb className="text-accent mx-auto" size={32} />
                  </div>
                  <h3 className="text-foreground-primary font-semibold">Innovation</h3>
                  <p className="text-foreground-secondary text-sm">Creative problem solving</p>
                </div>

                <div
                  className="text-center"
                  data-aos="fade-in"
                  data-aos-delay="700"
                >
                  <div className="ui-card ui-card--interactive mb-3 p-4">
                    <Coffee className="text-accent mx-auto" size={32} />
                  </div>
                  <h3 className="text-foreground-primary font-semibold">Dedication</h3>
                  <p className="text-foreground-secondary text-sm">Committed to excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
