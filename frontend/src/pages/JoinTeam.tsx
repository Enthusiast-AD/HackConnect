import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeams } from "@/hooks/useTeams";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Users, ArrowRight, CheckCircle, XCircle } from "lucide-react";

export default function JoinTeam() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { fetchTeam, joinTeam, isLoading } = useTeams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [team, setTeam] = useState<any>(null);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (teamId) {
      loadTeam();
    }
  }, [teamId]);

  const loadTeam = async () => {
    if (!teamId) return;
    const result = await fetchTeam(teamId);
    if (result.success) {
      setTeam(result.data);
    } else {
      toast({ title: "Error", description: "Team not found or invalid link", variant: "destructive" });
      navigate("/dashboard");
    }
  };

  const handleJoin = async () => {
    if (!teamId || !user) {
        navigate("/login");
        return;
    }
    
    setIsJoining(true);
    const result = await joinTeam(teamId);
    setIsJoining(false);

    if (result.success) {
      toast({ title: "Success", description: "Join request sent successfully!" });
      navigate("/dashboard");
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  if (isLoading && !team) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Card className="w-full max-w-md">
                <CardContent className="p-8 space-y-4">
                    <Skeleton className="h-8 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!team) return null;

  const isMember = team.members.includes(user?.id);
  const isPending = team.join_requests?.includes(user?.id);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg border-primary/20 shadow-2xl">
        <CardHeader className="text-center pb-2">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">You've been invited to join</CardTitle>
            <h2 className="text-3xl font-black text-primary mt-2">{team.name}</h2>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
            <div className="text-center text-muted-foreground">
                {team.description || "Join us to build something amazing!"}
            </div>

            <div className="flex justify-center gap-2 flex-wrap">
                {team.tech_stack?.map((tech: string) => (
                    <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
            </div>

            <div className="flex items-center justify-center -space-x-2 py-4">
                {team.members_enriched?.slice(0, 5).map((member: any, i: number) => (
                    <Avatar key={member.userId} className="h-10 w-10 border-2 border-background ring-2 ring-background" style={{ zIndex: 5 - i }}>
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {member.name?.slice(0, 2).toUpperCase() || "??"}
                        </AvatarFallback>
                    </Avatar>
                ))}
                {team.members.length > 5 && (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background z-0">
                        +{team.members.length - 5}
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {isMember ? (
                    <Button className="w-full" size="lg" variant="outline" onClick={() => navigate(`/teams/${teamId}`)}>
                        <CheckCircle className="mr-2 h-4 w-4" /> You are already a member
                    </Button>
                ) : isPending ? (
                    <Button className="w-full" size="lg" variant="secondary" disabled>
                        <ClockIcon className="mr-2 h-4 w-4" /> Request Pending
                    </Button>
                ) : (
                    <Button className="w-full" size="lg" onClick={handleJoin} disabled={isJoining}>
                        {isJoining ? "Sending Request..." : "Accept Invitation"}
                        {!isJoining && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                )}
                <Button variant="ghost" className="w-full" onClick={() => navigate("/dashboard")}>
                    Cancel
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ClockIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    )
  }
