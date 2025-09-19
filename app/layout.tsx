export const metadata = {
  title: 'Spy Cats Dashboard',
  description: 'Manage Spy Cats (CRUD)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif', margin: 0 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
          <h1 style={{ margin: '8px 0 16px' }}>Spy Cats Dashboard</h1>
          {children}
        </div>
      </body>
    </html>
  );
}

