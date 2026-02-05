import type { JSX } from 'react';
import type { Event, EventAccount } from '@/types/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import QRCodeDisplay from './QRCodeDisplay';

interface EventDetailProps {
  event: Event;
  guestAccount: EventAccount | null;
  balance: number | null;
  loading: boolean;
}

/**
 * Format date string to readable format
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format currency value
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default function EventDetail({
  event,
  guestAccount,
  balance,
  loading,
}: EventDetailProps): JSX.Element {
  return (
    <div className="space-y-6">
      {/* Event Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">{event.name}</CardTitle>
          <CardDescription>Event Details and Information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Start Time
                </p>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-primary"
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
                  <p className="text-sm">{formatDate(event.start)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  End Time
                </p>
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-primary"
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
                  <p className="text-sm">{formatDate(event.end)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {event.fee && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Entry Fee
                  </p>
                  <Badge variant="secondary" className="text-sm">
                    {formatCurrency(event.fee.amount / 100)}
                  </Badge>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Event ID
                </p>
                <p className="text-sm font-mono">{event.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Guest Account Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Guest Account</h3>

        {loading && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-48" />
              <p className="text-muted-foreground">Loading guest account...</p>
            </CardContent>
          </Card>
        )}

        {!loading && !guestAccount && (
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <p className="text-xl font-semibold text-muted-foreground mb-2">
                No guest account available
              </p>
              <p className="text-sm text-muted-foreground">
                Unable to retrieve account information for this event
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && guestAccount && (
          <div className="space-y-6">
            <QRCodeDisplay
              qrCodeUrl={guestAccount.qr_code}
              accountId={guestAccount.vid}
            />

            {/* Balance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stored Value Balance</CardTitle>
                <CardDescription>
                  Your current account balance for this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                {balance !== null ? (
                  <div className="flex items-center gap-3">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-2xl sm:text-3xl font-bold text-green-600">
                        {formatCurrency(balance / 100)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Available balance
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-amber-600">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <div>
                      <p className="text-lg font-semibold">
                        Unable to load balance
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Balance information is currently unavailable
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Account Name
                  </span>
                  <span className="text-sm font-medium">
                    {guestAccount.nickname || 'Guest Account'}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center gap-2">
                  <span className="text-sm text-muted-foreground shrink-0">
                    VID
                  </span>
                  <span className="text-sm font-mono font-medium truncate">
                    {guestAccount.vid}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center gap-2">
                  <span className="text-sm text-muted-foreground shrink-0">
                    CID
                  </span>
                  <span className="text-sm font-mono font-medium truncate">
                    {guestAccount.cid}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant={
                      guestAccount.status === 1 ? 'default' : 'secondary'
                    }
                  >
                    {guestAccount.status === 1 ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
