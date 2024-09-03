import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle,
  Rocket,
  Users,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

function Header() {
  return (
    <header className="flex h-14 items-center px-4 lg:px-6">
      <Link className="flex items-center justify-center" href="#">
        <Rocket className="mr-2 h-6 w-6" />
        <span className="font-bold">Startpad</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-sm font-medium underline-offset-4 hover:underline"
          href="#"
        >
          Program
        </Link>
        <Link
          className="text-sm font-medium underline-offset-4 hover:underline"
          href="#"
        >
          Portfolio
        </Link>
        <Link
          className="text-sm font-medium underline-offset-4 hover:underline"
          href="#"
        >
          About
        </Link>
        <Link
          className="text-sm font-medium underline-offset-4 hover:underline"
          href="#"
        >
          Apply
        </Link>
      </nav>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="w-full  bg-primary py-12 text-secondary  md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Launch Your Startup with Startpad
            </h1>
            <p className="mx-auto max-w-[700px] text-pretty text-gray-400 md:text-xl">
              We provide funding, mentorship, and resources to help you build
              the next big thing.
            </p>
          </div>
          <div className="space-x-4">
            <Button className="  bg-secondary text-primary hover:bg-slate-200">
              Apply Now
            </Button>
            <Button className="bg-secondary text-primary hover:bg-slate-200">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
        <Icon className="h-12 w-12 text-blue-500" />
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

function FeaturesSection() {
  return (
    <section className="w-full bg-gray-100 py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
          Why Choose Startpad?
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={Users}
            title="Expert Mentorship"
            description="Access to industry leaders and successful founders"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Funding"
            description="Seed funding to kickstart your startup journey"
          />
          <FeatureCard
            icon={CheckCircle}
            title="Proven Process"
            description="Structured program to accelerate your growth"
          />
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="mb-4 text-lg">{quote}</p>
        <p className="font-semibold">
          {author}, {role}
        </p>
      </CardContent>
    </Card>
  );
}

function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
          Success Stories
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <TestimonialCard
            quote="Startpad was instrumental in helping us scale our business. The mentorship and networking opportunities were invaluable."
            author="Sarah Johnson"
            role="CEO of TechSolutions"
          />
          <TestimonialCard
            quote="The Startpad program gave us the boost we needed to turn our idea into a thriving startup. We couldn't have done it without their support."
            author="Mike Chen"
            role="Founder of GreenEnergy"
          />
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <h3 className="mb-2 text-4xl font-bold">{value}</h3>
      <p>{label}</p>
    </div>
  );
}

function StatsSection() {
  return (
    <section className="w-full bg-blue-500 py-12 text-white md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-2 lg:grid-cols-4">
          <StatCard value="500+" label="Startups Funded" />
          <StatCard value="$1B+" label="Total Valuation" />
          <StatCard value="50+" label="Countries Represented" />
          <StatCard value="90%" label="Success Rate" />
        </div>
      </div>
    </section>
  );
}

function ProcessStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white">
        {number}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function ProcessSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tighter sm:text-5xl">
          How It Works
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <ProcessStep
            number="1"
            title="Apply"
            description="Submit your application and pitch your idea"
          />
          <ProcessStep
            number="2"
            title="Interview"
            description="If selected, present to our panel of experts"
          />
          <ProcessStep
            number="3"
            title="Launch"
            description="Join the program and start building your startup"
          />
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="w-full bg-gray-100 py-12 md:py-24 lg:py-32">
      <div className="container px-4 text-center md:px-6">
        <h2 className="mb-4 text-3xl font-bold tracking-tighter sm:text-5xl">
          Ready to Take Off?
        </h2>
        <p className="mx-auto mb-8 max-w-[700px] text-gray-600 md:text-xl">
          Join Startpad and turn your startup dreams into reality. Applications
          for our next cohort are now open.
        </p>
        <Button className="bg-blue-500 text-white hover:bg-blue-600">
          Apply Now <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
      <p className="text-xs text-gray-500">
        © {currentYear} Startpad. All rights reserved.
      </p>
      <nav className="flex gap-4 sm:ml-auto sm:gap-6">
        <Link className="text-xs underline-offset-4 hover:underline" href="#">
          Terms of Service
        </Link>
        <Link className="text-xs underline-offset-4 hover:underline" href="#">
          Privacy
        </Link>
      </nav>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <StatsSection />
        <ProcessSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
