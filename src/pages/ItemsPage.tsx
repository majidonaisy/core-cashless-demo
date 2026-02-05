import { useEffect } from 'react';
import type { JSX } from 'react';
import { toast } from 'sonner';
import { useItems } from '@/hooks/useItems';
import { useCart } from '@/context/CartContext';
import type { SaleItem } from '@/types/api';
import ItemCard from '@/components/items/ItemCard';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ItemsPage(): JSX.Element {
  const { items, loading, error } = useItems();
  const { addToCart } = useCart();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleAddToCart = async (
    item: SaleItem,
    categoryId: number
  ): Promise<void> => {
    try {
      await addToCart(item, categoryId, 1);
      toast.success(`${item.name} added to cart!`);
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Shop Items
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Browse our collection of items and add them to your cart
          </p>
        </div>

        {/* Loading State with Skeleton */}
        {loading && (
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-24 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && items.length === 0 && (
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p className="text-xl font-semibold text-muted-foreground mb-2">
                No items available
              </p>
              <p className="text-sm text-muted-foreground">
                Please check back later for new items
              </p>
            </CardContent>
          </Card>
        )}

        {/* Items Grid by Category */}
        {!loading && !error && items.length > 0 && (
          <div className="space-y-12">
            {items.map((category, index) => (
              <div key={category.id}>
                {index > 0 && <Separator className="mb-12" />}

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h2 className="text-2xl sm:text-3xl font-bold">
                      {category.name}
                    </h2>
                    <Badge variant="secondary" className="text-sm">
                      {category.items.length}{' '}
                      {category.items.length === 1 ? 'item' : 'items'}
                    </Badge>
                  </div>
                  {category.description && (
                    <p className="text-muted-foreground text-lg">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {category.items.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={(item) => handleAddToCart(item, category.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
