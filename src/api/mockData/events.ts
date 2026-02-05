import type {
  EventType,
  Event,
  EventAccount,
  BalanceCheckResponse,
} from '@/types/api';

/**
 * Mock data for testing when API returns empty responses
 */

export const mockEventTypes: EventType[] = [
  {
    id: 1,
    name: 'Summer Music Festival',
    event: {
      id: 101,
      name: 'Summer Music Festival 2026',
      start_promotion: '2026-05-01T00:00:00Z',
      app_enable: '2026-06-01T00:00:00Z',
      start: '2026-07-15T10:00:00Z',
      end: '2026-07-17T23:00:00Z',
      fee: {
        name: 'Entry Fee',
        description: 'General admission ticket',
        amount: 15000, // $150.00
      },
      links: [],
    },
  },
  {
    id: 2,
    name: 'Food & Wine Expo',
    event: {
      id: 102,
      name: 'Food & Wine Expo 2026',
      start_promotion: '2026-04-15T00:00:00Z',
      app_enable: '2026-05-20T00:00:00Z',
      start: '2026-08-05T12:00:00Z',
      end: '2026-08-07T22:00:00Z',
      fee: {
        name: 'Admission',
        description: 'All-access pass',
        amount: 8500, // $85.00
      },
      links: [],
    },
  },
  {
    id: 3,
    name: 'Tech Conference',
    event: {
      id: 103,
      name: 'Tech Conference 2026',
      start_promotion: '2026-06-01T00:00:00Z',
      app_enable: '2026-07-15T00:00:00Z',
      start: '2026-09-20T09:00:00Z',
      end: '2026-09-22T18:00:00Z',
      fee: {
        name: 'Registration',
        description: 'Conference pass',
        amount: 25000, // $250.00
      },
      links: [],
    },
  },
  {
    id: 4,
    name: 'Holiday Market',
    event: null, // No upcoming event
  },
];

export const mockCurrentEvent: Event = {
  id: 101,
  type: 1,
  name: 'Summer Music Festival 2026',
  start_promotion: '2026-05-01T00:00:00Z',
  app_enable: '2026-06-01T00:00:00Z',
  start: '2026-07-15T10:00:00Z',
  end: '2026-07-17T23:00:00Z',
  fee: {
    name: 'Entry Fee',
    description: 'General admission ticket',
    amount: 15000, // $150.00
  },
};

export const mockEventAccount: EventAccount = {
  id: 1001,
  event_type: 1,
  status: 1,
  nickname: 'Guest Pass',
  qr_code:
    'https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=GUEST-101-ABC123',
  vid: 'VID-ABC123456',
  cid: 'CID-XYZ789012',
};

export const mockBalanceResponse: BalanceCheckResponse = {
  account_name: 'John Doe',
  purses: [
    {
      name: 'Food Credits',
      purse_num: 1,
      value: 5000, // $50.00
    },
    {
      name: 'Beverage Credits',
      purse_num: 2,
      value: 3000, // $30.00
    },
    {
      name: 'General Balance',
      purse_num: 3,
      value: 12500, // $125.00
    },
  ],
  entitlements: [],
  timeplay_remaining: 0,
  timeplay_running: false,
  timeplay_name: 'Timeplay',
};
