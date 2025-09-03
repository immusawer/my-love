import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function App() {
  const [hearts, setHearts] = useState([]);

  // Generate floating hearts
  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev,
        { id: Date.now(), left: Math.random() * 100 },
      ]);
      // Remove hearts after 4s
      setTimeout(() => setHearts((prev) => prev.slice(1)), 4000);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-300 via-red-200 to-pink-100 p-6 text-center overflow-hidden font-sans">
      {/* Floating hearts */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-red-500 text-3xl"
          style={{ left: `${heart.left}%`, bottom: 0 }}
          animate={{ y: -600, opacity: [1, 0] }}
          transition={{ duration: 4, ease: "easeOut" }}
        >
          ❤️
        </motion.div>
      ))}

      {/* Main Heart Animation */}
      <motion.div
        className="text-8xl md:text-[10rem] text-red-600 drop-shadow-lg"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ❤️
      </motion.div>

      {/* Title */}
      <motion.h1
        className="mt-6 text-4xl md:text-6xl font-bold text-red-700 drop-shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Forever Yours, My Heart
      </motion.h1>

      {/* Speech */}
      <motion.p
        className="mt-4 max-w-md text-lg md:text-2xl text-gray-700 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        تشویش نکو مامایت خوب میشه گل سفید مه
      </motion.p>
    </div>
  );
}
