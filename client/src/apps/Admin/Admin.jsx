import { useState } from "react";

import AdminLogin from "./AdminLogin";
import Sidebar from "./layout/Sidebar";

import Dashboard from "./dashboard/Dashboard";
import Projects from "./projects/Projects";

import { isLoggedIn } from "../../services/authService";

export default function Admin() {

    const [loggedIn, setLoggedIn] = useState(isLoggedIn());

    const [page, setPage] = useState("dashboard");

    if (!loggedIn) {

        return (

            <AdminLogin
                onSuccess={() => setLoggedIn(true)}
            />

        );

    }

    return (

        <div className="flex h-screen bg-os-bg">

            <Sidebar

                page={page}

                setPage={setPage}

            />

            <main className="flex-1 overflow-y-auto p-8">

                {

                    page==="dashboard" &&

                    <Dashboard

                        setPage={setPage}

                    />

                }

                {

                    page==="projects" &&

                    <Projects/>

                }

            </main>

        </div>

    );

}