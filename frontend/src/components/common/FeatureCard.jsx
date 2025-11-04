import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useMemo } from "react";

export function FeatureCard({ icon, title, description, color }) {
  // Generate delay yang konsisten berdasarkan title
  const floatDelay = useMemo(() => {
    // Gunakan hash sederhana dari title untuk delay yang konsisten
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    return (Math.abs(hash) % 200) / 100; // Delay antara 0-2 detik
  }, [title]);

  return (
    <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-6">
        <motion.div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4`}
          whileHover={{
            scale: 1.15,
            rotate: 360,
            transition: { duration: 0.6, ease: "easeOut" },
          }}
          animate={{
            y: [0, -5, 0],
            transition: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: floatDelay,
            },
          }}
        >
          {icon}
        </motion.div>
        <h3 className="text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
