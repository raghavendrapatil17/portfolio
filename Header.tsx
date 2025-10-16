import React, { useState } from 'react';
import { sectionHash } from '@/data/links';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'About', href: sectionHash('about') },
    { name: 'Skills', href: sectionHash('skills') },
    { name: 'Education', href: sectionHash('education') },
    { name: 'Experience', href: sectionHash('experience') },
    { name: 'Projects', href: sectionHash('projects') },
    { name: 'Certifications', href: sectionHash('certifications') },
    { name: 'Contact', href: sectionHash('contact') },
  ];

  // use a custom hook for magnetic nav
  const useMagneticNav = () => {
    // attach once after mount
    React.useEffect(()=>{
      const items = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-magic]'));
      let frame = 0; let lastEvent: MouseEvent | null = null;
      const onMove = (e: MouseEvent) => { lastEvent = e; if(!frame) frame = requestAnimationFrame(tick); };
      const tick = () => {
        if(!lastEvent){ frame=0; return; }
        const e = lastEvent; items.forEach(a=>{
          const rect = a.getBoundingClientRect();
          const mx = e.clientX - (rect.left + rect.width/2);
          const my = e.clientY - (rect.top + rect.height/2);
          const dist = Math.sqrt(mx*mx+my*my);
          const influence = Math.max(0, 1 - dist/260);
          const tx = mx * 0.15 * influence;
          const ty = my * 0.15 * influence;
          a.style.transform = `translate(${tx}px,${ty}px)`;
          a.style.setProperty('--glow', (influence*0.6).toString());
        });
        frame = 0;
      };
      window.addEventListener('mousemove', onMove);
      return ()=> { window.removeEventListener('mousemove', onMove); if(frame) cancelAnimationFrame(frame); };
    },[]);
  };
  useMagneticNav();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
  <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-xl font-bold text-primary flex flex-col leading-tight">
            <span>0xV41BH4V</span>
            <span className="text-base tracking-widest text-muted-foreground">VAIBHAV</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                data-magic
                href={item.href}
                className="relative text-sm font-medium px-4 py-2 rounded-full text-foreground transition-colors duration-300
                  before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-primary/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
                  after:pointer-events-none after:absolute after:-inset-px after:rounded-full after:[background:var(--after-bg)] after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500"
                style={Object.assign(
                  {
                    boxShadow: '0 0 0px 0px rgba(var(--primary-rgb,0,0,0),0)',
                    willChange: 'transform'
                  },
                  {
                    ['--after-bg' as unknown as string]: 'radial-gradient(circle at center, hsl(var(--primary)/0.6), transparent 70%)'
                  }
                )}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.boxShadow='0 0 18px -2px hsl(var(--primary))'; }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.boxShadow='0 0 0px 0px hsl(var(--primary))'; }}
              >
                <span className="relative z-10" style={{textShadow:'0 0 6px hsl(var(--primary)/0.3)'}}>{item.name}</span>
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          {/* Single ThemeToggle (visible on all breakpoints) + hamburger on mobile */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {/* ThemeToggle removed from mobile menu to avoid duplicate state */}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;