import { apiClient } from '../client';
import type {
  CartStartRequest,
  CartStartResponse,
  CartAddRequest,
  CartAddResponse,
  CartRemoveRequest,
  CartRemoveResponse,
  CartResponse,
} from '../../types/api';

/**
 * Cart API endpoints
 */
export const cartAPI = {
  /**
   * Start a new shopping cart
   *
   * Creates a new shopping cart, optionally associating it with a user profile and storefront.
   * This must be called before adding any items to a cart.
   *
   * @param login_key - Optional authentication token to associate the cart with a user profile
   * @param storefront - Optional storefront ID to associate with the cart (default: 0)
   * @returns Promise<CartResponse> containing cart identifier and details
   */
  async startCart(
    login_key?: string,
    storefront?: number
  ): Promise<CartResponse | null> {
    try {
      const body: CartStartRequest = {};

      // Only include optional parameters if provided
      if (login_key !== undefined) {
        body.login_key = login_key;
      }
      if (storefront !== undefined) {
        body.storefront = storefront;
      }

      const response = (await apiClient.post(
        '/cart/start.php',
        body
      )) as CartStartResponse;

      if (response.error) {
        console.error('Cart start error:', response.error.message);
        return null;
      }

      return response.cart || null;
    } catch (error) {
      console.error('Failed to start cart:', error);
      return null;
    }
  },

  /**
   * Add an item to the shopping cart
   *
   * Adds a specified quantity of an item to the cart. The cart must already exist
   * (created via startCart).
   *
   * @param cart_identifier - The unique identifier of the cart
   * @param category_id - The category ID of the item to add
   * @param item_id - The item ID to add to the cart
   * @param qty - The quantity to add (must be at least 1)
   * @param account - Optional account ID to associate the item with
   * @param storefront - Optional storefront ID
   * @returns Promise<CartResponse> containing updated cart details
   */
  async addToCart(
    cart_identifier: string,
    category_id: number,
    item_id: number,
    qty: number,
    account?: string,
    storefront?: number
  ): Promise<CartResponse | null> {
    try {
      const body: CartAddRequest = {
        cart_identifier,
        category_id,
        item_id,
        qty,
      };

      // Only include optional parameters if provided
      if (account !== undefined) {
        body.account = account;
      }
      if (storefront !== undefined) {
        body.storefront = storefront;
      }

      const response = (await apiClient.post(
        '/cart/add.php',
        body
      )) as CartAddResponse;

      if (response.error) {
        console.error('Add to cart error:', response.error.message);
        return null;
      }

      return response.cart || null;
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      return null;
    }
  },

  /**
   * Remove an item from the shopping cart
   *
   * Removes a specified quantity of an item from the cart.
   * Use qty of -1 to remove all instances of a specific item.
   *
   * @param cart_identifier - The unique identifier of the cart
   * @param category_id - The category ID of the item to remove
   * @param item_id - The item ID to remove from the cart
   * @param qty - The quantity to remove (use -1 to remove all, or a positive number)
   * @param account_id - Optional account ID associated with the item
   * @param storefront - Optional storefront ID
   * @returns Promise<CartResponse> containing updated cart details
   */
  async removeFromCart(
    cart_identifier: string,
    category_id: number,
    item_id: number,
    qty: number,
    account_id?: string,
    storefront?: number
  ): Promise<CartResponse | null> {
    try {
      const body: CartRemoveRequest = {
        cart_identifier,
        category_id,
        item_id,
        qty,
      };

      // Only include optional parameters if provided
      if (account_id !== undefined) {
        body.account_id = account_id;
      }
      if (storefront !== undefined) {
        body.storefront = storefront;
      }

      const response = (await apiClient.post(
        '/cart/remove.php',
        body
      )) as CartRemoveResponse;

      if (response.error) {
        console.error('Remove from cart error:', response.error.message);
        throw new Error(
          response.error.message || 'Failed to remove item from cart'
        );
      }

      return response.cart || null;
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw error;
    }
  },
};
