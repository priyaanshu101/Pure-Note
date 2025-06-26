import { motion } from "framer-motion";
import type { ReactElement } from "react";

interface LayoutProps {
  title: string;
  text: string;
  icon: ReactElement;
  onClick: () => void;
}

export const Layout = ({ title, text, icon, onClick }: LayoutProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="p-6 bg-primary-50 rounded-2xl shadow-sm border border-primary-100 cursor-pointer hover:shadow-lg hover:bg-primary-100"
      style={{ willChange: "transform" }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        {/* ICON */}
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-200 mb-4">
          {icon}
        </div>

        {/* TITLE */}
        <h3 className="text-2xl font-semibold text-primary-800">{title}</h3>

        {/* TEXT */}
        <p className="text-primary-600 text-sm pt-4 text-center leading-relaxed">
          {text}
        </p>
      </div>
    </motion.div>
  );
};
