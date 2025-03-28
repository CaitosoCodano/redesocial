export interface Author {
    id: number;
    name: string;
    username: string;
    avatar: string;
  }
  
  export interface Post {
    id: number;
    author: Author;
    content: string;
    image?: string;
    timeAgo: string;
    likes: number;
    comments: number;
    shares: number;
  }
  
  export const authors: Author[] = [
    {
      id: 1,
      name: "João Silva",
      username: "@joaosilva",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: 2,
      name: "Carlos Oliveira",
      username: "@carlosoliveira",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
    },
    {
      id: 3,
      name: "Julia Santos",
      username: "@juliasantos",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
    },
  ];
  
  export const posts: Post[] = [
    {
      id: 1,
      author: authors[1],
      content: "Compartilhando algumas fotos da minha viagem ao litoral este final de semana. A vista estava incrível! 🌊 🏖️ #FimDeSemana #Praia",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      timeAgo: "10h",
      likes: 128,
      comments: 24,
      shares: 3,
    },
    {
      id: 2,
      author: authors[2],
      content: "Acabei de ler um livro incrível sobre desenvolvimento pessoal e queria compartilhar algumas reflexões...\n\nA principal lição que aprendi é que pequenas mudanças diárias podem trazer resultados extraordinários ao longo do tempo. Vocês já leram algum livro que mudou sua perspectiva sobre a vida? 📚 #DesenvolvimentoPessoal #Leitura",
      timeAgo: "18h",
      likes: 89,
      comments: 42,
      shares: 7,
    },
  ];
  