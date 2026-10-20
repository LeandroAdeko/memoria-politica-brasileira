import {
  EventCategory,
  PoliticalEvent,
  PoliticalActor,
  MacroScenario,
  EVENT_CATEGORIES,
  POLITICAL_EVENTS,
  POLITICAL_ACTORS,
  MACRO_SCENARIOS,
} from '../../data/politicalEventsData';
import {
  IPoliticalDataRepository,
  PoliticalDataBackupPayload,
} from '../../domain/ports/IPoliticalDataRepository';

const STORAGE_KEYS = {
  CATEGORIES: 'memoria_politica_categories_v2',
  EVENTS: 'memoria_politica_events_v2',
  ACTORS: 'memoria_politica_actors_v2',
  SCENARIOS: 'memoria_politica_scenarios_v2',
};

export const DATA_MUTATION_EVENT = 'political_data_changed';

/**
 * Secondary / Driven Adapter (Hexagonal Architecture)
 * Persiste entidades no localStorage do navegador com preenchimento inicial de sementes (seed).
 * Fácil de substituir por SqlPoliticalDataRepository ou FirestorePoliticalDataRepository.
 */
export class LocalStoragePoliticalDataRepository implements IPoliticalDataRepository {
  private notifyChange() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(DATA_MUTATION_EVENT));
    }
  }

  // --- CATEGORIAS ---

  public async getCategories(): Promise<EventCategory[]> {
    if (typeof window === 'undefined') return EVENT_CATEGORIES;
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      // Primeira inicialização com dados padrão
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(EVENT_CATEGORIES));
      return EVENT_CATEGORIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return EVENT_CATEGORIES;
    }
  }

  public async getCategoryById(id: string): Promise<EventCategory | null> {
    const list = await this.getCategories();
    return list.find((c) => c.id === id) || null;
  }

  public async saveCategory(category: EventCategory): Promise<EventCategory> {
    const list = await this.getCategories();
    const index = list.findIndex((c) => c.id === category.id);
    if (index >= 0) {
      list[index] = category;
    } else {
      list.push(category);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(list));
    this.notifyChange();
    return category;
  }

  public async deleteCategory(id: string): Promise<void> {
    const list = await this.getCategories();
    const filtered = list.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
    this.notifyChange();
  }

  // --- EVENTOS / FATOS ---

  public async getEvents(): Promise<PoliticalEvent[]> {
    if (typeof window === 'undefined') return POLITICAL_EVENTS;
    const raw = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(POLITICAL_EVENTS));
      return POLITICAL_EVENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return POLITICAL_EVENTS;
    }
  }

  public async getEventById(id: string): Promise<PoliticalEvent | null> {
    const list = await this.getEvents();
    return list.find((e) => e.id === id) || null;
  }

  public async saveEvent(event: PoliticalEvent): Promise<PoliticalEvent> {
    const list = await this.getEvents();
    const index = list.findIndex((e) => e.id === event.id);
    if (index >= 0) {
      list[index] = event;
    } else {
      list.unshift(event); // Novos eventos aparecem no topo
    }
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(list));
    this.notifyChange();
    return event;
  }

  public async deleteEvent(id: string): Promise<void> {
    const list = await this.getEvents();
    const filtered = list.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(filtered));
    this.notifyChange();
  }

  // --- ATORES POLÍTICOS ---

  public async getActors(): Promise<PoliticalActor[]> {
    if (typeof window === 'undefined') return POLITICAL_ACTORS;
    const raw = localStorage.getItem(STORAGE_KEYS.ACTORS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ACTORS, JSON.stringify(POLITICAL_ACTORS));
      return POLITICAL_ACTORS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return POLITICAL_ACTORS;
    }
  }

  public async getActorById(id: string): Promise<PoliticalActor | null> {
    const list = await this.getActors();
    return list.find((a) => a.id === id) || null;
  }

  public async saveActor(actor: PoliticalActor): Promise<PoliticalActor> {
    const list = await this.getActors();
    const index = list.findIndex((a) => a.id === actor.id);
    if (index >= 0) {
      list[index] = actor;
    } else {
      list.push(actor);
    }
    localStorage.setItem(STORAGE_KEYS.ACTORS, JSON.stringify(list));
    this.notifyChange();
    return actor;
  }

  public async deleteActor(id: string): Promise<void> {
    const list = await this.getActors();
    const filtered = list.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ACTORS, JSON.stringify(filtered));
    this.notifyChange();
  }

  // --- MACRO-CENÁRIOS ---

  public async getScenarios(): Promise<MacroScenario[]> {
    if (typeof window === 'undefined') return MACRO_SCENARIOS;
    const raw = localStorage.getItem(STORAGE_KEYS.SCENARIOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(MACRO_SCENARIOS));
      return MACRO_SCENARIOS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return MACRO_SCENARIOS;
    }
  }

  public async getScenarioById(id: string): Promise<MacroScenario | null> {
    const list = await this.getScenarios();
    return list.find((s) => s.id === id) || null;
  }

  public async saveScenario(scenario: MacroScenario): Promise<MacroScenario> {
    const list = await this.getScenarios();
    const index = list.findIndex((s) => s.id === scenario.id);
    if (index >= 0) {
      list[index] = scenario;
    } else {
      list.push(scenario);
    }
    localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(list));
    this.notifyChange();
    return scenario;
  }

  public async deleteScenario(id: string): Promise<void> {
    const list = await this.getScenarios();
    const filtered = list.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(filtered));
    this.notifyChange();
  }

  // --- EXPORTAÇÃO, IMPORTAÇÃO E RESTAURAÇÃO ---

  public async exportBackup(): Promise<PoliticalDataBackupPayload> {
    const [categories, events, actors, scenarios] = await Promise.all([
      this.getCategories(),
      this.getEvents(),
      this.getActors(),
      this.getScenarios(),
    ]);

    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      categories,
      events,
      actors,
      scenarios,
    };
  }

  public async importBackup(payload: PoliticalDataBackupPayload): Promise<void> {
    if (payload.categories) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(payload.categories));
    }
    if (payload.events) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(payload.events));
    }
    if (payload.actors) {
      localStorage.setItem(STORAGE_KEYS.ACTORS, JSON.stringify(payload.actors));
    }
    if (payload.scenarios) {
      localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(payload.scenarios));
    }
    this.notifyChange();
  }

  public async resetToDefaults(): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(EVENT_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(POLITICAL_EVENTS));
    localStorage.setItem(STORAGE_KEYS.ACTORS, JSON.stringify(POLITICAL_ACTORS));
    localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(MACRO_SCENARIOS));
    this.notifyChange();
  }
}

// Instância padrão do repositório e do serviço para injeção global
export const defaultRepository: IPoliticalDataRepository = new LocalStoragePoliticalDataRepository();
