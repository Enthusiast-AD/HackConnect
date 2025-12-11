import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Users, Trophy, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Hackathon } from "@/types/hackathon";

interface HackathonCardProps {
  hackathon: Partial<Hackathon>;
  variant?: "default" | "featured" | "compact";
}

export function HackathonCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer bg-[length:200%_100%]" />
      </div>
      <CardHeader className="pb-2 space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        <div className="flex gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export function HackathonCard({ hackathon, variant = "default" }: HackathonCardProps) {
  const {
    title,
    shortDescription,
    coverImage,
    startDate,
    location,
    participantCount,
    totalPrizePool,
    currency,
    tags,
    status,
    difficulty,
  } = hackathon;

  const formatDate = (date?: Date) => {
    if (!date) return "TBD";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatPrize = (amount?: number, currency?: string) => {
    if (!amount) return "No prize";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ongoing":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "upcoming":
        return "bg-primary/20 text-primary border-primary/30";
      case "ended":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  if (variant === "compact") {
    return (
      <Card variant="interactive" className="flex items-center gap-4 p-4">
        <div
          className="h-16 w-16 rounded-lg bg-cover bg-center flex-shrink-0"
          style={{ backgroundImage: `url(${coverImage || "/placeholder.svg"})` }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{title}</h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(startDate)}
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" />
              {formatPrize(totalPrizePool, currency)}
            </span>
          </div>
        </div>
        <Badge variant="outline" className={cn("flex-shrink-0", getStatusColor(status))}>
          {status}
        </Badge>
      </Card>
    );
  }

  return (
    <Card
      variant={variant === "featured" ? "neon" : "interactive"}
      className={cn(
        "overflow-hidden group h-full flex flex-col",
        variant === "featured" && "ring-1 ring-primary/50"
      )}
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${coverImage || "/placeholder.svg"})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="outline" className={cn(getStatusColor(status))}>
            {status === "ongoing" && <Clock className="h-3 w-3 mr-1 animate-pulse" />}
            {status}
          </Badge>
          {variant === "featured" && (
            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
          )}
        </div>

        {/* Prize Pool */}
        <div className="absolute bottom-4 right-4">
          <div className="glass rounded-lg px-3 py-1.5">
            <span className="text-sm font-semibold neon-text">
              {formatPrize(totalPrizePool, currency)}
            </span>
          </div>
        </div>
      </div>

      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{shortDescription}</p>
      </CardHeader>

      <CardContent className="space-y-3 flex-1">
        {/* Meta Info */}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(startDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {location?.type === "online" ? "Online" : location?.city || "TBD"}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {participantCount || 0} joined
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {difficulty && (
            <Badge variant="secondary" className="text-xs">
              {difficulty}
            </Badge>
          )}
          {tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full" variant={variant === "featured" ? "neon" : "default"}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
