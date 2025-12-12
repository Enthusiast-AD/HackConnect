import { useState, useEffect, useCallback } from "react";
import { account, databases } from "@/lib/appwrite";
import type { User } from "@/types/user";
import { Models } from "appwrite";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_USERS = import.meta.env.VITE_COLLECTION_USERS;

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const checkAuth = useCallback(async () => {
    try {
      const sessionUser = await account.get();
      
      let userProfile: User;

      try {
        // Fetch from Backend API
        const response = await fetch(`${API_URL}/users/${sessionUser.$id}`);
        if (!response.ok) throw new Error("Failed to fetch profile from backend");
        
        const data = await response.json();

        userProfile = {
          id: data.id,
          username: data.username,
          email: data.email,
          name: data.name,
          avatar: data.avatar_url,
          bio: data.bio,
          skills: data.skills || [],
          techStack: data.techStack || [], // Backend might not return this yet if not in model, but let's assume it does or defaults
          githubUrl: data.github_url,
          linkedinUrl: data.linkedin_url,
          portfolioUrl: data.portfolio_url,
          xp: data.xp || 0,
          level: Math.floor((data.xp || 0) / 1000) + 1,
          badges: [], // Backend doesn't return badges yet
          hackathonsParticipated: 0,
          hackathonsWon: 0,
          reputationScore: data.reputation_score || 0,
          createdAt: new Date(data.created_at),
        };
      } catch (dbError) {
        console.warn("User profile fetch failed, falling back to session data", dbError);
        userProfile = {
          id: sessionUser.$id,
          username: sessionUser.name.toLowerCase().replace(/\s+/g, ""),
          email: sessionUser.email,
          name: sessionUser.name,
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

      setState({
        user: userProfile,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      await account.createEmailPasswordSession(email, password);
      const sessionUser = await account.get();
      
      // Sync with backend to ensure DB record exists
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
      } catch (syncError) {
          console.error("Sync failed", syncError);
      }

      await checkAuth();
      return { success: true };
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message || "Login failed" };
    }
  }, [checkAuth]);

  const logout = useCallback(async () => {
    try {
      await account.deleteSession("current");
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, []);

  const signup = useCallback(async (data: { name: string; email: string; password: string; username: string }) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      // Auto login
      await login(data.email, data.password);
      return { success: true };
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error: error.message || "Signup failed" };
    }
  }, [login]);

  return {
    ...state,
    login,
    logout,
    signup,
    checkAuth
  };
}
