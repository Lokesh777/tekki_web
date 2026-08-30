import './globals.css';
import AuthProvider from '@/components/AuthProvider';

export const metadata = {
  title: 'Project Management System',
  description: 'Internal project management tool with real-time collaboration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
