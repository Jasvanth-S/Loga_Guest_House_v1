import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/organisms/AdminSidebar";

export const metadata: Metadata = {
    title: "Admin Dashboard | Loga Guest House",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login?redirect=/admin");

    const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
    if (profile?.role !== "admin") redirect("/dashboard");

    return (
        <div className="min-h-screen bg-coconut flex">
            <AdminSidebar />
            <main className="flex-1 overflow-auto pt-16 lg:pt-0">
                <div className="p-6 lg:p-10">{children}</div>
            </main>
        </div>
    );
}
