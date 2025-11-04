import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * AnimatedText component dengan berbagai animasi per huruf
 * @param {string} text - Teks yang akan dianimasikan
 * @param {string} animationType - Jenis animasi: 'typing', 'fade', 'slide', 'bounce', 'wave'
 * @param {number} delay - Delay sebelum animasi dimulai (ms)
 * @param {number} speed - Kecepatan animasi (ms per huruf)
 * @param {boolean} idleAnimation - Animasi idle setelah typing selesai
 * @param {string} className - CSS classes tambahan
 */
export function AnimatedText({
  text,
  animationType = "typing",
  delay = 0,
  speed = 50,
  idleAnimation = false,
  className = "",
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Typing animation effect
  useEffect(() => {
    if (animationType !== "typing") {
      setDisplayedText(text);
      return;
    }

    // Split text into characters
    const characters = text.split("");
    setDisplayedText("");
    setShowCursor(true);

    const timeout = setTimeout(() => {
      let currentIndex = 0;

      const typeNextChar = () => {
        if (currentIndex < characters.length) {
          const char = characters[currentIndex];
          // Add slight delay for spaces (pause) and punctuation
          let charSpeed = speed;
          if (char === " ") {
            charSpeed = speed * 1.5; // Pause pada spasi
          } else if (char === "&") {
            charSpeed = speed * 1.3; // Slight pause pada simbol
          }

          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
          setTimeout(typeNextChar, charSpeed);
        } else {
          // Typing complete
          setIsTypingComplete(true);
          // Hide cursor after typing completes
          setTimeout(() => setShowCursor(false), 500);
        }
      };

      typeNextChar();
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, animationType, delay, speed]);

  // Animasi per huruf untuk non-typing animations
  const getLetterVariants = (index, type) => {
    const baseDelay = index * 0.03;

    switch (type) {
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delay: baseDelay,
              duration: 0.3,
            },
          },
        };

      case "slide":
        return {
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              delay: baseDelay,
              duration: 0.4,
              ease: "easeOut",
            },
          },
        };

      case "bounce":
        return {
          hidden: { opacity: 0, y: -20, scale: 0.8 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              delay: baseDelay,
              type: "spring",
              stiffness: 300,
              damping: 15,
            },
          },
        };

      case "wave":
        return {
          hidden: { opacity: 0, y: 0, rotateX: -90 },
          visible: {
            opacity: 1,
            y: [0, -8, 0],
            rotateX: 0,
            transition: {
              delay: baseDelay,
              duration: 0.5,
              ease: "easeOut",
            },
          },
        };

      default:
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delay: baseDelay,
            },
          },
        };
    }
  };

  // Cursor blinking animation
  const cursorVariants = {
    blink: {
      opacity: [1, 0, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Idle animation variants for completed text (subtle glow effect)
  const idleTextVariants = {
    idle: {
      textShadow: [
        "0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)",
        "0 4px 16px rgba(255,255,255,0.25), 0 2px 6px rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)",
        "0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)",
      ],
      scale: [1, 1.005, 1],
      transition: {
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  if (animationType === "typing") {
    return (
      <motion.span
        className={className}
        variants={idleAnimation && isTypingComplete ? idleTextVariants : {}}
        animate={idleAnimation && isTypingComplete ? "idle" : {}}
      >
        {displayedText}
        {showCursor && (
          <motion.span
            variants={cursorVariants}
            animate="blink"
            className="inline-block w-0.5 h-[1em] bg-white ml-1 align-middle"
            style={{
              boxShadow: "0 0 4px rgba(255,255,255,0.8)",
            }}
          />
        )}
      </motion.span>
    );
  }

  // For other animation types, animate each letter
  return (
    <span className={className}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={getLetterVariants(index, animationType)}
          initial="hidden"
          animate="visible"
          className="inline-block"
          style={{
            whiteSpace: char === " " ? "pre" : "normal",
            transformStyle: "preserve-3d",
          }}
          whileHover={
            animationType === "wave"
              ? {
                  scale: 1.2,
                  y: -5,
                  transition: { duration: 0.2 },
                }
              : {}
          }
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
