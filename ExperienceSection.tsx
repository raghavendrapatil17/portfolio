import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import { resume } from '@/data/resume';

const ExperienceSection = () => {
  const experiences = resume.experience.map(exp => ({
    company: exp.company,
    position: exp.title,
    duration: `${exp.start} - ${exp.end}`,
    location: exp.location,
    bullets: exp.bullets,
  }));

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Experience</h2>
          <p className="text-muted-foreground text-lg">
            Professional journey and learning experiences
          </p>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <Card key={index} className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl mb-1">{exp.company}</CardTitle>
                <h4 className="text-lg text-primary font-semibold">{exp.position}</h4>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-primary" />
                    <span>{exp.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-primary" />
                    <span>{exp.location}</span>
                  </div>
                </div>
                <ul className="space-y-2 list-none pl-0">
                  {exp.bullets.map((b,i)=>(
                    <li key={i} className="flex items-start text-foreground">
                      <span className="text-primary mr-2">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;