/**
 * Dados mock — substituir por API quando o backend existir.
 *
 * **Modelo em camadas (vamos aperfeiçoar por etapas):**
 * 1. **Perfil do profissional** — pessoa que presta serviço (nome, cidade, foto de perfil, etc.).
 *    As fotos por utilizador mock vivem em `BLOCOS[].fotosPerfil` (no futuro: upload substitui a URL).
 * 2. **Perfil do cliente** — quem contrata (conta separada; mock em `AuthContext` / ecrãs de auth).
 * 3. **Tipo / oferta de serviço** — categoria de trabalho (cards na Busca, filtros). Editável em
 *    `IMAGENS_CARDS_POR_SERVICO` — não confundir com a foto do profissional.
 */

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
  /** Foto de perfil do profissional (mock: `BLOCOS[].fotosPerfil`; depois: upload). */
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
  /**
   * Foto de **perfil** de cada profissional (mesma ordem que `nomes`).
   * Troque o URL à mão; no produto virá do upload do utilizador.
   */
  fotosPerfil: [string, string, string, string, string];
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
    fotosPerfil: [
      "https://img.freepik.com/fotos-gratis/homem-um-tecnico-eletrico-trabalhando-em-uma-central-eletrica-com-fusiveis_169016-24230.jpg?semt=ais_hybrid&w=740&q=80",
      "https://img.freepik.com/fotos-gratis/um-eletricista-masculino-trabalha-em-uma-central-eletrica-com-um-cabo-de-conexao-eletrica_169016-52245.jpg?semt=ais_hybrid&w=740&q=80",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1-x3uAVjtUJHuH0kVbazxOAHRWZlJQWYGbA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT987KON8pVd47GwOQhe0nhNxc538dCqhFYMg&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTirgKGcLdgwLiTD5nIpgzPhAw-_aM2tJFKjw&s",
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
    fotosPerfil: [
      "https://img.freepik.com/fotos-gratis/dona-de-casa-sorridente-em-pe-de-avental-na-cozinha_259150-59701.jpg?semt=ais_hybrid&w=740&q=80",
      "https://revistaaldeia.com.br/arquivos/images/Dani%20Diarista-18.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRctDjJWdiaCxyy9vLylu-pNkYIvSnZn8s0vw&s",
      "https://i.pinimg.com/474x/d5/52/1b/d5521bccf761cab069d44c14df896ed9.jpg",
      "https://thumbs.dreamstime.com/b/limpeza-vapor-de-cozinha-com-gerador-profissional-mulher-limpa-est%C3%A1-cozinhando-e-desinfetando-fog%C3%A3o-limpadora-mulheres-na-266053241.jpg",
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
    fotosPerfil: [
      "https://primeirapagina.com.br/wp-content/uploads/2024/12/casa-pedreiro-1200x1595.jpeg",
      "https://images.pexels.com/photos/30640160/pexels-photo-30640160/free-photo-of-trabalhador-da-construcao-civil-em-frente-a-uma-parede-de-tijolos-sob-a-luz-do-sol.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnkgE5dLh-CnKaF1e-VIjY5O4vseF1jZEB7w&s",
      "https://static.ndmais.com.br/2023/11/pedreiro-brincalhao-600x800.png",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwtuh_R5QlY9qm1LSTbZNYuKBWCJS66POVDQ&s",
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
    fotosPerfil: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWacBfCV46JHB-LVhSQu65UYGc0npgK1GDwQ&s",
      "https://sosreformasereparos.com.br/wp-content/uploads/2024/06/Encanador-em-Carapicuiba-e-regiao-SOS-Reformas-e-Reparos.png",
      "https://encanadorfostertec.com.br/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-03-at-11.57.28.jpeg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVwH2exhw4uCEL3rVzpvYynDdmBQaBU3KHZw&s",
      "https://bombeirohidraulicobrasilia.com.br/wp-content/uploads/2024/09/Bombeiro-Hidraulico-Brasilia-DF.png",
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
    fotosPerfil: [
      "https://www.shutterstock.com/shutterstock/videos/3859678837/thumb/1.jpg?ip=x480",
      "https://img.freepik.com/fotos-gratis/house-painters-with-paint-roller-in-house_1398-1570.jpg?semt=ais_hybrid&w=740&q=80",
      "https://thumbs.dreamstime.com/b/homem-pintando-uma-parede-de-cor-branca-vista-traseira-do-pintor-com-rolo-tinta-181730016.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmiNI0RhCzYRqoWaGqEhx0Zs_h5H7lm86fdg&s",
      "https://s2.glbimg.com/KuGQVnfgJN3bRGU3p3HxxlosygQ=/smart/e.glbimg.com/og/ed/f/original/2020/08/13/interiores-dicas-pintura-youtube-influenciadores_2.jpg",
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
        imageUrl: bloco.fotosPerfil[i],
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

/**
 * Imagens dos cards “Serviços mais procurados” (Buscar) e fundo dos cards de oferta (profissional).
 *
 * **Edite manualmente** `imageUrl` com qualquer link direto de imagem (Pexels, Unsplash, etc.).
 * O campo `tema` é só lembrete do assunto — não é usado na UI.
 *
 * URLs abaixo: stock Pexels alinhado a cada skill (troque se quiser).
 */
export const IMAGENS_CARDS_POR_SERVICO: readonly {
  slug: ProfissaoSlug;
  tema: string;
  imageUrl: string;
}[] = [
  {
    slug: "eletricista",
    tema: "Elétrica / eletricista a trabalhar",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBKHeHToaTGNNMnf_6ZKgF6knuBYohQvZOAA&s",
  },
  {
    slug: "diarista",
    tema: "Limpeza / diarista / casa",
    imageUrl:
      "https://blog.edona.com.br/wp-content/uploads/2023/08/Limpeza-domestica-com-diarista.jpg",
  },
  {
    slug: "pedreiro",
    tema: "Obra / alvenaria / construção",
    imageUrl:
      "https://eldoradomaterial.com.br/wp-content/uploads/2024/05/tijolo-6-furos-eldorado-material-materiais-de-construcao-sitio-cercado-xapinhal-curitiba-2.png",
  },
  {
    slug: "encanador",
    tema: "Canalização / água / encanamento",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTid8314m_Cuujue8f3Wo_RvVrBNQb_6RMjcw&s",
  },
  {
    slug: "pintor",
    tema: "Pintura / rolo / acabamento",
    imageUrl:
      "https://images.pexels.com/photos/221027/pexels-photo-221027.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop",
  },
];

/** Mapa derivado — o ecrã usa isto; a lista editável é `IMAGENS_CARDS_POR_SERVICO`. */
export const IMAGEM_CARD_PROFISSAO: Record<ProfissaoSlug, string> =
  IMAGENS_CARDS_POR_SERVICO.reduce(
    (acc, row) => {
      acc[row.slug] = row.imageUrl;
      return acc;
    },
    {} as Record<ProfissaoSlug, string>,
  );

/** Pedidos / “empregos” mock — visão do profissional no Descobrir (mesmo fluxo swipe do cliente). */
export interface DemandaServico {
  id: string;
  profissao: ProfissaoSlug;
  titulo: string;
  resumo: string;
  orcamentoLabel: string;
  city: string;
  publicadoEm: string;
  /** Nome fictício do cliente que publicou (demo). */
  solicitanteLabel?: string;
}

/** Filtro de ofertas por profissão e texto (igual ideia a `filterProfessionals`). */
export function filterDemandas(
  list: DemandaServico[],
  opts: { profissao?: ProfissaoSlug | null; query?: string | null },
): DemandaServico[] {
  let result = [...list];
  if (opts.profissao) {
    result = result.filter((d) => d.profissao === opts.profissao);
  }
  const q = opts.query?.trim().toLowerCase();
  if (q) {
    result = result.filter(
      (d) =>
        d.titulo.toLowerCase().includes(q) ||
        d.resumo.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        LABEL_PROFISSAO[d.profissao].toLowerCase().includes(q) ||
        (d.solicitanteLabel?.toLowerCase().includes(q) ?? false),
    );
  }
  return result;
}

/** Imagem de fundo do card de oferta — mesma imagem temática da profissão (editável em `IMAGENS_CARDS_POR_SERVICO`). */
export function imagemDemanda(d: DemandaServico): string {
  return IMAGEM_CARD_PROFISSAO[d.profissao];
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
    solicitanteLabel: "Cliente — Mariana T.",
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
