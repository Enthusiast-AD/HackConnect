import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { HackathonCard } from "@/components/features/HackathonCard";
import { useHackathons } from "@/hooks/useHackathons";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  SlidersHorizontal,
  Grid3X3,
  List,
  Globe,
  Laptop,
  Building,
  X,
  ArrowRight,
} from "lucide-react";

const categories = [
  "All",
  "Web3",
  "AI/ML",
  "FinTech",
  "Gaming",
  "HealthTech",
  "CleanTech",
  "EdTech",
];

const locationFilters = [
  { label: "All", value: "all", icon: Globe },
  { label: "Online", value: "online", icon: Laptop },
  { label: "In-Person", value: "in-person", icon: Building },
];

export default function Explore() {
  const { fetchHackathons, isLoading } = useHackathons();
  const [hackathons, setHackathons] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const loadHackathons = async () => {
      const result = await fetchHackathons();
      if (result.success) {
        const mapped = result.data.map((h: any) => ({
          id: h.$id || h.id,
          title: h.name,
          slug: h.name.toLowerCase().replace(/\s+/g, '-'),
          shortDescription: h.description,
          coverImage: h.image_url || "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
          startDate: new Date(h.start_date),
          location: { type: h.mode || "online", city: h.location, country: "" },
          participantCount: 0, // Backend doesn't have this yet
          totalPrizePool: parseInt(h.prize_pool || "0"),
          currency: "USD",
          tags: h.tags || [],
          status: h.status || "upcoming",
          difficulty: "all", // Default
        }));
        setHackathons(mapped);
      }
    };
    loadHackathons();
  }, [fetchHackathons]);

  const selectedHackathon = hackathons.find((h) => h.id === selectedId);

  const filteredHackathons = hackathons.filter((h) => {
    const matchesSearch = h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" ||
      h.tags.some((t: string) => t.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesLocation = selectedLocation === "all" || h.location.type === selectedLocation;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Hackathons</h1>
        <p className="text-muted-foreground">
          Discover {hackathons.length}+ hackathons from around the world
        </p>
      </div>

          {/* Search & Filters */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hackathons, technologies, or themes..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
                <Button variant="outline" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Near Me
                </Button>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </Button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "neon-glow" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Location Filters & View Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {locationFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={selectedLocation === filter.value ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedLocation(filter.value)}
                    className="gap-2"
                  >
                    <filter.icon className="h-4 w-4" />
                    {filter.label}
                  </Button>
                ))}
              </div>
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredHackathons.length} hackathons
            </p>
          </div>

          {/* Hackathon Grid */}
          <div
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredHackathons.map((hackathon, index) => (
              <motion.div
                key={hackathon.id}
                layoutId={hackathon.id}
                className="h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <HackathonCard
                  hackathon={hackathon}
                  variant={viewMode === "list" ? "compact" : "default"}
                  onClick={() => setSelectedId(hackathon.id)}
                />
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {selectedId && selectedHackathon && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                  onClick={() => setSelectedId(null)}
                />
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
                  <motion.div
                    layoutId={selectedId}
                    className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
                  >
                    <div className="relative h-64">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${selectedHackathon.coverImage})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 bg-background/50 hover:bg-background/80 backdrop-blur-sm rounded-full"
                        onClick={() => setSelectedId(null)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h2 className="text-3xl font-bold text-white mb-2">{selectedHackathon.title}</h2>
                        <div className="flex flex-wrap gap-2">
                          {selectedHackathon.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-background/20 text-white hover:bg-background/30 border-none">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Prize Pool</p>
                          <p className="font-semibold text-lg text-primary">
                            {new Intl.NumberFormat("en-US", { style: "currency", currency: selectedHackathon.currency }).format(selectedHackathon.totalPrizePool)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Participants</p>
                          <p className="font-semibold text-lg">{selectedHackathon.participantCount}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Date</p>
                          <p className="font-semibold text-lg">
                            {selectedHackathon.startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                          <p className="font-semibold text-lg capitalize">{selectedHackathon.location.type}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">About the Event</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {selectedHackathon.shortDescription}. Join us for an incredible weekend of building, learning, and networking with the best minds in the industry.
                        </p>
                      </div>

                      <div className="flex gap-4 pt-4 border-t border-border">
                        <Link to={`/hackathons/${selectedHackathon.id}`} className="flex-1">
                          <Button size="lg" className="w-full font-semibold text-lg h-12" variant="neon">
                            Register Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="h-12" onClick={() => setSelectedId(null)}>
                          Maybe Later
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {filteredHackathons.length === 0 && (
            <Card variant="glass" className="p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No hackathons found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedLocation("all");
                }}
              >
                Clear Filters
              </Button>
            </Card>
          )}
        </div>
  );
}
