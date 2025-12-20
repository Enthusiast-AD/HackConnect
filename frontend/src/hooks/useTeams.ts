import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface CreateTeamData {
  name: string;
  description: string;
  hackathon_id: string;
  looking_for: string[];
  tech_stack: string[];
  project_repo?: string;
}

export function useTeams() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const createTeam = useCallback(async (data: CreateTeamData) => {
    if (!user) return { success: false, error: "You must be logged in to create a team." };
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/teams/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          leader_id: user.id,
          members: [user.id], // Leader is automatically a member
          status: "open"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create team");
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchTeams = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/teams/`);
      if (!response.ok) throw new Error("Failed to fetch teams");
      const data = await response.json();
      return { success: true, data: data.documents };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const joinTeam = useCallback(async (teamId: string) => {
    if (!user) return { success: false, error: "You must be logged in to join a team." };
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/teams/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          team_id: teamId,
          user_id: user.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to join team");
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const approveMember = useCallback(async (teamId: string, targetUserId: string) => {
    if (!user) return { success: false, error: "Not logged in" };
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/teams/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_id: teamId,
          leader_id: user.id,
          target_user_id: targetUserId
        }),
      });
      if (!response.ok) throw new Error("Failed to approve");
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const rejectMember = useCallback(async (teamId: string, targetUserId: string) => {
    if (!user) return { success: false, error: "Not logged in" };
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/teams/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_id: teamId,
          leader_id: user.id,
          target_user_id: targetUserId
        }),
      });
      if (!response.ok) throw new Error("Failed to reject");
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchTeam = useCallback(async (teamId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/teams/${teamId}`);
      if (!response.ok) throw new Error("Failed to fetch team");
      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTeam = useCallback(async (teamId: string, updates: any) => {
    if (!user) return { success: false, error: "Not logged in" };
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/teams/${teamId}?user_id=${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update team");
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const removeMember = useCallback(async (teamId: string, memberId: string) => {
    if (!user) return { success: false, error: "Not logged in" };
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/teams/remove_member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_id: teamId, leader_id: user.id, target_user_id: memberId }),
      });
      if (!response.ok) throw new Error("Failed to remove member");
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const deleteTeam = useCallback(async (teamId: string) => {
    if (!user) return { success: false, error: "Not logged in" };
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/teams/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_id: teamId, user_id: user.id }),
      });
      if (!response.ok) throw new Error("Failed to delete team");
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    createTeam,
    fetchTeams,
    fetchTeam,
    joinTeam,
    approveMember,
    rejectMember,
    updateTeam,
    removeMember,
    deleteTeam,
    isLoading
  };
}
