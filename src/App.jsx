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

  const coverPage = {
    title: "Our Eternal Love",
    subtitle: "A Collection of Our Most Precious Moments",
    names: "Halima & Musawer",
    date: "Since October 10, 2025",
    quote:
      "In your eyes, I found my home. In your heart, I found my love. In your soul, I found my mate.",
    dedication:
      "To my one and only,\nEvery word in this notebook\nis a heartbeat dedicated to you.",
    instruction: "Open with love...",
  };

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

        const pagesArray = [];
        let currentPageContent = "";
        let charCount = 0;
        const maxCharsPerPage = window.innerWidth < 768 ? 600 : 1200;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const lineWithNewline = line + "\n\n";
          const lineLength = lineWithNewline.length;

          if (
            charCount + lineLength > maxCharsPerPage &&
            currentPageContent.trim()
          ) {
            pagesArray.push(cleanPageEnding(currentPageContent.trim()));
            currentPageContent = lineWithNewline;
            charCount = lineLength;
          } else {
            currentPageContent += lineWithNewline;
            charCount += lineLength;
          }
        }

        if (currentPageContent.trim()) {
          pagesArray.push(cleanPageEnding(currentPageContent.trim()));
        }

        function cleanPageEnding(content) {
          content = content.replace(/\n+$/, "");
          const lastChar = content.slice(-1);
          if (![".", "!", "?", ":", ")", "]", "}"].includes(lastChar)) {
            content += "...";
          }
          return content;
        }

        if (pagesArray.length === 0)
          throw new Error("No content could be parsed");

        setPages(pagesArray);
        setCurrentPage(0);
      } catch (error) {
        console.error("Error loading messages:", error);
        setError(error.message);

        setPages([
          "My dearest love,\n\nEvery moment with you feels like a beautiful dream that I never want to wake up from...",
          "Your smile lights up my world in ways that words can never fully express...",
          "Through all our conversations, laughter, and shared moments, my love for you has only grown stronger...",
          "You are my greatest adventure, my deepest love, and my happiest ending...\n\nWith all my heart, yours eternally.",
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

  const renderCover = () => (
    <motion.div
      key="cover"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="w-full h-full flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100/80 via-pink-50/80 to-amber-50/80"></div>
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23be185d' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute top-4 left-4 text-rose-300 text-3xl rotate-0">
        ❦
      </div>
      <div className="absolute top-4 right-4 text-rose-300 text-3xl rotate-90">
        ❦
      </div>
      <div className="absolute bottom-4 left-4 text-rose-300 text-3xl -rotate-90">
        ❦
      </div>
      <div className="absolute bottom-4 right-4 text-rose-300 text-3xl rotate-180">
        ❦
      </div>

      <div className="relative z-10 text-center max-w-xl mx-auto px-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 md:mb-12"
        >
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-4 md:mb-6">
            <Heart className="w-5 h-5 md:w-8 md:h-8 fill-rose-400 text-rose-400" />
            <h1 className="text-2xl md:text-5xl font-bold text-rose-900 font-serif tracking-tight leading-tight">
              {coverPage.title}
            </h1>
            <Heart className="w-5 h-5 md:w-8 md:h-8 fill-rose-400 text-rose-400" />
          </div>
          <p className="text-sm md:text-xl text-rose-600 italic px-2 md:px-8">
            {coverPage.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 md:mb-14"
        >
          <div className="inline-block px-4 py-2 md:px-8 md:py-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg mb-2">
            <h2 className="text-xl md:text-3xl font-bold text-white font-serif tracking-wide">
              {coverPage.names}
            </h2>
          </div>
          <p className="text-sm md:text-lg text-rose-500 font-medium">
            {coverPage.date}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-8 md:mb-12 px-2 md:px-8"
        >
          <div className="relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-rose-300 text-3xl md:text-4xl">
              "
            </div>
            <p className="text-sm md:text-lg text-rose-700 italic leading-relaxed md:leading-loose px-2">
              {coverPage.quote}
            </p>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-rose-300 text-3xl md:text-4xl">
              "
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 md:mt-12 pt-4 md:pt-8 border-t border-rose-200/50 mx-2 md:mx-8"
        >
          <p className="text-sm md:text-lg text-rose-600 whitespace-pre-line font-handwriting leading-relaxed">
            {coverPage.dedication}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1.5 }}
          className="mt-6 md:mt-10 text-rose-400 text-sm md:text-base"
        >
          <p className="animate-pulse">{coverPage.instruction}</p>
          <p className="text-xs md:text-sm text-rose-300 mt-1">
            Press Spacebar or click → to begin
          </p>
        </motion.div>
      </div>
    </motion.div>
  );

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
      className="w-full h-full overflow-y-auto relative"
      ref={contentRef}
    >
      <div className="p-4 md:p-10">
        <div
          className="font-handwriting text-sm md:text-lg lg:text-xl text-rose-900 whitespace-pre-line leading-relaxed md:leading-loose mx-auto px-2"
          style={{
            fontFamily: "'Dancing Script', cursive",
            hyphens: "auto",
            wordBreak: "break-word",
            textAlign: "justify",
            maxWidth: "90%",
          }}
        >
          {pages[currentPage]}
          {currentPage === pages.length - 1 ? (
            <div className="mt-8 pt-4 border-t border-rose-200/50 text-center">
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
            <div className="mt-4 pt-2 text-center">
              <div className="inline-block h-px w-12 bg-rose-200/50"></div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
        <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-rose-200/50">
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
      <main className="max-w-6xl mx-auto">
        <div className="relative">
          <motion.div
            className="relative bg-gradient-to-br from-white to-rose-50 rounded-3xl shadow-2xl overflow-hidden border border-rose-200/30"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{ minHeight: "55vh", maxHeight: "75vh" }}
          >
            <AnimatePresence mode="wait">
              {showCover ? renderCover() : renderContentPage()}
            </AnimatePresence>

            {!isLocked && (
              <>
                <button
                  onClick={goToPrevPage}
                  disabled={isTurning || (showCover && currentPage === 0)}
                  className="absolute top-1/2 left-2 md:left-3 -translate-y-1/2 p-3 md:p-3 rounded-full bg-white/90 backdrop-blur-md shadow-lg hover:bg-white hover:shadow-xl disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 border border-rose-200/50"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-rose-700" />
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={
                    isTurning ||
                    (!showCover && currentPage === pages.length - 1)
                  }
                  className="absolute top-1/2 right-2 md:right-3 -translate-y-1/2 p-3 md:p-3 rounded-full bg-white/90 backdrop-blur-md shadow-lg hover:bg-white hover:shadow-xl disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300 border border-rose-200/50"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-rose-700" />
                </button>
              </>
            )}
          </motion.div>

          {/* Bottom Page Navigation */}
          {!isLocked && !showCover && (
            <motion.div className="mt-4 md:mt-6 bg-white/70 backdrop-blur-sm rounded-2xl p-3 md:p-4 shadow-lg border border-rose-200/30 overflow-x-auto whitespace-nowrap">
              {pages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  className={`inline-block mx-1 md:mx-2 px-3 py-1 md:px-4 md:py-2 rounded-full text-sm md:text-base font-medium transition-colors duration-300 ${
                    index === currentPage
                      ? "bg-rose-500 text-white"
                      : "bg-white text-rose-700 hover:bg-rose-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* File Upload */}
      <input
        type="file"
        accept=".txt"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 rounded-full bg-rose-200 hover:bg-rose-300 text-rose-900 font-medium shadow-md border border-rose-300/50"
        >
          Upload .txt File
        </button>
      </div>
    </div>
  );
}
