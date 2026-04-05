/** Dados mock — substituir por API quando o backend existir */

export type UserRole = "cliente" | "profissional";

export interface Professional {
  id: string;
  name: string;
  service: string;
  priceLabel: string;
  rating: number;
  reviewCount: number;
  city: string;
  imageUrl: string;
}

export interface ChatThread {
  id: string;
  name: string;
  lastMessage: string;
  timeLabel: string;
  unread: number;
}

export interface MockCurrentUser {
  name: string;
  role: UserRole;
  city: string;
  skills: string[];
  rating: number;
  completedJobs: number;
}

export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: "1",
    name: "Carlos Eletricista",
    service: "Instalação e manutenção elétrica",
    priceLabel: "A partir de R$ 120",
    rating: 4.8,
    reviewCount: 62,
    city: "São Paulo — Zona Sul",
    imageUrl: "https://picsum.photos/seed/match1/800/1000",
  },
  {
    id: "2",
    name: "Mariana Diarista",
    service: "Limpeza residencial e organização",
    priceLabel: "R$ 45/h",
    rating: 4.9,
    reviewCount: 128,
    city: "São Paulo — Centro",
    imageUrl: "https://picsum.photos/seed/match2/800/1000",
  },
  {
    id: "3",
    name: "João Pedreiro",
    service: "Reformas, reboco e alvenaria",
    priceLabel: "Orçamento sob consulta",
    rating: 4.6,
    reviewCount: 41,
    city: "São Paulo — Zona Leste",
    imageUrl: "https://picsum.photos/seed/match3/800/1000",
  },
  {
    id: "4",
    name: "Ana Encanadora",
    service: "Vazamentos, troca de registros",
    priceLabel: "A partir de R$ 90",
    rating: 4.7,
    reviewCount: 55,
    city: "São Paulo — Zona Oeste",
    imageUrl: "https://picsum.photos/seed/match4/800/1000",
  },
];

export const MOCK_CHAT_THREADS: ChatThread[] = [
  {
    id: "c1",
    name: "Carlos Eletricista",
    lastMessage: "Posso ir amanhã às 14h, ok?",
    timeLabel: "14:32",
    unread: 2,
  },
  {
    id: "c2",
    name: "Mariana Diarista",
    lastMessage: "Obrigada pelo match! Quando precisa?",
    timeLabel: "Ontem",
    unread: 0,
  },
];

export const MOCK_CURRENT_USER: MockCurrentUser = {
  name: "Você (demo)",
  role: "cliente",
  city: "São Paulo, SP",
  skills: ["Reformas", "Elétrica", "Limpeza"],
  rating: 5.0,
  completedJobs: 0,
};
