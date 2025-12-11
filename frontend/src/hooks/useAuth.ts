import { useState, useEffect, useCallback } from "react";
import type { User } from "@/types/user";

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

  useEffect(() => {
    // Simulate checking auth state
    const checkAuth = async () => {
      try {
        // In a real app, this would check with your auth provider
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setState({
            user: JSON.parse(storedUser),
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // Simulate login
      const user: User = {
        id: "1",
        username: "johndoe",
        email,
        name: "John Doe",
        skills: [],
        techStack: [],
        xp: 0,
        level: 1,
        badges: [],
        hackathonsParticipated: 0,
        hackathonsWon: 0,
        reputationScore: 100,
        createdAt: new Date(),
      };
      localStorage.setItem("user", JSON.stringify(user));
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
      return { success: true };
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error: "Login failed" };
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem("user");
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  }, []);

  const signup = useCallback(async (data: { name: string; email: string; password: string }) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // Simulate signup
      const user: User = {
        id: "1",
        username: data.name.toLowerCase().replace(/\s+/g, ""),
        email: data.email,
        name: data.name,
        skills: [],
        techStack: [],
        xp: 0,
        level: 1,
        badges: [],
        hackathonsParticipated: 0,
        hackathonsWon: 0,
        reputationScore: 100,
        createdAt: new Date(),
      };
      localStorage.setItem("user", JSON.stringify(user));
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
      return { success: true };
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error: "Signup failed" };
    }
  }, []);

  return {
    ...state,
    login,
    logout,
    signup,
  };
}
