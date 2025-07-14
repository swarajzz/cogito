"use client";
import { CreateMapModal } from "@/src/components/CreateMapModal";
import { Button } from "@/src/components/ui/button";
import { authClient } from "@/src/lib/auth-client";
import { Brain, Globe, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: session, error } = authClient.useSession();

  const isLoggedIn = !!session;

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-surface/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-glow">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  Cogito
                </h1>
                <p className="text-xs text-textSecondary">
                  AI Knowledge Mapping
                </p>
              </div>
            </div>
            <nav className="flex items-center gap-3">
              <Link href="/explore">
                <Button
                  variant="ghost"
                  className="text-textSecondary hover:text-textPrimary"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Explore Public Maps
                </Button>
              </Link>
              {isLoggedIn ? (
                <>
                  {/* <Button
                    variant="ghost"
                    className="text-textSecondary hover:text-textPrimary"
                  >
                    Settings
                  </Button> */}
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Map
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
                  <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg">
                    Get Started
                  </Button>
                </>
              )}
            </nav>
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
}
