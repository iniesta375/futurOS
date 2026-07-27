import { motion } from "framer-motion";

export default function GlassCard({
    children,
    className = "",
}) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: .2 }}
            className={`
                glass
                rounded-3xl
                border
                border-white/10
                p-6
                shadow-xl
                ${className}
            `}
        >
            {children}
        </motion.div>
    );
}