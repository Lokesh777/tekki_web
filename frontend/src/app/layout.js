import './globals.css';

export const metadata = {
  title: 'Project Management System',
  description: 'Internal project management tool with real-time collaboration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
