import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  variant = "display",
}) {
  const variantStyles = {
    add: "border-blue-500 bg-gray-100 dark:bg-gray-900/40 text-blue-700 dark:text-blue-300",
    edit: "border-green-500 bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300",
    display:
      "border-violet-500 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-950/40 dark:to-blue-950/40 text-violet-700 dark:text-violet-300",
    delete:
      "border-blue-500 bg-gray-100 dark:bg-gray-900/40 text-blue-700 dark:text-blue-300",
  };

  if (isOpen == false) return;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`relative w-full max-w-md rounded-2xl border p-6 shadow-xl ${variantStyles[variant]}`}
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="text-base">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}






