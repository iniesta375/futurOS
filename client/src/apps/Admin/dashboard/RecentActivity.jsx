import GlassCard from "../ui/GlassCard";

const activities=[

    "Added new Project",

    "Updated React Skill",

    "Uploaded Portfolio Image",

    "Edited Contact Details",

];

export default function RecentActivity(){

    return(

        <GlassCard>

            <h2 className="mb-6 text-xl font-semibold">

                Recent Activity

            </h2>

            <div className="space-y-4">

                {

                    activities.map(activity=>(

                        <div

                            key={activity}

                            className="glass-hover rounded-xl p-4"

                        >

                            {activity}

                        </div>

                    ))

                }

            </div>

        </GlassCard>

    )

}