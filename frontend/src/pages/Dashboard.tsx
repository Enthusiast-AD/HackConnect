import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { HackathonCard } from "@/components/features/HackathonCard";
import { TeamCard } from "@/components/features/TeamCard";
import {
  Calendar,
  Trophy,
  Users,
  Zap,
  ArrowRight,
  Bell,
  Clock,
  TrendingUp,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

const upcomingHackathons = [
  {
    id: "1",
    title: "Web3 Global Summit 2024",
    shortDescription: "Build the future of decentralized apps",
    coverImage: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80",
    startDate: new Date("2024-03-15"),
    location: { type: "hybrid" as const, city: "San Francisco" },
    totalPrizePool: 100000,
    currency: "USD",
    status: "upcoming" as const,
  },
  {
    id: "2",
    title: "AI Innovation Challenge",
    shortDescription: "Push AI boundaries",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&q=80",
    startDate: new Date("2024-02-28"),
    location: { type: "online" as const },
    totalPrizePool: 75000,
    currency: "USD",
    status: "ongoing" as const,
  },
];

const myTeam = {
  id: "1",
  name: "Code Crusaders",
  members: [
    { userId: "1", username: "johndoe", name: "John Doe", role: "leader" as const, skills: ["React", "TypeScript"], joinedAt: new Date() },
    { userId: "2", username: "janedoe", name: "Jane Smith", role: "member" as const, skills: ["Python", "ML"], joinedAt: new Date() },
    { userId: "3", username: "bobsmith", name: "Bob Smith", role: "member" as const, skills: ["Design", "UI/UX"], joinedAt: new Date() },
  ],
  maxSize: 4,
  techStack: ["React", "Python", "TensorFlow"],
  status: "competing" as const,
};

const recentActivity = [
  { id: 1, type: "team_join", message: "Jane Smith joined your team", time: "2 hours ago", icon: Users },
  { id: 2, type: "hackathon_start", message: "AI Innovation Challenge starts tomorrow", time: "5 hours ago", icon: Calendar },
  { id: 3, type: "message", message: "New message in Code Crusaders", time: "1 day ago", icon: MessageSquare },
  { id: 4, type: "xp_earned", message: "You earned 150 XP", time: "2 days ago", icon: Zap },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />

      <main className="pl-64 pt-16">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, John! 👋</h1>
              <p className="text-muted-foreground">Here's what's happening with your hackathons</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                  3
                </span>
              </Button>
              <Link to="/explore">
                <Button variant="neon">
                  Find Hackathons
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Hackathons</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total XP</p>
                    <p className="text-2xl font-bold neon-text">2,450</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Hackathons Won</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Team Members</p>
                    <p className="text-2xl font-bold">{myTeam.members.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* My Hackathons */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">My Hackathons</h2>
                  <Link to="/my-hackathons">
                    <Button variant="ghost" size="sm" className="group">
                      View All
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {upcomingHackathons.map((hackathon) => (
                    <HackathonCard key={hackathon.id} hackathon={hackathon} variant="compact" />
                  ))}
                </div>
              </section>

              {/* My Team */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">My Team</h2>
                  <Link to="/teams">
                    <Button variant="ghost" size="sm" className="group">
                      Manage Team
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
                <Card variant="neon">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{myTeam.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {myTeam.members.length}/{myTeam.maxSize} members
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                        {myTeam.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {myTeam.members.map((member, i) => (
                          <Avatar
                            key={member.userId}
                            className="h-10 w-10 border-2 border-card"
                            style={{ zIndex: myTeam.members.length - i }}
                          >
                            <AvatarFallback className="bg-muted text-sm">
                              {member.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        <div className="h-10 w-10 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center text-primary">
                          +
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {myTeam.techStack.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              {/* Recommended For You */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Recommended For You</h2>
                  </div>
                  <Link to="/explore">
                    <Button variant="ghost" size="sm" className="group">
                      Explore
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {upcomingHackathons.map((hackathon) => (
                    <HackathonCard key={hackathon.id} hackathon={hackathon} />
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <activity.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link to="/teams/lobby" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Find Teammates
                    </Button>
                  </Link>
                  <Link to="/explore" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Browse Hackathons
                    </Button>
                  </Link>
                  <Link to="/chat" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Team Chat
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Level Progress */}
              <Card variant="neon">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">12</span>
                    </div>
                    <div>
                      <p className="font-semibold">Level 12</p>
                      <p className="text-sm text-muted-foreground">Rising Star</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>2,450 XP</span>
                      <span className="text-muted-foreground">3,000 XP</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-[82%] rounded-full bg-primary animate-pulse-neon" />
                    </div>
                    <p className="text-xs text-muted-foreground">550 XP to Level 13</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
