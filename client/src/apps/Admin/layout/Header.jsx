import {
    Bell,
    Search,
    UserCircle2
} from "lucide-react";

export default function Header() {

    return (

        <header className="glass flex h-20 items-center justify-between border-b border-white/10 px-8">

            <div>

                <h2 className="text-2xl font-semibold">

                    Welcome back 👋

                </h2>

                <p className="text-white/50">

                    Manage your FuturOS Portfolio

                </p>

            </div>

            <div className="flex items-center gap-4">

                <button className="glass-hover rounded-xl p-3">

                    <Search />

                </button>

                <button className="glass-hover rounded-xl p-3">

                    <Bell />

                </button>

                <button className="glass-hover rounded-full">

                    <UserCircle2 size={42}/>

                </button>

            </div>

        </header>

    );

}