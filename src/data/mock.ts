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

/** Filtro usado na Busca e no Descobrir (match). */
export function filterProfessionals(
  list: Professional[],
  opts: { profissao?: ProfissaoSlug | null; query?: string | null },
): Professional[] {
  let result = [...list];
  if (opts.profissao) {
    result = result.filter((p) => p.profissao === opts.profissao);
  }
  const q = opts.query?.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.service.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        LABEL_PROFISSAO[p.profissao].toLowerCase().includes(q),
    );
  }
  return result;
}

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

/** Rótulos para UI (tags, filtros). */
export const LABEL_PROFISSAO: Record<ProfissaoSlug, string> = {
  eletricista: "Eletricista",
  diarista: "Diarista",
  pedreiro: "Pedreiro",
  encanador: "Encanador",
  pintor: "Pintor",
};

/** Tags dos serviços mais procurados (ordem de exibição). */
export const TAGS_SERVICOS_POPULARES: readonly {
  slug: ProfissaoSlug;
  label: string;
}[] = [
  { slug: "eletricista", label: "Eletricista" },
  { slug: "diarista", label: "Diarista" },
  { slug: "pedreiro", label: "Pedreiro" },
  { slug: "encanador", label: "Encanador" },
  { slug: "pintor", label: "Pintor" },
] as const;

/** Pedidos / oportunidades mock — visão do profissional (busca por tipo de serviço). */
export interface DemandaServico {
  id: string;
  profissao: ProfissaoSlug;
  titulo: string;
  resumo: string;
  orcamentoLabel: string;
  city: string;
  publicadoEm: string;
}

export const MOCK_DEMANDAS: DemandaServico[] = [
  {
    id: "d-ele-1",
    profissao: "eletricista",
    titulo: "Trocar quadro monofásico para trifásico",
    resumo: "Apartamento 80 m², preciso adequação do quadro e novos disjuntores.",
    orcamentoLabel: "Até R$ 2.500",
    city: "São Paulo — Vila Mariana",
    publicadoEm: "Hoje",
  },
  {
    id: "d-ele-2",
    profissao: "eletricista",
    titulo: "Instalar tomadas 220 V na cozinha",
    resumo: "4 pontos novos, eletroduto aparente aceitável.",
    orcamentoLabel: "R$ 400 – 700",
    city: "Guarulhos — Centro",
    publicadoEm: "Ontem",
  },
  {
    id: "d-ele-3",
    profissao: "eletricista",
    titulo: "Iluminação LED em escritório",
    resumo: "Projeto com 12 spots, preciso laudo se necessário.",
    orcamentoLabel: "Sob consulta",
    city: "Barueri — Alphaville",
    publicadoEm: "Há 2 dias",
  },
  {
    id: "d-dia-1",
    profissao: "diarista",
    titulo: "Limpeza pós-obra em apartamento",
    resumo: "Poeira fina, vidros e armários embutidos.",
    orcamentoLabel: "R$ 350 diária",
    city: "São Paulo — Mooca",
    publicadoEm: "Hoje",
  },
  {
    id: "d-dia-2",
    profissao: "diarista",
    titulo: "Faxina semanal — 3 cômodos",
    resumo: "Preferência quartas ou quintas pela manhã.",
    orcamentoLabel: "R$ 45/h",
    city: "Santo André — Centro",
    publicadoEm: "Ontem",
  },
  {
    id: "d-dia-3",
    profissao: "diarista",
    titulo: "Organização de closet e limpeza",
    resumo: "Cliente fornece caixas; foco em dobrar e etiquetar.",
    orcamentoLabel: "R$ 200 – 280",
    city: "Osasco",
    publicadoEm: "Há 3 dias",
  },
  {
    id: "d-ped-1",
    profissao: "pedreiro",
    titulo: "Rebocar parede da sala",
    resumo: "Aprox. 25 m², preparação para pintura.",
    orcamentoLabel: "Material incluso — orçar",
    city: "São Paulo — Itaquera",
    publicadoEm: "Hoje",
  },
  {
    id: "d-ped-2",
    profissao: "pedreiro",
    titulo: "Chapisco e contrapiso em área externa",
    resumo: "12 m², precisa impermeabilização.",
    orcamentoLabel: "Até R$ 1.800",
    city: "Taboão da Serra",
    publicadoEm: "Ontem",
  },
  {
    id: "d-ped-3",
    profissao: "pedreiro",
    titulo: "Abrir vão para porta de correr",
    resumo: "Alvenaria com 15 cm, com acabamento.",
    orcamentoLabel: "R$ 900 – 1.200",
    city: "São Bernardo — Centro",
    publicadoEm: "Há 4 dias",
  },
  {
    id: "d-enc-1",
    profissao: "encanador",
    titulo: "Vazamento em registro do chuveiro",
    resumo: "Apartamento, torneira gotejando há uma semana.",
    orcamentoLabel: "Até R$ 250",
    city: "São Paulo — Perdizes",
    publicadoEm: "Hoje",
  },
  {
    id: "d-enc-2",
    profissao: "encanador",
    titulo: "Instalar torneira e sifão novos",
    resumo: "Compras feitas pelo cliente; só instalação.",
    orcamentoLabel: "R$ 180",
    city: "Cotia — Granja Viana",
    publicadoEm: "Ontem",
  },
  {
    id: "d-enc-3",
    profissao: "encanador",
    titulo: "Desentupir ralo da lavanderia",
    resumo: "Máquina de alta pressão se preciso.",
    orcamentoLabel: "R$ 120 – 200",
    city: "São Paulo — Butantã",
    publicadoEm: "Há 2 dias",
  },
  {
    id: "d-pin-1",
    profissao: "pintor",
    titulo: "Pintar 2 quartos + teto",
    resumo: "Massa corrida ok; cor já escolhida (branco gelo).",
    orcamentoLabel: "R$ 28–32/m²",
    city: "São Paulo — Santana",
    publicadoEm: "Hoje",
  },
  {
    id: "d-pin-2",
    profissao: "pintor",
    titulo: "Pintura externa de muro — 40 m linear",
    resumo: "Textura acrílica, duas demãos.",
    orcamentoLabel: "Sob consulta",
    city: "Mauá — Centro",
    publicadoEm: "Ontem",
  },
  {
    id: "d-pin-3",
    profissao: "pintor",
    titulo: "Acabamento fino sala integrada",
    resumo: "Rodapés e cantos com fita; cliente exige acabamento premium.",
    orcamentoLabel: "Acima de R$ 4.000",
    city: "Diadema — Centro",
    publicadoEm: "Há 5 dias",
  },
];

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
