
import { Button } from '@/components/ui/button';
import { Github, Linkedin } from 'lucide-react';
import XIcon from '@/components/icons/XIcon';
import { SOCIAL } from '@/data/links';
import developerIllustration from '@/assets/developer-illustration.jpg';
import { GlslGradientHaloFrame } from '@/components/glsl/GlslGradientHaloFrame';
import FloatingEquationsCanvas from '@/components/FloatingEquationsCanvas';
import CommandPalette from '@/components/CommandPalette';
import { useDeferredMount } from '@/hooks/useDeferredMount';
import InteractiveBackground from '@/components/InteractiveBackground';

const HeroSection = () => {
  const visualsReady = useDeferredMount(1800);
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden network-bg">
      {visualsReady && <FloatingEquationsCanvas density={14} />}
  <CommandPalette />
      <InteractiveBackground />
      {/* Animated background elements - creative network/cyber effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
        {/* SVG grid background */}
        <svg className="absolute inset-0 w-full h-full opacity-20" style={{zIndex:1}}>
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.08"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
        </svg>

        {/* Animated network lines */}
        <svg className="absolute left-1/4 top-1/4 w-1/2 h-1/2 opacity-40 animate-spin-slow" style={{zIndex:2}}>
          <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 8" />
        </svg>
        <svg className="absolute right-10 bottom-10 w-1/4 h-1/4 opacity-30 animate-spin-reverse" style={{zIndex:2}}>
          <rect x="10" y="10" width="80" height="80" fill="none" stroke="#a78bfa" strokeWidth="2" strokeDasharray="6 6" rx="20" />
        </svg>

        {/* Floating icons */}
        <span className="absolute left-10 top-1/3 text-3xl animate-float-slow" style={{zIndex:3}} role="img" aria-label="bolt">⚡</span>
        <span className="absolute right-1/4 top-10 text-2xl animate-float" style={{zIndex:3}} role="img" aria-label="lock">🔒</span>
        <span className="absolute left-1/2 bottom-10 text-2xl animate-float" style={{zIndex:3}} role="img" aria-label="atom">⚛️</span>
        <span className="absolute right-1/3 bottom-1/4 text-2xl animate-float-slow" style={{zIndex:3}} role="img" aria-label="chip">💾</span>

        {/* Pulsing dots */}
        <div className="absolute w-2 h-2 bg-primary/30 rounded-full top-20 left-1/4 animate-pulse"></div>
        <div className="absolute w-3 h-3 bg-accent/40 rounded-full top-1/3 right-1/4 animate-pulse delay-1000"></div>
        <div className="absolute w-4 h-4 bg-secondary/30 rounded-full bottom-1/4 left-1/3 animate-pulse delay-2000"></div>
        <div className="absolute w-1 h-1 bg-foreground/20 rounded-full bottom-10 right-1/2 animate-pulse delay-1500"></div>
      </div>


      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl text-foreground">Hi There,</h2>
              <h1 className="text-4xl lg:text-6xl font-bold">
                I'm <span className="text-primary">Raghavendra</span> S Patil
              </h1>
              <div className="text-xl text-muted-foreground">
                I Am A <span className="text-primary">Data Scientist & ML Engineer</span>
                <span className="animate-pulse">|</span>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full text-lg"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              About Me
            </Button>

            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              <Button asChild variant="outline" size="icon" className="rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground">
                <a href={SOCIAL.linkedin} aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={20} />
                </a>
              </Button>
              <Button asChild variant="outline" size="icon" className="rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground">
                <a href={SOCIAL.github} aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                  <Github size={20} />
                </a>
              </Button>
              <Button asChild variant="outline" size="icon" className="rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground">
                <a href={SOCIAL.x} aria-label="X" target="_blank" rel="noopener noreferrer">
                  <XIcon size={20} />
                </a>
              </Button>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative floating">
              <GlslGradientHaloFrame size={384} intensity={1} rounded className="transition-transform duration-500 will-change-transform hover:scale-[1.03]">
                <img
                  src={developerIllustration}
                  alt="Developer working on computer"
                  className="w-full h-full object-cover"
                />
              </GlslGradientHaloFrame>
              {/* Decorative elements retained */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-accent rounded-full animate-bounce delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;