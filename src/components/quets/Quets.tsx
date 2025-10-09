/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */

"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
// Adjust the import path to your setup. This example uses a common Shadcn UI pattern.


const Quets = () => {
  const [quote, setQuote] = useState<string>("");

  const quotes = [
    "To plant a garden is to believe in tomorrow. – Audrey Hepburn",
    "Gardening adds years to your life and life to your years. – Unknown",
    "The garden is a mirror of the heart. – Anonymous",
    "A garden is a friend you can visit anytime. – Unknown",
    "In every gardener there is a child who believes in The Seed Fairy. – Barbara Kingsolver",
    "Planting a garden is the most optimistic act I know. – Lotte N. Lann",
    "The love of gardening is a seed once sown that never dies. – Gertrude Jekyll",
    "He who plants a garden plants happiness. – Chinese Proverb",
    "Gardens are a form of autobiography. – Sydney Eddison",
    "Gardening is the purest of human pleasures. – Francis Bacon",
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md mb-6">
      <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold text-green-700 dark:text-green-400">
          Inspiring Gardening Quote
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <p className="text-sm text-gray-800 italic dark:text-gray-200" aria-label="quote">
          {quote}
        </p>
        {/* Optional: a small refresh button to get a new quote without reloading the page */}
        <div className="mt-3">
          <button
            onClick={() => {
              const idx = Math.floor(Math.random() * quotes.length);
              setQuote(quotes[idx]);
            }}
            className="px-3 py-1.5 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            New Quote
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Quets;