import { motion } from "framer-motion";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-200 via-red-200 to-pink-300 p-6 text-center">
      {/* Heart Animation */}
      <motion.div
        className="text-7xl md:text-9xl text-red-600"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ❤️
      </motion.div>

      {/* Title */}
      <h1 className="mt-6 text-3xl md:text-5xl font-bold text-red-700 drop-shadow-lg">
        My Love, My honey, My pretty
      </h1>

      {/* Speech */}
      <p className="mt-4 max-w-md text-lg md:text-xl text-gray-700 font-medium">
        تشویش نکو مامایت خوب میشه گل سفید مه
      </p>
    </div>
  );
}
