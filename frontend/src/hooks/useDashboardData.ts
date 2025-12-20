import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useMemo } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

async function fetchAllHackathons() {
  const res = await fetch(`${API_URL}/hackathons`);
  if (!res.ok) throw new Error("Failed to load hackathons");
  return res.json();
}

async function fetchUserHackathons(userId: string) {
  const res = await fetch(`${API_URL}/users/${userId}/hackathons`);
  if (!res.ok) throw new Error("Failed to load user hackathons");
  return res.json();
}

async function fetchTeams() {
  const res = await fetch(`${API_URL}/teams`);
  if (!res.ok) throw new Error("Failed to load teams");
  return res.json();
}

export function useDashboardData() {
  const { user, isLoading: isAuthLoading } = useAuth();

  // 1. Fetch All Hackathons (Cached for 5 mins)
  const allHackathonsQuery = useQuery({
    queryKey: ["hackathons", "all"],
    queryFn: fetchAllHackathons,
    staleTime: 1000 * 60 * 5, 
  });

  // 2. Fetch User Hackathons (Cached for 5 mins)
  const myHackathonsQuery = useQuery({
    queryKey: ["hackathons", "user", user?.id],
    queryFn: () => fetchUserHackathons(user!.id),
    enabled: !!user?.id, // Only run if user is logged in
    staleTime: 1000 * 60 * 5,
  });

  // 3. Fetch Teams (Cached for 5 mins)
  const teamsQuery = useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
    staleTime: 1000 * 60 * 5,
  });

  const myTeam = useMemo(() => {
    return teamsQuery.data?.documents?.find((team: any) => 
      team.members.includes(user?.id)
    );
  }, [teamsQuery.data, user?.id]);

  return { 
    allHackathons: allHackathonsQuery.data?.documents || [],
    myHackathons: myHackathonsQuery.data?.hackathons || [],
    myTeam,
    isLoading: isAuthLoading || allHackathonsQuery.isLoading || (!!user && myHackathonsQuery.isLoading) || teamsQuery.isLoading,
    isError: allHackathonsQuery.isError
  };
}
