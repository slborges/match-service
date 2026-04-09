/**
 * Dados mock — substituir por API quando o backend existir.
 *
 * **Modelo em camadas (vamos aperfeiçoar por etapas):**
 * 1. **Perfil do profissional** — pessoa que presta serviço (nome, cidade, foto de perfil, etc.).
 *    As fotos por utilizador mock vivem em `BLOCOS[].fotosPerfil` (no futuro: upload substitui a URL).
 * 2. **Perfil do cliente** — quem contrata (conta separada; mock em `AuthContext` / ecrãs de auth).
 * 3. **Tipo / oferta de serviço** — categoria de trabalho (cards na Busca, filtros). Editável em
 *    `IMAGENS_CARDS_POR_SERVICO` — não confundir com a foto do profissional.
 * 4. **Oportunidades (pedidos)** — mesmo padrão que profissionais: `BLOCOS_DEMANDA[]` com tuplas de 5 por
 *    campo (títulos, imagens da oportunidade, etc.) e `montarDemandas()` gera `MOCK_DEMANDAS`.
 */

export type UserRole = "cliente" | "profissional";

/** Cinco profissões; há 5 profissionais e 5 oportunidades mock por profissão (25 + 25 itens). */
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
  /** Título de demanda usado na simulação de match para cliente. */
  demandaTituloMatch: string;
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
  titulosDemandasMatch: [string, string, string, string, string];
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
    titulosDemandasMatch: [
      "Trocar disjuntor do quadro principal",
      "Instalar tomadas 220V na cozinha",
      "Revisar curto intermitente na sala",
      "Refazer circuito da área de serviço",
      "Substituir fiação antiga do corredor",
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
    titulosDemandasMatch: [
      "Faxina pós-mudança em apartamento",
      "Limpeza semanal de 3 cômodos",
      "Organização completa do closet",
      "Limpeza pesada de cozinha e banheiros",
      "Higienização de estofado e tapetes",
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
    titulosDemandasMatch: [
      "Rebocar parede da sala",
      "Assentar porcelanato no quarto",
      "Abrir vão para porta de correr",
      "Construir muro de divisa",
      "Nivelar contrapiso da varanda",
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
    titulosDemandasMatch: [
      "Consertar vazamento no chuveiro",
      "Trocar sifão e torneira da cozinha",
      "Desentupir ralo da lavanderia",
      "Substituir caixa acoplada do banheiro",
      "Instalar aquecedor a gás",
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
    titulosDemandasMatch: [
      "Pintar dois quartos e corredor",
      "Repintar fachada frontal da casa",
      "Acabamento fino da sala integrada",
      "Aplicar textura em parede externa",
      "Pintura completa de apartamento",
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
        demandaTituloMatch: bloco.titulosDemandasMatch[i],
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

/** Prefixo curto para `id` das demandas (`d-ele-1` … `d-ele-5`), alinhado a `montarProfissionais`. */
const PREFIX_DEMANDA: Record<ProfissaoSlug, string> = {
  eletricista: "ele",
  diarista: "dia",
  pedreiro: "ped",
  encanador: "enc",
  pintor: "pin",
};

/**
 * Bloco de oportunidades por profissão — **cinco pedidos** por serviço (mesma ideia que `BlocoProfissao`).
 * Edite as tuplas à mão; `imagensOportunidade` segue o papel de `fotosPerfil`.
 */
type BlocoDemanda = {
  profissao: ProfissaoSlug;
  titulos: [string, string, string, string, string];
  resumos: [string, string, string, string, string];
  orcamentoLabels: [string, string, string, string, string];
  cidades: [string, string, string, string, string];
  publicadoEm: [string, string, string, string, string];
  /**
   * Imagem de cada oportunidade (mesma ordem que `titulos`).
   * Troque o URL à mão; no produto virá do upload do cliente.
   */
  imagensOportunidade: [string, string, string, string, string];
  solicitantesLabels: [
    string | undefined,
    string | undefined,
    string | undefined,
    string | undefined,
    string | undefined,
  ];
};

const BLOCOS_DEMANDA: BlocoDemanda[] = [
  {
    profissao: "eletricista",
    titulos: [
      "Trocar quadro monofásico para trifásico",
      "Instalar tomadas 220 V na cozinha",
      "Iluminação LED em escritório",
      "Aterramento e SPDA em cobertura",
      "Trocar disjuntor geral com cheiro a queimado",
    ],
    resumos: [
      "Apartamento 80 m², preciso adequação do quadro e novos disjuntores.",
      "4 pontos novos, eletroduto aparente aceitável.",
      "Projeto com 12 spots, preciso laudo se necessário.",
      "Casa térrea, preciso laudo e execução conforme norma.",
      "Quadro antigo, odor forte; avaliar cabos.",
    ],
    orcamentoLabels: [
      "Até R$ 2.500",
      "R$ 400 – 700",
      "Sob consulta",
      "A partir de R$ 3.200",
      "Emergência — orçar",
    ],
    cidades: [
      "São Paulo — Vila Mariana",
      "Guarulhos — Centro",
      "Barueri — Alphaville",
      "São Paulo — Ipiranga",
      "São Paulo — Brooklin",
    ],
    publicadoEm: ["Hoje", "Ontem", "Há 2 dias", "Há 1 semana", "Hoje"],
    imagensOportunidade: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVD9QG2WXEPxiy2cDcnz7fytyCm4t6HoWzzQ&s",
      "https://images.tcdn.com.br/img/img_prod/1018775/conjunto_1_tomada_2p_t_10a_250v_interruptor_simples_10a_250v_4x2_br_clean_margirius_1273_2_c1f35a8b75cb47b6f12606522f91ad79.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfdORyoklANRpeoM90YLPKuQqYQca6rKEFAw&s",
      "https://enetec.net.br/wp-content/uploads/2023/10/ChatGPT-Image-1-de-mai.-de-2025-19_20_44-683x1024.png",
      "https://m.media-amazon.com/images/I/71VAV9AS3PL.jpg",
    ],
    solicitantesLabels: [
      "Cliente — Mariana T.",
      undefined,
      undefined,
      undefined,
      undefined,
    ],
  },
  {
    profissao: "diarista",
    titulos: [
      "Limpeza pós-obra em apartamento",
      "Faxina semanal — 3 cômodos",
      "Organização de closet e limpeza",
      "Limpeza pós-evento em salão",
      "Lavar estofados e tapetes",
    ],
    resumos: [
      "Poeira fina, vidros e armários embutidos.",
      "Preferência quartas ou quintas pela manhã.",
      "Cliente fornece caixas; foco em dobrar e etiquetar.",
      "Lavar piso, retirar lixo e desmontar mesas.",
      "Sofá 3 lugares + 2 tapetes; produtos neutros.",
    ],
    orcamentoLabels: [
      "R$ 350 diária",
      "R$ 45/h",
      "R$ 200 – 280",
      "R$ 600 pacote",
      "R$ 280",
    ],
    cidades: [
      "São Paulo — Mooca",
      "Santo André — Centro",
      "Osasco",
      "São Paulo — Tatuapé",
      "Guarulhos — Jardim",
    ],
    publicadoEm: ["Hoje", "Ontem", "Há 3 dias", "Ontem", "Há 4 dias"],
    imagensOportunidade: [
      "https://img.freepik.com/fotos-gratis/homem-operando-equipamento-especial-de-limpeza-de-canteiro-de-obras_259150-57675.jpg?semt=ais_hybrid&w=740&q=80",
      "https://img.freepik.com/fotos-gratis/mulher-jovem-com-luvas-de-borracha-segurando-um-pano-e-material-de-limpeza-limpando-a-mesa-parecendo-confiante-na-luz-da-sala-de-estar_141793-101757.jpg?semt=ais_hybrid&w=740&q=80",
      "https://i.pinimg.com/originals/9b/1e/39/9b1e39df1692c93a96948db33e3e90ce.jpg",
      "https://media-cdn.tripadvisor.com/media/photo-s/18/d8/3a/a8/o-terraco-salao-de-festas.jpg",
      "https://preview.redd.it/living-room-rug-is-dirty-its-100-polyester-per-tag-v0-qafew8uexcyb1.jpg?width=640&crop=smart&auto=webp&s=2fb31d3d631a62855663e56676ef40bb75270e6e",
    ],
    solicitantesLabels: [undefined, undefined, undefined, undefined, undefined],
  },
  {
    profissao: "pedreiro",
    titulos: [
      "Rebocar parede da sala",
      "Chapisco e contrapiso em área externa",
      "Abrir vão para porta de correr",
      "Construir muro de divisa — 8 m",
      "Assentar piso porcelanato 60×60",
    ],
    resumos: [
      "Aprox. 25 m², preparação para pintura.",
      "12 m², precisa impermeabilização.",
      "Alvenaria com 15 cm, com acabamento.",
      "Com fundação e acabamento em massa.",
      "Sala 20 m², contrapiso já nivelado.",
    ],
    orcamentoLabels: [
      "Material incluso — orçar",
      "Até R$ 1.800",
      "R$ 900 – 1.200",
      "Sob consulta",
      "R$ 90/m²",
    ],
    cidades: [
      "São Paulo — Itaquera",
      "Taboão da Serra",
      "São Bernardo — Centro",
      "São Paulo — Penha",
      "São Caetano — Centro",
    ],
    publicadoEm: ["Hoje", "Ontem", "Há 4 dias", "Há 6 dias", "Ontem"],
    imagensOportunidade: [
      "https://eldoradomaterial.com.br/wp-content/uploads/2024/05/tijolo-6-furos-eldorado-material-materiais-de-construcao-sitio-cercado-xapinhal-curitiba-2.png",
      "https://eldoradomaterial.com.br/wp-content/uploads/2024/05/tijolo-6-furos-eldorado-material-materiais-de-construcao-sitio-cercado-xapinhal-curitiba-2.png",
      "https://eldoradomaterial.com.br/wp-content/uploads/2024/05/tijolo-6-furos-eldorado-material-materiais-de-construcao-sitio-cercado-xapinhal-curitiba-2.png",
      "https://eldoradomaterial.com.br/wp-content/uploads/2024/05/tijolo-6-furos-eldorado-material-materiais-de-construcao-sitio-cercado-xapinhal-curitiba-2.png",
      "https://eldoradomaterial.com.br/wp-content/uploads/2024/05/tijolo-6-furos-eldorado-material-materiais-de-construcao-sitio-cercado-xapinhal-curitiba-2.png",
    ],
    solicitantesLabels: [undefined, undefined, undefined, undefined, undefined],
  },
  {
    profissao: "encanador",
    titulos: [
      "Vazamento em registro do chuveiro",
      "Instalar torneira e sifão novos",
      "Desentupir ralo da lavanderia",
      "Trocar caixa acoplada e engate flexível",
      "Instalar aquecedor a gás",
    ],
    resumos: [
      "Apartamento, torneira gotejando há uma semana.",
      "Compras feitas pelo cliente; só instalação.",
      "Máquina de alta pressão se preciso.",
      "Banheiro social, vazamento leve na borracha.",
      "Ventilação conforme norma; ponto de gás existente.",
    ],
    orcamentoLabels: [
      "Até R$ 250",
      "R$ 180",
      "R$ 120 – 200",
      "R$ 320",
      "Até R$ 450",
    ],
    cidades: [
      "São Paulo — Perdizes",
      "Cotia — Granja Viana",
      "São Paulo — Butantã",
      "São Paulo — Moema",
      "São Paulo — Vila Prudente",
    ],
    publicadoEm: ["Hoje", "Ontem", "Há 2 dias", "Há 3 dias", "Hoje"],
    imagensOportunidade: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTid8314m_Cuujue8f3Wo_RvVrBNQb_6RMjcw&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTid8314m_Cuujue8f3Wo_RvVrBNQb_6RMjcw&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTid8314m_Cuujue8f3Wo_RvVrBNQb_6RMjcw&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTid8314m_Cuujue8f3Wo_RvVrBNQb_6RMjcw&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTid8314m_Cuujue8f3Wo_RvVrBNQb_6RMjcw&s",
    ],
    solicitantesLabels: [undefined, undefined, undefined, undefined, undefined],
  },
  {
    profissao: "pintor",
    titulos: [
      "Pintar 2 quartos + teto",
      "Pintura externa de muro — 40 m linear",
      "Acabamento fino sala integrada",
      "Pintar fachada com textura",
      "Restaurar móveis com laca",
    ],
    resumos: [
      "Massa corrida ok; cor já escolhida (branco gelo).",
      "Textura acrílica, duas demãos.",
      "Rodapés e cantos com fita; acabamento premium.",
      "Sobreamento, duas cores; preparação de emboço.",
      "Armário de cozinha e aparador; lixamento fino.",
    ],
    orcamentoLabels: [
      "R$ 28–32/m²",
      "Sob consulta",
      "Acima de R$ 4.000",
      "Sob consulta",
      "R$ 1.200 – 1.800",
    ],
    cidades: [
      "São Paulo — Santana",
      "Mauá — Centro",
      "Diadema — Centro",
      "São Bernardo — Rudge Ramos",
      "São Paulo — Vila Mariana",
    ],
    publicadoEm: ["Hoje", "Ontem", "Há 5 dias", "Há 1 semana", "Ontem"],
    imagensOportunidade: [
      "https://images.pexels.com/photos/221027/pexels-photo-221027.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop",
      "https://images.pexels.com/photos/221027/pexels-photo-221027.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop",
      "https://images.pexels.com/photos/221027/pexels-photo-221027.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop",
      "https://images.pexels.com/photos/221027/pexels-photo-221027.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop",
      "https://images.pexels.com/photos/221027/pexels-photo-221027.jpeg?auto=compress&cs=tinysrgb&w=640&h=800&fit=crop",
    ],
    solicitantesLabels: [undefined, undefined, undefined, undefined, undefined],
  },
];

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
  /** Imagem da oportunidade (mock: `BLOCOS_DEMANDA[].imagensOportunidade`; depois: upload). */
  imageUrl: string;
}

function montarDemandas(): DemandaServico[] {
  const lista: DemandaServico[] = [];
  for (const bloco of BLOCOS_DEMANDA) {
    const prefix = PREFIX_DEMANDA[bloco.profissao];
    for (let i = 0; i < 5; i++) {
      const n = i + 1;
      const sol = bloco.solicitantesLabels[i];
      const base: DemandaServico = {
        id: `d-${prefix}-${n}`,
        profissao: bloco.profissao,
        titulo: bloco.titulos[i],
        resumo: bloco.resumos[i],
        orcamentoLabel: bloco.orcamentoLabels[i],
        city: bloco.cidades[i],
        publicadoEm: bloco.publicadoEm[i],
        imageUrl: bloco.imagensOportunidade[i],
      };
      lista.push(
        sol !== undefined && sol !== ""
          ? { ...base, solicitanteLabel: sol }
          : base,
      );
    }
  }
  return lista;
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

export const MOCK_DEMANDAS: DemandaServico[] = montarDemandas();

/** Mapa opcional: profissão → lista (5 oportunidades mock por profissão). */
export const MOCK_DEMANDAS_POR_PROFISSAO: Record<
  ProfissaoSlug,
  DemandaServico[]
> = MOCK_DEMANDAS.reduce(
  (acc, d) => {
    if (!acc[d.profissao]) acc[d.profissao] = [];
    acc[d.profissao].push(d);
    return acc;
  },
  {} as Record<ProfissaoSlug, DemandaServico[]>,
);

/**
 * Pedidos de exemplo para «Os meus pedidos» (cliente).
 * Mesma forma que `DemandaCliente` em `AuthContext` — editável à mão até existir API.
 */
export type PedidoClienteListaMock = {
  id: string;
  titulo: string;
  resumo: string;
  profissao: ProfissaoSlug;
  orcamentoLabel: string;
  city: string;
  status: "pendente" | "atendida";
  criadaEm: number;
};

export const MOCK_PEDIDOS_CLIENTE: PedidoClienteListaMock[] = [
  {
    id: "mock-pc-1",
    titulo: "Rever tomadas na cozinha",
    resumo: "Quero 3 pontos novos com eletroduto embutido se possível.",
    profissao: "eletricista",
    orcamentoLabel: "Até R$ 600",
    city: "São Paulo — Vila Mariana",
    status: "pendente",
    criadaEm: 1_732_540_800_000,
  },
  {
    id: "mock-pc-2",
    titulo: "Faxina pós-mudança",
    resumo: "Apartamento 65 m², caixas ainda no chão.",
    profissao: "diarista",
    orcamentoLabel: "R$ 280 diária",
    city: "Santo André — Centro",
    status: "atendida",
    criadaEm: 1_731_763_200_000,
  },
  {
    id: "mock-pc-3",
    titulo: "Pintar hall e corredor",
    resumo: "Teto branco, paredes cinza claro — tinta já comprada.",
    profissao: "pintor",
    orcamentoLabel: "Sob consulta",
    city: "São Paulo — Santana",
    status: "pendente",
    criadaEm: 1_733_232_000_000,
  },
];

/**
 * Demandas já acertadas no chat para o profissional.
 * Estado editável em sessão: executada / não executada.
 */
export type DemandaAceitaProfissionalMock = {
  id: string;
  demandaClienteId?: string;
  titulo: string;
  resumo: string;
  profissao: ProfissaoSlug;
  imageUrl: string;
  city: string;
  clienteNome: string;
  combinadoNoChatEm: number;
  statusExecucao:
    | "nao_executada"
    | "aguardando_confirmacao_cliente"
    | "executada";
};

export const MOCK_DEMANDAS_ACEITAS_PROFISSIONAL: DemandaAceitaProfissionalMock[] = [
  {
    id: "mock-dap-1",
    demandaClienteId: "mock-pc-1",
    titulo: "Rever tomadas na cozinha",
    resumo: "Quero 3 pontos novos com eletroduto embutido se possível.",
    profissao: "eletricista",
    imageUrl: IMAGEM_CARD_PROFISSAO.eletricista,
    city: "São Paulo — Vila Mariana",
    clienteNome: "Maria Silva",
    combinadoNoChatEm: 1_734_009_600_000,
    statusExecucao: "nao_executada",
  },
  {
    id: "mock-dap-2",
    demandaClienteId: "mock-pc-2",
    titulo: "Faxina pós-mudança",
    resumo: "Apartamento 65 m², caixas ainda no chão.",
    profissao: "diarista",
    imageUrl: IMAGEM_CARD_PROFISSAO.diarista,
    city: "Santo André — Centro",
    clienteNome: "Maria Silva",
    combinadoNoChatEm: 1_733_664_000_000,
    statusExecucao: "aguardando_confirmacao_cliente",
  },
  {
    id: "mock-dap-3",
    demandaClienteId: "mock-pc-3",
    titulo: "Pintar hall e corredor",
    resumo: "Teto branco, paredes cinza claro — tinta já comprada.",
    profissao: "pintor",
    imageUrl: IMAGEM_CARD_PROFISSAO.pintor,
    city: "São Paulo — Santana",
    clienteNome: "Maria Silva",
    combinadoNoChatEm: 1_734_182_400_000,
    statusExecucao: "nao_executada",
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
