import type { JSX } from 'react';
import type { Event } from '@/types/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface EventsListProps {
  events: Event[];
  currentEventId: number | null;
  loading?: boolean;
  onSelectEvent: (event: Event) => void;
}

/**
 * Format date string to readable format
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

export default function EventsList({
  events,
  currentEventId,
  loading = false,
  onSelectEvent,
}: EventsListProps): JSX.Element {
  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <svg
            className="h-16 w-16 text-muted-foreground/50 mb-4"
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
          <p className="text-xl font-semibold text-muted-foreground mb-2">
            No events available
          </p>
          <p className="text-sm text-muted-foreground">
            Check back later for upcoming events
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      {events.map((event) => {
        const isCurrent = event.id === currentEventId;

        return (
          <Card
            key={event.id}
            className={`cursor-pointer transition-all hover:shadow-lg flex flex-col ${
              isCurrent
                ? 'border-primary border-2 bg-primary/5'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onSelectEvent(event)}
          >
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg line-clamp-2">
                  {event.name}
                </CardTitle>
                {isCurrent && (
                  <Badge
                    variant="default"
                    className="shrink-0 bg-green-600 hover:bg-green-600"
                  >
                    <span className="mr-1">🔴</span>
                    Current
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <div className="space-y-2 text-sm flex-1">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <svg
                    className="h-4 w-4 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">Starts</p>
                    <p className="break-words">{formatDate(event.start)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-muted-foreground">
                  <svg
                    className="h-4 w-4 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">Ends</p>
                    <p className="break-words">{formatDate(event.end)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-2">
                {event.fee && (
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium text-muted-foreground">
                      Entry Fee: ${(event.fee.amount / 100).toFixed(2)}
                    </p>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEvent(event);
                  }}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
