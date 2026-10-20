# Plano de Implementação: Arquitetura Hexagonal e Telas de Cadastro de Dados

Implementação de uma arquitetura hexagonal (*Ports & Adapters*) para o cadastro, manipulação e persistência de dados políticos (Categorias, Fatos/PECs/Escândalos, Atores Políticos com ano de início, e Macro-Cenários), atendendo integralmente à exigência de formulários isolados por entidade, persistência em `localStorage` e preparação total para substituição plugável por banco de dados futuro.

---

## 1. Arquitetura Hexagonal (*Ports & Adapters*)

### 1.1 Domínio e Portas Secundárias (*Driven Ports / Interfaces de Repositório*)
- **`IPoliticalDataRepository`** (`src/domain/ports/IPoliticalDataRepository.ts`):
  - **Categorias**: `getCategories(): Promise<EventCategory[]>`, `saveCategory(category: EventCategory): Promise<EventCategory>`, `deleteCategory(id: string): Promise<void>`.
  - **Eventos Políticos / Grafo**: `getEvents(): Promise<PoliticalEvent[]>`, `saveEvent(event: PoliticalEvent): Promise<PoliticalEvent>`, `deleteEvent(id: string): Promise<void>`.
  - **Atores Políticos**: `getActors(): Promise<PoliticalActor[]>`, `saveActor(actor: PoliticalActor): Promise<PoliticalActor>`, `deleteActor(id: string): Promise<void>`.
  - **Macro-Cenários**: `getScenarios(): Promise<MacroScenario[]>`, `saveScenario(scenario: MacroScenario): Promise<MacroScenario>`, `deleteScenario(id: string): Promise<void>`.
  - **Gerenciamento e Backup**: `exportJson(): Promise<string>`, `importJson(jsonString: string): Promise<void>`, `resetToDefaults(): Promise<void>`.

### 1.2 Serviço de Domínio / Caso de Uso (*Application Core / Hexagonal Core*)
- **`PoliticalDataService`** (`src/domain/services/PoliticalDataService.ts`):
  - Orquestra as regras de negócio, validações (fontes com links obrigatórios, anos válidos, unicidade de IDs, integridade referencial entre atores e fatos).
  - Recebe qualquer implementação de `IPoliticalDataRepository` via injeção de dependência no construtor.
  - Provê métodos de consulta com filtros, buscas e cruzamentos para a interface.

### 1.3 Adaptadores Secundários (*Infrastructure Adapters*)
- **`LocalStoragePoliticalDataRepository`** (`src/infrastructure/adapters/LocalStoragePoliticalDataRepository.ts`):
  - Implementa `IPoliticalDataRepository`.
  - Carrega inicialmente os dados padrão de semente (`seed` de `politicalEventsData.ts`).
  - Persiste qualquer alteração, novo cadastro ou remoção em chaves isoladas no `localStorage` do navegador.
  - Oferece suporte completo para exportar o JSON atualizado e importar novos lotes.
- **Preparação para Banco de Dados Futuro**:
  - Quando a persistência for migrada para banco de dados (ex: PostgreSQL / Firestore), bastará criar `SqlPoliticalDataRepository` ou `FirestorePoliticalDataRepository` implementando a mesma interface `IPoliticalDataRepository`, sem alterar nenhuma linha dos formulários ou da interface do usuário.

---

## 2. Telas e Formulários Isolados por Entidade

Criação do módulo visual **`PoliticalDataAdminPage`** (`src/components/admin/PoliticalDataAdminPage.tsx`), acessível pelo menu lateral com abas dedicadas e isoladas para cada formulário:

### 2.1 Formulário 1: Cadastro de Categorias (`CategoryForm.tsx`)
- Campos:
  - ID / Slug da categoria (gerado automaticamente ou customizado).
  - Nome completo (ex: *"Fraudes Fiscais & Bancárias"*).
  - Rótulo curto para crachás (ex: *"Fraude Bancária"*).
  - Descrição institucional do escopo da categoria.
  - Seletor de cor hexadecimal com prévia dinâmica do *badge*.
- Listagem e gerenciamento: tabela/cards das categorias existentes com contagem de eventos vinculados e ações de edição/exclusão.

### 2.2 Formulário 2: Cadastro de Fatos Políticos, PECs e Escândalos (`EventForm.tsx`)
- Campos estruturados e isolados:
  - **Dados Gerais**: Título completo, título reduzido, ano do fato, data precisa (opcional), resumo sintético.
  - **Categorias (N:N)**: Seleção múltipla com *checkboxes* das categorias cadastradas no sistema.
  - **Macro-Cenário**: Vínculo opcional a um macro-cenário existente.
  - **Pontos Relevantes da Matéria**: Lista dinâmica onde o usuário pode adicionar/remover pontos essenciais (artigos da PEC, modus operandi, etc.).
  - **Votações Legislativas (se aplicável)**: Casa (Câmara/Senado), turno, votos Sim, Não, Abstenções e resultado.
  - **Detalhes de Investigação (se aplicável)**: Órgãos investigadores (PF, MPF, TCU, CVM), valores estimados apurados e desfecho judicial.
  - **Conexões do Grafo**: Adicionar arestas com outros fatos (tipo de relação causal: desdobramento, gatilho, reação, etc. + evento de destino).
  - **Indicadores Socioeconômicos Impactados**: Seleção dos 10 indicadores históricos do Brasil (PIB, IPCA, Dólar, etc.).
  - **Fontes Oficiais**: Lista dinâmica com Título, Veículo/Órgão e URL obrigatória.

### 2.3 Formulário 3: Cadastro de Atores Políticos e Envolvimentos (`ActorForm.tsx`)
- Campos estruturados:
  - Nome da pessoa, partido ou instituição.
  - Tipo: Político, Partido ou Instituição.
  - Sigla partidária (se político).
  - **Lista de Envolvimentos em Fatos**:
    - Seleção do Fato Político vinculado.
    - **Ano de início do envolvimento** (campo obrigatório).
    - Ano de término (opcional).
    - Papel desempenhado (*autor, relator, votou a favor, votou contra, investigado, denunciante, presidente em exercício*, etc.).
    - Rótulo personalizado do papel.
    - Notas explicativas e **URL da fonte comprobatória**.

### 2.4 Formulário 4: Cadastro de Macro-Cenários (`ScenarioForm.tsx`)
- Campos:
  - Título do cenário (ex: *"Ciclo de Desestatizações dos Anos 90"*).
  - Período temporal (ex: *"1995–1999"*).
  - Descrição abrangente do contexto político-econômico.
  - Seleção de múltiplos eventos que integram o cenário.

### 2.5 Painel de Gestão e Backup JSON (`DataBackupManager.tsx`)
- Estatísticas do banco local: contagem de categorias, eventos, atores e cenários gravados.
- Botão de **Exportar JSON**: baixa o arquivo estruturado contendo todos os dados cadastrados.
- Botão de **Importar JSON**: permite carregar um arquivo JSON externo validando a integridade dos campos.
- Botão de **Restaurar Padrões**: restaura a base original de sementes históricas.

---

## 3. Integração na Aplicação e Navegação

1. **Menu Lateral (*NavigationDrawer*)**:
   - Inclusão do item *"Painel de Cadastro de Dados"* com ícone de banco de dados/lápis, permitindo navegação direta para os formulários.
2. **Atalho na Página de Eventos (*PoliticalEventsPage*)**:
   - Botão rápido *"Novo Fato / Cadastrar"* no topo da listagem de eventos para redirecionar diretamente para a tela de cadastro.
3. **Reatividade e Atualização Instantânea**:
   - Criação de um *React Hook* (`usePoliticalData`) conectado ao serviço hexagonal com disparo de eventos de mutação para que a página de eventos, grafos e atores atualizem em tempo real assim que qualquer dado for salvo.

---

## 4. Verificação e Testes

- Teste de cadastro de uma nova Categoria e verificação se ela aparece disponível para seleção imediata no formulário de Eventos.
- Teste de cadastro de um novo Fato Político com fontes e conexões causais, verificando a persistência no `localStorage`.
- Teste de cadastro de um novo Ator Político com ano de início vinculado ao fato cadastrado, verificando a correta exibição na aba de Atores.
- Teste de exportação e restauração de dados JSON.
- Verificação de compilação com `compile_applet` e validação com `lint_applet`.
