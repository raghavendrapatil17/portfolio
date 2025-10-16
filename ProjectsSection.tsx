import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { resume } from '@/data/resume';

const ProjectsSection = () => {

  const projects = resume.projects.map(p => ({
    title: p.name,
    description: p.bullets.join(' '),
    tech: p.tech,
    year: p.year,
    links: p.links || { live: '', source: '' }
  }));

  const colClass = (() => {
    const count = projects.length;
    if (count >= 3) return 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    return 'grid-cols-1';
  })();

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Projects Made</h2>
          <p className="text-muted-foreground text-lg">
            Some of my recent work and personal projects
          </p>
        </div>
        <div className={`grid gap-8 max-w-6xl mx-auto ${colClass}`}>
          {projects.map((project, index) => (
            <Card key={index} className="bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">{project.title} <span className="text-sm text-muted-foreground">({project.year})</span></CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                <ul className="flex flex-wrap gap-2 text-xs mb-4">
                  {project.tech.map(t => <li key={t} className="px-2 py-1 rounded bg-secondary/40 border border-border/40">{t}</li>)}
                </ul>
                {(project.links.live || project.links.source) && (
                  <div className="flex flex-wrap gap-3">
                    {project.links.source && !project.links.source.includes('placeholder') && (
                      <Button asChild variant="default" size="sm" className="group font-semibold shadow-sm">
                        <a href={project.links.source} target="_blank" rel="noopener noreferrer">
                          <span className="mr-1">Code</span>
                          <ExternalLink size={14} className="ml-0 group-hover:translate-x-px transition-transform" />
                        </a>
                      </Button>
                    )}
                    {project.links.live && !project.links.live.includes('placeholder') && (
                      <Button asChild variant="secondary" size="sm" className="group">
                        <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                          Live <ExternalLink size={14} className="ml-1 group-hover:translate-x-px transition-transform" />
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;