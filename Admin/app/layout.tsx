import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from './providers';
import { ModalProvider } from '@/providers/modal-provider';
import { ToastProvider } from '@/providers/toast-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Admin DashBoard',
  description: 'Admin Dashboard page',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className={'  min-h-screen '}>
            <ToastProvider />
            <ModalProvider />

            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
