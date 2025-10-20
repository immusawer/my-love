import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Heart, Sparkles, Star, Flower2, Crown } from "lucide-react";

export default function MarriageProposal() {
  const [particles, setParticles] = useState([]);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    {
      title: "My Dearest Halima",
      text: "You are the peace I never knew I needed, the calm in my chaos.",
      emoji: "💞",
    },
    {
      title: "Asal Ma",
      text: "چشمانت، آینه‌ی آرامش من است، صدایت، نغمه‌ی عشق جاودانم 💫",
      emoji: "🌙",
    },
    {
      title: "My Forever Dream",
      text: "Every heartbeat whispers your name — my destiny, my love.",
      emoji: "🌹",
    },
    {
      title: "My One & Only",
      text: "From the very first moment, my soul recognized you as home.",
      emoji: "💍",
    },
  ];

  const createParticle = useCallback((type) => {
    const id = Date.now() + Math.random();
    const types = {
      heart: { emoji: "❤️", color: "text-red-400" },
      sparkle: { emoji: "✨", color: "text-yellow-300" },
      flower: { emoji: "🌸", color: "text-pink-300" },
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
      }, 400),
      sparkle: setInterval(() => {
        setParticles((prev) => [...prev, createParticle("sparkle")]);
      }, 300),
      flower: setInterval(() => {
        setParticles((prev) => [...prev, createParticle("flower")]);
      }, 500),
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
          className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
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
        className="relative z-10 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 md:p-12 max-w-2xl w-full mx-auto"
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
            <Crown className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              To My Queen, Halima (Asal Ma)
            </h1>
            <Crown className="w-8 h-8 text-yellow-400" />
          </motion.div>

          {/* Animated Message Carousel */}
          <div className="h-32 relative">
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
                  className="text-2xl md:text-3xl font-semibold text-white mb-3 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  {messages[currentMessage].title}
                  <span>{messages[currentMessage].emoji}</span>
                </motion.h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                  {messages[currentMessage].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Love Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: Heart,
              label: "Days Loved",
              value: "∞",
              color: "text-red-400",
            },
            {
              icon: Star,
              label: "Memories",
              value: "1M+",
              color: "text-yellow-400",
            },
            {
              icon: Sparkles,
              label: "Magic",
              value: "100%",
              color: "text-purple-400",
            },
            {
              icon: Flower2,
              label: "Faithfulness",
              value: "Always",
              color: "text-pink-400",
            },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="bg-white/5 rounded-2xl p-4 text-center border border-white/5"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            >
              <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color}`} />
              <div className="text-2xl font-bold text-white">{item.value}</div>
              <div className="text-sm text-gray-400 mt-1">{item.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Persian Love Section */}
        <motion.div
          className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-2xl p-6 mb-6 border border-pink-500/20"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
        >
          <h3 className="text-xl font-semibold text-white text-center mb-4 flex items-center justify-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            برای عسل من، حلیمه
            <Heart className="w-5 h-5 text-red-400" />
          </h3>
          <div className="text-right space-y-3">
            <p className="text-lg text-gray-200 leading-8">
              تو تنها دلیل لبخندهای منی، نوری در تاریکی، آرامشی در طوفان.
            </p>
            <p className="text-lg text-gray-200 leading-8">
              عشق تو در رگ‌هایم می‌دود، تا ابد در قلبم خانه دارد.
            </p>
            <p className="text-lg text-gray-200 leading-8">
              با تمام وجودم، فقط تو را می‌خواهم.
            </p>
          </div>
        </motion.div>

        {/* Proposal Section */}
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center justify-center gap-4 text-gray-400">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
            <span className="text-sm">My Proposal</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
          </div>

          <motion.p
            className="text-2xl text-white font-light italic leading-relaxed"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            “Asal Ma, will you make me the luckiest man alive... and marry me?”
          </motion.p>

          <motion.div
            className="mt-6 pt-6 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <div className="text-4xl mb-2">💍</div>
            <p className="text-lg text-gray-400">Forever yours,</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mt-2">
              Your Soldier of Love ❤️
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating Hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/5 text-6xl"
            style={{ left: `${20 + i * 30}%`, top: `${20 + i * 20}%` }}
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 20 + i * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>
    </div>
  );
}
