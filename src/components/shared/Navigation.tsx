import { useState } from 'react';
import type { JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';

export function Navigation(): JSX.Element {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = (): void => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold shrink-0">
          CORE Cashless
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link to="/items">Items</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/events">Events</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/cart">Cart</Link>
            </Button>
          </div>
          <div className="flex gap-2">
            {isAuthenticated ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t px-4 pb-4 space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
            onClick={() => setMobileOpen(false)}
          >
            <Link to="/items">Items</Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
            onClick={() => setMobileOpen(false)}
          >
            <Link to="/events">Events</Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            asChild
            onClick={() => setMobileOpen(false)}
          >
            <Link to="/cart">Cart</Link>
          </Button>
          <Separator />
          {isAuthenticated ? (
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                asChild
                onClick={() => setMobileOpen(false)}
              >
                <Link to="/login">Login</Link>
              </Button>
              <Button
                className="flex-1"
                asChild
                onClick={() => setMobileOpen(false)}
              >
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
