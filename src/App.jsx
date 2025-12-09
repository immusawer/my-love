"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  RotateCcw,
  Lock,
  LockOpen,
  Star,
  Home,
  SkipBack,
  SkipForward,
} from "lucide-react";

export default function LoveNotebook() {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isTurning, setIsTurning] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState("messages.txt");
  const [totalLines, setTotalLines] = useState(0);
  const [pageFlipDirection, setPageFlipDirection] = useState("right");
  const [isLocked, setIsLocked] = useState(false);
  const [showCover, setShowCover] = useState(true);

  const contentRef = useRef(null);
  const fileInputRef = useRef(null);

  // Cover page content
  const coverPage = {
    title: "Our Eternal Love",
    subtitle: "A Collection of Our Most Precious Moments",
    names: "Halima & Musawer",
    date: "Since October 10, 2023",
    quote:
      "In your eyes, I found my home. In your heart, I found my love. In your soul, I found my mate.",
    dedication:
      "To my one and only,\nEvery word in this notebook\nis a heartbeat dedicated to you.",
    instruction: "Open with love...",
  };

  // Load messages from text file
  const loadMessages = useCallback(
    async (file = null) => {
      setIsLoading(true);
      setError(null);

      try {
        let text = "";

        if (file) {
          text = await file.text();
          setFileName(file.name);
        } else {
          const response = await fetch(`/${fileName}`);
          if (!response.ok)
            throw new Error(`Failed to load file: ${response.status}`);
          text = await response.text();
        }

        const lines = text.split("\n");
        setTotalLines(lines.length);

        if (!text.trim()) throw new Error("File is empty");

        // Process text into well-formatted pages
        const pagesArray = [];
        let currentPageContent = "";
        let charCount = 0;
        const maxCharsPerPage = window.innerWidth < 768 ? 800 : 1200; // Adjust based on screen size

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const lineWithNewline = line + "\n\n";
          const lineLength = lineWithNewline.length;

          // Check if adding this line would exceed page limit
          if (
            charCount + lineLength > maxCharsPerPage &&
            currentPageContent.trim()
          ) {
            // Clean up the current page and add it
            pagesArray.push(cleanPageEnding(currentPageContent.trim()));
            currentPageContent = lineWithNewline;
            charCount = lineLength;
          } else {
            currentPageContent += lineWithNewline;
            charCount += lineLength;
          }
        }

        // Add the last page
        if (currentPageContent.trim()) {
          pagesArray.push(cleanPageEnding(currentPageContent.trim()));
        }

        // Helper function to clean page endings
        function cleanPageEnding(content) {
          // Remove trailing newlines
          content = content.replace(/\n+$/, "");

          // Ensure page ends with proper punctuation if possible
          const lastChar = content.slice(-1);
          if (![".", "!", "?", ":", ")", "]", "}"].includes(lastChar)) {
            // If it ends mid-sentence, add ellipsis
            content += "...";
          }

          return content;
        }

        console.log(
          `Created ${pagesArray.length} pages from ${lines.length} lines`
        );

        if (pagesArray.length === 0)
          throw new Error("No content could be parsed");

        setPages(pagesArray);
        setCurrentPage(0);
      } catch (error) {
        console.error("Error loading messages:", error);
        setError(error.message);

        // Fallback romantic messages with perfect endings
        setPages([
          "My dearest love,\n\nEvery moment with you feels like a beautiful dream that I never want to wake up from. Your presence in my life has transformed ordinary days into extraordinary memories.\n\nI remember the way your eyes light up when you laugh, the gentle touch of your hand in mine, and the comfort of your voice that feels like home...",

          "Your smile lights up my world in ways that words can never fully express. I cherish every memory we've created together, from our long conversations under the stars to the quiet mornings where we simply exist in each other's presence.\n\nYou are the melody to my heart's song, the color to my world's canvas.",

          "Through all our conversations, laughter, and shared moments, my love for you has only grown stronger. Each day with you is a blessing I never take for granted.\n\nThe way you understand me without words, the way you support me without hesitation, makes me fall in love with you all over again...",

          "You are my greatest adventure, my deepest love, and my happiest ending.\n\nForever yours, in this life and every life that follows.\n\nWith all my heart and soul,\nYours eternally.",
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [fileName]
  );

  useEffect(() => {
    loadMessages();
  }, []);

  // Page navigation with flip animation
  const goToNextPage = useCallback(() => {
    if (currentPage < pages.length && !isTurning && !isLocked) {
      if (showCover) {
        setShowCover(false);
        setCurrentPage(0);
      } else if (currentPage < pages.length - 1) {
        setPageFlipDirection("right");
        setIsTurning(true);
        setCurrentPage((prev) => prev + 1);
        setTimeout(() => setIsTurning(false), 500);
      }
    }
  }, [currentPage, pages.length, isTurning, isLocked, showCover]);

  const goToPrevPage = useCallback(() => {
    if (!isTurning && !isLocked) {
      if (currentPage === 0 && !showCover) {
        setShowCover(true);
      } else if (currentPage > 0) {
        setPageFlipDirection("left");
        setIsTurning(true);
        setCurrentPage((prev) => prev - 1);
        setTimeout(() => setIsTurning(false), 500);
      }
    }
  }, [currentPage, isTurning, isLocked, showCover]);

  // Go to specific page
  const goToPage = useCallback(
    (pageIndex) => {
      if (
        pageIndex >= 0 &&
        pageIndex < pages.length &&
        !isTurning &&
        !isLocked
      ) {
        setPageFlipDirection(pageIndex > currentPage ? "right" : "left");
        setIsTurning(true);
        setShowCover(false);
        setCurrentPage(pageIndex);
        setTimeout(() => setIsTurning(false), 500);
      }
    },
    [currentPage, pages.length, isTurning, isLocked]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLocked) return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown")
        goToNextPage();
      if (e.key === "ArrowLeft" || e.key === "PageUp") goToPrevPage();
      if (e.key === "Home") setShowCover(true);
      if (e.key === "End") goToPage(pages.length - 1);
      if (e.key === "Escape") setIsLocked(!isLocked);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextPage, goToPrevPage, goToPage, isLocked, showCover, pages.length]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/plain") {
      loadMessages(file);
      setShowCover(true);
    } else {
      setError("Please upload a valid .txt file");
    }
  };

  // Render cover page
  const renderCover = () => (
    <motion.div
      key="cover"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="w-full h-full flex flex-col items-center justify-center p-8 md:p-12 lg:p-16 relative overflow-hidden"
    >
      {/* Cover background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100/80 via-pink-50/80 to-amber-50/80"></div>

      {/* Decorative pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23be185d' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 text-rose-300 text-3xl md:text-4xl">
        ❦
      </div>
      <div className="absolute top-4 right-4 md:top-6 md:right-6 text-rose-300 text-3xl md:text-4xl rotate-90">
        ❦
      </div>
      <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-rose-300 text-3xl md:text-4xl -rotate-90">
        ❦
      </div>
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 text-rose-300 text-3xl md:text-4xl rotate-180">
        ❦
      </div>

      {/* Main cover content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-4">
        {/* Decorative border */}
        <div className="absolute -inset-6 md:-inset-8 border-2 border-rose-200/50 rounded-3xl opacity-30"></div>

        {/* Title section with proper spacing */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
            <Heart className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 fill-rose-400 text-rose-400" />
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-rose-900 font-serif tracking-tight leading-tight">
              {coverPage.title}
            </h1>
            <Heart className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 fill-rose-400 text-rose-400" />
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-rose-600 italic px-4 md:px-8">
            {coverPage.subtitle}
          </p>
        </motion.div>

        {/* Names with proper padding */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-10 md:mb-14"
        >
          <div className="inline-block px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg mb-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white font-serif tracking-wide">
              {coverPage.names}
            </h2>
          </div>
          <p className="text-base md:text-lg lg:text-xl text-rose-500 font-medium">
            {coverPage.date}
          </p>
        </motion.div>

        {/* Quote with balanced spacing */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-10 md:mb-12 px-4 md:px-8"
        >
          <div className="relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-rose-300 text-3xl md:text-4xl">
              "
            </div>
            <p className="text-base md:text-lg lg:text-xl text-rose-700 italic leading-relaxed md:leading-loose px-4">
              {coverPage.quote}
            </p>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-rose-300 text-3xl md:text-4xl">
              "
            </div>
          </div>
        </motion.div>

        {/* Dedication with proper line spacing */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-rose-200/50 mx-4 md:mx-8"
        >
          <p className="text-base md:text-lg text-rose-600 whitespace-pre-line font-handwriting leading-relaxed">
            {coverPage.dedication}
          </p>
        </motion.div>

        {/* Open book hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.5 }}
          className="mt-10 md:mt-14 text-rose-400 text-sm md:text-base"
        >
          <p className="animate-pulse">{coverPage.instruction}</p>
          <p className="text-xs md:text-sm text-rose-300 mt-2">
            Press Spacebar or click → to begin
          </p>
        </motion.div>
      </div>
    </motion.div>
  );

  // Render content page with perfect margins and endings
  const renderContentPage = () => (
    <motion.div
      key={currentPage}
      custom={pageFlipDirection}
      initial={
        pageFlipDirection === "right"
          ? { opacity: 0, x: 100, rotateY: 90 }
          : { opacity: 0, x: -100, rotateY: -90 }
      }
      animate={{
        opacity: 1,
        x: 0,
        rotateY: 0,
        transition: { type: "spring", stiffness: 300, damping: 25 },
      }}
      exit={
        pageFlipDirection === "right"
          ? { opacity: 0, x: -100, rotateY: -90 }
          : { opacity: 0, x: 100, rotateY: 90 }
      }
      className="w-full h-full overflow-y-auto"
      ref={contentRef}
    >
      {/* Page content with perfect padding and margins */}
      <div className="p-6 md:p-10 lg:p-12">
        <div
          className="font-handwriting text-base md:text-lg lg:text-xl text-rose-900 whitespace-pre-line leading-relaxed md:leading-loose"
          style={{
            fontFamily: "'Dancing Script', cursive",
            hyphens: "auto",
            wordBreak: "break-word",
            textAlign: "justify",
            margin: "0 auto",
            maxWidth: "800px",
          }}
        >
          {pages[currentPage]}

          {/* Page end decoration */}
          {currentPage === pages.length - 1 ? (
            <div className="mt-12 pt-6 border-t border-rose-200/50 text-center">
              <p className="text-rose-500 italic text-sm md:text-base">
                The end... but our story continues forever.
              </p>
              <div className="flex justify-center gap-2 mt-2">
                <Heart className="w-4 h-4 fill-rose-300 text-rose-300" />
                <Heart className="w-4 h-4 fill-rose-300 text-rose-300" />
                <Heart className="w-4 h-4 fill-rose-300 text-rose-300" />
              </div>
            </div>
          ) : (
            <div className="mt-8 pt-4 text-center">
              <div className="inline-block h-px w-16 bg-rose-200/50"></div>
            </div>
          )}
        </div>
      </div>

      {/* Page number - positioned properly */}
      <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8">
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm border border-rose-200/50">
          <span className="text-rose-700 font-serif text-sm md:text-base font-medium">
            {currentPage + 1} <span className="text-rose-400 mx-1">/</span>{" "}
            {pages.length}
          </span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 p-4 md:p-6 lg:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-200/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 24 + 12}px`,
            }}
            animate={{
              y: [0, -40, 0],
              rotate: [0, 360, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 18 + Math.random() * 12,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            {["❤️", "💖", "💕", "✨", "🌸"][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      {/* Header with perfect spacing */}
      <header className="max-w-6xl mx-auto mb-6 md:mb-8 lg:mb-10 px-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6"
        >
          {/* Logo and title */}
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-rose-500" />
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-rose-900">
                Our Love Notebook
              </h1>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm text-rose-600">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {fileName}
              </span>
              <span className="hidden md:inline">•</span>
              <span>{pages.length} pages</span>
              <span className="hidden md:inline">•</span>
              <span>{totalLines.toLocaleString()} lines</span>
            </div>
          </div>

          {/* Controls with proper spacing */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Lock toggle */}
            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`p-2.5 rounded-full transition-all duration-300 ${
                isLocked
                  ? "bg-rose-500 text-white"
                  : "bg-white/80 text-rose-600 hover:bg-white"
              }`}
              title={
                isLocked ? "Unlock navigation (Esc)" : "Lock navigation (Esc)"
              }
            >
              {isLocked ? (
                <Lock className="w-4 h-4" />
              ) : (
                <LockOpen className="w-4 h-4" />
              )}
            </button>

            {/* Home button */}
            <button
              onClick={() => setShowCover(true)}
              disabled={showCover}
              className={`p-2.5 rounded-full transition-all duration-300 ${
                showCover
                  ? "bg-rose-100 text-rose-400"
                  : "bg-white/80 text-rose-600 hover:bg-white"
              }`}
              title="Go to cover (Home)"
            >
              <Home className="w-4 h-4" />
            </button>

            {/* File upload */}
            <label className="cursor-pointer px-4 py-2.5 bg-white/80 hover:bg-white text-rose-700 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt"
                className="hidden"
              />
              📁 Upload
            </label>

            {/* Reload */}
            <button
              onClick={() => loadMessages()}
              className="p-2.5 rounded-full bg-white/80 hover:bg-white text-rose-600 transition-all duration-300 shadow-sm hover:shadow"
              title="Reload original file"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </header>

      {/* Error display with proper margins */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mb-6 md:mb-8 px-4"
        >
          <div className="p-4 bg-rose-100/90 backdrop-blur-sm border border-rose-300 rounded-xl shadow-sm">
            <p className="text-rose-700 text-sm">
              <strong>Note:</strong> {error}
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Notebook Container */}
      <main className="max-w-6xl mx-auto">
        <div className="relative">
          {/* Notebook Container with perfect proportions */}
          <motion.div
            className="relative bg-gradient-to-br from-white to-rose-50 rounded-3xl shadow-2xl overflow-hidden border border-rose-200/30"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              boxShadow: `
                0 20px 60px rgba(190, 24, 93, 0.15),
                0 10px 40px rgba(190, 24, 93, 0.1),
                inset 0 1px 1px rgba(255, 255, 255, 0.9)
              `,
              minHeight: "65vh",
              maxHeight: "70vh",
            }}
          >
            {/* Notebook spine */}
            <div className="absolute left-0 top-0 bottom-0 w-3 md:w-4 bg-gradient-to-r from-amber-800/15 to-amber-900/10"></div>

            {/* Paper texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.08]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 24px,
                    rgba(190, 24, 93, 0.07) 24px,
                    rgba(190, 24, 93, 0.07) 25px
                  )
                `,
              }}
            />

            {/* Page content area */}
            <div className="relative h-full">
              <AnimatePresence mode="wait">
                {showCover ? renderCover() : renderContentPage()}
              </AnimatePresence>
            </div>

            {/* Navigation buttons with proper positioning */}
            {!isLocked && (
              <>
                {/* Previous button */}
                <button
                  onClick={goToPrevPage}
                  disabled={isTurning || (showCover && currentPage === 0)}
                  className="absolute top-1/2 left-3 md:left-4 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md shadow-lg hover:bg-white hover:shadow-xl disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 border border-rose-200/50"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-rose-700" />
                </button>

                {/* Next button */}
                <button
                  onClick={goToNextPage}
                  disabled={
                    isTurning ||
                    (!showCover && currentPage === pages.length - 1)
                  }
                  className="absolute top-1/2 right-3 md:right-4 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md shadow-lg hover:bg-white hover:shadow-xl disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 border border-rose-200/50"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-rose-700" />
                </button>
              </>
            )}
          </motion.div>

          {/* Page navigation panel with perfect margins */}
          {!showCover && pages.length > 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 md:mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-lg border border-rose-200/30"
            >
              {/* Top controls */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 md:mb-6">
                {/* Quick navigation */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCover(true)}
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-sm transition-all duration-200 flex items-center gap-2"
                  >
                    <Home className="w-3 h-3" />
                    Cover
                  </button>
                  <button
                    onClick={() => goToPage(0)}
                    disabled={currentPage === 0}
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-sm disabled:opacity-30 transition-all duration-200 flex items-center gap-2"
                  >
                    <SkipBack className="w-3 h-3" />
                    First
                  </button>
                  <button
                    onClick={() => goToPage(pages.length - 1)}
                    disabled={currentPage === pages.length - 1}
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-sm disabled:opacity-30 transition-all duration-200 flex items-center gap-2"
                  >
                    <SkipForward className="w-3 h-3" />
                    Last
                  </button>
                </div>

                {/* Page selector */}
                <div className="flex items-center gap-3">
                  <span className="text-rose-600 text-sm">Page:</span>
                  <input
                    type="number"
                    min="1"
                    max={pages.length}
                    value={currentPage + 1}
                    onChange={(e) => {
                      const page = parseInt(e.target.value) - 1;
                      if (!isNaN(page) && page >= 0 && page < pages.length) {
                        goToPage(page);
                      }
                    }}
                    className="w-16 px-2 py-1.5 border border-rose-300 rounded-lg text-center text-rose-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400/50 bg-white/50"
                  />
                  <span className="text-rose-600 text-sm">
                    of {pages.length}
                  </span>
                </div>

                {/* Progress stats */}
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-base font-bold text-rose-700">
                      {currentPage + 1}
                    </div>
                    <div className="text-xs text-rose-500">Current</div>
                  </div>
                  <div className="h-6 w-px bg-rose-200"></div>
                  <div className="text-center">
                    <div className="text-base font-bold text-rose-700">
                      {Math.round(((currentPage + 1) / pages.length) * 100)}%
                    </div>
                    <div className="text-xs text-rose-500">Progress</div>
                  </div>
                </div>
              </div>

              {/* Progress bar with perfect margins */}
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max={pages.length - 1}
                  value={currentPage}
                  onChange={(e) => goToPage(parseInt(e.target.value))}
                  className="w-full h-2 bg-rose-200/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-500 [&::-webkit-slider-thumb]:hover:bg-rose-600 [&::-webkit-slider-thumb]:transition-colors"
                />
              </div>
            </motion.div>
          )}

          {/* Instructions with proper spacing */}
          {!isLocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-4 md:mt-6 text-rose-500 text-sm"
            >
              <p className="mb-1">
                {showCover
                  ? "Press Spacebar or click → to begin"
                  : "Use ← → arrows or Spacebar to navigate"}
              </p>
              {!showCover && (
                <p className="text-xs text-rose-400">
                  {isLocked
                    ? "Navigation locked • Press Esc to unlock"
                    : "PageUp/Down • Home/End • Esc to lock"}
                </p>
              )}
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer with perfect margins */}
      <footer className="max-w-4xl mx-auto mt-8 md:mt-10 lg:mt-12 px-4 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-4 text-rose-700"
        >
          {/* Love message */}
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 fill-rose-400 text-rose-400 animate-pulse" />
            <span className="text-lg font-semibold">
              A Testament to Our Love
            </span>
            <Heart className="w-5 h-5 fill-rose-400 text-rose-400 animate-pulse" />
          </div>

          {/* Romantic quote */}
          <p className="text-sm text-rose-500 max-w-md leading-relaxed">
            Every page turns with a heartbeat, every word whispers a memory, and
            every line echoes an "I love you" that lasts forever.
          </p>

          {/* Lock status indicator */}
          {isLocked && (
            <div className="mt-2 px-4 py-1.5 bg-amber-100/80 text-amber-700 rounded-full text-xs flex items-center gap-2">
              <Star className="w-3 h-3" />
              Navigation locked • Press Esc to unlock
            </div>
          )}
        </motion.div>
      </footer>

      {/* Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
