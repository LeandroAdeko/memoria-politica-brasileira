/**
 * Memória Política do Brasil — Base de Dados de Fatos Políticos, PECs, Escândalos e Grafo Relacional
 * Estrutura focada em:
 * 1. Tabela independente de categorias (EventCategory)
 * 2. Eventos autônomos como nós de grafo (PoliticalEvent)
 * 3. Arestas causais e de relacionamento entre eventos (EventRelationEdge)
 * 4. Atores políticos que apontam para os fatos com ano de início (ActorInvolvement)
 * 5. Fontes sempre com links diretos e verificáveis.
 */

export interface EventCategory {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

export const EVENT_CATEGORIES: EventCategory[] = [
  {
    id: 'pec',
    name: 'Proposta de Emenda Constitucional (PEC)',
    shortLabel: 'PEC & Constituição',
    description: 'Reformas e emendas constitucionais votadas com quórum qualificado no Congresso Nacional.',
    color: '#002776', // Azul cívico
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-900',
    badgeBorder: 'border-blue-200',
  },
  {
    id: 'escandalo',
    name: 'Escândalos & Operações de Repercussão',
    shortLabel: 'Escândalo / Operação',
    description: 'Investigações de fraudes financeiras, desvios orçamentários e ilícitos com repercussão institucional.',
    color: '#DC2626', // Vermelho alerta
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-900',
    badgeBorder: 'border-rose-200',
  },
  {
    id: 'cpi',
    name: 'Comissões Parlamentares de Inquérito (CPIs)',
    shortLabel: 'CPI / Investigação',
    description: 'Inquéritos parlamentares do Congresso para apurar fatos determinados com poderes judiciais.',
    color: '#D97706', // Âmbar
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-900',
    badgeBorder: 'border-amber-200',
  },
  {
    id: 'reforma_economica',
    name: 'Reformas Econômicas & Fiscais',
    shortLabel: 'Reforma Econômica',
    description: 'Leis estruturantes de tributação, gastos públicos, regime monetário e responsabilidade fiscal.',
    color: '#009c3b', // Verde
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-900',
    badgeBorder: 'border-emerald-200',
  },
  {
    id: 'crise_politica',
    name: 'Crises Institucionais & Impeachments',
    shortLabel: 'Crise Institucional',
    description: 'Conflitos entre poderes, processos de afastamento presidencial e rupturas políticas.',
    color: '#475569', // Slate
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-800',
    badgeBorder: 'border-slate-300',
  },
  {
    id: 'marco_regulatorio',
    name: 'Marcos Regulatórios & Privatizações',
    shortLabel: 'Marco Regulatório',
    description: 'Regulamentação de setores estratégicos, desestatizações e normas de concorrência.',
    color: '#7C3AED', // Roxo
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-900',
    badgeBorder: 'border-purple-200',
  },
];

export type EventRelationType =
  | 'consequence_of' // Desdobramento causal direto de um fato prévio
  | 'triggered_by' // O fato serviu de gatilho para outro
  | 'reaction_to' // Contra-medida ou reação política
  | 'replaces_or_amends' // Substitui, revoga ou altera medida anterior
  | 'part_of_scenario' // Integra um mesmo macro-cenário
  | 'investigates'; // Investigou o fato (ex: CPI investiga Escândalo)

export interface EventRelationEdge {
  targetEventId: string;
  relationType: EventRelationType;
  description: string;
}

export interface PoliticianVoteRecord {
  actorId?: string; // ID do ator político caso cadastrado na base
  politicianName: string;
  party: string;
  state: string; // Sigla UF (ex: 'SP', 'RJ', 'MG', 'BA', 'RS', etc.)
  house: 'Câmara dos Deputados' | 'Senado Federal';
  round: '1º Turno' | '2º Turno';
  vote: 'SIM' | 'NÃO' | 'ABSTENÇÃO' | 'OBSTRUÇÃO' | 'AUSENTE';
  notes?: string; // Contexto, declaração ou justificativa do parlamentar
  officialVoteUrl: string; // LINK OBRIGATÓRIO da ata / portal da Câmara ou Senado
}

export interface PartyVoteSummary {
  party: string;
  guidance: 'SIM' | 'NÃO' | 'LIBERADO' | 'OBSTRUÇÃO';
  yesVotes: number;
  noVotes: number;
  abstentions?: number;
  totalVotes: number;
  orientationNotes?: string;
}

export interface LegislativeDetails {
  officialCode: string;
  promulgatedLaw?: string;
  keyArticlesSummary: string[];
  houseVotes?: {
    house: 'Câmara dos Deputados' | 'Senado Federal';
    round: '1º Turno' | '2º Turno';
    yesVotes: number;
    noVotes: number;
    abstentions: number;
    quorum: number;
    result: 'Aprovado' | 'Rejeitado';
  }[];
  partyBreakdown?: PartyVoteSummary[];
  individualVotes?: PoliticianVoteRecord[];
}

export interface InvestigationDetails {
  investigatingBodies: string[];
  estimatedFinancialImpact?: string;
  legalOutcome?: string;
}

export interface EventSource {
  title: string;
  publisher: string;
  url: string; // LINK SEMPRE OBRIGATÓRIO
}

export interface PoliticalEvent {
  id: string;
  title: string;
  shortTitle: string;
  categoryIds: string[]; // Tabela de categorias N:N
  year: number;
  date?: string;
  summary: string;
  keyPoints: string[]; // Pontos mais relevantes da matéria
  scenarioId?: string;
  legislativeDetails?: LegislativeDetails;
  investigationDetails?: InvestigationDetails;
  relatedEventEdges: EventRelationEdge[]; // Arestas no grafo
  impactedIndicatorIds: string[]; // Indicadores socioeconômicos correlacionados
  sources: EventSource[];
}

export interface MacroScenario {
  id: string;
  title: string;
  period: string;
  description: string;
  eventIds: string[];
}

export const MACRO_SCENARIOS: MacroScenario[] = [
  {
    id: 'ciclo-reformas-fiscais',
    title: 'Ciclo de Reformas Fiscais e Constitucionais (2016–2023)',
    period: '2016–2023',
    description:
      'Sucessão de emendas constitucionais com o objetivo de reordenar as despesas públicas, previdência e o sistema de tributação sobre o consumo.',
    eventIds: ['pec-teto-gastos-2016', 'pec-previdencia-2019', 'pec-reforma-tributaria-2023'],
  },
  {
    id: 'investigacoes-e-crises-institucionais',
    title: 'Grandes Inquéritos e Crises de Governabilidade',
    period: '2005–2021',
    description:
      'Cadeia de escândalos, comissões de inquérito e processos judiciais que transformaram as relações entre Executivo, Legislativo e Judiciário.',
    eventIds: ['mensalao-2005', 'cpi-correios-2005', 'petrolao-lava-jato-2014', 'cpi-pandemia-2021'],
  },
  {
    id: 'sistema-financeiro-e-marcos',
    title: 'Regulação do Sistema Financeiro e Fraudes Bancárias',
    period: '2020–2024',
    description:
      'Atuações dos órgãos reguladores (Banco Central e CVM) na fiscalização bancária e casos recentes de liquidação e fraudes de crédito.',
    eventIds: ['caso-banco-master-liquidacoes-2024', 'marco-legal-cambio-2021'],
  },
];

export const POLITICAL_EVENTS: PoliticalEvent[] = [
  {
    id: 'pec-teto-gastos-2016',
    title: 'PEC do Teto de Gastos Públicos (PEC 241/55 -> EC 95)',
    shortTitle: 'Teto de Gastos (EC 95)',
    categoryIds: ['pec', 'reforma_economica'],
    year: 2016,
    date: '2016-12-15',
    summary:
      'Instituiu o Novo Regime Fiscal congelando o crescimento das despesas primárias da União à variação do IPCA por 20 anos, visando estancar a crise da dívida pública.',
    keyPoints: [
      'Limite individualizado para os orçamentos do Executivo, Legislativo, Judiciário, MPU e DPU.',
      'Despesas correntes reajustadas estritamente pelo IPCA acumulado em 12 meses.',
      'Gatilhos de contenção em caso de descumprimento (proibição de concursos, reajustes salariais e incentivos fiscais).',
      'Piso de saúde e educação atrelado ao valor mínimo corrigido por inflação.',
    ],
    scenarioId: 'ciclo-reformas-fiscais',
    legislativeDetails: {
      officialCode: 'PEC 241/2016 (Câmara) / PEC 55/2016 (Senado)',
      promulgatedLaw: 'Emenda Constitucional nº 95/2016',
      keyArticlesSummary: [
        'Art. 106 do ADCT: Vigência fixada em vinte exercícios financeiros.',
        'Art. 107 do ADCT: Limite anual correspondente ao limite do ano anterior corrigido pelo IPCA.',
        'Art. 109 do ADCT: Vedações automáticas na hipótese de superação do limite de gastos.',
      ],
      houseVotes: [
        {
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          yesVotes: 359,
          noVotes: 116,
          abstentions: 2,
          quorum: 477,
          result: 'Aprovado',
        },
        {
          house: 'Senado Federal',
          round: '2º Turno',
          yesVotes: 53,
          noVotes: 16,
          abstentions: 0,
          quorum: 69,
          result: 'Aprovado',
        },
      ],
      partyBreakdown: [
        {
          party: 'MDB (PMDB)',
          guidance: 'SIM',
          yesVotes: 61,
          noVotes: 1,
          abstentions: 1,
          totalVotes: 63,
          orientationNotes: 'Partido do presidente Michel Temer; principal sustentação do Novo Regime Fiscal.',
        },
        {
          party: 'PSDB',
          guidance: 'SIM',
          yesVotes: 47,
          noVotes: 0,
          abstentions: 0,
          totalVotes: 47,
          orientationNotes: 'Votação unânime a favor da contenção do endividamento público.',
        },
        {
          party: 'DEM (Democratas)',
          guidance: 'SIM',
          yesVotes: 29,
          noVotes: 0,
          abstentions: 0,
          totalVotes: 29,
          orientationNotes: 'Liderado por Rodrigo Maia, que conduziu as votações na presidência da Câmara.',
        },
        {
          party: 'PP (Progressistas)',
          guidance: 'SIM',
          yesVotes: 42,
          noVotes: 2,
          abstentions: 0,
          totalVotes: 44,
          orientationNotes: 'Apoio massivo da bancada governista.',
        },
        {
          party: 'PR (atual PL)',
          guidance: 'SIM',
          yesVotes: 35,
          noVotes: 2,
          abstentions: 0,
          totalVotes: 37,
          orientationNotes: 'Bancada do PR votou fortemente favorável ao Teto de Gastos.',
        },
        {
          party: 'PT',
          guidance: 'NÃO',
          yesVotes: 0,
          noVotes: 57,
          abstentions: 0,
          totalVotes: 57,
          orientationNotes: 'Oposição frontal; 100% dos votos contrários sob argumento de desmonte da saúde e educação.',
        },
        {
          party: 'PDT',
          guidance: 'NÃO',
          yesVotes: 0,
          noVotes: 18,
          abstentions: 0,
          totalVotes: 18,
          orientationNotes: 'Votação unânime contrária ao congelamento de gastos públicos.',
        },
        {
          party: 'PSOL',
          guidance: 'NÃO',
          yesVotes: 0,
          noVotes: 6,
          abstentions: 0,
          totalVotes: 6,
          orientationNotes: 'Votação contrária e obstrução sistemática em plenário.',
        },
        {
          party: 'PCdoB',
          guidance: 'NÃO',
          yesVotes: 0,
          noVotes: 12,
          abstentions: 0,
          totalVotes: 12,
          orientationNotes: 'Bancada unida contra o Novo Regime Fiscal.',
        },
      ],
      individualVotes: [
        {
          actorId: 'rodrigo-maia',
          politicianName: 'Rodrigo Maia',
          party: 'DEM',
          state: 'RJ',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Presidente da Câmara dos Deputados; conduziu a aprovação célere da PEC 241 no plenário.',
          officialVoteUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2088351',
        },
        {
          actorId: 'arthur-lira',
          politicianName: 'Arthur Lira',
          party: 'PP',
          state: 'AL',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Deputado federal e liderança da bancada do PP; votou a favor da emenda constitucional.',
          officialVoteUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2088351',
        },
        {
          actorId: 'gleisi-hoffmann',
          politicianName: 'Gleisi Hoffmann',
          party: 'PT',
          state: 'PR',
          house: 'Senado Federal',
          round: '2º Turno',
          vote: 'NÃO',
          notes: 'Senadora da República na época; líder da resistência no Senado contra a PEC 55.',
          officialVoteUrl: 'https://legis.senado.leg.br/materia/127337',
        },
        {
          actorId: 'renan-calheiros',
          politicianName: 'Renan Calheiros',
          party: 'MDB',
          state: 'AL',
          house: 'Senado Federal',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Presidente do Senado Federal; pautou e presidiu a sessão solene de promulgação da EC 95.',
          officialVoteUrl: 'https://legis.senado.leg.br/materia/127337',
        },
        {
          actorId: 'aecio-neves',
          politicianName: 'Aécio Neves',
          party: 'PSDB',
          state: 'MG',
          house: 'Senado Federal',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Presidente nacional do PSDB e senador; discursou em defesa da âncora fiscal contra a inflação.',
          officialVoteUrl: 'https://legis.senado.leg.br/materia/127337',
        },
        {
          actorId: 'jair-bolsonaro',
          politicianName: 'Jair Bolsonaro',
          party: 'PSC',
          state: 'RJ',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Deputado federal na época; registrou voto favorável à PEC 241 no plenário da Câmara.',
          officialVoteUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2088351',
        },
        {
          actorId: 'eduardo-bolsonaro',
          politicianName: 'Eduardo Bolsonaro',
          party: 'PSC',
          state: 'SP',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Deputado federal; votou a favor da contenção do crescimento dos gastos públicos.',
          officialVoteUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2088351',
        },
        {
          actorId: 'lindbergh-farias',
          politicianName: 'Lindbergh Farias',
          party: 'PT',
          state: 'RJ',
          house: 'Senado Federal',
          round: '2º Turno',
          vote: 'NÃO',
          notes: 'Líder da bancada petista no Senado; questionou a constitucionalidade da matéria no STF.',
          officialVoteUrl: 'https://legis.senado.leg.br/materia/127337',
        },
      ],
    },
    relatedEventEdges: [
      {
        targetEventId: 'petrolao-lava-jato-2014',
        relationType: 'reaction_to',
        description:
          'Proposta elaborada em resposta à recessão de 2015-2016 e à paralisia fiscal desencadeada pela crise política e pela Lava Jato.',
      },
      {
        targetEventId: 'pec-reforma-tributaria-2023',
        relationType: 'part_of_scenario',
        description: 'Compõe o ciclo de reformas constitucionais de reestruturação do Estado brasileiro.',
      },
    ],
    impactedIndicatorIds: ['inflation', 'gdp_growth', 'minimum_wage'],
    sources: [
      {
        title: 'Tramitação da PEC 241/2016 no Portal da Câmara dos Deputados',
        publisher: 'Câmara dos Deputados',
        url: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2088351',
      },
      {
        title: 'Texto Promulgado da Emenda Constitucional nº 95/2016',
        publisher: 'Planalto / Diário Oficial da União',
        url: 'https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc95.htm',
      },
    ],
  },
  {
    id: 'pec-reforma-tributaria-2023',
    title: 'Reforma Tributária sobre o Consumo (PEC 45/2019 -> EC 132)',
    shortTitle: 'Reforma Tributária (EC 132)',
    categoryIds: ['pec', 'reforma_economica'],
    year: 2023,
    date: '2023-12-20',
    summary:
      'Histórica simplificação do sistema tributário brasileiro após três décadas de debate, unificando 5 impostos cumulativos no modelo de IVA Dual.',
    keyPoints: [
      'Unificação de PIS, Cofins e IPI (tributos federais) na Contribuição sobre Bens e Serviços (CBS).',
      'Unificação de ICMS (estadual) e ISS (municipal) no Imposto sobre Bens e Serviços (IBS).',
      'Tributação no destino (onde a mercadoria é consumida), acabando com a guerra fiscal entre estados.',
      'Criação da Cesta Básica Nacional de Alimentos com alíquota zero.',
      'Mecanismo de Cashback social devolvendo parte dos tributos pagos por famílias inscritas no CadÚnico.',
    ],
    scenarioId: 'ciclo-reformas-fiscais',
    legislativeDetails: {
      officialCode: 'PEC 45/2019 (Câmara) / PEC 45/2023 (Senado)',
      promulgatedLaw: 'Emenda Constitucional nº 132/2023',
      keyArticlesSummary: [
        'Art. 156-A da CF: Instituição do IBS por lei complementar sob competência compartilhada de estados e municípios.',
        'Art. 195, V da CF: Criação da CBS federal de incidência ampla e não cumulativa.',
        'Art. 153, VIII da CF: Criação do Imposto Seletivo sobre produtos prejudiciais à saúde ou ao meio ambiente.',
      ],
      houseVotes: [
        {
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          yesVotes: 365,
          noVotes: 118,
          abstentions: 0,
          quorum: 483,
          result: 'Aprovado',
        },
        {
          house: 'Senado Federal',
          round: '2º Turno',
          yesVotes: 53,
          noVotes: 24,
          abstentions: 0,
          quorum: 77,
          result: 'Aprovado',
        },
      ],
      partyBreakdown: [
        {
          party: 'PT (Federação Brasil da Esperança)',
          guidance: 'SIM',
          yesVotes: 68,
          noVotes: 0,
          abstentions: 0,
          totalVotes: 68,
          orientationNotes: 'Votação unânime favorável da base governista com articulação de Fernando Haddad e Gleisi Hoffmann.',
        },
        {
          party: 'PL (Partido Liberal)',
          guidance: 'NÃO',
          yesVotes: 20,
          noVotes: 75,
          abstentions: 0,
          totalVotes: 95,
          orientationNotes: 'Divisão pública na oposição: apesar da orientação contrária de Jair Bolsonaro, 20 deputados votaram a favor.',
        },
        {
          party: 'União Brasil',
          guidance: 'SIM',
          yesVotes: 59,
          noVotes: 0,
          abstentions: 0,
          totalVotes: 59,
          orientationNotes: 'Apoio integral do centro com negociação de fundos de desenvolvimento regional.',
        },
        {
          party: 'PP (Progressistas)',
          guidance: 'SIM',
          yesVotes: 40,
          noVotes: 7,
          abstentions: 0,
          totalVotes: 47,
          orientationNotes: 'Condução decisiva pelo presidente da Câmara Arthur Lira e pelo relator Aguinaldo Ribeiro.',
        },
        {
          party: 'MDB',
          guidance: 'SIM',
          yesVotes: 38,
          noVotes: 2,
          abstentions: 0,
          totalVotes: 40,
          orientationNotes: 'Partido do autor originário da proposta (Baleia Rossi), engajado na simplificação tributária.',
        },
        {
          party: 'PSD',
          guidance: 'SIM',
          yesVotes: 40,
          noVotes: 2,
          abstentions: 0,
          totalVotes: 42,
          orientationNotes: 'Alinhamento expressivo em diálogo com governadores estaduais e prefeitos.',
        },
        {
          party: 'Republicanos',
          guidance: 'SIM',
          yesVotes: 36,
          noVotes: 3,
          abstentions: 0,
          totalVotes: 39,
          orientationNotes: 'Apoio massivo após o acordo público entre o governador Tarcísio de Freitas e o Ministério da Fazenda.',
        },
        {
          party: 'PSB',
          guidance: 'SIM',
          yesVotes: 14,
          noVotes: 0,
          abstentions: 0,
          totalVotes: 14,
          orientationNotes: 'Votação 100% favorável destacando a tributação do consumo no destino.',
        },
        {
          party: 'PDT',
          guidance: 'SIM',
          yesVotes: 17,
          noVotes: 1,
          abstentions: 0,
          totalVotes: 18,
          orientationNotes: 'Bancada majoritariamente favorável.',
        },
        {
          party: 'PSOL / REDE',
          guidance: 'SIM',
          yesVotes: 14,
          noVotes: 0,
          abstentions: 0,
          totalVotes: 14,
          orientationNotes: 'Voto a favor condicionado e obtido pela inclusão da cesta básica com alíquota zero e do cashback social.',
        },
        {
          party: 'NOVO',
          guidance: 'NÃO',
          yesVotes: 1,
          noVotes: 3,
          abstentions: 0,
          totalVotes: 4,
          orientationNotes: 'Votação contrária fundamentada na incerteza da alíquota final e temor de aumento de carga global.',
        },
        {
          party: 'PSDB / Cidadania',
          guidance: 'SIM',
          yesVotes: 14,
          noVotes: 2,
          abstentions: 0,
          totalVotes: 16,
          orientationNotes: 'Apoio à simplificação do sistema tributário nacional.',
        },
      ],
      individualVotes: [
        {
          actorId: 'arthur-lira',
          politicianName: 'Arthur Lira',
          party: 'PP',
          state: 'AL',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Desceu da cadeira da presidência da Câmara dos Deputados e foi à tribuna proferir voto enfático a favor da aprovação.',
          officialVoteUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
        },
        {
          actorId: 'baleia-rossi',
          politicianName: 'Baleia Rossi',
          party: 'MDB',
          state: 'SP',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Autor originário da PEC 45/2019, articulou a construção do texto base com o Centro de Cidadania Fiscal (CCiF).',
          officialVoteUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
        },
        {
          actorId: 'aguinaldo-ribeiro',
          politicianName: 'Aguinaldo Ribeiro',
          party: 'PP',
          state: 'PB',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Relator da matéria no plenário da Câmara, redigiu os substitutivos com a transição federativa e a cesta básica.',
          officialVoteUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
        },
        {
          actorId: 'gleisi-hoffmann',
          politicianName: 'Gleisi Hoffmann',
          party: 'PT',
          state: 'PR',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Presidenta nacional do PT e deputada federal; defendeu a justiça tributária, cashback e alívio para os mais pobres.',
          officialVoteUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
        },
        {
          actorId: 'zeca-dirceu',
          politicianName: 'Zeca Dirceu',
          party: 'PT',
          state: 'PR',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Líder da bancada do PT na Câmara, coordenou a presença e a unanimidade de 68 votos a favor.',
          officialVoteUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
        },
        {
          actorId: 'nikolas-ferreira',
          politicianName: 'Nikolas Ferreira',
          party: 'PL',
          state: 'MG',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'NÃO',
          notes: 'Votou contra alinhado à orientação da bancada de oposição, apontando riscos de aumento da alíquota final do IVA.',
          officialVoteUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
        },
        {
          actorId: 'eduardo-bolsonaro',
          politicianName: 'Eduardo Bolsonaro',
          party: 'PL',
          state: 'SP',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'NÃO',
          notes: 'Voto contrário em estrita consonância com as orientações do ex-presidente Jair Bolsonaro.',
          officialVoteUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
        },
        {
          actorId: 'bia-kicis',
          politicianName: 'Bia Kicis',
          party: 'PL',
          state: 'DF',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'NÃO',
          notes: 'Líder da Minoria na Câmara; criticou no plenário a criação do Conselho Federativo e a rapidez da votação.',
          officialVoteUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
        },
        {
          actorId: 'yury-do-paredao',
          politicianName: 'Yury do Paredão',
          party: 'PL',
          state: 'CE',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Um dos 20 parlamentares do PL que divergiram da orientação partidária e votaram a favor da Reforma.',
          officialVoteUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
        },
        {
          actorId: 'tabata-amaral',
          politicianName: 'Tabata Amaral',
          party: 'PSB',
          state: 'SP',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Defendeu enfaticamente o fim da cumulatividade, o cashback para famílias vulneráveis e a transparência fiscal.',
          officialVoteUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
        },
        {
          actorId: 'aecio-neves',
          politicianName: 'Aécio Neves',
          party: 'PSDB',
          state: 'MG',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Votou a favor da simplificação tributária, registrando a necessidade de aperfeiçoamentos nas alíquotas no Senado.',
          officialVoteUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
        },
        {
          actorId: 'marcel-van-hattem',
          politicianName: 'Marcel van Hattem',
          party: 'NOVO',
          state: 'RS',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'NÃO',
          notes: 'Principal voz contrária no debate de plenário, sustentou que o modelo do IVA aumentará impostos sobre o setor de serviços.',
          officialVoteUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
        },
        {
          actorId: 'guilherme-boulos',
          politicianName: 'Guilherme Boulos',
          party: 'PSOL',
          state: 'SP',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Apoiou o texto final após a inclusão de imposto seletivo e da garantia expressa de alíquota zero para itens da cesta básica.',
          officialVoteUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
        },
        {
          actorId: 'kim-kataguiri',
          politicianName: 'Kim Kataguiri',
          party: 'União Brasil',
          state: 'SP',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Votou a favor do texto base na Câmara com defesa do fim da burocracia de emissão de notas e declarações.',
          officialVoteUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
        },
        {
          actorId: 'carlos-zarattini',
          politicianName: 'Carlos Zarattini',
          party: 'PT',
          state: 'SP',
          house: 'Câmara dos Deputados',
          round: '2º Turno',
          vote: 'SIM',
          notes: 'Membro titular do grupo de trabalho da Reforma Tributária na Câmara.',
          officialVoteUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
        },
      ],
    },
    relatedEventEdges: [
      {
        targetEventId: 'pec-teto-gastos-2016',
        relationType: 'replaces_or_amends',
        description:
          'Adequou as regras orçamentárias constitucionais pós-teto criando novas bases de arrecadação e eficiência de produtividade.',
      },
    ],
    impactedIndicatorIds: ['gdp_growth', 'inflation', 'hunger'],
    sources: [
      {
        title: 'Tramitação da Reforma Tributária (PEC 45/2019)',
        publisher: 'Congresso Nacional / Câmara dos Deputados',
        url: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2196833',
      },
      {
        title: 'Publicação da Emenda Constitucional nº 132/2023',
        publisher: 'Imprensa Nacional / DOU',
        url: 'https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm',
      },
    ],
  },
  {
    id: 'mensalao-2005',
    title: 'Escândalo do Mensalão e Ação Penal 470',
    shortTitle: 'Escândalo do Mensalão',
    categoryIds: ['escandalo', 'crise_politica'],
    year: 2005,
    date: '2005-06-06',
    summary:
      'Esquema de compra de apoio parlamentar e pagamento periódico de mesadas a deputados federais de partidos da base aliada no Congresso Nacional.',
    keyPoints: [
      'Denúncias públicas feitas pelo deputado federal Roberto Jefferson em entrevista à Folha de S.Paulo.',
      'Uso de recursos de contratos de publicidade estatal (Visanet/Banco do Brasil) repassados por agências de publicidade.',
      'Instauração da Ação Penal 470 no Supremo Tribunal Federal que condenou ministros de Estado, banqueiros e parlamentares.',
      'Consolidação de novas jurisprudências contra corrupção passiva e lavagem de dinheiro no Judiciário.',
    ],
    scenarioId: 'investigacoes-e-crises-institucionais',
    investigationDetails: {
      investigatingBodies: ['Polícia Federal', 'Ministério Público Federal / PGR', 'Supremo Tribunal Federal'],
      estimatedFinancialImpact: 'R$ 101 milhões (valores da época movimentados no esquema)',
      legalOutcome:
        'Julgamento histórico do STF concluído em 2012 com 25 réus condenados, incluindo José Dirceu, José Genoino, Marcos Valério e Roberto Jefferson.',
    },
    relatedEventEdges: [
      {
        targetEventId: 'cpi-correios-2005',
        relationType: 'triggered_by',
        description: 'As denúncias do Mensalão levaram diretamente à criação da CPI dos Correios no Congresso Nacional.',
      },
      {
        targetEventId: 'petrolao-lava-jato-2014',
        relationType: 'part_of_scenario',
        description:
          'Antecedente do modelo de investigação e cooperação judicial posteriormente aprofundado na Operação Lava Jato.',
      },
    ],
    impactedIndicatorIds: ['gdp_growth', 'unemployment'],
    sources: [
      {
        title: 'Acórdão do Julgamento da Ação Penal 470 (Mensalão)',
        publisher: 'Supremo Tribunal Federal (STF)',
        url: 'https://portal.stf.jus.br/processos/detalhe.asp?incidente=2538118',
      },
      {
        title: 'Memória da Cobertura e Inquérito do Mensalão',
        publisher: 'Ministério Público Federal',
        url: 'https://www.mpf.mp.br',
      },
    ],
  },
  {
    id: 'cpi-correios-2005',
    title: 'Comissão Parlamentar Mista de Inquérito dos Correios',
    shortTitle: 'CPI dos Correios',
    categoryIds: ['cpi', 'escandalo'],
    year: 2005,
    date: '2005-06-09',
    summary:
      'CPMI instaurada no Congresso Nacional após gravação em vídeo de flagrante de propina na Empresa Brasileira de Correios e Telégrafos, desaguando na apuração do Mensalão.',
    keyPoints: [
      'Quebra de sigilos bancários e fiscais de dezenas de empresas e agentes políticos.',
      'Identificação de repasses de recursos públicos para campanhas eleitorais não declaradas ("caixa 2").',
      'Relatório final aprovado recomendando o indiciamento de mais de 100 pessoas.',
      'Cassação do mandato de parlamentares e renúncia de lideranças do governo.',
    ],
    scenarioId: 'investigacoes-e-crises-institucionais',
    investigationDetails: {
      investigatingBodies: ['Senado Federal e Câmara dos Deputados (CPMI Mista)'],
      legalOutcome:
        'Relatório de 2.700 páginas aprovado em abril de 2006, cujas provas fundamentaram a denúncia da PGR na AP 470.',
    },
    relatedEventEdges: [
      {
        targetEventId: 'mensalao-2005',
        relationType: 'investigates',
        description: 'A CPI investigou formalmente a estrutura de repasses financeiros e votos no Congresso.',
      },
    ],
    impactedIndicatorIds: ['gdp_growth'],
    sources: [
      {
        title: 'Relatório Final da CPMI dos Correios',
        publisher: 'Senado Federal',
        url: 'https://www.senado.leg.br/atividade/comissoes/comissao.asp?origem=CN&com=794',
      },
    ],
  },
  {
    id: 'petrolao-lava-jato-2014',
    title: 'Operação Lava Jato e Desvios na Petrobras ("Petrolão")',
    shortTitle: 'Operação Lava Jato',
    categoryIds: ['escandalo', 'crise_politica'],
    year: 2014,
    date: '2014-03-17',
    summary:
      'Maior investigação sobre corrupção e lavagem de dinheiro da história do país, apurando cartel de empreiteiras e desvios bilionários na Petrobras e contratos públicos.',
    keyPoints: [
      'Uso pioneiro sistemático da Lei das Organizações Criminosas (Lei 12.850/2013) com acordos de colaboração premiada.',
      'Desvios sistemáticos de 1% a 5% dos contratos da Petrobras direcionados a partidos políticos e diretores cooptados.',
      'Bloqueio e repatriação de mais de R$ 6 bilhões aos cofres públicos e Petrobras.',
      'Desencadeou profunda instabilidade institucional, prisão de grandes empresários e de líderes dos três poderes.',
    ],
    scenarioId: 'investigacoes-e-crises-institucionais',
    investigationDetails: {
      investigatingBodies: ['Polícia Federal', 'Força-Tarefa MPF', 'Justiça Federal de Curitiba', 'STF'],
      estimatedFinancialImpact: 'R$ 42,8 bilhões em valores totais apurados em corrupção e perdas financeiras',
      legalOutcome:
        'Mais de 70 fases ostensivas, centenas de condenações em 1ª e 2ª instâncias e posteriores anulações processuais pelo STF por competência de jurisdição e imparcialidade.',
    },
    relatedEventEdges: [
      {
        targetEventId: 'pec-teto-gastos-2016',
        relationType: 'triggered_by',
        description:
          'O choque econômico e a paralisia do setor de óleo e gás agravaram a recessão de 2015-2016 que exigiu a aprovação do Teto de Gastos.',
      },
    ],
    impactedIndicatorIds: ['gdp_growth', 'unemployment', 'inflation'],
    sources: [
      {
        title: 'Página Oficial e Balanço dos Resultados da Operação Lava Jato',
        publisher: 'Ministério Público Federal',
        url: 'https://www.mpf.mp.br/grandes-casos/lava-jato',
      },
      {
        title: 'Balanço Patrimonial e Acordos de Leniência da Petrobras',
        publisher: 'Petróleo Brasileiro S.A. (Petrobras)',
        url: 'https://investidorpetrobras.com.br',
      },
    ],
  },
  {
    id: 'cpi-pandemia-2021',
    title: 'Comissão Parlamentar de Inquérito da Pandemia de COVID-19',
    shortTitle: 'CPI da Pandemia',
    categoryIds: ['cpi', 'crise_politica'],
    year: 2021,
    date: '2021-04-27',
    summary:
      'CPI instaurada no Senado Federal para investigar ações, omissões e contratos do governo federal e destinação de verbas federais aos estados durante a emergência da COVID-19.',
    keyPoints: [
      'Investigação das negociações de compra de vacinas (Covaxin, Pfizer e Coronavac) e suspeitas de superfaturamento.',
      'Apurou a crise de desabastecimento de oxigênio hospitalar em Manaus no início de 2021.',
      'Análise de campanhas de tratamento precoce com medicamentos sem eficácia comprovada.',
      'Mais de 60 reuniões transmitidas ao vivo com impacto de opinião pública internacional.',
    ],
    scenarioId: 'investigacoes-e-crises-institucionais',
    investigationDetails: {
      investigatingBodies: ['Senado Federal (CPI da Pandemia)'],
      legalOutcome:
        'Relatório final do senador Renan Calheiros aprovado em outubro de 2021, com pedido de indiciamento de 80 pessoas (incluindo o presidente da República e ministros de Estado).',
    },
    relatedEventEdges: [
      {
        targetEventId: 'petrolao-lava-jato-2014',
        relationType: 'part_of_scenario',
        description: 'Exemplo de inquérito parlamentar de grande repercussão nacional com impacto eleitoral.',
      },
    ],
    impactedIndicatorIds: ['life_expectancy', 'infant_mortality'],
    sources: [
      {
        title: 'Relatório Final da CPI da Pandemia no Senado Federal',
        publisher: 'Senado Federal',
        url: 'https://legis.senado.leg.br/comissoes/comissao?codcol=2441',
      },
    ],
  },
  {
    id: 'caso-banco-master-liquidacoes-2024',
    title: 'Fiscalização e Fraudes no Sistema Financeiro: Caso Banco Master & Liquidações',
    shortTitle: 'Caso Banco Master & Fraudes',
    categoryIds: ['escandalo', 'reforma_economica'],
    year: 2024,
    date: '2024-05-10',
    summary:
      'Investigações e auditorias do Banco Central do Brasil e órgãos de controle sobre emissão atípica de Certificados de Depósito Bancário (CDBs), compra de carteiras de crédito podre e governança de liquidez bancária.',
    keyPoints: [
      'Apuração de práticas de captação com juros muito acima da taxa Selic de mercado cobertos pelo Fundo Garantidor de Créditos (FGC).',
      'Operações de cessão de direitos creditórios e concentração de ativos de alto risco.',
      'Envolvimento de consultorias, escritórios e fundos de investimento com vínculos políticos e judiciais.',
      'Reforço nas diretrizes de prudência bancária e exigência de capital mínimo pelo Banco Central.',
    ],
    scenarioId: 'sistema-financeiro-e-marcos',
    investigationDetails: {
      investigatingBodies: ['Banco Central do Brasil (Bacen)', 'Comissão de Valores Mobiliários (CVM)', 'Polícia Federal'],
      estimatedFinancialImpact: 'Carteiras sob escrutínio de mais de R$ 30 bilhões em ativos e depósitos',
      legalOutcome:
        'Abertura de processos administrativos sancionadores pelo Bacen e CVM para verificação de responsabilidades de administradores.',
    },
    relatedEventEdges: [
      {
        targetEventId: 'pec-reforma-tributaria-2023',
        relationType: 'part_of_scenario',
        description: 'Contexto de ajuste institucional e modernização das regras de conformidade e integridade financeira.',
      },
    ],
    impactedIndicatorIds: ['gdp_growth', 'inflation'],
    sources: [
      {
        title: 'Relatório de Estabilidade Financeira e Fiscalização Prudencial',
        publisher: 'Banco Central do Brasil',
        url: 'https://www.bcb.gov.br/publicacoes/ref',
      },
      {
        title: 'Processos Sancionadores e Alertas ao Mercado',
        publisher: 'Comissão de Valores Mobiliários (CVM)',
        url: 'https://www.gov.br/cvm/pt-br',
      },
    ],
  },
];

/**
 * Atores Políticos (Políticos, Partidos e Instituições)
 * Os fatos NÃO estão ligados a pessoas; são os atores que apontam para os fatos,
 * informando o ano em que começaram a se envolver e seu papel.
 */
export interface ActorInvolvement {
  eventId: string;
  startYear: number; // Ano em que o ator começou a se envolver
  endYear?: number;
  role:
    | 'author'
    | 'rapporteur'
    | 'voted_for'
    | 'voted_against'
    | 'party_guidance'
    | 'investigated'
    | 'whistleblower'
    | 'president_in_office'
    | 'sanctioned_by';
  roleLabel: string;
  notes?: string;
  sourceUrl: string; // LINK OBRIGATÓRIO
}

export interface PoliticalActor {
  id: string;
  name: string;
  type: 'politician' | 'party' | 'institution';
  party?: string;
  involvements: ActorInvolvement[];
}

export const POLITICAL_ACTORS: PoliticalActor[] = [
  {
    id: 'michel-temer',
    name: 'Michel Temer',
    type: 'politician',
    party: 'MDB',
    involvements: [
      {
        eventId: 'pec-teto-gastos-2016',
        startYear: 2016,
        endYear: 2016,
        role: 'author',
        roleLabel: 'Propositor do Novo Regime Fiscal',
        notes: 'Enviou a proposta como prioridade máxima de ajuste das contas de seu governo.',
        sourceUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2088351',
      },
      {
        eventId: 'pec-teto-gastos-2016',
        startYear: 2016,
        endYear: 2016,
        role: 'sanctioned_by',
        roleLabel: 'Promulgação em sessão solene do Congresso',
        notes: 'Presente à promulgação da Emenda Constitucional 95.',
        sourceUrl: 'https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc95.htm',
      },
    ],
  },
  {
    id: 'henrique-meirelles',
    name: 'Henrique Meirelles',
    type: 'politician',
    party: 'MDB / PSD',
    involvements: [
      {
        eventId: 'pec-teto-gastos-2016',
        startYear: 2016,
        endYear: 2018,
        role: 'author',
        roleLabel: 'Ministro da Fazenda / Articulador',
        notes: 'Co-autor técnico da regra do Teto de Gastos à frente do Ministério da Fazenda.',
        sourceUrl: 'https://www.gov.br/fazenda/pt-br',
      },
    ],
  },
  {
    id: 'fernando-haddad',
    name: 'Fernando Haddad',
    type: 'politician',
    party: 'PT',
    involvements: [
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2023,
        endYear: 2023,
        role: 'author',
        roleLabel: 'Ministro da Fazenda / Articulador',
        notes: 'Coordenou as negociações com governadores, prefeitos e setores produtivos para aprovação da EC 132.',
        sourceUrl: 'https://www.gov.br/fazenda/pt-br',
      },
    ],
  },
  {
    id: 'bernard-appy',
    name: 'Bernard Appy',
    type: 'politician',
    party: 'Técnico / Sem partido',
    involvements: [
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2019,
        endYear: 2023,
        role: 'author',
        roleLabel: 'Idealizador da PEC 45 e Secretário Extraordinário',
        notes: 'Formulou a proposta no Centro de Cidadania Fiscal (CCiF) e liderou a redação técnica no governo.',
        sourceUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2196833',
      },
    ],
  },
  {
    id: 'aguinaldo-ribeiro',
    name: 'Aguinaldo Ribeiro',
    type: 'politician',
    party: 'PP',
    involvements: [
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2019,
        endYear: 2023,
        role: 'rapporteur',
        roleLabel: 'Relator da PEC 45 na Câmara dos Deputados',
        notes: 'Responsável pelo parecer final aprovado em dois turnos na Câmara dos Deputados.',
        sourceUrl: 'https://www.camara.leg.br',
      },
    ],
  },
  {
    id: 'roberto-jefferson',
    name: 'Roberto Jefferson',
    type: 'politician',
    party: 'PTB',
    involvements: [
      {
        eventId: 'mensalao-2005',
        startYear: 2005,
        endYear: 2012,
        role: 'whistleblower',
        roleLabel: 'Denunciante do esquema na imprensa',
        notes: 'Deu a entrevista revelando o pagamento de R$ 30 mil mensais a deputados federais.',
        sourceUrl: 'https://portal.stf.jus.br/processos/detalhe.asp?incidente=2538118',
      },
      {
        eventId: 'cpi-correios-2005',
        startYear: 2005,
        endYear: 2005,
        role: 'investigated',
        roleLabel: 'Depoente e investigado',
        notes: 'Prestou depoimento público na CPI e teve seu mandato cassado pela Câmara em setembro de 2005.',
        sourceUrl: 'https://www.camara.leg.br',
      },
    ],
  },
  {
    id: 'jose-dirceu',
    name: 'José Dirceu',
    type: 'politician',
    party: 'PT',
    involvements: [
      {
        eventId: 'mensalao-2005',
        startYear: 2005,
        endYear: 2012,
        role: 'investigated',
        roleLabel: 'Réu na Ação Penal 470',
        notes: 'Apontado pela denúncia da PGR como mentor político do esquema; condenado pelo STF.',
        sourceUrl: 'https://portal.stf.jus.br/processos/detalhe.asp?incidente=2538118',
      },
    ],
  },
  {
    id: 'renan-calheiros',
    name: 'Renan Calheiros',
    type: 'politician',
    party: 'MDB',
    involvements: [
      {
        eventId: 'cpi-pandemia-2021',
        startYear: 2021,
        endYear: 2021,
        role: 'rapporteur',
        roleLabel: 'Relator da CPI da Pandemia no Senado',
        notes: 'Autor do relatório final de 1.288 páginas propondo o indiciamento de autoridades.',
        sourceUrl: 'https://legis.senado.leg.br/comissoes/comissao?codcol=2441',
      },
    ],
  },
  {
    id: 'omar-aziz',
    name: 'Omar Aziz',
    type: 'politician',
    party: 'PSD',
    involvements: [
      {
        eventId: 'cpi-pandemia-2021',
        startYear: 2021,
        endYear: 2021,
        role: 'rapporteur',
        roleLabel: 'Presidente da CPI da Pandemia',
        notes: 'Conduziu os trabalhos de oitiva de testemunhas e autoridades.',
        sourceUrl: 'https://legis.senado.leg.br/comissoes/comissao?codcol=2441',
      },
    ],
  },
  // Partidos Políticos e suas orientações de bancada
  {
    id: 'partido-pt',
    name: 'Partido dos Trabalhadores (PT)',
    type: 'party',
    involvements: [
      {
        eventId: 'pec-teto-gastos-2016',
        startYear: 2016,
        endYear: 2016,
        role: 'party_guidance',
        roleLabel: 'Orientação de Bancada: NÃO (100% dos votos contrários)',
        notes: 'Considerou a PEC um desmonte das políticas de saúde, educação e serviços públicos.',
        sourceUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2088351',
      },
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2023,
        endYear: 2023,
        role: 'party_guidance',
        roleLabel: 'Orientação de Bancada: SIM (Unanimidade a favor)',
        notes: 'Articulou o texto com cashback social e isenção da cesta básica.',
        sourceUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2196833',
      },
    ],
  },
  {
    id: 'partido-pl',
    name: 'Partido Liberal (PL)',
    type: 'party',
    involvements: [
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2023,
        endYear: 2023,
        role: 'party_guidance',
        roleLabel: 'Orientação de Bancada: NÃO (com dissidências)',
        notes: 'Orientou voto contra sob a alegação de risco de aumento de carga tributária e concentração em conselho federativo.',
        sourceUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2196833',
      },
    ],
  },
  {
    id: 'partido-mdb',
    name: 'Movimento Democrático Brasileiro (MDB)',
    type: 'party',
    involvements: [
      {
        eventId: 'pec-teto-gastos-2016',
        startYear: 2016,
        endYear: 2016,
        role: 'party_guidance',
        roleLabel: 'Orientação de Bancada: SIM (Bancada majoritária governista)',
        notes: 'Principal pilar da aprovação do Novo Regime Fiscal.',
        sourceUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2088351',
      },
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2023,
        endYear: 2023,
        role: 'party_guidance',
        roleLabel: 'Orientação de Bancada: SIM (38 a favor)',
        notes: 'Apoiou a modernização e o fim da guerra fiscal interestadual.',
        sourceUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2196833',
      },
    ],
  },
  {
    id: 'partido-uniao',
    name: 'União Brasil',
    type: 'party',
    involvements: [
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2023,
        endYear: 2023,
        role: 'party_guidance',
        roleLabel: 'Orientação de Bancada: SIM (59 votos unânimes a favor)',
        notes: 'Apoio decisivo do centro com pactuação dos fundos regionais.',
        sourceUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2196833',
      },
    ],
  },
  {
    id: 'partido-pp',
    name: 'Progressistas (PP)',
    type: 'party',
    involvements: [
      {
        eventId: 'pec-teto-gastos-2016',
        startYear: 2016,
        endYear: 2016,
        role: 'party_guidance',
        roleLabel: 'Orientação de Bancada: SIM (42 votos favoráveis)',
        notes: 'Base do governo Temer.',
        sourceUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2088351',
      },
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2023,
        endYear: 2023,
        role: 'party_guidance',
        roleLabel: 'Orientação de Bancada: SIM (40 votos favoráveis)',
        notes: 'Conduzido pelo presidente da Casa Arthur Lira e pelo relator Aguinaldo Ribeiro.',
        sourceUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2196833',
      },
    ],
  },
  {
    id: 'partido-novo',
    name: 'Partido NOVO',
    type: 'party',
    involvements: [
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2023,
        endYear: 2023,
        role: 'party_guidance',
        roleLabel: 'Orientação de Bancada: NÃO (3 contrários, 1 a favor)',
        notes: 'Oposição fiscal com alerta contra alta de tributação do setor de serviços.',
        sourceUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2196833',
      },
    ],
  },
  {
    id: 'partido-psol',
    name: 'Partido Socialismo e Liberdade (PSOL)',
    type: 'party',
    involvements: [
      {
        eventId: 'pec-teto-gastos-2016',
        startYear: 2016,
        endYear: 2016,
        role: 'party_guidance',
        roleLabel: 'Orientação de Bancada: NÃO (Unanimidade contrária)',
        notes: 'Oposição combativa ao congelamento de investimentos sociais.',
        sourceUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2088351',
      },
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2023,
        endYear: 2023,
        role: 'party_guidance',
        roleLabel: 'Orientação de Bancada: SIM (14 votos favoráveis)',
        notes: 'Apoio após atendimento de pautas de isenção da cesta básica e cashback.',
        sourceUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2196833',
      },
    ],
  },
  // Parlamentares com Votos Nominais Registrados
  {
    id: 'arthur-lira',
    name: 'Arthur Lira',
    type: 'politician',
    party: 'PP',
    involvements: [
      {
        eventId: 'pec-teto-gastos-2016',
        startYear: 2016,
        endYear: 2016,
        role: 'voted_for',
        roleLabel: 'Voto SIM (Câmara dos Deputados)',
        notes: 'Votou favoravelmente ao Teto de Gastos como deputado federal.',
        sourceUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2088351',
      },
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2023,
        endYear: 2023,
        role: 'voted_for',
        roleLabel: 'Presidente da Câmara / Voto SIM no Plenário',
        notes: 'Desceu da cadeira da presidência da Casa para discursar e votar a favor da Reforma Tributária em 2º turno.',
        sourceUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
      },
    ],
  },
  {
    id: 'baleia-rossi',
    name: 'Baleia Rossi',
    type: 'politician',
    party: 'MDB',
    involvements: [
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2019,
        endYear: 2023,
        role: 'author',
        roleLabel: 'Autor Originário da PEC 45 e Voto SIM',
        notes: 'Apresentou a PEC 45 em 2019 e proferiu voto favorável na sessão histórica.',
        sourceUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
      },
    ],
  },
  {
    id: 'gleisi-hoffmann',
    name: 'Gleisi Hoffmann',
    type: 'politician',
    party: 'PT',
    involvements: [
      {
        eventId: 'pec-teto-gastos-2016',
        startYear: 2016,
        endYear: 2016,
        role: 'voted_against',
        roleLabel: 'Voto NÃO (Senado Federal)',
        notes: 'Liderou protestos e votou contra a Emenda Constitucional 95 no plenário do Senado.',
        sourceUrl: 'https://legis.senado.leg.br/materia/127337',
      },
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2023,
        endYear: 2023,
        role: 'voted_for',
        roleLabel: 'Voto SIM (Câmara dos Deputados)',
        notes: 'Presidenta do PT, votou SIM defendendo o modelo não-cumulativo e justiça social.',
        sourceUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
      },
    ],
  },
  {
    id: 'nikolas-ferreira',
    name: 'Nikolas Ferreira',
    type: 'politician',
    party: 'PL',
    involvements: [
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2023,
        endYear: 2023,
        role: 'voted_against',
        roleLabel: 'Voto NÃO (Câmara dos Deputados)',
        notes: 'Votou contra a proposta em consonância com a ala de oposição do PL.',
        sourceUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
      },
    ],
  },
  {
    id: 'eduardo-bolsonaro',
    name: 'Eduardo Bolsonaro',
    type: 'politician',
    party: 'PL',
    involvements: [
      {
        eventId: 'pec-teto-gastos-2016',
        startYear: 2016,
        endYear: 2016,
        role: 'voted_for',
        roleLabel: 'Voto SIM (Câmara dos Deputados)',
        notes: 'Votou a favor do Teto de Gastos na gestão Temer.',
        sourceUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2088351',
      },
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2023,
        endYear: 2023,
        role: 'voted_against',
        roleLabel: 'Voto NÃO (Câmara dos Deputados)',
        notes: 'Voto contrário em consonância com as orientações do ex-presidente Jair Bolsonaro.',
        sourceUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
      },
    ],
  },
  {
    id: 'tabata-amaral',
    name: 'Tabata Amaral',
    type: 'politician',
    party: 'PSB',
    involvements: [
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2023,
        endYear: 2023,
        role: 'voted_for',
        roleLabel: 'Voto SIM (Câmara dos Deputados)',
        notes: 'Articulou a inclusão do cashback e da cesta básica nacional com alíquota zero.',
        sourceUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
      },
    ],
  },
  {
    id: 'marcel-van-hattem',
    name: 'Marcel van Hattem',
    type: 'politician',
    party: 'NOVO',
    involvements: [
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2023,
        endYear: 2023,
        role: 'voted_against',
        roleLabel: 'Voto NÃO (Câmara dos Deputados)',
        notes: 'Votou contra alertando para o risco de aumento da carga sobre o setor de serviços.',
        sourceUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
      },
    ],
  },
  {
    id: 'guilherme-boulos',
    name: 'Guilherme Boulos',
    type: 'politician',
    party: 'PSOL',
    involvements: [
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2023,
        endYear: 2023,
        role: 'voted_for',
        roleLabel: 'Voto SIM (Câmara dos Deputados)',
        notes: 'Apoiou a reforma destacando o benefício da isenção de impostos nos alimentos básicos.',
        sourceUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
      },
    ],
  },
  {
    id: 'aecio-neves',
    name: 'Aécio Neves',
    type: 'politician',
    party: 'PSDB',
    involvements: [
      {
        eventId: 'pec-teto-gastos-2016',
        startYear: 2016,
        endYear: 2016,
        role: 'voted_for',
        roleLabel: 'Voto SIM (Senado Federal)',
        notes: 'Discursou a favor da austeridade fiscal e combate à inflação.',
        sourceUrl: 'https://legis.senado.leg.br/materia/127337',
      },
      {
        eventId: 'pec-reforma-tributaria-2023',
        startYear: 2023,
        endYear: 2023,
        role: 'voted_for',
        roleLabel: 'Voto SIM (Câmara dos Deputados)',
        notes: 'Votou a favor do IVA Dual para modernização do ambiente de negócios.',
        sourceUrl: 'https://www.camara.leg.br/presenca-comissoes/votacao-portal?reuniaoCodReuniao=68765',
      },
    ],
  },
  {
    id: 'rodrigo-maia',
    name: 'Rodrigo Maia',
    type: 'politician',
    party: 'DEM',
    involvements: [
      {
        eventId: 'pec-teto-gastos-2016',
        startYear: 2016,
        endYear: 2016,
        role: 'voted_for',
        roleLabel: 'Presidente da Câmara / Voto SIM no Plenário',
        notes: 'Comandou as sessões de votação em 1º e 2º turnos da PEC 241 na Câmara.',
        sourceUrl: 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2088351',
      },
    ],
  },
];

/**
 * Funções utilitárias de relacionamento e cruzamento no Grafo
 */

// Retorna os atores que apontam para um evento específico
export function getActorsForEvent(eventId: string): { actor: PoliticalActor; involvement: ActorInvolvement }[] {
  const result: { actor: PoliticalActor; involvement: ActorInvolvement }[] = [];
  POLITICAL_ACTORS.forEach((actor) => {
    actor.involvements.forEach((inv) => {
      if (inv.eventId === eventId) {
        result.push({ actor, involvement: inv });
      }
    });
  });
  return result;
}

// Retorna os eventos conectados a um evento no Grafo
export function getRelatedEvents(
  eventId: string
): { event: PoliticalEvent; edge: EventRelationEdge; isOutgoing: boolean }[] {
  const event = POLITICAL_EVENTS.find((e) => e.id === eventId);
  const result: { event: PoliticalEvent; edge: EventRelationEdge; isOutgoing: boolean }[] = [];

  if (event) {
    // Arestas de saída
    event.relatedEventEdges.forEach((edge) => {
      const target = POLITICAL_EVENTS.find((e) => e.id === edge.targetEventId);
      if (target) {
        result.push({ event: target, edge, isOutgoing: true });
      }
    });
  }

  // Arestas de entrada (onde o evento atual é o destino de outro)
  POLITICAL_EVENTS.forEach((other) => {
    if (other.id !== eventId) {
      other.relatedEventEdges.forEach((edge) => {
        if (edge.targetEventId === eventId) {
          result.push({ event: other, edge, isOutgoing: false });
        }
      });
    }
  });

  return result;
}

// Retorna os objetos de categoria a partir dos IDs
export function getCategoriesForEvent(categoryIds: string[]): EventCategory[] {
  return EVENT_CATEGORIES.filter((c) => categoryIds.includes(c.id));
}
