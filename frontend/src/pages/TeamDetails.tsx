import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeams } from "@/hooks/useTeams";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, Trash2, UserMinus, Copy, Check, 
  Edit2, Save, X, ArrowLeft 
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function TeamDetails() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { fetchTeam, updateTeam, removeMember, deleteTeam, isLoading } = useTeams();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [team, setTeam] = useState<any>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [copied, setCopied] = useState(false);

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
      setNewName(result.data.name);
    } else {
      toast({ title: "Error", description: "Failed to load team", variant: "destructive" });
      navigate("/dashboard");
    }
  };

  const handleUpdateName = async () => {
    if (!teamId || !newName.trim()) return;
    const result = await updateTeam(teamId, { name: newName });
    if (result.success) {
      setTeam({ ...team, name: newName });
      setIsEditingName(false);
      toast({ title: "Success", description: "Team name updated" });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!teamId) return;
    const result = await removeMember(teamId, memberId);
    if (result.success) {
      setTeam({
        ...team,
        members_enriched: team.members_enriched.filter((m: any) => m.userId !== memberId),
        members: team.members.filter((id: string) => id !== memberId)
      });
      toast({ title: "Success", description: "Member removed" });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const handleDeleteTeam = async () => {
    if (!teamId) return;
    const result = await deleteTeam(teamId);
    if (result.success) {
      toast({ title: "Success", description: "Team deleted" });
      navigate("/dashboard");
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/teams/join/${teamId}`; // Assuming we have a join route or just share this page
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied", description: "Invite link copied to clipboard" });
  };

  if (isLoading && !team) {
    return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;
  }

  if (!team) return null;

  const isLeader = user?.id === team.leader_id;

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-8">
      <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2 flex-1">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                className="text-3xl font-bold h-auto py-2 px-3 w-full md:w-auto"
              />
              <Button size="icon" onClick={handleUpdateName}><Save className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => setIsEditingName(false)}><X className="h-4 w-4" /></Button>
            </div>
          ) : (
            <div className="flex items-center gap-3 group">
              <h1 className="text-4xl font-bold tracking-tight">{team.name}</h1>
              {isLeader && (
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setIsEditingName(true)}>
                  <Edit2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              )}
            </div>
          )}
          <p className="text-muted-foreground text-lg">{team.description || "No description provided."}</p>
        </div>
        
        <div className="flex gap-2">
           <Button variant="outline" onClick={copyInviteLink}>
             {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
             Invite Link
           </Button>
           {isLeader && (
             <AlertDialog>
               <AlertDialogTrigger asChild>
                 <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete Team</Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                 <AlertDialogHeader>
                   <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                   <AlertDialogDescription>
                     This action cannot be undone. This will permanently delete your team and remove all members.
                   </AlertDialogDescription>
                 </AlertDialogHeader>
                 <AlertDialogFooter>
                   <AlertDialogCancel>Cancel</AlertDialogCancel>
                   <AlertDialogAction onClick={handleDeleteTeam} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                     Delete
                   </AlertDialogAction>
                 </AlertDialogFooter>
               </AlertDialogContent>
             </AlertDialog>
           )}
        </div>
      </div>

      {/* Members Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Team Members ({team.members.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {team.members_enriched?.map((member: any) => (
            <div key={member.userId} className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium flex items-center gap-2">
                    {member.name}
                    {member.userId === team.leader_id && <Badge variant="secondary" className="text-xs">Leader</Badge>}
                  </p>
                  <p className="text-xs text-muted-foreground">Member</p>
                </div>
              </div>
              
              {isLeader && member.userId !== user?.id && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <UserMinus className="h-4 w-4 mr-2" /> Remove
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove member?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to remove {member.name} from the team?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRemoveMember(member.userId)}>Remove</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tech Stack & Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Tech Stack</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {team.tech_stack?.length > 0 ? (
                team.tech_stack.map((tech: string) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No tech stack listed.</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle>Looking For</CardTitle></CardHeader>
          <CardContent>
             <div className="flex flex-wrap gap-2">
              {team.looking_for?.length > 0 ? (
                team.looking_for.map((role: string) => (
                  <Badge key={role} variant="outline">{role}</Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">Not looking for specific roles.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}