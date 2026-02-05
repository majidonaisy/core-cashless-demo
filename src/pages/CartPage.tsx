import { useState } from 'react';
import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

/**
 * Format number as USD currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function CartPage(): JSX.Element {
  const { items, itemCount, removeFromCart, getCheckoutUrl } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<number | null>(null);

  // Convert Map to array for easier rendering
  const cartItems = Array.from(items.values());

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
    0
  );

  const handleRemoveItem = async (itemId: number): Promise<void> => {
    setRemovingItemId(itemId);
    try {
      await removeFromCart(itemId);
      toast.success('Item removed from cart');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to remove item from cart';
      toast.error(message);
    } finally {
      setRemovingItemId(null);
    }
  };

  const handleCheckout = (): void => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      setIsCheckoutOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Your Cart
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            {itemCount > 0
              ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your cart`
              : 'Your shopping cart is empty'}
          </p>
        </div>

        {/* Empty State */}
        {cartItems.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-xl font-semibold text-muted-foreground mb-2">
                Your cart is empty
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Add some items to get started
              </p>
              <Button asChild>
                <Link to="/items">Browse Items</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Cart Items */}
        {cartItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((cartItem) => (
                <Card key={cartItem.item.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg mb-1">
                          {cartItem.item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {cartItem.item.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">
                            Qty: {cartItem.quantity}
                          </Badge>
                          <span className="text-lg font-bold text-primary">
                            {formatCurrency(cartItem.item.price)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            each
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                        <p className="text-lg sm:text-xl font-bold">
                          {formatCurrency(
                            cartItem.item.price * cartItem.quantity
                          )}
                        </p>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveItem(cartItem.item.id)}
                          disabled={removingItemId === cartItem.item.id}
                        >
                          {removingItemId === cartItem.item.id ? (
                            'Removing...'
                          ) : (
                            <>
                              <svg
                                className="h-4 w-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Remove
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>
                    Review your order before checkout
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items</span>
                      <span className="font-medium">{itemCount}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button onClick={handleCheckout} className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/items">Continue Shopping</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}

        {/* Checkout Dialog with Iframe */}
        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-4xl h-[90vh] sm:h-[85vh] flex flex-col p-0">
            <DialogHeader className="px-6 pt-6 pb-4">
              <DialogTitle>Complete Your Purchase</DialogTitle>
              <DialogDescription>
                Complete the checkout process in the frame below
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0 px-6 pb-6">
              <iframe
                src={getCheckoutUrl() || ''}
                className="w-full h-full border rounded-md"
                title="Checkout"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
