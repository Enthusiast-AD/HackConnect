import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { account } from "@/lib/appwrite";
import type { User } from "@/types/user";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Fetch function
const fetchUser = async (): Promise<User | null> => {
  try {
    const sessionUser = await account.get();
    
    try {
      const response = await fetch(`${API_URL}/users/${sessionUser.$id}`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      
      return {
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
          hackathonsParticipated: 0,
          hackathonsWon: 0,
          reputationScore: data.reputation_score || 0,
          createdAt: new Date(data.created_at),
      };
    } catch (e) {
       // Fallback if backend fails but appwrite session exists
       console.warn("Backend profile fetch failed", e);
       return {
          id: sessionUser.$id,
          username: sessionUser.name.toLowerCase().replace(/\s+/g, ""),
          email: sessionUser.email,
          name: sessionUser.name,
          role: "participant",
          skills: [],
          techStack: [],
          xp: 0,
          level: 1,
          badges: [],
          hackathonsParticipated: 0,
          hackathonsWon: 0,
          reputationScore: 0,
          createdAt: new Date(sessionUser.$createdAt),
       };
    }
  } catch (error) {
    // Not logged in
    return null;
  }
};

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth_user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 15, // 15 minutes cache
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: any) => {
      await account.createEmailPasswordSession(email, password);
      const sessionUser = await account.get();
      // Sync
      try {
        await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: sessionUser.$id,
                email: sessionUser.email,
                name: sessionUser.name,
                username: sessionUser.name.toLowerCase().replace(/\s+/g, "")
            })
        });
      } catch (e) { console.error(e); }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth_user"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await account.deleteSession("current");
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth_user"], null);
      queryClient.invalidateQueries({ queryKey: ["auth_user"] });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }
      // Auto login
      await account.createEmailPasswordSession(data.email, data.password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth_user"] });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<User>) => {
      if (!user) throw new Error("No user logged in");
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: data.name,
            bio: data.bio,
            skills: data.skills,
            tech_stack: data.techStack,
            github_url: data.githubUrl,
            portfolio_url: data.portfolioUrl,
            avatar_url: data.avatar
        }),
      });
      if (!response.ok) throw new Error("Failed to update profile");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth_user"] });
    },
  });

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    login: async (email, password) => {
        try {
            await loginMutation.mutateAsync({ email, password });
            return { success: true };
        } catch (e: any) {
            return { success: false, error: e.message };
        }
    },
    logout: async () => {
        await logoutMutation.mutateAsync();
    },
    signup: async (data) => {
        try {
            await signupMutation.mutateAsync(data);
            return { success: true };
        } catch (e: any) {
            return { success: false, error: e.message };
        }
    },
    checkAuth: async () => {
        await queryClient.invalidateQueries({ queryKey: ["auth_user"] });
    },
    updateProfile: async (data) => {
        try {
            await updateProfileMutation.mutateAsync(data);
            return { success: true };
        } catch (e: any) {
            return { success: false, error: e.message };
        }
    }
  };
}
