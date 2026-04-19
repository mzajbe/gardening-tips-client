/* eslint-disable prettier/prettier */
"use client";

import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { Crown, Check } from "lucide-react";
import { Button } from "../ui/button";

const PremiumTeaser = () => {
  return (
    <Card className="relative overflow-hidden shadow-lg border-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/40 dark:via-green-950/30 dark:to-teal-950/40">
      {/* Decorative glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-teal-400/20 dark:bg-teal-500/10 rounded-full blur-2xl" />

      <CardContent className="relative p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-300">
              Go Premium
            </h3>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/70 font-medium">
              $1.00/month
            </p>
          </div>
        </div>

        {/* Pitch */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
          Unlock exclusive gardening tips, expert Q&As, and downloadable guides.
        </p>

        {/* Mini feature list */}
        <ul className="space-y-1.5 mb-4">
          {[
            "Exclusive tips & articles",
            "Expert Q&A sessions",
            "Community forums",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link href="/premium">
          <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 h-9 text-sm">
            Upgrade Now
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PremiumTeaser;
