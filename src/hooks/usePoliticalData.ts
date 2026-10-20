import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  EventCategory,
  PoliticalEvent,
  PoliticalActor,
  MacroScenario,
} from '../data/politicalEventsData';
import { PoliticalDataService } from '../domain/services/PoliticalDataService';
import {
  defaultRepository,
  DATA_MUTATION_EVENT,
} from '../infrastructure/adapters/LocalStoragePoliticalDataRepository';

export function usePoliticalData() {
  const service = useMemo(() => new PoliticalDataService(defaultRepository), []);

  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [events, setEvents] = useState<PoliticalEvent[]>([]);
  const [actors, setActors] = useState<PoliticalActor[]>([]);
  const [scenarios, setScenarios] = useState<MacroScenario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const reloadData = useCallback(async () => {
    try {
      const [catList, evtList, actList, scnList] = await Promise.all([
        service.listCategories(),
        service.listEvents(),
        service.listActors(),
        service.listScenarios(),
      ]);
      setCategories(catList);
      setEvents(evtList);
      setActors(actList);
      setScenarios(scnList);
      setError(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha ao carregar dados.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    reloadData();

    const handleDataChanged = () => {
      reloadData();
    };

    window.addEventListener(DATA_MUTATION_EVENT, handleDataChanged);
    return () => {
      window.removeEventListener(DATA_MUTATION_EVENT, handleDataChanged);
    };
  }, [reloadData]);

  return {
    service,
    categories,
    events,
    actors,
    scenarios,
    loading,
    error,
    reloadData,
  };
}
