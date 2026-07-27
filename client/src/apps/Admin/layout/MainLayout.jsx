import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({ children }) {
    return (
        <div className="flex h-screen bg-os-bg">

            <Sidebar />

            <main className="flex flex-1 flex-col overflow-hidden">

                <Header />

                <section className="flex-1 overflow-y-auto p-8">

                    {children}

                </section>

            </main>

        </div>
    );
}