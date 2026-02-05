import { apiClient } from '../client';
import type {
  EventsResponse,
  CurrentEventResponse,
  EventAccountRequest,
  EventAccountResponse,
  BalanceCheckRequest,
  BalanceCheckResponse,
  EventType,
  Event,
  EventAccount,
} from '../../types/api';
import {
  mockEventTypes,
  mockCurrentEvent,
  mockEventAccount,
  mockBalanceResponse,
} from '../mockData/events';

/**
 * Events API endpoints
 */
export const eventsAPI = {
  /**
   * List all event types
   *
   * Retrieves all event types along with their current or closest upcoming event.
   * Each event type will have an associated event (if available).
   *
   * @param forceMock - If true, always return mock data instead of calling the API
   * @returns Promise<EventType[]> containing all event types with their events
   */
  async listEvents(forceMock: boolean = false): Promise<EventType[]> {
    // Return mock data immediately if forced
    if (forceMock) {
      console.info('Using mock data (force mock enabled)');
      return mockEventTypes;
    }
    try {
      const response = (await apiClient.post(
        '/event/list.php',
        {}
      )) as EventsResponse;

      if (response.error) {
        console.error('List events error:', response.error.message);
        return [];
      }

      return response.event_types || [];
    } catch (error) {
      console.error('Failed to fetch events:', error);
      return [];
    }
  },

  /**
   * Get current or upcoming event
   *
   * Retrieves the currently active event, or the closest upcoming event
   * if no event is currently active.
   *
   * @param forceMock - If true, always return mock data instead of calling the API
   * @returns Promise<Event | null> containing current/upcoming event details
   */
  async getCurrentEvent(forceMock: boolean = false): Promise<Event | null> {
    // Return mock data immediately if forced
    if (forceMock) {
      console.info('Using mock data (force mock enabled)');
      return mockCurrentEvent;
    }
    try {
      const response = (await apiClient.post(
        '/event/current.php',
        {}
      )) as CurrentEventResponse;

      if (response.error) {
        console.error('Get current event error:', response.error.message);
        return null;
      }

      return response.event || null;
    } catch (error) {
      console.error('Failed to fetch current event:', error);
      return null;
    }
  },

  /**
   * Get event account for authenticated user
   *
   * Retrieves or creates an account for the authenticated user for a specific event.
   * Returns account details including QR code, VID, and CID.
   *
   * @param login_key - Authentication token for the user
   * @param event - The event ID to retrieve an account for
   * @param forceMock - If true, always return mock data instead of calling the API
   * @returns Promise<EventAccount | null> containing event account details with QR code
   */
  async getEventAccount(
    login_key: string,
    event: number,
    forceMock: boolean = false
  ): Promise<EventAccount | null> {
    // Return mock data immediately if forced
    if (forceMock) {
      console.info('Using mock event account (force mock enabled)');
      return mockEventAccount;
    }
    try {
      const body: EventAccountRequest = {
        login_key,
        event,
      };

      const response = (await apiClient.post(
        '/event/get-account.php',
        body
      )) as EventAccountResponse;

      if (response.error) {
        console.error('Get event account error:', response.error.message);
        return null;
      }

      return response.account || null;
    } catch (error) {
      console.error('Failed to get event account:', error);
      return null;
    }
  },

  /**
   * Check account balance
   *
   * Retrieves the stored value balance and entitlements for an account.
   * **Note: This endpoint requires employee authentication.**
   * It may not work with regular user login keys.
   *
   * @param login_key - Employee authentication token
   * @param qr_code - QR code identifying the account (required if vid not provided)
   * @param vid - Virtual ID identifying the account (required if qr_code not provided)
   * @param forceMock - If true, always return mock data instead of calling the API
   * @returns Promise<BalanceCheckResponse | null> containing balance details and purses
   */
  async checkBalance(
    login_key: string,
    qr_code?: string,
    vid?: string,
    forceMock: boolean = false
  ): Promise<BalanceCheckResponse | null> {
    // Return mock data immediately if forced
    if (forceMock) {
      console.info('Using mock balance data (force mock enabled)');
      return mockBalanceResponse;
    }
    try {
      const body: BalanceCheckRequest = {
        login_key,
        qr_code,
        vid,
      };

      const response = (await apiClient.post(
        '/event/balance-check.php',
        body
      )) as BalanceCheckResponse;

      if (response.error) {
        console.error('Balance check error:', response.error.message);
        return null;
      }

      return response;
    } catch (error) {
      console.error('Failed to check balance:', error);
      return null;
    }
  },
};
