import joao from "@/presentation/assets/images/joao.png";
import jose from "@/presentation/assets/images/jose.png";
import lohine from "@/presentation/assets/images/lohine.png";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  shortBio: string;
  avatar: string;
  links?: {
    linkedin?: string;
    github?: string;
    lattes?: string;
  };
}

export const teamMembers: TeamMember[] = [
  {
    id: "joao-victor",
    name: "João Victor Ferreira",
    role: "Software Engineer",
    shortBio: "Software Engineer at Illuvium",
    avatar: joao.src,
    links: {
      github: "https://github.com/joaovictor-ferreira",
      linkedin: "https://www.linkedin.com/in/joao-victor-eth/",
    },
  },
  {
    id: "lohine",
    name: "Lohine Mussi",
    role: "Researcher",
    shortBio: "Software Engineer at Renault",
    avatar: lohine.src,
    links: {
      linkedin: "https://www.linkedin.com/in/lohine-mussi/",
      github: "https://github.com/lohine",
    },
  },
  {
    id: "jose-mussy",
    name: "José Mussy",
    role: "Researcher",
    shortBio: "Software Engineer at Alta Rail",
    avatar: jose.src,
    links: {
      linkedin: "https://www.linkedin.com/in/josemussy/",
      github: "https://github.com/Josemussy",
    },
  },
];
