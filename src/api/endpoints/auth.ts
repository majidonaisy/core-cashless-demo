import { apiClient } from '../client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  LogoutRequest,
  LogoutResponse,
  PasswordResetRequest,
  PasswordResetResponse,
} from '../../types/api';

/**
 * Authentication API endpoints
 */
export const authAPI = {
  /**
   * Login to an account
   * Authenticates a user with username and password, returning a login key for subsequent authenticated requests.
   *
   * @param username - The user's email address
   * @param password - The user's password
   * @param cart_identifier - Optional cart identifier to associate with the logged-in user
   * @param keep_alive - If true, extends the login key expiration to 1 year (default: false)
   * @param app_name - Name of the application making the request (default: "CORE Cashless")
   * @param app_version - Version of the application making the request (default: "1.0.0")
   * @returns Promise<LoginResponse> containing login_key and optional cart
   */
  login(
    username: string,
    password: string,
    cart_identifier?: string,
    keep_alive: boolean = false,
    app_name: string = 'CORE Cashless',
    app_version: string = '1.0.0'
  ): Promise<LoginResponse> {
    const body: LoginRequest = {
      username,
      password,
      cart_identifier,
      keep_alive,
      app_name,
      app_version,
    };

    return apiClient.post('/account/login.php', body) as Promise<LoginResponse>;
  },

  /**
   * Create a passwordless account
   * Creates a new user account without requiring a password.
   * The user can later set a password and activate the account in a single step.
   *
   * @param username - The email address for the new account
   * @returns Promise<RegisterResponse> containing success status
   */
  register(username: string): Promise<RegisterResponse> {
    const body: RegisterRequest = {
      username,
    };

    return apiClient.post(
      '/account/create-passwordless.php',
      body
    ) as Promise<RegisterResponse>;
  },

  /**
   * Logout from an account
   * Invalidates the current login key, ending the user's session.
   *
   * @param login_key - The login key to invalidate
   * @returns Promise<LogoutResponse> containing success status
   */
  logout(login_key: string): Promise<LogoutResponse> {
    const body: LogoutRequest = {
      login_key,
    };

    return apiClient.post(
      '/account/logout.php',
      body
    ) as Promise<LogoutResponse>;
  },

  /**
   * Request a password reset
   * Initiates a password reset process for the specified username.
   * A password reset email will be sent if the account exists.
   *
   * @param username - The email address for the account
   * @returns Promise<PasswordResetResponse> containing success status
   */
  passwordReset(username: string): Promise<PasswordResetResponse> {
    const body: PasswordResetRequest = {
      username,
    };

    return apiClient.post(
      '/account/password-reset.php',
      body
    ) as Promise<PasswordResetResponse>;
  },
};
