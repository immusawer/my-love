import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function App() {
  const [hearts, setHearts] = useState([]);
  const [sparkles, setSparkles] = useState([]);

  // Generate floating hearts
  useEffect(() => {
    const heartInterval = setInterval(() => {
      setHearts((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          left: Math.random() * 100,
          size: Math.random() * 25 + 20,
          emoji: ["❤️", "💖", "💗", "💓", "💞", "💕"][
            Math.floor(Math.random() * 6)
          ],
        },
      ]);
    }, 200);

    return () => clearInterval(heartInterval);
  }, []);

  // Generate sparkles on click
  useEffect(() => {
    const handleClick = (e) => {
      setSparkles((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
        },
      ]);

      setTimeout(() => {
        setSparkles((prev) => prev.slice(1));
      }, 2000);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-red-300 p-6 text-center overflow-hidden font-sans cursor-pointer">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-pink-400/30 via-purple-400/30 to-red-300/30"
        animate={{
          background: [
            "linear-gradient(45deg, #ff6b6b, #ff8e8e, #ffb6c1)",
            "linear-gradient(45deg, #ffb6c1, #ff8e8e, #ff6b6b)",
            "linear-gradient(45deg, #ff8e8e, #ff6b6b, #ffb6c1)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Floating hearts */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute pointer-events-none"
          style={{
            left: `${heart.left}%`,
            bottom: -50,
            fontSize: `${heart.size}px`,
            filter: "drop-shadow(0 0 10px rgba(255,255,255,0.8))",
          }}
          animate={{
            y: -800,
            opacity: [0, 1, 0.8, 0],
            rotate: [0, Math.random() * 360],
            scale: [0.8, 1.2, 0.9],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            ease: "easeOut",
          }}
          onAnimationComplete={() => {
            setHearts((prev) => prev.filter((h) => h.id !== heart.id));
          }}
        >
          {heart.emoji}
        </motion.div>
      ))}

      {/* Click sparkles */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute pointer-events-none text-3xl"
          style={{
            left: sparkle.x - 20,
            top: sparkle.y - 20,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180],
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          ✨
        </motion.div>
      ))}

      {/* Continuous sparkle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-200 text-2xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* Floating rose petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300 text-3xl"
            style={{
              left: `${Math.random() * 120 - 10}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, 600],
              x: [0, Math.random() * 200 - 100],
              opacity: [0, 0.8, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 7,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
          >
            {["🌸", "🌺", "🌷", "💮"][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </div>

      {/* Main Content Container */}
      <motion.div
        className="relative z-10 bg-white/20 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-white/30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, type: "spring" }}
      >
        {/* Glowing Main Heart */}
        <motion.div
          className="relative text-8xl md:text-[12rem] mb-6 mx-auto w-fit"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, -5, 5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="absolute inset-0 text-red-500 filter blur-md opacity-70"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ❤️
          </motion.div>
          <motion.div
            className="relative text-red-600 drop-shadow-2xl"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            ❤️
          </motion.div>
        </motion.div>

        {/* Title with gradient shine */}
        <motion.h1
          className="mt-4 text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-red-600 via-pink-500 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.span
            animate={{
              textShadow: [
                "0 0 20px rgba(255,255,255,0.5)",
                "0 0 30px rgba(255,105,180,0.8)",
                "0 0 20px rgba(255,255,255,0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            My Sweet Asal 🍯
          </motion.span>
        </motion.h1>

        {/* Romantic Quote */}
        <motion.div
          className="mb-8 p-6 bg-white/30 rounded-2xl border-2 border-white/40 shadow-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <motion.p
            className="text-2xl md:text-3xl text-red-800 font-light italic leading-relaxed"
            animate={{
              textShadow: [
                "0 0 10px rgba(255,255,255,0.5)",
                "0 0 15px rgba(255,255,255,0.8)",
                "0 0 10px rgba(255,255,255,0.5)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            "You are the honey that sweetens my life,
            <br />
            the light that guides my heart"
          </motion.p>
        </motion.div>

        {/* Persian Love Message */}
        <motion.div
          className="mb-8 p-8 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl border-2 border-white/30 shadow-2xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <motion.p
            className="text-3xl md:text-4xl text-white font-bold leading-relaxed drop-shadow-lg"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            عسل شیرین من 💝
          </motion.p>
          <motion.p
            className="text-xl md:text-2xl text-white/90 font-medium mt-4 leading-loose"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            چشمانت مانند ستاره‌ها می‌درخشد
            <br />
            و قلبم برای همیشه مال توست
            <br />
            تو زیباترین رویای من هستی ✨
          </motion.p>
        </motion.div>

        {/* Love Promise */}
        <motion.div
          className="mb-8 p-6 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl shadow-2xl border-2 border-white/40"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
        >
          <motion.p
            className="text-2xl md:text-3xl text-white font-bold mb-4"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💖 Promise of My Heart 💖
          </motion.p>
          <p className="text-xl text-white/90 font-medium italic">
            "I promise to cherish every moment with you, to love you more each
            day, and to always be your safe haven"
          </p>
        </motion.div>

        {/* Forever Signature */}
        <motion.div
          className="p-6 bg-white/40 rounded-2xl border-2 border-white/50 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.2 }}
        >
          <motion.p
            className="text-2xl text-red-700 font-bold"
            animate={{
              textShadow: "0 0 20px rgba(255,255,255,0.8)",
            }}
            whileHover={{ scale: 1.1 }}
          >
            Forever Yours,
            <br />
            <span className="text-3xl bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Your Eternal Love
            </span>
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Floating love phrases */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {["I Love You", "My Asal", "Forever", "💝", "My Honey"].map(
          (text, i) => (
            <motion.div
              key={i}
              className="absolute text-white/40 text-xl font-bold"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 0.7, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              {text}
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
