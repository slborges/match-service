/** Dados mock — substituir por API quando o backend existir */

export type UserRole = "cliente" | "profissional";

/** Cinco profissões; há 5 profissionais mock por profissão (25 no total). */
export type ProfissaoSlug =
  | "eletricista"
  | "diarista"
  | "pedreiro"
  | "encanador"
  | "pintor";

export interface Professional {
  id: string;
  profissao: ProfissaoSlug;
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

type BlocoProfissao = {
  profissao: ProfissaoSlug;
  service: string;
  nomes: [string, string, string, string, string];
  priceLabels: [string, string, string, string, string];
  cidades: [string, string, string, string, string];
  ratings: [number, number, number, number, number];
  reviews: [number, number, number, number, number];
};

const BLOCOS: BlocoProfissao[] = [
  {
    profissao: "eletricista",
    service: "Instalação e manutenção elétrica",
    nomes: [
      "Carlos Mendes",
      "Ricardo Alves",
      "Felipe Nogueira",
      "André Santana",
      "Lucas Ferreira",
    ],
    priceLabels: [
      "A partir de R$ 120",
      "Visita técnica R$ 150",
      "A partir de R$ 95",
      "Orçamento sob consulta",
      "R$ 180 — instalação completa",
    ],
    cidades: [
      "São Paulo — Zona Sul",
      "São Paulo — Pinheiros",
      "São Paulo — Zona Leste",
      "São Paulo — Centro",
      "Guarulhos — Centro",
    ],
    ratings: [4.8, 4.7, 4.9, 4.6, 4.85],
    reviews: [62, 44, 103, 28, 91],
  },
  {
    profissao: "diarista",
    service: "Limpeza residencial e organização",
    nomes: [
      "Mariana Costa",
      "Ana Paula Ribeiro",
      "Juliana Martins",
      "Fernanda Lima",
      "Carla Souza",
    ],
    priceLabels: [
      "R$ 45/h",
      "R$ 50/h",
      "R$ 40/h",
      "Diária R$ 180",
      "R$ 48/h",
    ],
    cidades: [
      "São Paulo — Centro",
      "São Paulo — Vila Mariana",
      "Santo André — Centro",
      "São Paulo — Mooca",
      "Osasco — Continental",
    ],
    ratings: [4.9, 4.85, 4.95, 4.7, 4.8],
    reviews: [128, 96, 201, 55, 142],
  },
  {
    profissao: "pedreiro",
    service: "Reformas, reboco e alvenaria",
    nomes: [
      "João Batista",
      "Marcos Antunes",
      "Sérgio Oliveira",
      "Paulo Henrique Dias",
      "Roberto Campos",
    ],
    priceLabels: [
      "Orçamento sob consulta",
      "A partir de R$ 200/dia",
      "Mão de obra + material",
      "Visita e orçamento grátis",
      "Reforma completa — sob consulta",
    ],
    cidades: [
      "São Paulo — Zona Leste",
      "São Paulo — Itaquera",
      "São Bernardo — Centro",
      "Taboão da Serra",
      "São Paulo — Campo Limpo",
    ],
    ratings: [4.6, 4.55, 4.7, 4.5, 4.65],
    reviews: [41, 33, 58, 19, 47],
  },
  {
    profissao: "encanador",
    service: "Vazamentos, troca de registros e hidráulica",
    nomes: [
      "Pedro Encanador",
      "Gustavo Hidráulica",
      "Rafael Motta",
      "Bruno Aquino",
      "Diego Pires",
    ],
    priceLabels: [
      "A partir de R$ 90",
      "Deslocamento R$ 80 + serviço",
      "A partir de R$ 110",
      "Emergência — consultar",
      "R$ 95 visita",
    ],
    cidades: [
      "São Paulo — Zona Oeste",
      "São Paulo — Perdizes",
      "Cotia — Granja Viana",
      "São Paulo — Butantã",
      "Barueri — Alphaville",
    ],
    ratings: [4.7, 4.65, 4.8, 4.55, 4.75],
    reviews: [55, 38, 72, 24, 61],
  },
  {
    profissao: "pintor",
    service: "Pintura residencial e comercial",
    nomes: [
      "Eduardo Pinturas",
      "Thiago Cores",
      "Vinícius Lata",
      "Gabriel Acabamentos",
      "Henrique Moraes",
    ],
    priceLabels: [
      "R$ 35/m²",
      "Orçamento por ambiente",
      "A partir de R$ 28/m²",
      "Mão de obra + tinta",
      "Pacote apartamento — consultar",
    ],
    cidades: [
      "São Paulo — Zona Norte",
      "São Paulo — Santana",
      "Mauá — Centro",
      "São Paulo — Tatuapé",
      "Diadema — Centro",
    ],
    ratings: [4.75, 4.6, 4.85, 4.5, 4.7],
    reviews: [48, 31, 67, 22, 54],
  },
];

function montarProfissionais(): Professional[] {
  const lista: Professional[] = [];
  for (const bloco of BLOCOS) {
    for (let i = 0; i < 5; i++) {
      const n = i + 1;
      lista.push({
        id: `${bloco.profissao}-${n}`,
        profissao: bloco.profissao,
        name: bloco.nomes[i],
        service: bloco.service,
        priceLabel: bloco.priceLabels[i],
        rating: bloco.ratings[i],
        reviewCount: bloco.reviews[i],
        city: bloco.cidades[i],
        imageUrl: `https://picsum.photos/seed/match-${bloco.profissao}-${n}/800/1000`,
      });
    }
  }
  return lista;
}

export const MOCK_PROFESSIONALS: Professional[] = montarProfissionais();

/** Mapa opcional: profissão → lista (5 itens cada) */
export const MOCK_PROFISSIONAIS_POR_PROFISSAO: Record<
  ProfissaoSlug,
  Professional[]
> = MOCK_PROFESSIONALS.reduce(
  (acc, p) => {
    if (!acc[p.profissao]) acc[p.profissao] = [];
    acc[p.profissao].push(p);
    return acc;
  },
  {} as Record<ProfissaoSlug, Professional[]>,
);

export const MOCK_CHAT_THREADS: ChatThread[] = [
  {
    id: "c1",
    name: "Carlos Mendes",
    lastMessage: "Posso ir amanhã às 14h, ok?",
    timeLabel: "14:32",
    unread: 2,
  },
  {
    id: "c2",
    name: "Mariana Costa",
    lastMessage: "Obrigada pelo match! Quando precisa?",
    timeLabel: "Ontem",
    unread: 0,
  },
  {
    id: "c3",
    name: "Pedro Encanador",
    lastMessage: "Enviei o orçamento no chat.",
    timeLabel: "Seg",
    unread: 1,
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
