import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

export function HomePage(): JSX.Element {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items } = useCart();

  const cartItemCount = items.size;

  return (
    <div className="container mx-auto px-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 sm:mb-16 mt-6 sm:mt-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            {isAuthenticated ? 'Welcome back.' : 'Core Cashless'}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Event payments, simplified.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="space-y-3 sm:space-y-4 mb-10 sm:mb-16">
          <button
            onClick={() => navigate('/events')}
            className="w-full text-left p-4 sm:p-5 border rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Events</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Browse events, guest accounts, and balances
                </p>
              </div>
              <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </div>
          </button>

          <button
            onClick={() => navigate('/items')}
            className="w-full text-left p-4 sm:p-5 border rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Items</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Browse and add items to your cart
                </p>
              </div>
              <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </div>
          </button>

          <button
            onClick={() => navigate('/cart')}
            className="w-full text-left p-4 sm:p-5 border rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">
                  Cart{cartItemCount > 0 && ` (${cartItemCount})`}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Review and checkout
                </p>
              </div>
              <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">
                &rarr;
              </span>
            </div>
          </button>
        </div>

        {/* Auth Section */}
        {!isAuthenticated && (
          <div className="border-t pt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Sign in to access events and manage your account.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/login')} variant="outline">
                Sign In
              </Button>
              <Button onClick={() => navigate('/register')} variant="ghost">
                Create Account
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
