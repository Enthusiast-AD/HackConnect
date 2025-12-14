import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { TeamCard } from "@/components/features/TeamCard";
import { CreateTeamDialog } from "@/components/features/CreateTeamDialog";
import { useTeams } from "@/hooks/useTeams";
import { useToast } from "@/hooks/use-toast";
import { Team } from "@/types/team";
import {
  Search,
  Plus,
  Users,
  Sparkles,
  Filter,
  ArrowRight,
  Shuffle,
} from "lucide-react";

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
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All Skills");
  const { fetchTeams, joinTeam } = useTeams();
  const { toast } = useToast();
  const [joiningTeamId, setJoiningTeamId] = useState<string | null>(null);

  const loadTeams = async () => {
    const result = await fetchTeams();
    if (result.success) {
      // Map backend data to frontend Team type
      const mappedTeams = result.data.map((t: any) => ({
        id: t.$id,
        name: t.name,
        description: t.description || "",
        hackathonId: t.hackathon_id || "",
        leaderId: t.leader_id || "",
        // Use enriched members if available, else fallback
        members: t.members_enriched || t.members.map((m: string) => ({ userId: m, name: "Member", avatar: "" })),
        joinRequests: t.join_requests_enriched || [], // Use enriched requests
        maxSize: 4, // Default
        lookingFor: t.looking_for || [],
        techStack: t.tech_stack || [],
        status: t.status || "open",
        createdAt: new Date(t.$createdAt),
        projectRepo: t.project_repo
      }));
      setTeams(mappedTeams);
    } else {
      toast({
        title: "Error",
        description: "Failed to load teams. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadTeams();
  }, [fetchTeams]);

  const handleJoinTeam = async (teamId: string) => {
    setJoiningTeamId(teamId);
    const result = await joinTeam(teamId);
    setJoiningTeamId(null);

    if (result.success) {
      toast({
        title: "Request Sent",
        description: "Your request to join the team has been sent to the leader.",
      });
      // Refresh teams
      const refreshResult = await fetchTeams();
      if (refreshResult.success) {
         const mappedTeams = refreshResult.data.map((t: any) => ({
          id: t.$id,
          name: t.name,
          description: t.description,
          hackathonId: t.hackathon_id,
          leaderId: t.leader_id,
          members: t.members.map((m: string) => ({ userId: m, name: "Member", avatar: "" })),
          joinRequests: t.join_requests || [],
          maxSize: 4,
          lookingFor: t.looking_for || [],
          techStack: t.tech_stack || [],
          status: t.status,
          createdAt: new Date(t.$createdAt),
          projectRepo: t.project_repo
        }));
        setTeams(mappedTeams);
      }
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to join team",
        variant: "destructive",
      });
    }
  };


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
          <CreateTeamDialog onTeamCreated={loadTeams} />
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
                <TeamCard 
                  team={team} 
                  variant="lobby" 
                  onJoin={handleJoinTeam}
                  isJoining={joiningTeamId === team.id}
                />
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
                <CreateTeamDialog />
              </div>
            </Card>
          )}
        </div>
  );
}
