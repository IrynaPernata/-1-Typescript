
export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}


export type SkillCategory = 'frontend' | 'backend' | 'cloud' | 'emerging' | 'all';


export interface Skill {
  name: string;
  icon: string; 
  level: number;
  categories: SkillCategory[]; 
}