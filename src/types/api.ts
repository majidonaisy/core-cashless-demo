// =============================================================================
// Error Types
// =============================================================================

export interface PortalError {
  critical: boolean;
  type: 'generic' | 'format' | 'login' | 'comm' | 'data';
  message: string;
}

// =============================================================================
// Auth Types
// =============================================================================

export interface LoginResponse {
  error?: PortalError | null;
  login_key?: string;
  cart?: Cart | null;
}

export interface RegisterResponse {
  error?: PortalError | null;
  success?: boolean;
}

export interface LogoutResponse {
  error?: PortalError | null;
  success?: boolean;
}

export interface PasswordResetResponse {
  error?: PortalError | null;
  success?: boolean;
}

// =============================================================================
// Item Types
// =============================================================================

export interface SaleItem {
  id: number;
  name: string;
  description: string;
  price: number;
  qty_min: number;
  qty_max: number;
  image_url?: string;
  image_alt?: string;
  num_payments?: number | null;
  tiers?: Array<unknown> | null;
  add_mode?: string | null;
  replaces?: string | null;
}

export interface ItemCategory {
  id: number;
  name: string;
  description: string;
  items: SaleItem[];
  image_url?: string;
  image_alt?: string;
  type: 'items' | 'reservations';
}

export interface ItemsResponse {
  error?: PortalError | null;
  categories?: ItemCategory[];
  display_categories?: number[];
  store_etag?: string;
}

// =============================================================================
// Cart Types
// =============================================================================

export interface Cart {
  // Minimal cart representation
  [key: string]: unknown;
}

export interface CartResponse {
  identifier: string;
  valid: boolean;
  items: Array<unknown>;
  store_etag?: string;
  profile: number;
  last_update: string;
  complete_sale_url: string;
  added_items?: Array<unknown>;
  errors?: Array<unknown>;
  reservations?: Array<unknown>;
  promo_code?: string;
  subtotal?: number;
  taxes?: number;
}

export interface CartStartResponse {
  error?: PortalError | null;
  cart?: CartResponse;
}

export interface CartAddResponse {
  error?: PortalError | null;
  cart?: CartResponse;
}

export interface CartRemoveResponse {
  error?: PortalError | null;
  cart?: CartResponse;
}

// =============================================================================
// Event Types
// =============================================================================

export interface Fee {
  name: string;
  description: string;
  amount: number;
}

export interface Event {
  id: number;
  type: number;
  name: string;
  start_promotion: string;
  app_enable: string;
  start: string;
  end: string;
  fee?: Fee | null;
}

export interface EventListItem {
  id: number;
  name: string;
  start_promotion: string;
  app_enable: string;
  start: string;
  end: string;
  fee?: Fee | null;
  links?: Array<unknown>;
}

export interface EventType {
  id: number;
  name: string;
  event: EventListItem | null;
}

export interface EventsResponse {
  error?: PortalError | null;
  event_types?: EventType[];
}

export interface CurrentEventResponse {
  error?: PortalError | null;
  event?: Event;
}

export interface EventAccount {
  id: number;
  event_type: number;
  status: 0 | 1 | 2;
  nickname: string;
  qr_code: string;
  vid: string;
  cid: string;
}

export interface EventAccountResponse {
  error?: PortalError | null;
  account?: EventAccount;
}

export interface Purse {
  name: string;
  purse_num: number;
  value: number;
}

export interface BalanceCheckResponse {
  error?: PortalError | null;
  account_name?: string;
  purses?: Purse[];
  entitlements?: Array<unknown>;
  timeplay_remaining?: number;
  timeplay_running?: boolean;
  timeplay_name?: string;
}

// =============================================================================
// Demographics Types
// =============================================================================

export interface Demographics {
  first_name?: string;
  last_name?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  country?: string;
}

export interface DemographicsResponse {
  error?: PortalError | null;
  success?: boolean;
  demographics?: Demographics;
}

// =============================================================================
// Request Body Types
// =============================================================================

export interface LoginRequest {
  username: string;
  password: string;
  cart_identifier?: string;
  keep_alive?: boolean;
  app_name?: string;
  app_version?: string;
}

export interface RegisterRequest {
  username: string;
}

export interface LogoutRequest {
  login_key: string;
}

export interface PasswordResetRequest {
  username: string;
}

export interface CartStartRequest {
  login_key?: string;
  storefront?: number;
}

export interface CartAddRequest {
  cart_identifier: string;
  category_id: number;
  item_id: number;
  qty: number;
  account?: string;
  storefront?: number;
}

export interface CartRemoveRequest {
  cart_identifier: string;
  category_id: number;
  item_id: number;
  qty: number;
  account_id?: string;
  storefront?: number;
}

export interface ItemsRequest {
  category_id?: number;
  account_type?: number;
  category_list?: number[];
  storefront?: number;
  cart_key?: string;
}

export interface EventAccountRequest {
  login_key: string;
  event: number;
}

export interface BalanceCheckRequest {
  login_key: string;
  qr_code?: string;
  vid?: string;
}
