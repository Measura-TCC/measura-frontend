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
    role: "Desenvolvedor Full-Stack",
    shortBio:
      "Apaixonado por engenharia de software e metodologias de medição.",
    avatar: "/api/placeholder/80/80",
    links: {
      github: "https://github.com/joaovictorferreira",
      linkedin: "https://linkedin.com/in/joaovictorferreira",
    },
  },
  {
    id: "orientador",
    name: "Prof. Dr. Orientador",
    role: "Orientador de Pesquisa",
    shortBio: "Especialista em engenharia de software e métricas de qualidade.",
    avatar: "/api/placeholder/80/80",
    links: {
      lattes: "http://lattes.cnpq.br/example",
    },
  },
  {
    id: "colaborador",
    name: "Colaborador Acadêmico",
    role: "Pesquisador",
    shortBio: "Focado em análise de pontos de função e metodologias GQM.",
    avatar: "/api/placeholder/80/80",
    links: {
      linkedin: "https://linkedin.com/in/colaborador",
    },
  },
];
