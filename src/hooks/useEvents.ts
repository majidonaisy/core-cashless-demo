import { useState, useEffect, useCallback } from 'react';
import { eventsAPI } from '@/api/endpoints/events';
import type { EventType, Event } from '@/types/api';

interface UseEventsReturn {
  events: EventType[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseEventsOptions {
  forceMock?: boolean;
}

/**
 * Custom hook to manage fetching events and current event
 * Fetches both in parallel on mount and provides a refetch function
 *
 * @param options - Options object with forceMock flag
 * @returns Object containing events, currentEvent, loading state, error state, and refetch function
 */
export function useEvents(options: UseEventsOptions = {}): UseEventsReturn {
  const { forceMock = false } = options;
  const [events, setEvents] = useState<EventType[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events and current event in parallel
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both endpoints in parallel
      const [eventsList, current] = await Promise.all([
        eventsAPI.listEvents(forceMock),
        eventsAPI.getCurrentEvent(forceMock),
      ]);

      setEvents(eventsList);
      setCurrentEvent(current);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch events';
      setError(errorMessage);
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, [forceMock]);

  // Fetch events when forceMock changes
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Refetch function for manual refresh
  const refetch = fetchEvents;

  return {
    events,
    currentEvent,
    loading,
    error,
    refetch,
  };
}
