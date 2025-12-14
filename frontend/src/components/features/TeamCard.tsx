import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Zap, ArrowRight, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Team } from "@/types/team";
import { useAuth } from "@/hooks/useAuth";
import { useTeams } from "@/hooks/useTeams";
import { useToast } from "@/hooks/use-toast";

interface TeamCardProps {
  team: Partial<Team>;
  variant?: "default" | "compact" | "lobby";
  onJoin?: (teamId: string) => void;
  isJoining?: boolean;
}

export function TeamCard({ team, variant = "default", onJoin, isJoining }: TeamCardProps) {
  const { user } = useAuth();
  const { approveMember, rejectMember } = useTeams();
  const { toast } = useToast();
  
  const {
    id,
    name,
    description,
    avatar,
    members,
    joinRequests,
    maxSize,
    lookingFor,
    techStack,
    status,
    projectIdea,
    leaderId,
  } = team;

  const isLeader = user?.id === leaderId;
  const isMember = members?.some((m) => m.userId === user?.id);
  const isPending = joinRequests?.some(req => req.userId === (user?.id || ""));

  const handleApprove = async (requesterId: string) => {
    if (!id) return;
    const result = await approveMember(id, requesterId);
    if (result.success) {
      toast({ title: "Member Approved", description: "User has been added to the team." });
      // Ideally trigger a refresh here, but for now we rely on parent or optimistic update
      // Since we don't have a refresh callback, we might need to reload or use context
      window.location.reload(); // Temporary fix to refresh state
    } else {
      toast({ title: "Error", variant: "destructive", description: result.error });
    }
  };

  const handleReject = async (requesterId: string) => {
    if (!id) return;
    const result = await rejectMember(id, requesterId);
    if (result.success) {
      toast({ title: "Request Rejected", description: "User request has been rejected." });
      window.location.reload(); // Temporary fix
    } else {
      toast({ title: "Error", variant: "destructive", description: result.error });
    }
  };

  const spotsLeft = (maxSize || 4) - (members?.length || 0);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "forming":
        return "bg-primary/20 text-primary border-primary/30";
      case "full":
        return "bg-muted text-muted-foreground border-muted";
      case "competing":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "submitted":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  if (variant === "compact") {
    return (
      <Card variant="interactive" className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-border">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-primary/20 text-primary font-semibold">
              {name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{name}</h3>
            <p className="text-sm text-muted-foreground">
              {members?.length || 0}/{maxSize || 4} members
            </p>
          </div>
          <Badge variant="outline" className={cn(getStatusColor(status))}>
            {status}
          </Badge>
        </div>
      </Card>
    );
  }

  if (variant === "lobby") {
    return (
      <Card variant="neon" className="overflow-hidden group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/30">
                <AvatarImage src={avatar} />
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                  {name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left</span>
                </div>
              </div>
            </div>
            <Badge variant="outline" className={cn(getStatusColor(status))}>
              {status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}

          {/* Project Idea */}
          {projectIdea && (
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm font-medium mb-1">Project Idea</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{projectIdea}</p>
            </div>
          )}

          {/* Looking For */}
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-primary" />
              Looking for
            </p>
            <div className="flex flex-wrap gap-1.5">
              {lookingFor?.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <p className="text-sm font-medium mb-2">Tech Stack</p>
            <div className="flex flex-wrap gap-1.5">
              {techStack?.map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Members */}
          <div>
            <p className="text-sm font-medium mb-2">Team Members</p>
            <div className="flex -space-x-2">
              {members?.slice(0, 5).map((member, i) => (
                <Avatar
                  key={member.userId}
                  className="h-8 w-8 border-2 border-card"
                  style={{ zIndex: members.length - i }}
                >
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-muted text-xs">
                    {member.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {(members?.length || 0) > 5 && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border-2 border-card text-xs font-medium">
                  +{(members?.length || 0) - 5}
                </div>
              )}
            </div>
          </div>

          {/* Leader: Manage Requests */}
          {isLeader && joinRequests && joinRequests.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-sm font-medium mb-2 text-primary">Pending Requests ({joinRequests.length})</p>
              <div className="space-y-2">
                {joinRequests.map((req) => (
                  <div key={req.userId} className="flex items-center justify-between bg-muted/30 p-2 rounded text-sm">
                    <span>{req.name}</span>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-green-500 hover:text-green-600 hover:bg-green-100" onClick={() => handleApprove(req.userId)}>
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-100" onClick={() => handleReject(req.userId)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          {isLeader ? (
            <Button className="w-full" variant="outline" disabled>
              You are the Leader
            </Button>
          ) : isMember ? (
            <Button className="w-full" variant="secondary" disabled>
              Joined
            </Button>
          ) : isPending ? (
            <Button className="w-full" variant="secondary" disabled>
              Request Pending
            </Button>
          ) : (
            <Button 
              className="w-full group/btn" 
              variant="neon-outline"
              onClick={() => onJoin?.(id!)}
              disabled={isJoining}
            >
              {isJoining ? "Sending Request..." : "Request to Join"}
              {!isJoining && <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card variant="interactive" className="group">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-primary/20 text-primary font-semibold">
              {name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {members?.length || 0}/{maxSize || 4} members
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {techStack?.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="outline" className="text-xs">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full">
          View Team
        </Button>
      </CardFooter>
    </Card>
  );
}
