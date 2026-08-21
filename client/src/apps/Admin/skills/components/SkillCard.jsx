import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function SkillCard({
  skill,
  onClick,
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        scale: 1.02,
      }}
      transition={{
        duration: 0.2,
      }}
      onClick={() => onClick?.(skill)}
      className="
        group
        cursor-pointer
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-5
        backdrop-blur-xl
        transition-all
        hover:border-indigo-500/30
        hover:bg-white/10
      "
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {skill.icon ? (
            <img
              src={skill.icon}
              alt={skill.name}
              className="h-14 w-14 rounded-2xl object-cover"
            />
          ) : (
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-indigo-500/15
                text-xl
                font-bold
                text-indigo-400
              "
            >
              {skill.name?.charAt(0)}
            </div>
          )}

          <div>
            <h3 className="font-semibold">
              {skill.name}
            </h3>

            <p className="text-sm text-white/50">
              {skill.category}
            </p>
          </div>
        </div>

        {skill.featured && (
          <Star
            size={18}
            className="fill-yellow-400 text-yellow-400"
          />
        )}
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>Proficiency</span>

          <span className="font-semibold">
            {skill.proficiency}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${skill.proficiency}%`,
            }}
            transition={{
              duration: 0.8,
            }}
            className="
              h-full
              rounded-full
              bg-gradient-to-r
              from-indigo-500
              to-cyan-400
            "
          />
        </div>
      </div>
    </motion.div>
  );
}