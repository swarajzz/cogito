"use client";

import { CreateMapModal } from "@/src/components/CreateMapModal";
import { Button } from "@/src/components/ui/button";
import { auth } from "@/src/lib/auth";
import { authClient } from "@/src/lib/auth-client";
import { Brain, CircleUser, Globe, Menu, Plus, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Session = typeof auth.$Infer.Session;

const Header = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLoggedIn = !!session;

  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname.includes("dashboard"));

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/home");
          router.refresh();
        },
      },
    });
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-surface/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-glow">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div className="hidden lg:block">
                <h1 className="font-heading text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  Cogito
                </h1>
                <p className="text-xs text-textSecondary">
                  AI Knowledge Mapping
                </p>
              </div>
            </Link>

            <div className="relative">
              <nav className="hidden md:flex items-center gap-3">
                {!pathname.includes("explore") && (
                  <Link href="/explore">
                    <Button
                      variant="ghost"
                      className="text-textSecondary hover:text-textPrimary"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Explore
                    </Button>
                  </Link>
                )}
                {isLoggedIn ? (
                  <>
                    {!pathname.includes("dashboard") && (
                      <Link href="/dashboard">
                        <Button
                          variant="ghost"
                          className="text-textSecondary hover:text-textPrimary"
                        >
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    <Button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Map
                    </Button>
                    <Button variant="destructive" onClick={handleLogout}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/sign-in">
                      <Button
                        variant="ghost"
                        className="text-textSecondary hover:text-textPrimary"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/dashboard">
                      <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </nav>

              {/* Mobile Nav Toggle */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-textSecondary"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>

              {/* Mobile Dropdown Menu */}
              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-4 w-64 bg-white border rounded-lg shadow-lg p-4 space-y-3 md:hidden z-50">
                  {!pathname.includes("explore") && (
                    <Link
                      href="/explore"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="text-textSecondary w-full justify-start hover:text-textPrimary"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Explore
                      </Button>
                    </Link>
                  )}
                  {isLoggedIn ? (
                    <>
                      {!pathname.includes("dashboard") && (
                        <Link
                          href="/dashboard"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                          >
                            Dashboard
                          </Button>
                        </Link>
                      )}
                      <Button
                        onClick={() => {
                          setShowCreateModal(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full justify-start bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Map
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="w-full justify-start"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/sign-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="text-textSecondary hover:text-textPrimary"
                        >
                          <CircleUser className="h-4 w-4 mr-2" />
                          Sign In
                        </Button>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button className="w-full justify-start bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {children}

      {showCreateModal && (
        <CreateMapModal
          onClose={() => setShowCreateModal(false)}
          onMapCreated={(mapData) => {
            // setSelectedMap(mapData);
            setShowCreateModal(false);
          }}
        />
      )}
    </>
  );
};

export default Header;
