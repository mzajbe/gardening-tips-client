/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */

import { useEffect, useState } from "react";


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
        <div className="bg-green-100 p-4 border-l-4 border-green-500 shadow-md rounded-lg mb-6">  
      <h2 className="text-lg font-semibold text-green-700">Inspiring Gardening Quote</h2>  
      <p className="mt-2 text-gray-800 italic">{quote}</p>  
    </div> 
    );
};

export default Quets;