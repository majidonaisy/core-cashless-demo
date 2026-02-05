import type { JSX } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CheckoutModalProps {
  checkoutUrl: string;
  onClose: () => void;
}

export default function CheckoutModal({
  checkoutUrl,
  onClose,
}: CheckoutModalProps): JSX.Element {
  // Close modal when clicking backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <Card className="relative w-[600px] max-w-full shadow-2xl">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Complete Your Purchase</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <iframe
            src={checkoutUrl}
            className="w-full h-[700px] border-0"
            title="Checkout"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </CardContent>
      </Card>
    </div>
  );
}
