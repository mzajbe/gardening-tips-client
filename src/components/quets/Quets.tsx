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
    "বাগান করা হলো আগামীকালকে বিশ্বাস করা।",
    "যে গাছ লাগায়, সে আশা রোপণ করে।",
    "বাগান একটি বন্ধু, যার কাছে আপনি যে কোনো সময় যেতে পারেন।",
    "প্রকৃতির প্রতিটি সুন্দর জিনিসের পিছনে একটু সময় ও যত্ন লুকিয়ে থাকে।",
    "গাছ লাগান, পৃথিবী বাঁচান।",
    "বাগান হলো মনের প্রতিচ্ছবি।",
    "একটি ফুল ফোটানো মানে একটি আনন্দ ছড়িয়ে দেওয়া।",
    "প্রকৃতির কাছে ফিরে যাওয়াই হলো সবচেয়ে বড় শান্তি।",
    "যেখানে ফুল ফোটে, সেখানে আশাও ফোটে।",
    "মাটির ঘ্রাণ আর পাতার সবুজই আসল প্রশান্তি।",
    "বাগান করা এমন এক শিল্প, যেখানে ক্যানভাস হলো মাটি।",
    "প্রতিটি বীজ একটি নতুন স্বপ্নের শুরু।",
    "ধৈর্য ধরতে হলে একজন মালির কাছে শিখুন।",
    "একটি সুন্দর বাগান একদিনে তৈরি হয় না, এটি অনেক যত্নের ফসল।",
    "যে ব্যক্তি বাগান ভালোবাসে, সে কখনো একা থাকে না।",
    "প্রকৃতির কাছাকাছি থাকা মানে নিজের কাছাকাছি থাকা।",
    "গাছের যত্ন নেওয়া মানে নিজের মনের যত্ন নেওয়া।",
    "সবুজের মাঝে হারিয়ে যাওয়াই হলো আসল স্বাধীনতা।",
    "যে বাগান করে, সে কখনো বৃদ্ধ হয় না।",
    "একটি ছোট বাগান আপনার সারা জীবনের আনন্দের উৎস হতে পারে।",
    "গাছের পাতার মর্মর ধ্বনি প্রকৃতির শ্রেষ্ঠ সঙ্গীত।",
    "বাগান হলো প্রকৃতির নিজের তৈরি করা স্বর্গ।",
    "একটি সুন্দর ফুল সব কষ্ট ভুলিয়ে দিতে পারে।",
    "মাটির সাথে সম্পর্ক মানুষের সবচেয়ে প্রাচীন এবং অটুট বন্ধন।",
    "গাছের কাছে গেলে মন আপনাআপনি ভালো হয়ে যায়।",
    "বাগান করা হলো প্রকৃতির সাথে সরাসরি কথা বলা।",
    "যে বাড়িতে একটি বাগান আছে, সে বাড়িতে সুখের অভাব হয় না।",
    "প্রতিটি নতুন কুঁড়ি একটি নতুন সম্ভাবনার প্রতীক।",
    "গাছপালার মতো নীরব বন্ধু আর কেউ হতে পারে না।",
    "সবুজ মানেই সতেজতা, সবুজ মানেই জীবন।"
  ];

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <Card className="shadow-md mb-6">
      <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
        <CardTitle className="text-lg font-semibold text-green-700 dark:text-green-400">
          Inspiring Gardening Quote
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4">
        <p className="text-sm italic " aria-label="quote">
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