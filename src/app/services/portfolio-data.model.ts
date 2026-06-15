// TypeScript interfaces for all portfolio data structures

export interface HeroData {
  firstName: string;
  lastName: string;
  subtitle: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  enabled: boolean;
}

export interface AboutData {
  bio: string;
  email: string;
  phone: string;
  availability: string;
  languages: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  desc: string;
}

export interface SoftwareSkill {
  name: string;
  level: number;
  color: string;
}

export interface HobbyItem {
  name: string;
  icon: string;
}

export interface EducationItem {
  dateRange: string;
  degree: string;
  institute: string;
}

export interface ContactData {
  email: string;
  phone: string;
  location: string;
  collaborationText: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  desc: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  isVertical?: boolean;
}

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  socialLinks: SocialLink[];
  services: ServiceItem[];
  softwareSkills: SoftwareSkill[];
  personalSkills: string[];
  gameArtSkills: string[];
  hobbies: HobbyItem[];
  education: EducationItem[];
  contact: ContactData;
  projects: ProjectItem[];
}

