import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { UserProfile } from "@/components/features/UserProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HackathonCard } from "@/components/features/HackathonCard";
import { Edit, Share2, Settings, LogOut } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { EditProfileDialog } from "@/components/features/EditProfileDialog";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/types/user";

/*
const mockUser = {
  id: "1",
  username: "johndoe",
  email: "john@example.com",
  name: "John Doe",
  bio: "Full-stack developer passionate about Web3 and AI. Love building innovative solutions at hackathons.",
  skills: ["React", "TypeScript", "Python", "Node.js", "Solidity", "Machine Learning"],
  techStack: ["React", "Next.js", "TailwindCSS", "PostgreSQL", "AWS", "Docker"],
  githubUrl: "https://github.com/johndoe",
  linkedinUrl: "https://linkedin.com/in/johndoe",
  portfolioUrl: "https://johndoe.dev",
  xp: 2450,
  level: 12,
  badges: [
    { id: "1", name: "First Hackathon", description: "Completed your first hackathon", icon: "🎉", earnedAt: new Date() },
    { id: "2", name: "Team Player", description: "Worked in 5+ teams", icon: "🤝", earnedAt: new Date() },
    { id: "3", name: "Winner", description: "Won a hackathon", icon: "🏆", earnedAt: new Date() },
    { id: "4", name: "Mentor", description: "Mentored other hackers", icon: "🧑‍🏫", earnedAt: new Date() },
  ],
  hackathonsParticipated: 15,
  hackathonsWon: 3,
  reputationScore: 98,
  createdAt: new Date("2023-01-15"),
};
*/

const pastHackathons = [
  {
    id: "1",
    title: "ETHGlobal Paris 2023",
    shortDescription: "Built a decentralized identity solution",
    coverImage: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&q=80",
    startDate: new Date("2023-07-21"),
    location: { type: "in-person" as const, city: "Paris" },
    totalPrizePool: 50000,
    currency: "EUR",
    status: "ended" as const,
  },
  {
    id: "2",
    title: "AI Builders Hackathon",
    shortDescription: "Created an AI-powered code review tool",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80",
    startDate: new Date("2023-09-15"),
    location: { type: "online" as const },
    totalPrizePool: 25000,
    currency: "USD",
    status: "ended" as const,
  },
];

const projects = [
  {
    id: "1",
    title: "DecentraID",
    description: "Decentralized identity verification using blockchain",
    hackathon: "ETHGlobal Paris 2023",
    placement: "1st Place",
    techStack: ["Solidity", "React", "IPFS"],
  },
  {
    id: "2",
    title: "CodeReview AI",
    description: "AI-powered code review assistant for GitHub",
    hackathon: "AI Builders Hackathon",
    placement: "2nd Place",
    techStack: ["Python", "OpenAI", "GitHub API"],
  },
];

export default function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user: authUser, logout } = useAuth();
  const { toast } = useToast();
  
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
          const response = await fetch(`${API_URL}/users/${id}`);
          
          if (!response.ok) {
            throw new Error("Failed to fetch user");
          }
          
          const data = await response.json();
          
          const mappedUser: User = {
            id: data.id,
            username: data.username,
            email: data.email,
            name: data.name,
            role: data.role || "participant",
            avatar: data.avatar_url,
            bio: data.bio,
            skills: data.skills || [],
            techStack: data.tech_stack || [],
            githubUrl: data.github_url,
            portfolioUrl: data.portfolio_url,
            xp: data.xp || 0,
            level: Math.floor((data.xp || 0) / 1000) + 1,
            badges: [],
            hackathonsParticipated: data.hackathons_participated || 0,
            hackathonsWon: data.hackathons_won || 0,
            reputationScore: data.reputation_score || 0,
            createdAt: data.created_at ? new Date(data.created_at) : new Date(),
          };
          
          setViewedUser(mappedUser);
        } catch (error) {
          console.error("Error fetching user:", error);
          toast({
            title: "Error",
            description: "Could not load user profile",
            variant: "destructive",
          });
          navigate("/profile"); // Redirect to own profile on error
        } finally {
          setIsLoading(false);
        }
      } else {
        setViewedUser(authUser);
      }
    };

    fetchUser();
  }, [id, authUser, navigate, toast]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleShare = async () => {
    if (!viewedUser) return;
    
    const url = `${window.location.origin}/profile/${viewedUser.id}`;
    
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Profile link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center">Loading profile...</div>;
  }

  if (!viewedUser) return null;

  const isOwnProfile = !id || (authUser && authUser.id === viewedUser.id);

  return (
    <div className="p-8">
      {/* Header Actions */}
      <div className="flex justify-end gap-3 mb-6">
        <Button variant="outline" className="gap-2" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
          Share Profile
        </Button>
        
        {isOwnProfile && (
          <>
            <EditProfileDialog user={viewedUser} />
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

          {/* User Profile */}
          <UserProfile user={viewedUser} variant="full" />

          {/* Tabs */}
          <Tabs defaultValue="hackathons" className="mt-8">
            <TabsList className="mb-6">
              <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="hackathons">
              <div className="grid md:grid-cols-2 gap-4">
                {pastHackathons.map((hackathon) => (
                  <HackathonCard key={hackathon.id} hackathon={hackathon} variant="compact" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="projects">
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} variant="elevated">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <span className="text-sm font-medium text-primary">{project.placement}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      <p className="text-xs text-muted-foreground mb-3">{project.hackathon}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs bg-muted px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">Activity feed coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Logout Button */}
          {isOwnProfile && (
            <div className="mt-8 flex justify-end">
              <Button 
                variant="destructive" 
                className="gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          )}
        </div>
  );
}
