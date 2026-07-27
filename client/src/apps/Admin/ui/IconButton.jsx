import { motion } from "framer-motion";

export default function IconButton({

    icon,

    text,

    onClick,

}) {

    return (

        <motion.button

            whileHover={{ scale: 1.04 }}

            whileTap={{ scale: .96 }}

            onClick={onClick}

            className="flex items-center gap-3 rounded-xl bg-indigo-500 px-5 py-3 text-white"

        >

            {icon}

            {text}

        </motion.button>

    );

}