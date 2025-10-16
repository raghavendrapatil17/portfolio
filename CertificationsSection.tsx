import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { resume } from '@/data/resume';
import { Award, ExternalLink } from 'lucide-react';

const CertificationsSection = () => {
  if (!resume.certifications.length) return null;
  return (
    <section id="certifications" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Certifications & Awards</h2>
          <p className="text-muted-foreground text-lg">Recognitions & completed courses</p>
        </div>
        <div className="grid gap-6 max-w-3xl mx-auto">
          {resume.certifications.map((c: string | { name: string; link?: string }, i: number) => (
            <Card key={i} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center space-x-3 pb-2">
                <Award className="text-primary" size={24} />
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>{typeof c === 'string' ? c : c.name}</span>
                  {typeof c !== 'string' && c.link && (
                    <a
                      href={c.link}
                      className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={14} />
                      View
                    </a>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;