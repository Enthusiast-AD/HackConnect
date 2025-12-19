import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HackathonCard } from "@/components/features/HackathonCard";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/hooks/useDashboardData"; // Import the hook we made
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar, Trophy, Users, Zap, ArrowRight, Clock,
  TrendingUp, MessageSquare, ChevronRight
} from "lucide-react";

// Keep static data outside component to prevent re-creation
const myTeam = {
  id: "1",
  name: "Code Crusaders",
  members: [
    { userId: "1", name: "John Doe" },
    { userId: "2", name: "Jane Smith" },
    { userId: "3", name: "Bob Smith" },
  ],
  maxSize: 4,
  techStack: ["React", "Python", "TensorFlow"],
  status: "competing" as const,
};

const recentActivity = [
  { id: 1, type: "team_join", message: "Jane Smith joined your team", time: "2 hours ago", icon: Users },
  { id: 2, type: "hackathon_start", message: "AI Innovation Challenge starts tomorrow", time: "5 hours ago", icon: Calendar },
  { id: 3, type: "message", message: "New message in Code Crusaders", time: "1 day ago", icon: MessageSquare },
  // { id: 4, type: "xp_earned", message: "You earned 150 XP", time: "2 days ago", icon: Zap },
];

export default function Dashboard() {
  const { user } = useAuth();
  
  // 1. USE THE CUSTOM HOOK (No more useEffect)
  const { allHackathons, myHackathons: rawMyHackathons, isLoading } = useDashboardData();
  
  const [visibleCount, setVisibleCount] = useState(4);
  const isOrganizer = user?.role === "organizer";

  // 2. OPTIMIZATION: Memoize the mapping logic so it doesn"t run on every render
  const processedMyHackathons = useMemo(() => {
    return rawMyHackathons.map((h: any) => ({
      id: h.$id || h.id,
      title: h.name,
      shortDescription: h.tagline || "",
      coverImage: h.image_url,
      startDate: new Date(h.start_date),
      location: { type: h.mode === "online" ? "online" : "in-person", city: h.location },
      totalPrizePool: parseInt(h.prize_pool) || 0,
      currency: "USD",
      status: h.status,
    }));
  }, [rawMyHackathons]);

  const recommendedHackathons = useMemo(() => {
    return allHackathons.map((h: any) => ({
      id: h.$id || h.id,
      title: h.name,
      shortDescription: h.tagline || "",
      coverImage: h.image_url,
      startDate: new Date(h.start_date),
      location: { type: "hybrid", city: h.location },
      totalPrizePool: parseInt(h.prize_pool) || 0,
      currency: "USD",
      status: "upcoming", // Simplified logic for demo
      organizer_id: h.organizer_id,
    })).filter((h: any) => h.organizer_id !== user?.id); // Don"t recommend own hacks
  }, [allHackathons, user?.id]);

  const managedHackathons = useMemo(() => {
    if (!isOrganizer) return [];
    return allHackathons
      .filter((h: any) => h.organizer_id === user?.id)
      .map((h: any) => ({
        id: h.$id || h.id,
        title: h.name,
        shortDescription: h.tagline || "",
        coverImage: h.image_url,
        startDate: new Date(h.start_date),
        location: { type: "hybrid", city: h.location },
        totalPrizePool: parseInt(h.prize_pool) || 0,
        currency: "USD",
        status: h.status,
      }));
  }, [allHackathons, user?.id, isOrganizer]);


  // 3. LOADING STATE: Use Skeletons instead of full screen spinner
  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex justify-between">
            <div className="space-y-2">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
        </div>
      </div>
    );
  }

  // --- ORGANIZER VIEW ---
  if (isOrganizer) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(" ")[0]}! 👋</h1>
            <p className="text-muted-foreground">Manage your hackathons</p>
          </div>
          <Link to="/create-hackathon">
            <Button variant="neon"><Zap className="h-4 w-4 mr-2" />Create Hackathon</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* ... Keep your stats cards here, they are fine ... */}
            <StatsCard title="Active Hackathons" value={managedHackathons.length} icon={Calendar} />
            <StatsCard title="Total Participants" value="1,240" icon={Users} highlight />
            <StatsCard title="Submissions" value="45" icon={Trophy} />
            <StatsCard title="Pending Reviews" value="12" icon={Clock} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Managed Hackathons</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {managedHackathons.length > 0 ? (
                  managedHackathons.slice(0, visibleCount).map((h: any) => (
                    <HackathonCard key={h.id} hackathon={h} variant="compact" />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                    No hackathons created yet.
                  </div>
                )}
              </div>
            </section>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
             {/* ... Keep sidebar ... */}
          </div>
        </div>
      </div>
    );
  }

  // --- HACKER VIEW ---
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(" ")[0] || "Hacker"}! 👋</h1>
          <p className="text-muted-foreground">Here"s what"s happening</p>
        </div>
        <Link to="/explore">
            <Button variant="neon">Find Hackathons <ArrowRight className="h-4 w-4 ml-1" /></Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Active Hackathons" value={processedMyHackathons.length} icon={Calendar} />
        {/* <StatsCard title="Total XP" value={user?.xp?.toLocaleString() || "0"} icon={Zap} highlight /> */}
        <StatsCard title="Hackathons Won" value={user?.hackathonsWon || 0} icon={Trophy} />
        <StatsCard title="Team Members" value={myTeam.members.length} icon={Users} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* My Hackathons */}
          <section>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">My Hackathons</h2>
                <Link to="/my-hackathons"><Button variant="ghost" size="sm">View All</Button></Link>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {processedMyHackathons.length > 0 ? (
                processedMyHackathons.slice(0, visibleCount).map((h: any) => (
                  <HackathonCard key={h.id} hackathon={h} variant="compact" />
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                    <p>You haven"t joined any hackathons yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* My Team - Keeping static for MVP as requested */}
          <section>
            <h2 className="text-xl font-semibold mb-4">My Team</h2>
            <Card variant="neon">
                <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">{myTeam.name}</h3>
                        <p className="text-sm text-muted-foreground">{myTeam.members.length}/{myTeam.maxSize} members</p>
                    </div>
                    </div>
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">{myTeam.status}</Badge>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                    {myTeam.members.map((member, i) => (
                        <Avatar key={member.userId} className="h-10 w-10 border-2 border-card" style={{ zIndex: 3 - i }}>
                        <AvatarFallback className="bg-muted text-sm">{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    ))}
                    </div>
                    <div className="flex gap-2">
                    {myTeam.techStack.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">{tech}</Badge>
                    ))}
                    </div>
                </div>
                </CardContent>
            </Card>
          </section>

          {/* Recommended */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Recommended For You</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendedHackathons.slice(0, 4).map((h: any) => (
                <HackathonCard key={h.id} hackathon={h} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar content remains static/same */}
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-3"><CardTitle className="text-lg">Recent Activity</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {recentActivity.map((a) => (
                        <div key={a.id} className="flex items-start gap-3">
                            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0"><a.icon className="h-4 w-4 text-muted-foreground" /></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm">{a.message}</p>
                                <p className="text-xs text-muted-foreground">{a.time}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
            {/* Quick Actions & Level Card can go here */}
        </div>
      </div>
    </div>
  );
}

// Helper component for cleaner JSX
function StatsCard({ title, value, icon: Icon, highlight }: any) {
    return (
        <Card variant="elevated">
            <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                <p className="text-sm text-muted-foreground">{title}</p>
                <p className={`text-2xl font-bold ${highlight ? "neon-text" : ""}`}>{value}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
                </div>
            </div>
            </CardContent>
        </Card>
    );
}
