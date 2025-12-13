import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Github,
  Linkedin,
  Globe,
  MapPin,
  Trophy,
  Zap,
  Users,
  Star,
} from "lucide-react";
import type { User, SkillRadar } from "@/types/user";

interface UserProfileProps {
  user: Partial<User>;
  skillRadar?: SkillRadar;
  variant?: "card" | "full";
}

export function UserProfile({ user, skillRadar, variant = "card" }: UserProfileProps) {
  const {
    name,
    username,
    avatar,
    bio,
    skills,
    techStack,
    githubUrl,
    linkedinUrl,
    portfolioUrl,
    xp,
    level,
    badges,
    hackathonsParticipated,
    hackathonsWon,
    reputationScore,
  } = user;

  if (variant === "card") {
    return (
      <Card variant="interactive" className="group">
        <CardHeader className="text-center pb-2">
          <Avatar className="h-20 w-20 mx-auto mb-3 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-primary/20 text-primary text-xl font-semibold">
              {name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-muted-foreground">@{username}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Level & XP */}
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-primary">
              <Zap className="h-4 w-4" />
              Level {level}
            </span>
            <span className="text-muted-foreground">{xp?.toLocaleString()} XP</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center py-3 border-y border-border/50">
            <div>
              <p className="text-lg font-semibold">{hackathonsParticipated}</p>
              <p className="text-xs text-muted-foreground">Participated</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-primary">{hackathonsWon}</p>
              <p className="text-xs text-muted-foreground">Won</p>
            </div>
            <div>
              <p className="text-lg font-semibold">{reputationScore}</p>
              <p className="text-xs text-muted-foreground">Rep Score</p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">TOP SKILLS</p>
            <div className="flex flex-wrap gap-1.5">
              {skills?.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-2">
            {githubUrl && (
              <Button variant="ghost" size="icon" asChild>
                <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            {linkedinUrl && (
              <Button variant="ghost" size="icon" asChild>
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
            )}
            {portfolioUrl && (
              <Button variant="ghost" size="icon" asChild>
                <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>

          <Button className="w-full" variant="neon-outline">
            View Profile
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="glass" className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
        <CardContent className="relative -mt-16 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4">
            <Avatar className="h-32 w-32 ring-4 ring-background">
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-primary/20 text-primary text-3xl font-semibold">
                {name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{name}</h1>
                <Badge variant="outline" className="text-primary border-primary/30">
                  <Zap className="h-3 w-3 mr-1" />
                  Level {level}
                </Badge>
              </div>
              <p className="text-muted-foreground">@{username}</p>
              {bio && <p className="mt-2 text-sm">{bio}</p>}
            </div>
            <div className="flex gap-2">
              {githubUrl && (
                <Button variant="outline" size="icon" asChild>
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {linkedinUrl && (
                <Button variant="outline" size="icon" asChild>
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {portfolioUrl && (
                <Button variant="outline" size="icon" asChild>
                  <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="elevated" className="p-4 text-center">
          <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">{hackathonsWon}</p>
          <p className="text-sm text-muted-foreground">Wins</p>
        </Card>
        <Card variant="elevated" className="p-4 text-center">
          <Users className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-2xl font-bold">{hackathonsParticipated}</p>
          <p className="text-sm text-muted-foreground">Hackathons</p>
        </Card>
        <Card variant="elevated" className="p-4 text-center">
          <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />
          <p className="text-2xl font-bold">{xp?.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">XP Earned</p>
        </Card>
        <Card variant="elevated" className="p-4 text-center">
          <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
          <p className="text-2xl font-bold">{reputationScore}</p>
          <p className="text-sm text-muted-foreground">Reputation</p>
        </Card>
      </div>

      {/* Skills & Tech */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-semibold">Skills</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skills?.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-semibold">Tech Stack</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {techStack?.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      {badges && badges.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <h3 className="font-semibold">Achievements</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <p className="font-medium text-sm">{badge.name}</p>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
