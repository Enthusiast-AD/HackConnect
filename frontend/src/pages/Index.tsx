import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HackathonCard, HackathonCardSkeleton } from "@/components/features/HackathonCard";
import {
  Zap,
  Users,
  Trophy,
  Globe,
  ArrowRight,
  Sparkles,
  Code2,
  Calendar,
  MessageSquare,
  Star,
  ChevronRight,
} from "lucide-react";

const featuredHackathons = [
  {
    id: "1",
    title: "Web3 Global Summit 2024",
    slug: "web3-global-summit-2024",
    shortDescription: "Build the future of decentralized applications with $100K in prizes",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    startDate: new Date("2024-03-15"),
    location: { type: "hybrid" as const, city: "San Francisco", country: "USA" },
    participantCount: 1247,
    totalPrizePool: 100000,
    currency: "USD",
    tags: ["Web3", "Blockchain", "DeFi"],
    status: "upcoming" as const,
    difficulty: "intermediate" as const,
  },
  {
    id: "2",
    title: "AI Innovation Challenge",
    slug: "ai-innovation-challenge",
    shortDescription: "Push the boundaries of artificial intelligence and machine learning",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    startDate: new Date("2024-02-28"),
    location: { type: "online" as const },
    participantCount: 2891,
    totalPrizePool: 75000,
    currency: "USD",
    tags: ["AI", "ML", "Python"],
    status: "ongoing" as const,
    difficulty: "advanced" as const,
  },
  {
    id: "3",
    title: "Green Tech Hackathon",
    slug: "green-tech-hackathon",
    shortDescription: "Create sustainable solutions for a better planet",
    coverImage: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
    startDate: new Date("2024-04-01"),
    location: { type: "in-person" as const, city: "Berlin", country: "Germany" },
    participantCount: 583,
    totalPrizePool: 50000,
    currency: "EUR",
    tags: ["CleanTech", "IoT", "Sustainability"],
    status: "upcoming" as const,
    difficulty: "beginner" as const,
  },
];

const stats = [
  { value: "50K+", label: "Hackers", icon: Users },
  { value: "1,200+", label: "Hackathons", icon: Calendar },
  { value: "$5M+", label: "Prizes Won", icon: Trophy },
  { value: "180+", label: "Countries", icon: Globe },
];

const features = [
  {
    icon: Sparkles,
    title: "Smart Team Matching",
    description: "AI-powered skill matching to find your perfect teammates based on experience and goals.",
  },
  {
    icon: Code2,
    title: "Integrated Workspace",
    description: "Kanban boards, real-time chat, and project management tools all in one place.",
  },
  {
    icon: Trophy,
    title: "XP & Achievements",
    description: "Level up, earn badges, and build your verified hackathon portfolio.",
  },
  {
    icon: MessageSquare,
    title: "Real-time Collaboration",
    description: "Stay connected with your team through integrated chat and video calls.",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-[0.02]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl animate-float" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary/30 animate-fade-in">
              <Star className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Trusted by 50,000+ hackers worldwide
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Where Hackers
              <span className="block text-gradient-neon">Build the Future</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Discover hackathons, find your dream team, and showcase your projects. 
              Join the ultimate platform for builders, creators, and innovators.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Link to="/explore">
                <Button size="xl" variant="neon" className="group">
                  Explore Hackathons
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="xl" variant="outline">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group relative animate-fade-in"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="absolute -inset-px bg-gradient-to-b from-primary/40 to-transparent rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition duration-500" />
                <Card
                  variant="glass"
                  className="relative h-full p-6 flex flex-col items-center justify-center border-primary/10 bg-background/40 backdrop-blur-md transition-all duration-300 group-hover:translate-y-[-2px] group-hover:bg-background/60"
                >
                  <div className="mb-4 p-3 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:ring-primary/50 group-hover:bg-primary/20">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-1 text-center">
                    <p className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                      {stat.value}
                    </p>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      {stat.label}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hackathons */}
      <section className="py-20 border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Hackathons</h2>
              <p className="text-muted-foreground">Discover trending events from around the world</p>
            </div>
            <Link to="/explore">
              <Button variant="ghost" className="group">
                View All
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHackathons.map((hackathon, index) => (
              <div
                key={hackathon.id}
                className="animate-fade-in h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <HackathonCard
                  hackathon={hackathon}
                  variant={index === 0 ? "featured" : "default"}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 border-primary/30">
              <Zap className="h-3.5 w-3.5 mr-1.5 text-primary" />
              Platform Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to Win
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From team formation to project submission, we've got you covered with powerful tools designed for hackers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="elevated"
                className="p-6 text-center hover:border-primary/30 transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card variant="neon" className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
            <CardContent className="relative py-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Start Building?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join thousands of hackers who have found their teams, won prizes, and launched their careers through HackHub.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" variant="neon" className="group">
                    Get Started Free
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/explore">
                  <Button size="lg" variant="outline">
                    Browse Hackathons
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
