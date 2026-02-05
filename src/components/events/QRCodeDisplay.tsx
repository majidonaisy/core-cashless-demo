import type { JSX } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QRCodeDisplayProps {
  qrCodeUrl: string;
  accountId: string;
}

export default function QRCodeDisplay({
  qrCodeUrl,
  accountId,
}: QRCodeDisplayProps): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Your Guest Pass</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <div className="p-3 sm:p-4 bg-white rounded-lg shadow-sm max-w-full">
          <QRCodeCanvas
            value={qrCodeUrl}
            size={200}
            style={{ width: '100%', maxWidth: 256, height: 'auto' }}
          />
        </div>
        <p className="text-sm font-medium text-muted-foreground text-center break-all">
          Account ID:{' '}
          <span className="font-mono text-foreground">{accountId}</span>
        </p>
      </CardContent>
    </Card>
  );
}
