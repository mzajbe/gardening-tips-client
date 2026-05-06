/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */

"use client"

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { quotes } from "../../constants/quotes";

const Quets = () => {
  const [quote, setQuote] = useState<string>("");

  useEffect(() => {
    if (quotes && quotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
    }
  }, []);

  return (
    <Card className="shadow-md mb-6">
      <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold text-green-700 dark:text-green-400">
          Inspiring Gardening Quote
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <p aria-label="quote" className="text-sm italic ">
          {quote}
        </p>
        <div className="mt-3">
          <button
            className="px-3 py-1.5 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => {
              if (quotes && quotes.length > 0) {
                const idx = Math.floor(Math.random() * quotes.length);
                setQuote(quotes[idx]);
              }
            }}
          >
            New Quote
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Quets;
