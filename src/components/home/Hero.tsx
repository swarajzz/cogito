"use client"
import { Button } from "@/src/components/ui/button";
import { Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <div className="max-w-4xl mx-auto text-center mb-16">
      <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
        <Sparkles className="h-4 w-4" />
        Transform Knowledge into Visual Maps
      </div>
      <h2 className="font-heading text-5xl font-bold text-textPrimary mb-6 leading-tight">
        Discover Connections in
        <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent block">
          Any Knowledge Domain
        </span>
      </h2>
      <p className="text-xl text-textSecondary mb-8 leading-relaxed max-w-3xl mx-auto">
        Create interactive concept maps powered by AI. Explore relationships
        between ideas, people, events, and concepts across any field of
        knowledge.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/auth/sign-in">
          <Button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 h-14 text-lg font-semibold shadow-lg px-8">
            <Sparkles className="mr-2 h-5 w-5" />
            Start Creating Maps
          </Button>
        </Link>
        <Link href="/explore">
          <Button
            variant="outline"
            className="h-14 px-8 border-2 hover:bg-surface/50 text-lg bg-transparent"
          >
            <Globe className="mr-2 h-5 w-5" />
            Explore Public Maps
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
