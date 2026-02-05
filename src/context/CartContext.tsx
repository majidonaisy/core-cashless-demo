import type { JSX, ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '@/api/endpoints/cart';
import type { SaleItem } from '@/types/api';
import { useAuth } from './AuthContext';

// =============================================================================
// Types
// =============================================================================

export interface CartItem {
  item: SaleItem;
  quantity: number;
  category_id: number;
}

export interface CartContextType {
  cartId: string | null;
  items: Map<number, CartItem>;
  itemCount: number;
  loading: boolean;
  error: string | null;
  addToCart: (
    item: SaleItem,
    category_id: number,
    quantity?: number
  ) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  getCheckoutUrl: () => string | null;
}

// =============================================================================
// Context
// =============================================================================

const CartContext = createContext<CartContextType | undefined>(undefined);

// =============================================================================
// Provider
// =============================================================================

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [items, setItems] = useState<Map<number, CartItem>>(new Map());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { loginKey } = useAuth();

  // Restore cartId, checkoutUrl, and items from localStorage on mount
  useEffect(() => {
    const storedCartId = localStorage.getItem('cart_id');
    const storedCheckoutUrl = localStorage.getItem('checkout_url');
    const storedItems = localStorage.getItem('cart_items');

    if (storedCartId) {
      setCartId(storedCartId);
    }

    if (storedCheckoutUrl) {
      setCheckoutUrl(storedCheckoutUrl);
    }

    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems) as Array<
          [number, CartItem]
        >;
        setItems(new Map(parsedItems));
      } catch (err) {
        console.error('Failed to parse stored cart items:', err);
        localStorage.removeItem('cart_items');
      }
    }
  }, []);

  // Clear cart state when user logs out
  useEffect(() => {
    // If loginKey becomes null (user logged out), clear cart state
    if (loginKey === null) {
      setCartId(null);
      setCheckoutUrl(null);
      setItems(new Map());
      setError(null);
    }
  }, [loginKey]);

  // Compute item count from items Map
  const itemCount = Array.from(items.values()).reduce(
    (total, cartItem) => total + cartItem.quantity,
    0
  );

  /**
   * Add an item to the cart
   * If no cartId exists, start a new cart first
   */
  const addToCart = async (
    item: SaleItem,
    category_id: number,
    quantity: number = 1
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      let currentCartId = cartId;

      // Start a new cart if we don't have one
      if (!currentCartId) {
        const cartResponse = await cartAPI.startCart(loginKey || undefined);

        if (!cartResponse) {
          setError('Failed to start cart');
          return;
        }

        currentCartId = cartResponse.identifier;
        setCartId(currentCartId);
        localStorage.setItem('cart_id', currentCartId);

        // Store checkout URL if available
        if (cartResponse.complete_sale_url) {
          setCheckoutUrl(cartResponse.complete_sale_url);
          localStorage.setItem('checkout_url', cartResponse.complete_sale_url);
        }
      }

      // Add item to cart via API
      const updatedCart = await cartAPI.addToCart(
        currentCartId,
        category_id,
        item.id,
        quantity
      );

      if (!updatedCart) {
        setError('Failed to add item to cart');
        return;
      }

      // Update checkout URL if available in response
      if (updatedCart.complete_sale_url) {
        setCheckoutUrl(updatedCart.complete_sale_url);
        localStorage.setItem('checkout_url', updatedCart.complete_sale_url);
      }

      // Update local items Map
      const existingItem = items.get(item.id);
      const newQuantity = existingItem
        ? existingItem.quantity + quantity
        : quantity;

      const updatedItems = new Map(items);
      updatedItems.set(item.id, {
        item,
        quantity: newQuantity,
        category_id,
      });

      setItems(updatedItems);

      // Save to localStorage
      localStorage.setItem(
        'cart_items',
        JSON.stringify(Array.from(updatedItems.entries()))
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to add item to cart';
      setError(errorMessage);
      console.error('Add to cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove an item from the cart
   */
  const removeFromCart = async (itemId: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      if (!cartId) {
        setError('No active cart');
        return;
      }

      const cartItem = items.get(itemId);
      if (!cartItem) {
        setError('Item not found in cart');
        return;
      }

      console.log('Removing item:', {
        cartId,
        category_id: cartItem.category_id,
        item_id: itemId,
        qty: -1,
      });

      // Remove item via API (qty -1 removes all)
      const updatedCart = await cartAPI.removeFromCart(
        cartId,
        cartItem.category_id,
        itemId,
        -1
      );

      console.log('Remove response:', updatedCart);

      // Update checkout URL if available in response
      if (updatedCart?.complete_sale_url) {
        setCheckoutUrl(updatedCart.complete_sale_url);
        localStorage.setItem('checkout_url', updatedCart.complete_sale_url);
      }

      // Update local items Map
      const updatedItems = new Map(items);
      updatedItems.delete(itemId);
      setItems(updatedItems);

      // Save to localStorage
      if (updatedItems.size > 0) {
        localStorage.setItem(
          'cart_items',
          JSON.stringify(Array.from(updatedItems.entries()))
        );
      } else {
        localStorage.removeItem('cart_items');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to remove item from cart';
      setError(errorMessage);
      console.error('Remove from cart error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get the checkout URL for completing the purchase
   */
  const getCheckoutUrl = (): string | null => {
    // Return the stored checkout URL from API if available
    if (checkoutUrl) {
      return checkoutUrl;
    }

    // Fallback: construct URL with cart_id if no stored URL
    if (cartId) {
      return `/checkout/complete.php?cart_id=${cartId}`;
    }

    return null;
  };

  const value: CartContextType = {
    cartId,
    items,
    itemCount,
    loading,
    error,
    addToCart,
    removeFromCart,
    getCheckoutUrl,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// =============================================================================
// Hook
// =============================================================================

export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
