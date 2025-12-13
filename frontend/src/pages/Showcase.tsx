import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import {
  Search,
  Filter,
  ArrowUp,
  MessageSquare,
  ExternalLink,
  Trophy,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const projects = [
  {
    id: "1",
    title: "DecentraID",
    tagline: "Decentralized identity verification for the modern web",
    description: "A blockchain-based identity solution that gives users complete control over their personal data while enabling seamless verification across platforms.",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80",
    hackathon: "ETHGlobal Paris 2023",
    placement: "1st Place",
    team: [
      { name: "John Doe", avatar: "" },
      { name: "Jane Smith", avatar: "" },
      { name: "Bob Johnson", avatar: "" },
    ],
    techStack: ["Solidity", "React", "IPFS", "Ethereum"],
    upvotes: 342,
    comments: 28,
    demoUrl: "https://demo.example.com",
  },
  {
    id: "2",
    title: "CodeReview AI",
    tagline: "AI-powered code review assistant for GitHub",
    description: "Automatically reviews pull requests, suggests improvements, and catches bugs before they reach production using advanced machine learning.",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80",
    hackathon: "AI Builders Hackathon",
    placement: "2nd Place",
    team: [
      { name: "Alice Chen", avatar: "" },
      { name: "David Lee", avatar: "" },
    ],
    techStack: ["Python", "OpenAI", "GitHub API", "FastAPI"],
    upvotes: 289,
    comments: 42,
    demoUrl: "https://demo.example.com",
  },
  {
    id: "3",
    title: "GreenGrid",
    tagline: "Smart energy optimization for sustainable buildings",
    description: "ML-powered system that optimizes energy consumption in commercial buildings, reducing costs by up to 40% while minimizing carbon footprint.",
    thumbnail: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80",
    hackathon: "Green Tech Hackathon",
    placement: "Winner",
    team: [
      { name: "Emma Davis", avatar: "" },
      { name: "Frank Miller", avatar: "" },
      { name: "Grace Kim", avatar: "" },
      { name: "Henry Wang", avatar: "" },
    ],
    techStack: ["TensorFlow", "IoT", "Python", "React"],
    upvotes: 256,
    comments: 19,
    demoUrl: "https://demo.example.com",
  },
  {
    id: "4",
    title: "MediChain",
    tagline: "Secure medical records on blockchain",
    description: "A patient-centric healthcare data platform that ensures privacy, interoperability, and easy access to medical records across providers.",
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
    hackathon: "Health Tech Summit",
    placement: "3rd Place",
    team: [
      { name: "Sarah Johnson", avatar: "" },
      { name: "Mike Brown", avatar: "" },
    ],
    techStack: ["Hyperledger", "Node.js", "React", "FHIR"],
    upvotes: 198,
    comments: 31,
    demoUrl: "https://demo.example.com",
  },
];

const sortOptions = [
  { label: "Trending", value: "trending", icon: TrendingUp },
  { label: "Most Upvoted", value: "upvotes", icon: ArrowUp },
  { label: "Recent", value: "recent", icon: Clock },
];

export default function Showcase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  const [upvotedProjects, setUpvotedProjects] = useState<string[]>([]);

  const handleUpvote = (projectId: string) => {
    setUpvotedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techStack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Project Showcase</h1>
        <p className="text-muted-foreground">
          Discover amazing projects built at hackathons worldwide
        </p>
      </div>

          {/* Winner Spotlight */}
          <Card variant="neon" className="mb-8 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div
                  className="h-64 md:h-auto bg-cover bg-center"
                  style={{ backgroundImage: `url(${projects[0].thumbnail})` }}
                />
                <div className="p-8">
                  <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                    <Star className="h-3 w-3 mr-1" />
                    Winner of the Week
                  </Badge>
                  <h2 className="text-2xl font-bold mb-2">{projects[0].title}</h2>
                  <p className="text-muted-foreground mb-4">{projects[0].tagline}</p>
                  <p className="text-sm mb-4">{projects[0].description}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex -space-x-2">
                      {projects[0].team.map((member, i) => (
                        <Avatar
                          key={member.name}
                          className="h-8 w-8 border-2 border-card"
                          style={{ zIndex: projects[0].team.length - i }}
                        >
                          <AvatarFallback className="bg-muted text-xs">
                            {member.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {projects[0].hackathon}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="neon">View Project</Button>
                    <Button variant="outline" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Demo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects, technologies..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setSortBy(option.value)}
                  className="gap-2"
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
              <Card
                key={project.id}
                variant="interactive"
                className="overflow-hidden group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${project.thumbnail})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  {project.placement && (
                    <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
                      <Trophy className="h-3 w-3 mr-1" />
                      {project.placement}
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{project.tagline}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {project.team.slice(0, 3).map((member, i) => (
                        <Avatar
                          key={member.name}
                          className="h-6 w-6 border-2 border-card"
                          style={{ zIndex: project.team.length - i }}
                        >
                          <AvatarFallback className="bg-muted text-[10px]">
                            {member.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {project.hackathon}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="border-t border-border/50 pt-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpvote(project.id)}
                        className={cn(
                          "gap-1.5",
                          upvotedProjects.includes(project.id) && "text-primary"
                        )}
                      >
                        <ArrowUp
                          className={cn(
                            "h-4 w-4",
                            upvotedProjects.includes(project.id) && "fill-current"
                          )}
                        />
                        {project.upvotes + (upvotedProjects.includes(project.id) ? 1 : 0)}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1.5">
                        <MessageSquare className="h-4 w-4" />
                        {project.comments}
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <ExternalLink className="h-4 w-4" />
                      Demo
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
  );
}
