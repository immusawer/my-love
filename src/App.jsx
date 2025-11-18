import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Heart, Sparkles, Star, Flower2, Crown } from "lucide-react";
import i from "./assets/download (1).jpg";
export default function MarriageProposal() {
  const [particles, setParticles] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showProposal, setShowProposal] = useState(false);

  const messages = [
    {
      title: "My Dearest Halima",
      text: "You are the peace I never knew I needed, the calm in my chaos, the missing piece of my soul.",
      emoji: "💞",
    },
    {
      title: "عشق ابدی من",
      text: "چشمانت، آینه‌ی آرامش من است، صدایت، نغمه‌ی عشق جاودانم 💫 تو تمام رویاهایم هستی",
      emoji: "🌙",
    },
    {
      title: "My Forever Dream",
      text: "Every heartbeat whispers your name — my destiny, my love, my eternal happiness.",
      emoji: "🌹",
    },
    {
      title: "My One & Only",
      text: "From the very first moment, my soul recognized you as home. You complete me in ways I never imagined.",
      emoji: "💍",
    },
  ];

  const createParticle = useCallback((type) => {
    const id = Date.now() + Math.random();
    const types = {
      heart: { emoji: "❤️", color: "text-red-400" },
      sparkle: { emoji: "✨", color: "text-yellow-300" },
      flower: { emoji: "🌸", color: "text-pink-300" },
      ring: { emoji: "💍", color: "text-white" },
    };

    return {
      id,
      type,
      left: Math.random() * 100,
      ...types[type],
      size: Math.random() * 20 + 15,
      duration: 4 + Math.random() * 3,
    };
  }, []);

  useEffect(() => {
    const intervals = {
      heart: setInterval(() => {
        setParticles((prev) => [...prev, createParticle("heart")]);
      }, 300),
      sparkle: setInterval(() => {
        setParticles((prev) => [...prev, createParticle("sparkle")]);
      }, 200),
      flower: setInterval(() => {
        setParticles((prev) => [...prev, createParticle("flower")]);
      }, 400),
      ring: setInterval(() => {
        setParticles((prev) => [...prev, createParticle("ring")]);
      }, 1000),
    };

    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 5000);

    return () => {
      Object.values(intervals).forEach(clearInterval);
      clearInterval(messageInterval);
    };
  }, [createParticle, messages.length]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      setParticles((prev) => prev.slice(-50));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      {/* Floating Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute pointer-events-none ${particle.color} text-2xl`}
            style={{
              left: `${particle.left}%`,
              bottom: "0%",
            }}
            initial={{ y: 0, opacity: 0, scale: 0 }}
            animate={{
              y: -1000,
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0.8],
              rotate: [0, particle.type === "heart" ? 360 : 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: particle.duration, ease: "easeOut" }}
          >
            {particle.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        className="relative z-10 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 md:p-12 max-w-4xl w-full mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, type: "spring" }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center gap-3 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            <Crown className="w-10 h-10 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              To My Queen, Halima Jan
            </h1>
            <Crown className="w-10 h-10 text-yellow-400" />
          </motion.div>

          {/* Animated Message Carousel */}
          <div className="h-40 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessage}
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h2
                  className="text-3xl md:text-4xl font-semibold text-white mb-4 flex items-center gap-3"
                  whileHover={{ scale: 1.05 }}
                >
                  {messages[currentMessage].title}
                  <span className="text-4xl">
                    {messages[currentMessage].emoji}
                  </span>
                </motion.h2>
                <p className="text-xl text-gray-200 leading-relaxed max-w-2xl">
                  {messages[currentMessage].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Proposal Image/GIF Section */}
        <motion.div
          className="relative mb-8 rounded-2xl overflow-hidden border-2 border-pink-400/30 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="bg-black/50 p-4 text-center">
            <p className="text-white text-lg italic mb-2">
              Our Future Moment...
            </p>
          </div>
          {/* Replace this div with your actual image or GIF */}
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 h-64 md:h-80 flex items-center justify-center relative">
            <div className="text-white text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-6xl mb-4"
              >
                💍
              </motion.div>
              <p className="text-xl font-semibold">
                Will You Marry Me, Halima Jan?
                <img src={i} alt="Pro" />
              </p>
            </div>

            {/* Animated ring */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 360],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="text-8xl">💎</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Love Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Heart,
              label: "Days Loved",
              value: "∞",
              color: "text-red-400",
              description: "Forever and always",
            },
            {
              icon: Star,
              label: "Memories",
              value: "1M+",
              color: "text-yellow-400",
              description: "And counting...",
            },
            {
              icon: Sparkles,
              label: "Magic",
              value: "100%",
              color: "text-purple-400",
              description: "You bring to my life",
            },
            {
              icon: Flower2,
              label: "Faithfulness",
              value: "Always",
              color: "text-pink-400",
              description: "Until the end of time",
            },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="bg-white/10 rounded-2xl p-4 text-center border border-white/10 hover:border-white/20 transition-all duration-300"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{
                scale: 1.08,
                backgroundColor: "rgba(255,255,255,0.15)",
              }}
            >
              <item.icon className={`w-10 h-10 mx-auto mb-3 ${item.color}`} />
              <div className="text-3xl font-bold text-white mb-1">
                {item.value}
              </div>
              <div className="text-sm text-gray-300 font-semibold">
                {item.label}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {item.description}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Persian Love Section */}
        <motion.div
          className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl p-8 mb-8 border border-pink-500/30 shadow-xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.01 }}
        >
          <h3 className="text-2xl font-semibold text-white text-center mb-6 flex items-center justify-center gap-3">
            <Heart className="w-6 h-6 text-red-400" />
            حلیمه جان
            <Heart className="w-6 h-6 text-red-400" />
          </h3>
          <div className="text-right space-y-4">
            <p className="text-xl text-gray-100 leading-9">
              تو تنها دلیل لبخندهای منی، نوری در تاریکی، آرامشی در طوفان، و معنی
              واقعی عشق در زندگی‌ام.
            </p>
            <p className="text-xl text-gray-100 leading-9">
              عشق تو در رگ‌هایم می‌دود، تا ابد در قلبم خانه دارد، و روح مرا به
              پرواز درمی‌آورد.
            </p>
            <p className="text-xl text-gray-100 leading-9">
              با تمام وجودم، فقط تو را می‌خواهم، امروز، فردا، و برای همیشه.
            </p>
          </div>
        </motion.div>

        {/* Final Proposal Section */}
        <motion.div
          className="text-center space-y-6 bg-gradient-to-b from-white/5 to-transparent rounded-3xl p-8 border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center justify-center gap-4 text-gray-300">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/30"></div>
            <span className="text-lg font-semibold">
              The Most Important Question
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/30"></div>
          </div>

          <motion.div
            className="relative"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.p className="text-3xl md:text-4xl text-white font-light italic leading-relaxed mb-6">
              "My dearest Halima, you are my everything. Will you make me the
              luckiest man alive... and spend the rest of your life with me as
              my wife?"
            </motion.p>
          </motion.div>

          {/* Ring Animation */}
          <motion.div
            className="mt-4 pt-6 border-t border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <motion.div
              className="text-6xl mb-4 cursor-pointer"
              whileHover={{ scale: 1.3, rotate: 360 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => setShowProposal(!showProposal)}
            >
              💍
            </motion.div>

            <AnimatePresence>
              {showProposal && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mt-4 p-4 border border-white/10 rounded-xl"
                >
                  YES! 💖
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-xl text-gray-300 mt-4">
              Forever and always yours,
            </p>
            <p className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mt-2">
              Your Soldier of Love ❤️
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10 text-8xl"
            style={{
              left: `${15 + i * 20}%`,
              top: `${10 + i * 15}%`,
            }}
            animate={{
              rotate: [0, 360],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 25 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {i % 2 === 0 ? "❤️" : "💍"}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
