/**
 * Memória Política do Brasil — Base de Dados de Presidentes da República (1990–2024)
 * Período democrático contemporâneo com perfis biográficos, legislação aprovada,
 * programas criados e legado econômico (antes x depois).
 */

import { YearRecord, HISTORICAL_DATA, INDICATORS, IndicatorMeta } from './brazilHistoryData';

export interface PresidentLaw {
  number: string;
  name: string;
  year: number;
  category: 'Fiscal & Tributária' | 'Social & Cidadania' | 'Institucional & Estado' | 'Econômica & Trabalho' | 'Educação & Saúde';
  description: string;
}

export interface PresidentProgram {
  name: string;
  year: number;
  category: string;
  description: string;
  impact: string;
}

export interface PresidentMandate {
  label: string;
  period: string;
  startYear: number;
  endYear: number;
  baselineYear: number; // Year immediately prior to mandate to measure "how it was before"
  conclusionYear: number; // Final full year of mandate or current available year
}

export interface PresidentProfile {
  id: string;
  orderNumber: number; // Posição na lista de presidentes da República
  name: string;
  fullName: string;
  shortName: string;
  party: string;
  coalition?: string;
  vicePresident: string;
  mandates: PresidentMandate[];
  badgeColor: 'green' | 'blue' | 'amber' | 'slate';
  bio: {
    summary: string;
    birthDate: string;
    birthPlace: string;
    educationAndCareer: string;
    roadToPresidency: string;
    mandateConclusion: string;
  };
  laws: PresidentLaw[];
  programs: PresidentProgram[];
  economicLegacy: {
    beforeContext: string;
    duringGovernance: string;
    afterContext: string;
    synthesis: string;
  };
}

export const PRESIDENTS: PresidentProfile[] = [
  {
    id: 'collor',
    orderNumber: 32,
    name: 'Fernando Collor de Mello',
    fullName: 'Fernando Affonso Collor de Mello',
    shortName: 'Fernando Collor',
    party: 'PRN (Partido da Reconstrução Nacional)',
    coalition: 'Brasil Novo (PRN, PTR, PST, PSC)',
    vicePresident: 'Itamar Franco',
    badgeColor: 'amber',
    mandates: [
      {
        label: 'Mandato Presidencial (1990–1992)',
        period: '15/03/1990 – 29/12/1992',
        startYear: 1990,
        endYear: 1992,
        baselineYear: 1990, // início da série histórica disponível
        conclusionYear: 1992,
      },
    ],
    bio: {
      summary:
        'Primeiro presidente eleito por voto direto após o regime militar, sua gestão foi marcada pela tentativa de choque contra a hiperinflação, abertura comercial às importações e posterior processo de impeachment culminado em sua renúncia.',
      birthDate: '12 de agosto de 1949',
      birthPlace: 'Rio de Janeiro (RJ)',
      educationAndCareer:
        'Formado em Economia pela Universidade Federal de Alagoas (UFAL). Foi prefeito de Maceió (1979–1982), deputado federal (1983–1986) e governador de Alagoas (1987–1989), quando ganhou projeção nacional como o "caçador de marajás".',
      roadToPresidency:
        'Venceu a eleição histórica de 1989 em segundo turno contra Luiz Inácio Lula da Silva com uma campanha focada na moralização pública, modernização da economia e combate à burocracia.',
      mandateConclusion:
        'Após denúncias de corrupção envolvendo o tesoureiro de sua campanha, Paulo César Farias, eclodiram manifestações populares ("Caras-Pintadas"). Foi afastado pela Câmara dos Deputados em outubro de 1992 e renunciou ao cargo em 29 de dezembro de 1992, tendo seus direitos políticos suspensos pelo Senado por oito anos.',
    },
    laws: [
      {
        number: 'Lei nº 8.078/1990',
        name: 'Código de Defesa do Consumidor (CDC)',
        year: 1990,
        category: 'Social & Cidadania',
        description:
          'Marco civil revolucionário que estabeleceu as normas de proteção e defesa do consumidor, criando o Procon e reequilibrando as relações de consumo no Brasil.',
      },
      {
        number: 'Lei nº 8.069/1990',
        name: 'Estatuto da Criança e do Adolescente (ECA)',
        year: 1990,
        category: 'Social & Cidadania',
        description:
          'Instituiu a doutrina da proteção integral da infância e da adolescência no Brasil, criando os Conselhos Tutelares e garantias de direitos fundamentais.',
      },
      {
        number: 'Lei nº 8.080/1990',
        name: 'Lei Orgânica da Saúde (Regulamentação do SUS)',
        year: 1990,
        category: 'Educação & Saúde',
        description:
          'Regulamentou as ações e serviços de saúde em todo o território nacional, formalizando as bases e o financiamento do Sistema Único de Saúde (SUS).',
      },
      {
        number: 'Lei nº 8.031/1990',
        name: 'Programa Nacional de Desestatização (PND)',
        year: 1990,
        category: 'Econômica & Trabalho',
        description:
          'Marco regulatório que deu início às privatizações de empresas estatais da siderurgia, química e fertilizantes no país.',
      },
    ],
    programs: [
      {
        name: 'Plano Collor I e II',
        year: 1990,
        category: 'Econômica',
        description:
          'Choque de liquidez sem precedentes que bloqueou por 18 meses depósitos em contas bancárias e cadernetas de poupança acima de 50 mil cruzados novos.',
        impact:
          'Derrubou momentaneamente a atividade econômica provocando recessão imediata de -4,3% em 1990, sem debelar a espiral inflacionária a médio prazo.',
      },
      {
        name: 'Abertura Comercial e Tarifária',
        year: 1990,
        category: 'Comércio Exterior',
        description:
          'Eliminação de barreiras alfandegárias protecionistas e redução drástica das tarifas de importação de bens de consumo, veículos e tecnologia.',
        impact:
          'Expos a indústria nacional à concorrência internacional, impulsionando a modernização tecnológica, embora tenha acarretado falências no curto prazo.',
      },
      {
        name: 'Criação do Ministério do Meio Ambiente e Rio-92',
        year: 1992,
        category: 'Meio Ambiente',
        description:
          'Criação da pasta do Meio Ambiente e acolhimento da Conferência das Nações Unidas sobre o Meio Ambiente e o Desenvolvimento (Eco-92 no Rio de Janeiro).',
        impact:
          'Inseriu o Brasil no protagonismo global da agenda de sustentabilidade, biodiversidade e mudanças climáticas.',
      },
    ],
    economicLegacy: {
      beforeContext:
        'Como estava antes: O Brasil vivia o colapso do Plano Sarney com hiperinflação galopante (IPCA superior a 1.900% ao ano em 1989), moratória da dívida externa e mercado fechado com desabastecimento de produtos essenciais.',
      duringGovernance:
        'Durante a gestão: Tentativa heterodoxa de estancar a inflação pelo confisco bancário ("Plano Brasil Novo"), eliminação do monopólio estatal em vários setores e abertura das importações.',
      afterContext:
        'Como ficou depois: Deixou o país em forte recessão econômica (PIB de -4,35% em 1990 e -0,5% em 1992), inflação anual ainda descontrolada em 1.119% ao final de 1992 e alto descontentamento social, mas com o mercado aberto e marcos civis históricos (CDC, ECA e SUS).',
      synthesis:
        'Marcado pelo trauma do confisco da poupança e recessão, mas responsável pela virada de chave rumo à abertura comercial e institucionalização do SUS e CDC.',
    },
  },
  {
    id: 'itamar',
    orderNumber: 33,
    name: 'Itamar Franco',
    fullName: 'Itamar Augusto Cautiero Franco',
    shortName: 'Itamar Franco',
    party: 'PMDB (Partido do Movimento Democrático Brasileiro)',
    coalition: 'Governo de Coalizão e União Nacional',
    vicePresident: 'Cargo vago (assumiu como vice)',
    badgeColor: 'blue',
    mandates: [
      {
        label: 'Mandato Presidencial (1992–1994)',
        period: '02/10/1992 – 31/12/1994',
        startYear: 1992,
        endYear: 1994,
        baselineYear: 1992,
        conclusionYear: 1994,
      },
    ],
    bio: {
      summary:
        'Assumiu a presidência após a renúncia de Collor, liderando um governo de pacificação e união nacional que formulou e executou o Plano Real, encerrando décadas de hiperinflação crônica no país.',
      birthDate: '28 de junho de 1930',
      birthPlace: 'Nascido em navio de cabotagem entre Salvador e Rio de Janeiro (registrado em Juiz de Fora - MG)',
      educationAndCareer:
        'Engenheiro civil e eletrotécnico formado pela Escola de Engenharia de Juiz de Fora. Foi prefeito de Juiz de Fora por dois mandatos e senador da República por Minas Gerais.',
      roadToPresidency:
        'Eleito vice-presidente na chapa de Collor em 1989, assumiu a presidência interinamente em outubro de 1992 com a abertura do impeachment e em definitivo em 29 de dezembro de 1992.',
      mandateConclusion:
        'Concluiu seu mandato com elevada popularidade após o sucesso histórico do Plano Real e conduziu uma transição institucional tranquila, elegendo seu ministro da Fazenda, Fernando Henrique Cardoso.',
    },
    laws: [
      {
        number: 'Lei nº 8.880/1994',
        name: 'Instituição da URV e Plano Real',
        year: 1994,
        category: 'Fiscal & Tributária',
        description:
          'Criou a Unidade Real de Valor (URV) como índice de transição para alinhar preços e salários antes do lançamento da moeda Real em 1º de julho de 1994.',
      },
      {
        number: 'Lei nº 8.742/1993',
        name: 'Lei Orgânica da Assistência Social (LOAS)',
        year: 1993,
        category: 'Social & Cidadania',
        description:
          'Regulamentou o artigo 203 da Constituição, criando o Benefício de Prestação Continuada (BPC) para idosos e pessoas com deficiência em situação de vulnerabilidade.',
      },
      {
        number: 'Decreto de 1993',
        name: 'Plebiscito sobre Forma e Sistema de Governo',
        year: 1993,
        category: 'Institucional & Estado',
        description:
          'Realizou a consulta popular constitucional que confirmou a República (contra a Monarquia) e o Presidencialismo (contra o Parlamentarismo) como sistema político.',
      },
    ],
    programs: [
      {
        name: 'Plano Real',
        year: 1994,
        category: 'Econômica',
        description:
          'Plano de estabilização monetária mais bem-sucedido da história do Brasil, planejado pela equipe econômica liderada por Fernando Henrique Cardoso.',
        impact:
          'Reduziu a inflação mensal de quase 50% em junho de 1994 para menos de 2% ao mês no fim do ano, eliminando o "imposto inflacionário" sobre os mais pobres.',
      },
      {
        name: 'Comunidade Solidária e Ação da Cidadania',
        year: 1993,
        category: 'Social',
        description:
          'Apoio institucional e mobilização governamental em torno da campanha contra a fome liderada pelo sociólogo Herbert de Souza (Betinho).',
        impact:
          'Colocou a fome e a segurança alimentar no centro da agenda pública nacional pela primeira vez.',
      },
      {
        name: 'Incentivo ao Carro Popular (Relançamento do Fusca)',
        year: 1993,
        category: 'Industrial',
        description:
          'Política de incentivos tributários e redução de IPI para veículos compactos de baixa cilindrada, reativando a produção automobilística.',
        impact:
          'Aqueceu o setor industrial automobilístico gerando milhares de empregos operários na região do ABC e interior paulista.',
      },
    ],
    economicLegacy: {
      beforeContext:
        'Como estava antes: Hiperinflação descontrolada superior a 1.100% ao ano em 1992, profunda crise política e desconfiança da população após o confisco de Collor.',
      duringGovernance:
        'Durante a gestão: Construção de base de apoio multipartidária, ajuste das contas públicas com o Fundo Social de Emergência e lançamento ordenado da URV e do Real sem congelamento de preços.',
      afterContext:
        'Como ficou depois: Queda abrupta da inflação, aceleração do PIB com alta de 5,85% em 1994, expressivo ganho de poder de compra real nos salários e retomada da confiança dos agentes econômicos.',
      synthesis:
        'Governo de sobriedade e pacificação que entregou a maior conquista macroeconômica do Brasil contemporâneo: a estabilização da moeda.',
    },
  },
  {
    id: 'fhc',
    orderNumber: 34,
    name: 'Fernando Henrique Cardoso',
    fullName: 'Fernando Henrique Cardoso',
    shortName: 'FHC',
    party: 'PSDB (Partido da Social Democracia Brasileira)',
    coalition: 'União, Trabalho e Progresso (PSDB, PFL, PTB, PPB)',
    vicePresident: 'Marco Maciel (PFL)',
    badgeColor: 'blue',
    mandates: [
      {
        label: '1º e 2º Mandatos Presidenciais (1995–2002)',
        period: '01/01/1995 – 31/12/2002',
        startYear: 1995,
        endYear: 2002,
        baselineYear: 1994,
        conclusionYear: 2002,
      },
    ],
    bio: {
      summary:
        'Sociólogo e professor universitário de projeção internacional, consolidou a estabilização monetária do Real, implementou o Tripé Macroeconômico, reformou o Estado brasileiro e institucionalizou a Lei de Responsabilidade Fiscal.',
      birthDate: '18 de junho de 1931',
      birthPlace: 'Rio de Janeiro (RJ)',
      educationAndCareer:
        'Doutor em Ciências Sociais pela Universidade de São Paulo (USP). Exilado durante o regime militar, lecionou em universidades da França, Chile e EUA. Foi senador por São Paulo e ministro das Relações Exteriores e da Fazenda no governo Itamar Franco.',
      roadToPresidency:
        'Eleito no primeiro turno em 1994 impulsionado pelo sucesso estrondoso do Plano Real, e reeleito também em primeiro turno em 1998.',
      mandateConclusion:
        'Enfrentou severas crises financeiras internacionais (México, Ásia, Rússia) e a crise energética de 2001, concluindo seu segundo mandato em 2002 com a transição democrática e madura de poder para a oposição.',
    },
    laws: [
      {
        number: 'Lei Complementar nº 101/2000',
        name: 'Lei de Responsabilidade Fiscal (LRF)',
        year: 2000,
        category: 'Fiscal & Tributária',
        description:
          'Marco supremo da gestão pública no Brasil, estabelecendo limites rígidos de gastos com pessoal e endividamento para União, estados e municípios.',
      },
      {
        number: 'Lei nº 10.406/2002',
        name: 'Novo Código Civil Brasileiro',
        year: 2002,
        category: 'Institucional & Estado',
        description:
          'Substituiu o código centenário de 1916, modernizando o direito de família, empresarial, sucessões e contratos conforme a Constituição de 1988.',
      },
      {
        number: 'Emenda Constitucional nº 16/1997',
        name: 'Emenda da Reeleição',
        year: 1997,
        category: 'Institucional & Estado',
        description:
          'Permitiu a reeleição para cargos do Poder Executivo (Presidente, Governadores e Prefeitos) para um único período subsequente.',
      },
      {
        number: 'Lei nº 9.472/1997',
        name: 'Lei Geral de Telecomunicações',
        year: 1997,
        category: 'Econômica & Trabalho',
        description:
          'Criou a Agência Nacional de Telecomunicações (Anatel) e abriu o setor privado à universalização da telefonia fixa e expansão celular.',
      },
      {
        number: 'Lei nº 9.787/1999',
        name: 'Lei dos Medicamentos Genéricos',
        year: 1999,
        category: 'Educação & Saúde',
        description:
          'Autorizou a fabricação e venda de medicamentos genéricos sem patente de marca, barateando remédios essenciais para toda a população.',
      },
    ],
    programs: [
      {
        name: 'Tripé Macroeconômico (1999)',
        year: 1999,
        category: 'Econômica',
        description:
          'Arquitetura econômica baseada em Câmbio Flutuante, Regime de Metas para a Inflação e Metas de Superávit Primário.',
        impact:
          'Permitiu ao país absorver choques internacionais com flexibilidade cambial, tornando-se pilar permanente da política econômica nacional.',
      },
      {
        name: 'Fundef (Fundo do Ensino Fundamental)',
        year: 1996,
        category: 'Educação',
        description:
          'Mecanismo de redistribuição de recursos vinculados para valorização salarial dos professores e universalização do acesso à escola.',
        impact:
          'Elevou as taxas de matrícula no ensino fundamental para mais de 96% e aumentou substancialmente a escolaridade média do brasileiro.',
      },
      {
        name: 'Bolsa Escola, Bolsa Alimentação e Vale-Gás',
        year: 2001,
        category: 'Social',
        description:
          'Primeiros programas federais descentralizados de transferência direta de renda condicionada à frequência escolar das crianças.',
        impact:
          'Criaram o Cadastro Único e a infraestrutura institucional que mais tarde foram unificados no Programa Bolsa Família.',
      },
      {
        name: 'Privatizações e Agências Reguladoras',
        year: 1997,
        category: 'Infraestrutura',
        description:
          'Leilões de privatização do sistema Telebras, mineradora Vale do Rio Doce, distribuidoras elétricas e malha ferroviária, com criação de agências (Anatel, Aneel, ANP, Anvisa).',
        impact:
          'Universalizou o acesso à telefonia celular e reduziu o custo de linhas telefônicas de milhares de dólares para acesso popular.',
      },
    ],
    economicLegacy: {
      beforeContext:
        'Como estava antes: Inflação recentemente domada pelo Plano Real, mas com forte dependência de financiamento externo e desequilíbrios fiscais nos estados e bancos públicos.',
      duringGovernance:
        'Durante a gestão: Saneamento bancário pelo PROER, privatizações para amortização de dívidas, aprovação da LRF e transição para o regime de metas de inflação e câmbio flutuante após a crise cambial de 1999.',
      afterContext:
        'Como ficou depois: Inflação contida na maior parte do tempo em patamares civilizados (com repique pontual para 12,5% em 2002 pela incerteza eleitoral), PIB crescendo a uma média de 2,3% ao ano e instituições fiscais sólidas pela LRF, com desemprego de 11,7% e dívida pública mais dolarizada ao fim do período.',
      synthesis:
        'Oito anos de profunda modernização institucional que dotaram o Estado de regras fiscais rígidas, agências reguladoras e consolidação do Real.',
    },
  },
  {
    id: 'lula',
    orderNumber: 35,
    name: 'Luiz Inácio Lula da Silva',
    fullName: 'Luiz Inácio Lula da Silva',
    shortName: 'Lula',
    party: 'PT (Partido dos Trabalhadores)',
    coalition: 'Lula Presidente / Federação Brasil da Esperança',
    vicePresident: 'José Alencar (2003–2010) / Geraldo Alckmin (2023–atual)',
    badgeColor: 'amber',
    mandates: [
      {
        label: '1º e 2º Mandatos Presidenciais (2003–2010)',
        period: '01/01/2003 – 31/12/2010',
        startYear: 2003,
        endYear: 2010,
        baselineYear: 2002,
        conclusionYear: 2010,
      },
      {
        label: '3º Mandato Presidencial (2023–atual)',
        period: '01/01/2023 – atual',
        startYear: 2023,
        endYear: 2024,
        baselineYear: 2022,
        conclusionYear: 2024,
      },
    ],
    bio: {
      summary:
        'Líder sindical metalúrgico nascido em Pernambuco, presidiu o país durante o ciclo do "boom das commodities", promovendo expansão histórica de programas sociais de combate à fome e valorização do salário mínimo, retornando ao poder em 2023 para um terceiro mandato.',
      birthDate: '27 de outubro de 1945',
      birthPlace: 'Caetés / Garanhuns (PE)',
      educationAndCareer:
        'Metalúrgico e torneiro mecânico formado pelo Senai. Liderou as históricas greves operárias no ABC paulista no final dos anos 1970 e cofundou o Partido dos Trabalhadores (PT) em 1980 e a Central Única dos Trabalhadores (CUT). Foi deputado constituinte em 1988.',
      roadToPresidency:
        'Disputou a presidência em 1989, 1994 e 1998, vencendo em 2002 com a "Carta ao Povo Brasileiro", reeleito em 2006. Em 2022, venceu a eleição mais acirrada da redemocratização liderando uma ampla frente democrática contra Jair Bolsonaro.',
      mandateConclusion:
        'Concluiu seus dois primeiros mandatos em 2010 com aprovação recorde superior a 80%, elegendo Dilma Rousseff. Seu terceiro mandato (2023–2026) é voltado à reconstrução institucional, responsabilidade socioambiental e reforma tributária.',
    },
    laws: [
      {
        number: 'Lei nº 10.836/2004',
        name: 'Criação do Programa Bolsa Família',
        year: 2004,
        category: 'Social & Cidadania',
        description:
          'Unificou os programas de transferência de renda no Bolsa Família, tornando-se referência internacional de combate à extrema pobreza e redução da desigualdade.',
      },
      {
        number: 'Lei nº 10.741/2003',
        name: 'Estatuto da Pessoa Idosa',
        year: 2003,
        category: 'Social & Cidadania',
        description:
          'Assegurou direitos e garantias prioritárias às pessoas com idade igual ou superior a 60 anos na saúde, transporte, habitação e assistência.',
      },
      {
        number: 'Lei nº 11.340/2006',
        name: 'Lei Maria da Penha',
        year: 2006,
        category: 'Social & Cidadania',
        description:
          'Marco de proteção aos direitos humanos das mulheres e combate à violência doméstica e familiar com criação de varas especializadas e medidas protetivas.',
      },
      {
        number: 'Emenda Constitucional nº 132/2023',
        name: 'Reforma Tributária sobre o Consumo',
        year: 2023,
        category: 'Fiscal & Tributária',
        description:
          'Histórica simplificação do sistema tributário após três décadas de debate, unificando PIS, Cofins, IPI, ICMS e ISS no IVA Dual (IBS e CBS) com cashback e desoneração da cesta básica.',
      },
    ],
    programs: [
      {
        name: 'Bolsa Família e Fome Zero',
        year: 2003,
        category: 'Social',
        description:
          'Transferência direta de renda condicionada à vacinação e frequência escolar, atingindo mais de 12 milhões de famílias.',
        impact:
          'Contribuiu de forma decisiva para a saída do Brasil do Mapa da Fome da ONU e expressiva queda do Índice de Gini de desigualdade.',
      },
      {
        name: 'Luz para Todos',
        year: 2003,
        category: 'Infraestrutura Social',
        description:
          'Eletrificação rural gratuita que levou energia elétrica contínua a milhões de moradores do campo e regiões isoladas da Amazônia.',
        impact:
          'Universalizou o acesso à energia elétrica para mais de 15 milhões de brasileiros.',
      },
      {
        name: 'Minha Casa Minha Vida (MCMV)',
        year: 2009,
        category: 'Habitação',
        description:
          'Subsídios governamentais e financiamentos facilitados para aquisição da casa própria para famílias de baixa renda.',
        impact:
          'Contratou mais de 4 milhões de moradias, dinamizando a cadeia da construção civil e geração de emprego formal.',
      },
      {
        name: 'Prouni, Fies e REUNI',
        year: 2004,
        category: 'Educação',
        description:
          'Bolsas universitárias em instituições privadas (Prouni) e abertura de dezenas de novos campi e universidades federais públicas no interior do país (REUNI).',
        impact:
          'Democratizou o acesso ao ensino superior, dobrando o número de universitários brasileiros.',
      },
    ],
    economicLegacy: {
      beforeContext:
        'Como estava antes (2002): Risco-país em 2.400 pontos base ("efeito Lula"), inflação de 12,5% em 2002, desemprego em 11,7% e taxa de fome em patamares alarmantes de mais de 10% da população.',
      duringGovernance:
        'Durante a gestão: Manutenção do tripé macroeconômico com aumento inicial da Selic para ancorar expectativas, quitação antecipada da dívida com o FMI em 2005, acúmulo histórico de mais de US$ 280 bilhões em reservas cambiais e forte valorização real do salário mínimo.',
      afterContext:
        'Como ficou depois (2010): O PIB encerrou 2010 com crescimento extraordinário de 7,53% (média de mais de 4% a.a.), o desemprego caiu para mínimas históricas de 6,7%, o Brasil conquistou o Grau de Investimento e ascensão de mais de 30 milhões de pessoas à classe C. No terceiro mandato (2023–2024), aprovação da Reforma Tributária e crescimento de 2,9% em 2023.',
      synthesis:
        'Ciclo de ouro de inclusão social, redução acentuada da pobreza e da fome, geração de empregos formais e consolidação do Brasil como credor internacional.',
    },
  },
  {
    id: 'dilma',
    orderNumber: 36,
    name: 'Dilma Rousseff',
    fullName: 'Dilma Vana Rousseff',
    shortName: 'Dilma Rousseff',
    party: 'PT (Partido dos Trabalhadores)',
    coalition: 'Para o Brasil Seguir Mudando / Com a Força do Povo',
    vicePresident: 'Michel Temer (PMDB)',
    badgeColor: 'amber',
    mandates: [
      {
        label: '1º e 2º Mandatos Presidenciais (2011–2016)',
        period: '01/01/2011 – 31/08/2016',
        startYear: 2011,
        endYear: 2016,
        baselineYear: 2010,
        conclusionYear: 2016,
      },
    ],
    bio: {
      summary:
        'Primeira mulher eleita presidente do Brasil, economista de formação, sua gestão aprofundou investimentos em infraestrutura e políticas sociais, mas enfrentou grave crise fiscal e política decorrente da Nova Matriz Econômica e choques externos, resultando em seu impeachment em 2016.',
      birthDate: '14 de dezembro de 1947',
      birthPlace: 'Belo Horizonte (MG)',
      educationAndCareer:
        'Graduada em Ciências Econômicas pela Universidade Federal do Rio Grande do Sul (UFRGS). Atuou como secretária da Fazenda de Porto Alegre e secretária de Energia e Minas do RS. No governo Lula, foi ministra de Minas e Energia e ministra-chefe da Casa Civil.',
      roadToPresidency:
        'Eleita em 2010 com o apoio decisivo de Lula, vencendo José Serra no segundo turno. Reeleita em 2014 em disputa extremamente polarizada contra Aécio Neves.',
      mandateConclusion:
        'Sofreu forte oposição parlamentar com a Operação Lava Jato e protestos de rua a partir de 2013 e 2015. Teve seu mandato cassado pelo Senado Federal em 31 de agosto de 2016 por acusações de edição de decretos orçamentários sem autorização legislativa ("pedaladas fiscais").',
    },
    laws: [
      {
        number: 'Lei nº 12.527/2011',
        name: 'Lei de Acesso à Informação (LAI)',
        year: 2011,
        category: 'Institucional & Estado',
        description:
          'Obrigou todos os órgãos públicos dos poderes Executivo, Legislativo e Judiciário a dar transparência ativa a receitas, despesas, contratos e salários de servidores.',
      },
      {
        number: 'Lei nº 12.846/2013',
        name: 'Lei Anticorrupção (Empresas Limpas)',
        year: 2013,
        category: 'Institucional & Estado',
        description:
          'Instituiu a responsabilização objetiva administrativa e civil de pessoas jurídicas pela prática de atos contra a administração pública nacional ou estrangeira.',
      },
      {
        number: 'Lei nº 12.965/2014',
        name: 'Marco Civil da Internet',
        year: 2014,
        category: 'Institucional & Estado',
        description:
          'Constituição da internet no Brasil, assegurando a neutralidade da rede, privacidade dos dados dos usuários e liberdade de expressão online.',
      },
      {
        number: 'Lei nº 12.711/2012',
        name: 'Lei das Cotas nas Universidades Federais',
        year: 2012,
        category: 'Educação & Saúde',
        description:
          'Reservou 50% das vagas em universidades federais e institutos federais para estudantes egressos de escolas públicas, com subcotas raciais e de renda.',
      },
    ],
    programs: [
      {
        name: 'Programa Mais Médicos',
        year: 2013,
        category: 'Saúde',
        description:
          'Contratação de médicos nacionais e estrangeiros para atuar na atenção primária do SUS em municípios remotos do interior e periferias.',
        impact:
          'Levou atendimento médico básico regular a mais de 60 milhões de pessoas em áreas antes desassistidas.',
      },
      {
        name: 'Pronatec (Ensino Técnico Profissionalizante)',
        year: 2011,
        category: 'Educação',
        description:
          'Oferta de milhões de vagas gratuitas em cursos técnicos e de qualificação profissionalizante pelo Sistema S e rede federal.',
        impact:
          'Capacitou milhões de jovens trabalhadores para inserção no mercado de trabalho formal.',
      },
      {
        name: 'Brasil Sem Miséria',
        year: 2011,
        category: 'Social',
        description:
          'Plano integrado com foco na erradicação da extrema pobreza mediante busca ativa de famílias vulneráveis e complementação de renda.',
        impact:
          'Retirou 22 milhões de pessoas da faixa de extrema pobreza nos primeiros anos de governo.',
      },
      {
        name: 'Nova Matriz Econômica e Desonerações',
        year: 2012,
        category: 'Econômica',
        description:
          'Política de corte induzido da taxa de juros pelo Copom, subsídios volumosos de crédito via BNDES (PSI) e desoneração da folha de pagamento para mais de 50 setores.',
        impact:
          'Causou perda expressiva de arrecadação fiscal, déficit nas contas públicas e distorções de preços relativos.',
      },
    ],
    economicLegacy: {
      beforeContext:
        'Como estava antes (2010): Economia operando em pleno emprego com PIB crescendo a 7,53%, mas com pressões de custo interno, fim do boom das commodities e inflação acumulando pressão.',
      duringGovernance:
        'Durante a gestão: Implementação da Nova Matriz Econômica com intervenção nas tarifas elétricas (MP 579) e represamento dos combustíveis. Queda brusca nas cotações internacionais do petróleo e minério de ferro coincidiu com crise fiscal aguda e paralisia política.',
      afterContext:
        'Como ficou depois (2016): O país mergulhou na recessão mais severa de sua história recente, com o PIB encolhendo -3,55% em 2015 e -3,28% em 2016; o desemprego disparou de 6,7% para 11,5%; a inflação bateu 10,67% em 2015 e as agências de risco retiraram o grau de investimento do Brasil.',
      synthesis:
        'Avanços de inclusão educacional (Lei de Cotas) e saúde básica (Mais Médicos), obscurecidos por desarranjo fiscal, recessão e desfecho em processo de impeachment.',
    },
  },
  {
    id: 'temer',
    orderNumber: 37,
    name: 'Michel Temer',
    fullName: 'Michel Miguel Elias Temer Lulia',
    shortName: 'Michel Temer',
    party: 'PMDB / MDB (Movimento Democrático Brasileiro)',
    coalition: 'Base Parlamentar Multipartidária',
    vicePresident: 'Cargo vago (assumiu como vice)',
    badgeColor: 'green',
    mandates: [
      {
        label: 'Mandato Presidencial (2016–2018)',
        period: '12/05/2016 – 31/12/2018',
        startYear: 2016,
        endYear: 2018,
        baselineYear: 2015,
        conclusionYear: 2018,
      },
    ],
    bio: {
      summary:
        'Jurista e constitucionalista com extensa trajetória parlamentar, assumiu a presidência após o impeachment de Dilma Rousseff, implementando uma agenda liberal de contenção fiscal (Teto de Gastos) e modernização da legislação trabalhista.',
      birthDate: '23 de setembro de 1940',
      birthPlace: 'Tietê (SP)',
      educationAndCareer:
        'Doutor em Direito pela Pontifícia Universidade Católica de São Paulo (PUC-SP). Foi procurador-geral do Estado de São Paulo, secretário de Segurança Pública e presidente da Câmara dos Deputados por três vezes.',
      roadToPresidency:
        'Eleito vice-presidente em 2010 e 2014 na chapa de Dilma Rousseff, assumiu o governo interinamente em maio de 2016 e definitivamente em 31 de agosto de 2016.',
      mandateConclusion:
        'Enfrentou denúncias de corrupção da PGR e a greve dos caminhoneiros de 2018, concluindo seu mandato com baixa aprovação popular mas com reformas estruturais e queda expressiva da taxa Selic e inflação.',
    },
    laws: [
      {
        number: 'Emenda Constitucional nº 95/2016',
        name: 'Teto de Gastos Públicos',
        year: 2016,
        category: 'Fiscal & Tributária',
        description:
          'Instituiu o Novo Regime Fiscal, congelando o crescimento das despesas primárias da União à inflação (IPCA) por 20 anos como âncora fiscal.',
      },
      {
        number: 'Lei nº 13.467/2017',
        name: 'Reforma Trabalhista',
        year: 2017,
        category: 'Econômica & Trabalho',
        description:
          'Modernizou a CLT de 1943, estabelecendo a prevalência do negociado sobre o legislado, regulamentando o trabalho intermitente e extinguindo o imposto sindical obrigatório.',
      },
      {
        number: 'Lei nº 13.303/2016',
        name: 'Lei das Estatais',
        year: 2016,
        category: 'Institucional & Estado',
        description:
          'Estabeleceu critérios rígidos de governança corporativa, compliance e vedação de indicações político-partidárias para diretorias de empresas públicas.',
      },
      {
        number: 'Lei nº 13.415/2017',
        name: 'Reforma do Ensino Médio',
        year: 2017,
        category: 'Educação & Saúde',
        description:
          'Flexibilizou o currículo do ensino médio com a criação de itinerários formativos optativos e incentivo à formação técnica profissionalizante.',
      },
    ],
    programs: [
      {
        name: 'Ponte para o Futuro e PPI',
        year: 2016,
        category: 'Econômica e Concessões',
        description:
          'Programa de Parcerias de Investimentos (PPI) focado na atração de capital privado para leilões de concessões de aeroportos, rodovias e ferrovias.',
        impact:
          'Retomou a confiança e o investimento privado em infraestrutura e logística.',
      },
      {
        name: 'Liberação de Contas Inativas do FGTS',
        year: 2017,
        category: 'Social & Consumo',
        description:
          'Autorização de saques extraordinários de saldos de contas inativas do FGTS para milhões de trabalhadores.',
        impact:
          'Injetou mais de R$ 44 bilhões diretamente na economia, permitindo a quitação de dívidas das famílias e alívio do consumo.',
      },
      {
        name: 'Queda Histórica da Selic',
        year: 2016,
        category: 'Monetária',
        description:
          'Política monetária coordenada pelo Banco Central que reduziu a taxa básica de juros de 14,25% ao ano para 6,5% ao ano.',
        impact:
          'Reduziu substancialmente o custo de rolagem da dívida pública e destravou o mercado de capitais no país.',
      },
    ],
    economicLegacy: {
      beforeContext:
        'Como estava antes (2015/2016): O Brasil atravessava uma recessão devastadora com dois anos de queda contínua do PIB (-3,5% e -3,3%), inflação de 10,67% em 2015, juros a 14,25% e paralisia fiscal.',
      duringGovernance:
        'Durante a gestão: Aprovação célere de reformas liberais estruturantes (Teto de Gastos, Lei das Estatais, Reforma Trabalhista) e choque positivo de credibilidade nos mercados financeiros.',
      afterContext:
        'Como ficou depois (2018): O PIB saiu do terreno negativo voltando a crescer modestamente (1,3% em 2017 e 1,78% em 2018); a inflação caiu de 10,67% para 3,75% em 2018; a taxa Selic atingiu a mínima de 6,5%; embora o desemprego tenha permanecido alto (11,6%) e a crise fiscal não tenha sido totalmente estancada.',
      synthesis:
        'Governo de transição rápida que debelou a hiperinflação de custos e a recessão profunda, legando a modernização trabalhista e a governança nas estatais.',
    },
  },
  {
    id: 'bolsonaro',
    orderNumber: 38,
    name: 'Jair Bolsonaro',
    fullName: 'Jair Messias Bolsonaro',
    shortName: 'Jair Bolsonaro',
    party: 'PSL (2019–2021) / PL (2021–2022)',
    coalition: 'Brasil Acima de Tudo, Deus Acima de Todos',
    vicePresident: 'Hamilton Mourão (PRTB)',
    badgeColor: 'green',
    mandates: [
      {
        label: 'Mandato Presidencial (2019–2022)',
        period: '01/01/2019 – 31/12/2022',
        startYear: 2019,
        endYear: 2022,
        baselineYear: 2018,
        conclusionYear: 2022,
      },
    ],
    bio: {
      summary:
        'Capitão reformado do Exército e deputado federal por sete mandatos, venceu as eleições com plataforma conservadora e liberal. Sua administração foi marcada pela aprovação da Reforma da Previdência, privatização da Eletrobras, gestão da pandemia de COVID-19 e forte polarização política.',
      birthDate: '21 de março de 1955',
      birthPlace: 'Glicério (SP)',
      educationAndCareer:
        'Formado pela Academia Militar das Agulhas Negras (AMAN) e paraquedista militar. Foi vereador no Rio de Janeiro (1989–1991) e exerceu sete mandatos consecutivos como deputado federal pelo Rio de Janeiro de 1991 a 2018.',
      roadToPresidency:
        'Venceu a eleição presidencial de 2018 no segundo turno contra Fernando Haddad (PT), impulsionado pelo discurso anticorrupção, anticomunismo, pauta armamentista e defesa da moralidade tradicional.',
      mandateConclusion:
        'Disputou a reeleição em 2022 sendo derrotado por Luiz Inácio Lula da Silva na disputa mais apertada da história democrática brasileira.',
    },
    laws: [
      {
        number: 'Emenda Constitucional nº 103/2019',
        name: 'Reforma da Previdência Social',
        year: 2019,
        category: 'Fiscal & Tributária',
        description:
          'Fixou idade mínima de aposentadoria (65 anos para homens e 62 para mulheres), instituiu regras de transição e alíquotas progressivas, aliviando o déficit atuarial da União.',
      },
      {
        number: 'Lei nº 13.874/2019',
        name: 'Declaração de Direitos de Liberdade Econômica',
        year: 2019,
        category: 'Econômica & Trabalho',
        description:
          'Desburocratizou o ambiente de negócios no Brasil, dispensando alvarás e licenças para atividades de baixo risco e garantindo a livre estipulação de preços.',
      },
      {
        number: 'Lei nº 14.026/2020',
        name: 'Novo Marco Legal do Saneamento Básico',
        year: 2020,
        category: 'Econômica & Trabalho',
        description:
          'Abriu o setor de saneamento à concorrência privada mediante licitações públicas obrigatórias, com meta de universalização de água e esgoto até 2033.',
      },
      {
        number: 'Lei Complementar nº 179/2021',
        name: 'Autonomia Formal do Banco Central',
        year: 2021,
        category: 'Institucional & Estado',
        description:
          'Definiu mandato fixo de quatro anos não coincidente com o mandato do Presidente da República para o presidente e diretores do Banco Central.',
      },
      {
        number: 'Lei nº 14.182/2021',
        name: 'Privatização da Eletrobras',
        year: 2021,
        category: 'Econômica & Trabalho',
        description:
          'Processo de capitalização e pulverização acionária que transformou a maior geradora de energia da América Latina em corporação privada.',
      },
    ],
    programs: [
      {
        name: 'Auxílio Emergencial',
        year: 2020,
        category: 'Social & Pandemia',
        description:
          'Transferência direta de renda de até R$ 600 a R$ 1.200 mensais que atendeu mais de 68 milhões de brasileiros vulneráveis durante a quarentena da COVID-19.',
        impact:
          'Mitigou o impacto econômico da pandemia e amparou os trabalhadores informais impedidos de trabalhar.',
      },
      {
        name: 'Implementação do Pix (2020)',
        year: 2020,
        category: 'Tecnologia Bancária',
        description:
          'Sistema de pagamentos instantâneos criado e implementado pelo Banco Central com gratuidade e operação 24 horas.',
        impact:
          'Revolucionou as transações comerciais no Brasil, bancarizando milhões de cidadãos e reduzindo custos operacionais.',
      },
      {
        name: 'Auxílio Brasil e Desoneração de Combustíveis',
        year: 2021,
        category: 'Social & Tributária',
        description:
          'Reformulação do programa de transferência de renda elevando o piso para R$ 400 e posteriormente R$ 600, junto ao teto de ICMS sobre combustíveis.',
        impact:
          'Aumento imediato de renda aos beneficiários e deflação temporária de preços de energia e transportes em 2022.',
      },
    ],
    economicLegacy: {
      beforeContext:
        'Como estava antes (2018): Recuperação lenta e tímida da recessão anterior (PIB de 1,78%), desemprego em 11,6%, déficit previdenciário estrutural ameaçando as contas públicas e taxa de juros em 6,5%.',
      duringGovernance:
        'Durante a gestão: Aprovação histórica da Reforma da Previdência em 2019. Em 2020, o país enfrentou o choque sanitário e econômico da pandemia de COVID-19, com acionamento do Orçamento de Guerra e Auxílio Emergencial. Em 2021/2022, sofreu pressão inflacionária global (IPCA de 10,06% em 2021) com elevação da Selic para 13,75% e expressiva desoneração de combustíveis em 2022.',
      afterContext:
        'Como ficou depois (2022): O PIB recuperou-se com crescimento de 4,99% em 2021 e 3,02% em 2022; a taxa de desemprego caiu expressivamente para 7,9%; o governo federal registrou superávit primário temporário de R$ 54 bilhões em 2022; todavia, inquéritos alimentares apontaram agravamento da insegurança alimentar (fome) para 15,5% da população no período pós-pandêmico e aumento do desmatamento na Amazônia.',
      synthesis:
        'Gestão de forte tensão institucional e pandemia, que aprovou a histórica Reforma da Previdência, inaugurou o Pix e privatizou a Eletrobras, deixando desemprego em queda mas desafios sociais severos na segurança alimentar.',
    },
  },
];

/**
 * Utilitário que calcula as métricas reais antes vs. depois do mandato
 * puxando diretamente da base HISTORICAL_DATA existente no aplicativo.
 */
export interface LegacyMetricComparison {
  indicator: IndicatorMeta;
  beforeYear: number;
  beforeValue: number;
  afterYear: number;
  afterValue: number;
  changeAbs: number;
  changePercent: number;
  isPositiveForSociety: boolean | null;
}

export interface PresidentDataLegacy {
  beforeYearRecord: YearRecord;
  afterYearRecord: YearRecord;
  averageGdpGrowth: number;
  averageInflation: number;
  metrics: LegacyMetricComparison[];
}

export function computePresidentLegacy(
  president: PresidentProfile,
  mandateIndex = 0
): PresidentDataLegacy | null {
  const mandate = president.mandates[mandateIndex] || president.mandates[0];
  if (!mandate) return null;

  const beforeRecord = HISTORICAL_DATA.find((y) => y.year === mandate.baselineYear);
  const afterRecord = HISTORICAL_DATA.find((y) => y.year === mandate.conclusionYear);

  if (!beforeRecord || !afterRecord) return null;

  // Anos de exercício do mandato para calcular médias de PIB e Inflação
  const mandateYears = HISTORICAL_DATA.filter(
    (y) => y.year >= mandate.startYear && y.year <= mandate.conclusionYear
  );

  const averageGdpGrowth =
    mandateYears.length > 0
      ? mandateYears.reduce((acc, y) => acc + y.metrics.gdp_growth, 0) / mandateYears.length
      : 0;

  const averageInflation =
    mandateYears.length > 0
      ? mandateYears.reduce((acc, y) => acc + y.metrics.inflation, 0) / mandateYears.length
      : 0;

  const metrics: LegacyMetricComparison[] = INDICATORS.map((ind) => {
    const key = ind.id as keyof YearRecord['metrics'];
    const beforeValue = beforeRecord.metrics[key];
    const afterValue = afterRecord.metrics[key];
    const changeAbs = afterValue - beforeValue;
    const changePercent =
      beforeValue !== 0 ? ((afterValue - beforeValue) / Math.abs(beforeValue)) * 100 : 0;

    let isPositiveForSociety: boolean | null = null;
    if (Math.abs(changePercent) >= 0.05) {
      if (ind.betterDirection === 'higher') {
        isPositiveForSociety = changeAbs > 0;
      } else {
        isPositiveForSociety = changeAbs < 0;
      }
    }

    return {
      indicator: ind,
      beforeYear: mandate.baselineYear,
      beforeValue,
      afterYear: mandate.conclusionYear,
      afterValue,
      changeAbs,
      changePercent,
      isPositiveForSociety,
    };
  });

  return {
    beforeYearRecord: beforeRecord,
    afterYearRecord: afterRecord,
    averageGdpGrowth,
    averageInflation,
    metrics,
  };
}
