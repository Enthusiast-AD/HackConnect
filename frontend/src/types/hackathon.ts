export interface Hackathon {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  logo?: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  location: {
    type: 'online' | 'in-person' | 'hybrid';
    venue?: string;
    city?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  prizes: Prize[];
  totalPrizePool: number;
  currency: string;
  tags: string[];
  techStack: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'all';
  participantCount: number;
  maxParticipants?: number;
  teamSize: {
    min: number;
    max: number;
  };
  status: 'upcoming' | 'ongoing' | 'ended';
  organizer: {
    id: string;
    name: string;
    logo: string;
  };
  sponsors: Sponsor[];
  judges: Judge[];
  schedule: ScheduleItem[];
}

export interface Prize {
  id: string;
  title: string;
  amount: number;
  description: string;
  sponsor?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  url: string;
}

export interface Judge {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
}

export interface ScheduleItem {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  type: 'ceremony' | 'workshop' | 'break' | 'deadline' | 'other';
}
