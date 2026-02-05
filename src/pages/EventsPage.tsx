import type { JSX } from 'react';
import { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import type { Event, EventAccount } from '@/types/api';
import { useAuth } from '@/context/AuthContext';
import { useEvents } from '@/hooks/useEvents';
import { eventsAPI } from '@/api/endpoints/events';
import EventsList from '@/components/events/EventsList';
import EventDetail from '@/components/events/EventDetail';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function EventsPage(): JSX.Element {
  const { loginKey } = useAuth();
  const [useMockData, setUseMockData] = useState<boolean>(() => {
    const saved = localStorage.getItem('useMockEventData');
    return saved ? JSON.parse(saved) : false;
  });

  const {
    events: eventTypes,
    currentEvent,
    loading: eventsLoading,
    error: eventsError,
  } = useEvents({ forceMock: useMockData });

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [guestAccount, setGuestAccount] = useState<EventAccount | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [accountLoading, setAccountLoading] = useState(false);

  const handleMockDataToggle = (checked: boolean): void => {
    setUseMockData(checked);
    localStorage.setItem('useMockEventData', JSON.stringify(checked));
  };

  // Show toast for events loading error
  useEffect(() => {
    if (eventsError) {
      toast.error(eventsError);
    }
  }, [eventsError]);

  // Show toast for login key missing
  useEffect(() => {
    if (!loginKey) {
      toast.info(
        'Please log in to view event details and access your guest account'
      );
    }
  }, [loginKey]);

  // Extract events from event types, filtering out null events
  // Also convert EventListItem to Event by adding the type field
  // Memoized to prevent unnecessary recalculations
  const events: Event[] = useMemo(
    () =>
      eventTypes
        .filter((eventType) => eventType.event !== null)
        .map((eventType) => ({
          ...eventType.event!,
          type: eventType.id, // Use event type ID as the type field
        })),
    [eventTypes]
  );

  /**
   * Handle event selection and fetch guest account
   */
  const handleEventSelect = async (event: Event): Promise<void> => {
    setSelectedEvent(event);
    setGuestAccount(null);
    setBalance(null);

    if (!loginKey) {
      toast.error('You must be logged in to view event details');
      return;
    }

    setAccountLoading(true);

    try {
      // Fetch guest account for selected event
      const account = await eventsAPI.getEventAccount(
        loginKey,
        event.id,
        useMockData
      );

      if (!account) {
        toast.error('Unable to retrieve guest account for this event');
        setAccountLoading(false);
        return;
      }

      setGuestAccount(account);

      // Fetch balance using the account's VID
      const balanceResponse = await eventsAPI.checkBalance(
        loginKey,
        undefined,
        account.vid,
        useMockData
      );

      if (balanceResponse && !balanceResponse.error) {
        // Calculate total balance from all purses
        const totalBalance =
          balanceResponse.purses?.reduce(
            (sum, purse) => sum + purse.value,
            0
          ) ?? 0;
        setBalance(totalBalance);
      } else {
        // Balance check failed, but we still have the account
        console.warn('Balance check failed:', balanceResponse?.error?.message);
        setBalance(null);
      }
    } catch (err) {
      console.error('Failed to fetch event account:', err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while fetching event details';
      toast.error(errorMsg);
    } finally {
      setAccountLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">Events</h1>
            <p className="text-muted-foreground">
              Browse events and access your guest account
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="mock-data"
              checked={useMockData}
              onCheckedChange={handleMockDataToggle}
            />
            <Label htmlFor="mock-data" className="cursor-pointer">
              Use Mock Data
            </Label>
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Events List */}
        <div className="lg:h-[calc(100vh-16rem)] lg:overflow-y-auto">
          <EventsList
            events={events}
            currentEventId={currentEvent?.id ?? null}
            loading={eventsLoading}
            onSelectEvent={handleEventSelect}
          />
        </div>

        {/* Right Column: Event Detail or Placeholder */}
        <div className="lg:h-[calc(100vh-16rem)] lg:overflow-y-auto">
          {selectedEvent ? (
            <>
              <EventDetail
                event={selectedEvent}
                guestAccount={guestAccount}
                balance={balance}
                loading={accountLoading}
              />
            </>
          ) : (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-center text-muted-foreground">
                  Select an Event
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <svg
                  className="h-24 w-24 text-muted-foreground/30 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-lg text-muted-foreground text-center max-w-sm">
                  Choose an event from the list to view details, access your
                  guest account, and check your balance
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
