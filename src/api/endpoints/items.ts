import { apiClient } from '../client';
import type {
  ItemsRequest,
  ItemsResponse,
  ItemCategory,
} from '../../types/api';

/**
 * Items API endpoints
 */
export const itemsAPI = {
  /**
   * Get items and categories from the storefront
   *
   * Retrieves sale items organized by categories. Automatically filters out:
   * 1. Categories named "Reservation Packages" (reservations are out of scope)
   * 2. Categories with non-positive IDs (id <= 0)
   * 3. Items with non-positive IDs (id <= 0)
   *
   * This ensures only valid, purchasable items are returned for display.
   *
   * @param storefront - Storefront deployment ID (use 4 for sample dataset)
   * @returns Promise<ItemCategory[]> containing filtered categories with their items
   */
  async getItems(storefront: number = 4): Promise<ItemCategory[]> {
    try {
      const body: ItemsRequest = {
        storefront,
      };

      const response = (await apiClient.post(
        '/item/get.php',
        body
      )) as ItemsResponse;

      // Handle error response
      if (response.error) {
        console.error('API Error:', response.error.message);
        return [];
      }

      // Handle missing categories
      if (!response.categories || response.categories.length === 0) {
        return [];
      }

      // Filter categories:
      // 1. Exclude "Reservation Packages" category
      // 2. Exclude categories with id <= 0
      const filteredCategories = response.categories
        .filter((category) => {
          // Exclude Reservation Packages
          if (category.name === 'Reservation Packages') {
            return false;
          }
          // Exclude categories with non-positive IDs
          if (category.id <= 0) {
            return false;
          }
          return true;
        })
        .map((category) => {
          // Also filter items within each category to exclude items with id <= 0
          return {
            ...category,
            items: category.items.filter((item) => item.id > 0),
          };
        });

      return filteredCategories;
    } catch (error) {
      console.error('Failed to fetch items:', error);
      return [];
    }
  },
};
