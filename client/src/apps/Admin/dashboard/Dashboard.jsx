import {

    Folder,

    Brain,

    Newspaper,

    Eye,

} from "lucide-react";

import SectionTitle from "../ui/SectionTitle";
import StatCard from "./StatCard";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import SystemHealth from "./SystemHealth";

export default function Dashboard(
    {
        setPage,
    }
) {

    return (

        <div className="space-y-8">

            <SectionTitle

                title="Welcome back 👋"

                subtitle="Manage your FuturOS Portfolio"

            />

            <div className="grid grid-cols-4 gap-6">

                <StatCard

                    icon={<Folder />}

                    title="Projects"

                    value="12"

                />

                <StatCard

                    icon={<Brain />}

                    title="Skills"

                    value="18"

                />

                <StatCard

                    icon={<Newspaper />}

                    title="Blogs"

                    value="4"

                />

                <StatCard

                    icon={<Eye />}

                    title="Visitors"

                    value="924"

                />

            </div>
            <div className="grid grid-cols-2 gap-6">

    <QuickActions
        onNewProject={() => setPage("projects")}
    />

    <RecentActivity/>

</div>

<SystemHealth/>

        </div>

    );

}