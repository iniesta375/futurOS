import GlassCard from "../ui/GlassCard";

export default function StatCard({

    icon,

    title,

    value,

}) {

    return (

        <GlassCard>

            <div className="text-3xl mb-4">

                {icon}

            </div>

            <p className="text-white/60">

                {title}

            </p>

            <h2 className="text-4xl font-bold mt-2">

                {value}

            </h2>

        </GlassCard>

    );

}