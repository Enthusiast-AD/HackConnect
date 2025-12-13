import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { TeamCard } from "@/components/features/TeamCard";
import {
  Search,
  Plus,
  Users,
  Sparkles,
  Filter,
  ArrowRight,
  Shuffle,
} from "lucide-react";

const teams = [
  {
    id: "1",
    name: "Code Crusaders",
    description: "Building an AI-powered learning platform",
    members: [
      { userId: "1", username: "johndoe", name: "John Doe", role: "leader" as const, skills: ["React", "TypeScript"], joinedAt: new Date() },
      { userId: "2", username: "janedoe", name: "Jane Smith", role: "member" as const, skills: ["Python", "ML"], joinedAt: new Date() },
    ],
    maxSize: 4,
    lookingFor: ["Backend Developer", "UI/UX Designer"],
    techStack: ["React", "Python", "TensorFlow", "PostgreSQL"],
    projectIdea: "An adaptive learning platform that uses AI to personalize educational content based on individual learning styles.",
    status: "forming" as const,
  },
  {
    id: "2",
    name: "Blockchain Builders",
    description: "Creating next-gen DeFi solutions",
    members: [
      { userId: "3", username: "alice", name: "Alice Chen", role: "leader" as const, skills: ["Solidity", "Web3"], joinedAt: new Date() },
      { userId: "4", username: "bob", name: "Bob Johnson", role: "member" as const, skills: ["React", "Ethers.js"], joinedAt: new Date() },
      { userId: "5", username: "carol", name: "Carol Williams", role: "member" as const, skills: ["Smart Contracts"], joinedAt: new Date() },
    ],
    maxSize: 4,
    lookingFor: ["Full-Stack Developer"],
    techStack: ["Solidity", "React", "Hardhat", "IPFS"],
    projectIdea: "A decentralized lending protocol with innovative yield farming mechanics.",
    status: "forming" as const,
  },
  {
    id: "3",
    name: "Green Innovators",
    description: "Sustainable tech for a better future",
    members: [
      { userId: "6", username: "david", name: "David Lee", role: "leader" as const, skills: ["IoT", "Python"], joinedAt: new Date() },
    ],
    maxSize: 5,
    lookingFor: ["Frontend Developer", "ML Engineer", "Hardware Specialist"],
    techStack: ["Python", "TensorFlow", "Arduino", "React"],
    projectIdea: "Smart grid optimization system using machine learning to reduce energy waste in buildings.",
    status: "forming" as const,
  },
  {
    id: "4",
    name: "HealthTech Heroes",
    description: "Revolutionizing healthcare with technology",
    members: [
      { userId: "7", username: "emma", name: "Emma Davis", role: "leader" as const, skills: ["React Native", "Node.js"], joinedAt: new Date() },
      { userId: "8", username: "frank", name: "Frank Miller", role: "member" as const, skills: ["Python", "Data Science"], joinedAt: new Date() },
    ],
    maxSize: 4,
    lookingFor: ["Mobile Developer", "Backend Developer"],
    techStack: ["React Native", "Node.js", "MongoDB", "AWS"],
    projectIdea: "A telemedicine platform with AI-powered symptom checker and appointment scheduling.",
    status: "forming" as const,
  },
];

const skillFilters = [
  "All Skills",
  "React",
  "Python",
  "Node.js",
  "TypeScript",
  "Solidity",
  "ML/AI",
  "UI/UX",
  "Mobile",
];

export default function TeamsLobby() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All Skills");

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.lookingFor.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      team.techStack.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesSkill =
      selectedSkill === "All Skills" ||
      team.techStack.some((tech) =>
        tech.toLowerCase().includes(selectedSkill.toLowerCase())
      ) ||
      team.lookingFor.some((skill) =>
        skill.toLowerCase().includes(selectedSkill.toLowerCase())
      );
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Team Finder</h1>
          <p className="text-muted-foreground">
            Find your dream team or create your own
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Shuffle className="h-4 w-4" />
            Quick Match
          </Button>
          <Button variant="neon" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Team
          </Button>
        </div>
      </div>

          {/* Smart Matching Banner */}
          <Card variant="neon" className="mb-8 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Smart Team Matching</h3>
                    <p className="text-sm text-muted-foreground">
                      Let AI find the perfect teammates based on your skills and goals
                    </p>
                  </div>
                </div>
                <Button variant="neon-outline" className="gap-2">
                  Try Matching
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search & Filters */}
          <div className="space-y-4 mb-8">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teams, skills, or technologies..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>

            {/* Skill Pills */}
            <div className="flex flex-wrap gap-2">
              {skillFilters.map((skill) => (
                <Button
                  key={skill}
                  variant={selectedSkill === skill ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSkill(skill)}
                  className={selectedSkill === skill ? "neon-glow" : ""}
                >
                  {skill}
                </Button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {filteredTeams.length} teams looking for members
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              {teams.reduce((acc, t) => acc + (t.maxSize - t.members.length), 0)} open spots
            </div>
          </div>

          {/* Teams Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredTeams.map((team, index) => (
              <div
                key={team.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TeamCard team={team} variant="lobby" />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTeams.length === 0 && (
            <Card variant="glass" className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No teams found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or create your own team
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSkill("All Skills");
                  }}
                >
                  Clear Filters
                </Button>
                <Button variant="neon">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Team
                </Button>
              </div>
            </Card>
          )}
        </div>
  );
}
