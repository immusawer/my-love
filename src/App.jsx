import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function App() {
  const [hearts, setHearts] = useState([]);

  // Generate floating hearts
  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev,
        {
          id: Date.now(),
          left: Math.random() * 100,
          size: Math.random() * 20 + 15, // Random size between 15-35px
        },
      ]);
      // Remove hearts after 4s
      setTimeout(() => setHearts((prev) => prev.slice(1)), 4000);
    }, 300); // More frequent hearts
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 via-red-300 to-pink-200 p-6 text-center overflow-hidden font-sans">
      {/* Floating hearts */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-red-500"
          style={{
            left: `${heart.left}%`,
            bottom: 0,
            fontSize: `${heart.size}px`,
          }}
          animate={{
            y: -600,
            opacity: [0, 1, 0],
            rotate: [0, Math.random() * 20 - 10], // Slight random rotation
          }}
          transition={{ duration: 4 + Math.random() * 2, ease: "easeOut" }}
        >
          ❤️
        </motion.div>
      ))}

      {/* Main Heart Animation */}
      <motion.div
        className="text-8xl md:text-[10rem] text-red-600 drop-shadow-lg mb-4"
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 5, -5, 0],
        }}
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
        Paroo Aziz{" "}
      </motion.h1>

      {/* Romantic Message */}
      <motion.p
        className="mt-6 max-w-md text-xl md:text-2xl text-red-800 font-medium italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      >
        Every beat of my heart whispers your name
      </motion.p>

      {/* Persian Message with Enhanced Romance */}
      <motion.div
        className="mt-8 p-6 bg-white/40 rounded-2xl shadow-lg max-w-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
      >
        <p className="text-2xl md:text-3xl text-red-700 font-semibold leading-relaxed">
          سینه ات د دهنم{" "}
        </p>
        <p className="mt-4 text-lg text-red-600">
          میبوسم از لبت
          <br />
          از گردنت
          <br />
          از چاک گریبان ات
        </p>
      </motion.div>

      {/* Romantic Signature */}
      <motion.p
        className="mt-8 text-xl text-red-900 font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2 }}
      >
        Forever Yours
      </motion.p>
    </div>
  );
}
