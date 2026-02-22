/**
 * @file pages/Landing.jsx
 * @description Professional landing page with hero section and features.
 */

import { Link } from 'react-router-dom';
import { Activity, Zap, BarChart3, Shield, Clock, Gauge } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';
import GradientBlinds from '../components/custom/gradient-blind.jsx';
import DotGrid from '../components/custom/dot-grid.jsx';

export function Landing() {
  return (
    <div className="min-h-screen relative text-foreground overflow-hidden max-w-7xl mx-auto px-4">

      {/* Gradient Background Layer */}
      <div className="fixed inset-0 z-10">
        <DotGrid
          dotSize={5}
          gap={15}
          baseColor="#271E37"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      {/* Overlay for readability */}
      <div className="fixed inset-0 -z-10 bg-background/80 backdrop-blur-[2px] " />

      {/* Navigation */}
      <header className="relative z-50 border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0">
        <div className="container  max-w-7xl  mx-auto px-4 py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                       <img src="/logo.png" alt="Logo" className="w-7 h-7" />
                    </div>
            <span className="font-bold text-lg">RateLimiter</span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center font-semibold gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </a>
            <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition">
              Benefits
            </a>
            <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition">
              View Docs
            </Link>
            <Button asChild size="sm">
              <Link to="/dashboard">Launch App</Link>
            </Button>
          </nav>

          {/* Mobile */}
          <div className="md:hidden">
            <Button asChild size="sm">
              <Link to="/dashboard">Launch</Link>
            </Button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-24 md:py-32">
        <div className="container mx-auto px-4">

          <div className="max-w-3xl mx-auto text-center space-y-6">

            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-sm text-primary backdrop-blur-md">
              <Zap className="w-4 h-4" />
              <span>Professional API Testing Tool</span>
            </div> */}

            <h1 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight">
              Learn Rate Limiting
              <span className="block text-transparent bg-clip-text bg-primary">
                at Scale
              </span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Simulate high-throughput traffic, visualize rate limiter behavior in real time,
              and optimize your API's resilience with our powerful simulator.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button asChild size="lg">
                <Link to="/simulator">Start Simulating</Link>
              </Button>

              <Button asChild  size="lg">
                <Link to="/dashboard">View Docs</Link>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-20 md:py-28 border-t border-border/40">

        <div className="container mx-auto px-4">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to test and optimize API rate limiting
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {[
              {
                icon: Gauge,
                title: 'Real-time Metrics',
                description:
                  'Track requests, response times, and success rates live.',
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description:
                  'Visualize rate limiter patterns with detailed insights.',
              },
              {
                icon: Zap,
                title: 'Multiple Modes',
                description:
                  'Simulate constant, burst, and spike traffic scenarios.',
              },
              {
                icon: Shield,
                title: 'Endpoint Presets',
                description:
                  'Preconfigured endpoints for fast testing.',
              },
              {
                icon: Clock,
                title: 'Custom Headers',
                description:
                  'Test API keys, user IDs, and role-based limits.',
              },
              {
                icon: Activity,
                title: 'Live Event Log',
                description:
                  'Monitor every request in real time.',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;

              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl border border-border/40 bg-card/40 backdrop-blur-md hover:bg-card/60 hover:border-primary/30 transition-all duration-300"
                >
                  <Icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="relative z-10 py-20 md:py-28">

        <div className="container mx-auto px-4">

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Test Your Limits?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ensure reliability under real-world traffic
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">

            {[
              {
                number: '01',
                title: 'Prevent Downtime',
                description:
                  'Catch misconfigurations before production.',
              },
              {
                number: '02',
                title: 'Optimize Performance',
                description:
                  'Find the perfect rate limit balance.',
              },
              {
                number: '03',
                title: 'Security Testing',
                description:
                  'Protect against abuse and attacks.',
              },
              {
                number: '04',
                title: 'Capacity Planning',
                description:
                  'Plan infrastructure with confidence.',
              },
            ].map((benefit, idx) => (

              <div key={idx} className="flex gap-6">

                <div className="h-12 w-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold">
                    {benefit.number}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>

              </div>

            ))}

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 border-t border-border/40 text-center">

        <div className="container mx-auto px-4">

          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Optimize Your API?
          </h2>

          <p className="text-muted-foreground mb-8">
            Start testing today.
          </p>

          <Button asChild size="lg">
            <Link to="/simulator">
              Launch Simulator
            </Link>
          </Button>

        </div>
      </section>

      {/* Footer */}

    </div>
  );
}