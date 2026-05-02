import { Link, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/domains', label: 'Domains' },
];

export function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="text-xl font-bold">
              Polymath
            </Link>
            <nav className="flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === item.path
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <Toaster />
    </div>
  );
}
