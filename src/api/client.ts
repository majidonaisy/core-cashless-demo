import axios from 'axios';
import type {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Read login_key from localStorage
    const loginKey = localStorage.getItem('login_key');

    // Only add login_key to endpoints that expect it
    // Cart add/remove endpoints don't accept login_key in the request body
    const excludeLoginKeyPaths = ['/cart/add.php', '/cart/remove.php'];
    const shouldAddLoginKey =
      loginKey &&
      config.data &&
      !excludeLoginKeyPaths.some((path) => config.url?.includes(path));

    // Add login_key to request body if applicable
    // Per API spec: login_key goes in request body, not headers
    if (shouldAddLoginKey) {
      if (typeof config.data === 'string') {
        try {
          const parsed = JSON.parse(config.data);
          config.data = JSON.stringify({ ...parsed, login_key: loginKey });
        } catch {
          // If parsing fails, keep original data
        }
      } else if (typeof config.data === 'object') {
        config.data = { ...config.data, login_key: loginKey };
      }
    }

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
      if (config.data && import.meta.env.DEV) {
        console.log('[API] Request body:', config.data);
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse['data'] => {
    // Return just the data on success
    return response.data;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - clear session
    if (error.response?.status === 401) {
      localStorage.removeItem('login_key');
      localStorage.removeItem('user');
    }

    // Transform error to consistent format
    const transformedError: {
      message: string;
      status: number | undefined;
      originalError: AxiosError;
    } = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
      originalError: error,
    };

    // Network error (no response)
    if (!error.response) {
      transformedError.message = 'Network error. Please check your connection.';
      transformedError.status = 0;
    }
    // Server responded with error
    else if (error.response.data) {
      // Try to extract error message from response
      const data = error.response.data as { error?: { message?: string } };
      if (data.error?.message) {
        transformedError.message = data.error.message;
      } else if (typeof data === 'string') {
        transformedError.message = data;
      } else {
        transformedError.message = error.message || 'Request failed';
      }
    }
    // Request timeout
    else if (error.code === 'ECONNABORTED') {
      transformedError.message = 'Request timeout. Please try again.';
    }
    // Other errors
    else {
      transformedError.message = error.message || 'An error occurred';
    }

    return Promise.reject(transformedError);
  }
);
