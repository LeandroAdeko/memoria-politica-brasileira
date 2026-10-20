import {
  EventCategory,
  PoliticalEvent,
  PoliticalActor,
  MacroScenario,
  ActorInvolvement,
  EventRelationEdge,
} from '../../data/politicalEventsData';
import {
  IPoliticalDataRepository,
  PoliticalDataBackupPayload,
} from '../ports/IPoliticalDataRepository';

export interface EventWithActorEnriched extends PoliticalEvent {
  actorsInvolved: {
    actor: PoliticalActor;
    involvement: ActorInvolvement;
  }[];
}

/**
 * Domain Service / Hexagonal Application Core
 * Orquestra as regras de negócio e validações, delegando a persistência à porta secundária.
 */
export class PoliticalDataService {
  private repository: IPoliticalDataRepository;

  constructor(repository: IPoliticalDataRepository) {
    this.repository = repository;
  }

  // Permite trocar o repositório em runtime (ex: trocar de LocalStorage para API/DB)
  public setRepository(newRepo: IPoliticalDataRepository) {
    this.repository = newRepo;
  }

  // --- CATEGORIAS ---

  public async listCategories(): Promise<EventCategory[]> {
    return this.repository.getCategories();
  }

  public async getCategory(id: string): Promise<EventCategory | null> {
    return this.repository.getCategoryById(id);
  }

  public async registerCategory(categoryData: Partial<EventCategory>): Promise<EventCategory> {
    if (!categoryData.name?.trim()) {
      throw new Error('O nome da categoria é obrigatório.');
    }

    const id =
      categoryData.id?.trim() ||
      this.slugify(categoryData.name) ||
      `cat-${Date.now()}`;

    const newCategory: EventCategory = {
      id,
      name: categoryData.name.trim(),
      shortLabel: categoryData.shortLabel?.trim() || categoryData.name.trim(),
      description: categoryData.description?.trim() || '',
      color: categoryData.color || '#002776',
      badgeBg: categoryData.badgeBg || 'bg-blue-50',
      badgeText: categoryData.badgeText || 'text-blue-900',
      badgeBorder: categoryData.badgeBorder || 'border-blue-200',
    };

    return this.repository.saveCategory(newCategory);
  }

  public async removeCategory(id: string): Promise<void> {
    // Validar se há eventos usando esta categoria
    const events = await this.repository.getEvents();
    const isUsed = events.some((e) => e.categoryIds.includes(id));
    if (isUsed) {
      throw new Error(`Não é possível excluir a categoria "${id}" pois existem fatos vinculados a ela.`);
    }
    await this.repository.deleteCategory(id);
  }

  // --- FATOS / EVENTOS POLÍTICOS ---

  public async listEvents(): Promise<PoliticalEvent[]> {
    return this.repository.getEvents();
  }

  public async getEvent(id: string): Promise<PoliticalEvent | null> {
    return this.repository.getEventById(id);
  }

  public async registerEvent(eventData: Partial<PoliticalEvent>): Promise<PoliticalEvent> {
    if (!eventData.title?.trim()) {
      throw new Error('O título do fato/evento é obrigatório.');
    }
    if (!eventData.year || isNaN(eventData.year) || eventData.year < 1889 || eventData.year > 2100) {
      throw new Error('Ano inválido. Informe um ano entre 1889 e 2100.');
    }
    if (!eventData.categoryIds || eventData.categoryIds.length === 0) {
      throw new Error('O fato deve possuir pelo menos uma categoria associada.');
    }

    // Regra de Integridade: Todas as fontes DEVEM ter URL obrigatória
    if (eventData.sources && eventData.sources.length > 0) {
      for (const src of eventData.sources) {
        if (!src.url?.trim() || (!src.url.startsWith('http://') && !src.url.startsWith('https://'))) {
          throw new Error(`A fonte "${src.title || 'sem título'}" deve conter uma URL válida iniciando com http:// ou https://.`);
        }
      }
    }

    const id =
      eventData.id?.trim() ||
      `${this.slugify(eventData.shortTitle || eventData.title)}-${eventData.year}`;

    const newEvent: PoliticalEvent = {
      id,
      title: eventData.title.trim(),
      shortTitle: eventData.shortTitle?.trim() || eventData.title.trim(),
      categoryIds: eventData.categoryIds,
      year: Number(eventData.year),
      date: eventData.date?.trim() || undefined,
      summary: eventData.summary?.trim() || '',
      keyPoints: (eventData.keyPoints || []).filter((p) => p && p.trim().length > 0),
      scenarioId: eventData.scenarioId || undefined,
      legislativeDetails: eventData.legislativeDetails,
      investigationDetails: eventData.investigationDetails,
      relatedEventEdges: (eventData.relatedEventEdges || []).filter(
        (edge) => edge.targetEventId && edge.targetEventId !== id
      ),
      impactedIndicatorIds: eventData.impactedIndicatorIds || [],
      sources: (eventData.sources || []).map((s) => ({
        title: s.title.trim(),
        publisher: s.publisher.trim(),
        url: s.url.trim(),
      })),
    };

    return this.repository.saveEvent(newEvent);
  }

  public async removeEvent(id: string): Promise<void> {
    await this.repository.deleteEvent(id);
  }

  // --- ATORES POLÍTICOS (Fatos não estão ligados a pessoas; pessoas apontam para fatos) ---

  public async listActors(): Promise<PoliticalActor[]> {
    return this.repository.getActors();
  }

  public async getActor(id: string): Promise<PoliticalActor | null> {
    return this.repository.getActorById(id);
  }

  public async registerActor(actorData: Partial<PoliticalActor>): Promise<PoliticalActor> {
    if (!actorData.name?.trim()) {
      throw new Error('O nome do ator político (pessoa, partido ou órgão) é obrigatório.');
    }
    if (!actorData.type) {
      throw new Error('O tipo do ator (politician, party ou institution) é obrigatório.');
    }

    // Validar regras de envolvimentos
    const involvements: ActorInvolvement[] = [];
    if (actorData.involvements && actorData.involvements.length > 0) {
      for (const inv of actorData.involvements) {
        if (!inv.eventId?.trim()) {
          throw new Error('Todo envolvimento deve apontar para um fato político existente.');
        }
        if (!inv.startYear || isNaN(inv.startYear) || inv.startYear < 1889 || inv.startYear > 2100) {
          throw new Error(`Ano de início do envolvimento inválido: ${inv.startYear}. Deve ser informado.`);
        }
        if (!inv.sourceUrl?.trim() || (!inv.sourceUrl.startsWith('http://') && !inv.sourceUrl.startsWith('https://'))) {
          throw new Error(`O envolvimento no evento "${inv.eventId}" deve ter URL comprobatória com http:// ou https://.`);
        }

        involvements.push({
          eventId: inv.eventId.trim(),
          startYear: Number(inv.startYear),
          endYear: inv.endYear ? Number(inv.endYear) : undefined,
          role: inv.role,
          roleLabel: inv.roleLabel?.trim() || inv.role,
          notes: inv.notes?.trim() || undefined,
          sourceUrl: inv.sourceUrl.trim(),
        });
      }
    }

    const id = actorData.id?.trim() || this.slugify(actorData.name);

    const newActor: PoliticalActor = {
      id,
      name: actorData.name.trim(),
      type: actorData.type,
      party: actorData.party?.trim() || undefined,
      involvements,
    };

    return this.repository.saveActor(newActor);
  }

  public async removeActor(id: string): Promise<void> {
    await this.repository.deleteActor(id);
  }

  // --- MACRO-CENÁRIOS ---

  public async listScenarios(): Promise<MacroScenario[]> {
    return this.repository.getScenarios();
  }

  public async getScenario(id: string): Promise<MacroScenario | null> {
    return this.repository.getScenarioById(id);
  }

  public async registerScenario(scenarioData: Partial<MacroScenario>): Promise<MacroScenario> {
    if (!scenarioData.title?.trim()) {
      throw new Error('O título do macro-cenário é obrigatório.');
    }

    const id = scenarioData.id?.trim() || this.slugify(scenarioData.title);

    const newScenario: MacroScenario = {
      id,
      title: scenarioData.title.trim(),
      period: scenarioData.period?.trim() || '',
      description: scenarioData.description?.trim() || '',
      eventIds: scenarioData.eventIds || [],
    };

    return this.repository.saveScenario(newScenario);
  }

  public async removeScenario(id: string): Promise<void> {
    await this.repository.deleteScenario(id);
  }

  // --- BACKUP & EXPORTAÇÃO JSON ---

  public async exportAllData(): Promise<PoliticalDataBackupPayload> {
    return this.repository.exportBackup();
  }

  public async importAllData(payload: PoliticalDataBackupPayload): Promise<void> {
    if (!payload || !Array.isArray(payload.categories) || !Array.isArray(payload.events)) {
      throw new Error('Arquivo de backup inválido: categorias e eventos são estruturas obrigatórias.');
    }
    await this.repository.importBackup(payload);
  }

  public async resetData(): Promise<void> {
    await this.repository.resetToDefaults();
  }

  // --- MÉTODOS DE CONSULTA CRUZADA ---

  public async getEnrichedEvents(): Promise<EventWithActorEnriched[]> {
    const [events, actors] = await Promise.all([
      this.repository.getEvents(),
      this.repository.getActors(),
    ]);

    return events.map((event) => {
      const actorsInvolved: { actor: PoliticalActor; involvement: ActorInvolvement }[] = [];
      for (const actor of actors) {
        for (const inv of actor.involvements) {
          if (inv.eventId === event.id) {
            actorsInvolved.push({ actor, involvement: inv });
          }
        }
      }
      return {
        ...event,
        actorsInvolved,
      };
    });
  }

  // Helper utilitário
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}
