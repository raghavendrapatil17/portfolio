import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MapPin, Mail, GraduationCap, Briefcase, ArrowRight } from 'lucide-react';
import profilePhoto from '@/assets/raghavendra photo.jpg';
import { GlslGradientHaloFrame } from '@/components/glsl/GlslGradientHaloFrame';
import { resume } from '@/data/resume';
import { sectionHash, FILES } from '@/data/links';
import { formatExperienceDuration } from '@/lib/utils';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <div className="flex justify-center">
            <div className="relative floating">
              <GlslGradientHaloFrame size={320} intensity={0.9} rounded={false} className="rounded-2xl">
                <img
                  src={profilePhoto}
                  alt="Raghavendra S Patil"
                  className="w-full h-full object-cover"
                />
              </GlslGradientHaloFrame>
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold"></div>
            </div>
          </div>

          {/* About Content */}
          <div className="space-y-6">
            <div>
          <h3 className="text-3xl font-bold text-primary mb-4 flex flex-col leading-tight">Professional Summary</h3>
          <h4 className="text-xl text-muted-foreground mb-6">Data Scientist & Machine Learning Engineer</h4>
            </div>

            <p className="text-foreground leading-relaxed whitespace-pre-line">{resume.summary}</p>
            {Array.isArray(resume.experience) && resume.experience.length > 0 && (() => {
              const exp = resume.experience[0];
              const duration = formatExperienceDuration(exp.start, exp.end);
              const visibleBullets = exp.bullets.slice(0, 2);
              return (
                <div
                  className="relative mt-4 p-5 rounded-lg border border-primary/40 bg-gradient-to-br from-background/90 to-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/55 shadow-sm ring-1 ring-border/40 text-sm"
                  style={{ zIndex: 2 }}
                  data-testid="about-current-role"
                >
                  <p className="font-semibold text-primary tracking-wide mb-1 flex items-center gap-2">
                    <Briefcase size={14} className="opacity-90" />
                    Current Role
                    <span className="text-xs ml-2 px-2 py-0.5 rounded bg-primary/10 text-primary/90 border border-primary/20">{duration}</span>
                  </p>
                  <p className="leading-snug">
                    <strong>{exp.title}</strong> @ {exp.company}
                    <span className="text-muted-foreground"> ({exp.start} – {exp.end})</span>
                  </p>
                  {visibleBullets.length > 0 && (
                    <ul className="list-disc ml-5 mt-2 space-y-1 text-muted-foreground">
                      {visibleBullets.map((b,i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                  <div className="mt-3 flex items-center gap-4">
                    <a
                      href={sectionHash('experience')}
                      className="group text-xs inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      View full experience <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              );
            })()}

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="text-primary" size={20} />
                    <span><strong>Education:</strong> {resume.education[0].degree.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="text-primary" size={20} />
                    <span><strong>Email:</strong> {resume.contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="text-primary" size={20} />
                    <span><strong>Location:</strong> {resume.contact.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <a href={FILES.resume} download>
                <Download size={20} className="mr-2" />
                Download Resume
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;