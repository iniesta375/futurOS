import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  StarOff,
  Archive,
  Trash2,
  X,
  CheckSquare,
} from "lucide-react";

import BulkActionButton from "./BulkActionButton";
import GlassCard from "../../ui/GlassCard";

export default function BulkActionBar({
  selectedCount,
  onFeature,
  onUnfeature,
  onArchive,
  onDelete,
  onClear,
}) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{
            opacity: 0,
            y: -16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -16,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          <GlassCard hover={false}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/15">
                  <CheckSquare
                    size={20}
                    className="text-indigo-400"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {selectedCount} Project
                    {selectedCount > 1 ? "s" : ""} Selected
                  </h3>

                  <p className="text-sm text-white/55">
                    Choose an action to perform on the selected
                    project
                    {selectedCount > 1 ? "s" : ""}.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <BulkActionButton
                  variant="warning"
                  icon={<Star size={16} />}
                  onClick={onFeature}
                >
                  Feature
                </BulkActionButton>

                <BulkActionButton
                  variant="gray"
                  icon={<StarOff size={16} />}
                  onClick={onUnfeature}
                >
                  Unfeature
                </BulkActionButton>

                <BulkActionButton
                  variant="primary"
                  icon={<Archive size={16} />}
                  onClick={onArchive}
                >
                  Archive
                </BulkActionButton>

                <BulkActionButton
                  variant="danger"
                  icon={<Trash2 size={16} />}
                  onClick={onDelete}
                >
                  Delete
                </BulkActionButton>

                <BulkActionButton
                  variant="gray"
                  icon={<X size={16} />}
                  onClick={onClear}
                >
                  Clear
                </BulkActionButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}