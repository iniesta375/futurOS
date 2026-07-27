import { motion, AnimatePresence } from "framer-motion";

export default function Modal({

    open,

    title,

    children,

    onClose,

}){

    return(

        <AnimatePresence>

        {

            open && (

                <motion.div

                    initial={{opacity:0}}

                    animate={{opacity:1}}

                    exit={{opacity:0}}

                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"

                >

                    <motion.div

                        initial={{

                            scale:.9,

                            opacity:0,

                        }}

                        animate={{

                            scale:1,

                            opacity:1,

                        }}

                        exit={{

                            scale:.9,

                            opacity:0,

                        }}

                        className="glass w-full max-w-2xl rounded-3xl p-8"

                    >

                        <div className="mb-8 flex items-center justify-between">

                            <h2 className="text-2xl font-bold">

                                {title}

                            </h2>

                            <button

                                onClick={onClose}

                                className="text-xl"

                            >

                                ✕

                            </button>

                        </div>

                        {children}

                    </motion.div>

                </motion.div>

            )

        }

        </AnimatePresence>

    )

}