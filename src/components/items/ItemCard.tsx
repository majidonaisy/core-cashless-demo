import type { JSX } from 'react';
import type { SaleItem } from '@/types/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ItemCardProps {
  item: SaleItem;
  onAddToCart: (item: SaleItem) => void;
}

/**
 * Truncate text to specified length and add ellipsis if needed
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

/**
 * Format number as USD currency
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default function ItemCard({
  item,
  onAddToCart,
}: ItemCardProps): JSX.Element {
  const handleAddToCart = (): void => {
    onAddToCart(item);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{item.name}</CardTitle>
        <CardDescription>{truncateText(item.description, 100)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-2xl font-bold text-primary">
          {formatCurrency(item.price)}
        </p>
        {item.qty_min > 1 && (
          <p className="text-sm text-muted-foreground mt-2">
            Minimum quantity: {item.qty_min}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
