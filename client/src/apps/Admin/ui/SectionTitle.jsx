export default function SectionTitle({

    title,

    subtitle,

}) {

    return (

        <div className="mb-6">

            <h2 className="text-2xl font-semibold">

                {title}

            </h2>

            <p className="text-white/50 mt-1">

                {subtitle}

            </p>

        </div>

    );

}