import { useState, useEffect, useCallback } from 'react';
import { itemsAPI } from '@/api/endpoints/items';
import type { ItemCategory } from '@/types/api';

interface UseItemsReturn {
  items: ItemCategory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook to manage fetching items from the API
 * Fetches items on mount and provides a refetch function for manual refresh
 *
 * @returns Object containing items, loading state, error state, and refetch function
 */
export function useItems(): UseItemsReturn {
  const [items, setItems] = useState<ItemCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch items function
  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedItems = await itemsAPI.getItems(4); // storefront 4

      setItems(fetchedItems);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch items';
      setError(errorMessage);
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch items on mount
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Refetch function for manual refresh
  const refetch = useCallback(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    refetch,
  };
}
