export interface Team {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  hackathonId: string;
  leaderId: string;
  members: TeamMember[];
  joinRequests: { userId: string; name: string }[]; // Updated to object
  maxSize: number;
  lookingFor: string[];
  techStack: string[];
  projectIdea?: string;
  projectRepo?: string;
  status: 'forming' | 'full' | 'competing' | 'submitted';
  createdAt: Date;
}

export interface TeamMember {
  userId: string;
  username: string;
  name: string;
  avatar?: string;
  role: 'leader' | 'member';
  skills: string[];
  joinedAt: Date;
}

export interface TeamInvite {
  id: string;
  teamId: string;
  teamName: string;
  inviterId: string;
  inviterName: string;
  inviteeId: string;
  status: 'pending' | 'accepted' | 'declined';
  message?: string;
  createdAt: Date;
}

export interface TeamRequest {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  skills: string[];
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}
