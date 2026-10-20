import {
  EventCategory,
  PoliticalEvent,
  PoliticalActor,
  MacroScenario,
} from '../../data/politicalEventsData';

export interface PoliticalDataBackupPayload {
  version: string;
  exportedAt: string;
  categories: EventCategory[];
  events: PoliticalEvent[];
  actors: PoliticalActor[];
  scenarios: MacroScenario[];
}

/**
 * Secondary / Driven Port (Hexagonal Architecture)
 * Contrato de persistência e consulta independente de tecnologia de armazenamento.
 * Pode ser implementado por LocalStorage, PostgreSQL, Cloud SQL, Firestore, etc.
 */
export interface IPoliticalDataRepository {
  // Categorias
  getCategories(): Promise<EventCategory[]>;
  getCategoryById(id: string): Promise<EventCategory | null>;
  saveCategory(category: EventCategory): Promise<EventCategory>;
  deleteCategory(id: string): Promise<void>;

  // Eventos / Fatos Políticos
  getEvents(): Promise<PoliticalEvent[]>;
  getEventById(id: string): Promise<PoliticalEvent | null>;
  saveEvent(event: PoliticalEvent): Promise<PoliticalEvent>;
  deleteEvent(id: string): Promise<void>;

  // Atores Políticos (apontam para os fatos)
  getActors(): Promise<PoliticalActor[]>;
  getActorById(id: string): Promise<PoliticalActor | null>;
  saveActor(actor: PoliticalActor): Promise<PoliticalActor>;
  deleteActor(id: string): Promise<void>;

  // Macro-Cenários
  getScenarios(): Promise<MacroScenario[]>;
  getScenarioById(id: string): Promise<MacroScenario | null>;
  saveScenario(scenario: MacroScenario): Promise<MacroScenario>;
  deleteScenario(id: string): Promise<void>;

  // Exportação, Importação e Restauração de Base
  exportBackup(): Promise<PoliticalDataBackupPayload>;
  importBackup(payload: PoliticalDataBackupPayload): Promise<void>;
  resetToDefaults(): Promise<void>;
}
