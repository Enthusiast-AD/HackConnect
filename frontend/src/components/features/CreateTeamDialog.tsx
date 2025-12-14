import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTeams } from "@/hooks/useTeams";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users } from "lucide-react";

export function CreateTeamDialog({ onTeamCreated }: { onTeamCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const { createTeam, isLoading } = useTeams();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hackathonId: "",
    lookingFor: "",
    techStack: "",
    projectRepo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const lookingForArray = formData.lookingFor
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const techStackArray = formData.techStack
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const result = await createTeam({
      name: formData.name,
      description: formData.description,
      hackathon_id: formData.hackathonId,
      looking_for: lookingForArray,
      tech_stack: techStackArray,
      project_repo: formData.projectRepo || undefined,
    });

    if (result.success) {
      toast({
        title: "Team Created",
        description: "Your team has been successfully created!",
      });
      setOpen(false);
      // Reset form
      setFormData({
        name: "",
        description: "",
        hackathonId: "",
        lookingFor: "",
        techStack: "",
        projectRepo: "",
      });
      onTeamCreated?.();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to create team",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" variant="neon">
          <Plus className="h-4 w-4" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create a New Team</DialogTitle>
          <DialogDescription>
            Form a squad for an upcoming hackathon.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Code Crusaders"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe your team (max 150 chars)"
                maxLength={150}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="hackathonId">Hackathon ID</Label>
              <Input
                id="hackathonId"
                name="hackathonId"
                value={formData.hackathonId}
                onChange={handleChange}
                placeholder="Enter the Hackathon ID"
                required
              />
              <p className="text-xs text-muted-foreground">
                (Temporary: Enter the ID of the hackathon you are joining)
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lookingFor">Looking For (Roles)</Label>
              <Input
                id="lookingFor"
                name="lookingFor"
                value={formData.lookingFor}
                onChange={handleChange}
                placeholder="Frontend, Designer, Backend... (comma separated)"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="techStack">Tech Stack</Label>
              <Input
                id="techStack"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="React, Python, Appwrite... (comma separated)"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="projectRepo">Project Repo (Optional)</Label>
              <Input
                id="projectRepo"
                name="projectRepo"
                value={formData.projectRepo}
                onChange={handleChange}
                placeholder="https://github.com/..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Team"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
