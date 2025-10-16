import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Award } from 'lucide-react';
import { resume } from '@/data/resume';

const EducationSection = () => {
  const education = resume.education.map(e => ({
    degree: e.degree,
    institution: e.institution,
    duration: `${e.start} - ${e.end}`,
    gpa: e.gpa,
  }));

  return (
    <section id="education" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">My Education</h2>
          <p className="text-muted-foreground text-lg">
            Education is not the learning of facts, but the training of the mind to think.
          </p>
        </div>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {education.map((edu, index) => (
            <Card key={index} className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl mb-2">{edu.degree}</CardTitle>
                <p className="text-muted-foreground text-lg">{edu.institution}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar size={16} className="text-primary" />
                  <span className="font-semibold">{edu.duration}</span>
                </div>
                {edu.gpa && <p><strong>GPA:</strong> <span className="text-primary font-semibold">{edu.gpa}</span></p>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;