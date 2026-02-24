"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, BedDouble, CalendarDays,
    Star, Settings, ChevronRight, Tag, Menu, X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Rooms", href: "/admin/rooms", icon: BedDouble },
    { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
    { label: "Coupons", href: "/admin/coupons", icon: Tag },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-white/10">
                <Link href="/" className="font-serif text-xl text-white italic">
                    Loga <span className="font-sans text-xs font-normal not-italic text-white/50 ml-1">Admin</span>
                </Link>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                    const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
                    return (
                        <Link key={label} href={href} onClick={() => setOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm font-medium transition-all duration-200",
                                active
                                    ? "bg-white/15 text-white"
                                    : "text-white/60 hover:bg-white/8 hover:text-white"
                            )}>
                            <Icon size={17} />
                            <span className="flex-1">{label}</span>
                            {active && <ChevronRight size={13} className="text-white/40" />}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-white/10">
                <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-sans transition-colors">
                    ← Back to Website
                </Link>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile toggle */}
            <button onClick={() => setOpen(!open)}
                className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-ocean rounded-xl flex items-center justify-center text-white shadow-luxury">
                {open ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Mobile overlay */}
            {open && (
                <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
                    <div className="absolute inset-0 bg-ocean-dark/60 backdrop-blur-sm" />
                    <div className="absolute left-0 top-0 h-full w-64 bg-ocean-dark">
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <aside className="hidden lg:flex flex-col w-56 bg-ocean-dark min-h-screen shrink-0">
                <SidebarContent />
            </aside>
        </>
    );
}
