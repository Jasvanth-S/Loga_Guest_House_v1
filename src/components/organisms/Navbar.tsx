"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";

const NAV_LINKS = [
    { label: "Rooms", href: "/rooms" },
    {
        label: "Explore",
        href: "#",
        children: [
            { label: "Experiences", href: "/experiences" },
            { label: "Gallery", href: "/gallery" },
            { label: "Blog", href: "/blog" },
        ],
    },
    { label: "Contact", href: "/contact" },
];

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const pathname = usePathname();

    // Is this a page where the hero is dark? (show transparent nav)
    const isHeroPage = pathname === "/" || pathname === "/gallery";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setOpenDropdown(null);
    }, [pathname]);

    const navBg = scrolled
        ? "bg-ocean-dark/95 backdrop-blur-xl border-b border-white/10 shadow-luxury"
        : (isHeroPage ? "bg-transparent" : "bg-ocean-dark");

    const textColor = "text-white";
    const logoColor = "text-white";

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-400",
                    navBg
                )}
            >
                <div className="container-luxury">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link
                            href="/"
                            className={cn(
                                "font-serif text-2xl font-medium tracking-wide transition-colors duration-300",
                                logoColor
                            )}
                        >
                            <span className="italic">Loga</span>
                            <span className={cn("text-sm font-sans font-normal ml-2 opacity-70", textColor)}>
                                Guest House
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {NAV_LINKS.map((link) =>
                                link.children ? (
                                    <div key={link.label} className="relative group">
                                        <button
                                            className={cn(
                                                "flex items-center gap-1 px-4 py-2 rounded-xl font-sans text-sm font-medium transition-all duration-200",
                                                textColor,
                                                "hover:bg-white/10"
                                            )}
                                            onMouseEnter={() => setOpenDropdown(link.label)}
                                            onMouseLeave={() => setOpenDropdown(null)}
                                        >
                                            {link.label}
                                            <ChevronDown
                                                size={14}
                                                className={cn(
                                                    "transition-transform duration-200",
                                                    openDropdown === link.label && "rotate-180"
                                                )}
                                            />
                                        </button>

                                        {/* Dropdown */}
                                        <div
                                            onMouseEnter={() => setOpenDropdown(link.label)}
                                            onMouseLeave={() => setOpenDropdown(null)}
                                            className={cn(
                                                "absolute top-full left-0 mt-1 w-48 bg-ocean-dark rounded-2xl shadow-luxury-lg border border-white/10 p-1.5",
                                                "transition-all duration-200",
                                                openDropdown === link.label
                                                    ? "opacity-100 translate-y-0 pointer-events-auto"
                                                    : "opacity-0 -translate-y-2 pointer-events-none"
                                            )}
                                        >
                                            {link.children.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className="flex items-center px-3 py-2 rounded-xl text-sm text-white/80 hover:bg-white/10 hover:text-white font-sans transition-colors duration-150"
                                                >
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className={cn(
                                            "px-4 py-2 rounded-xl font-sans text-sm font-medium transition-all duration-200",
                                            textColor,
                                            "hover:bg-white/10",
                                            pathname === link.href && "font-semibold"
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            )}
                        </div>

                        {/* CTA */}
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                href="/auth/login"
                                className={cn(
                                    "font-sans text-sm font-medium transition-colors duration-200",
                                    textColor,
                                    "hover:opacity-70"
                                )}
                            >
                                Sign In
                            </Link>
                            <Button
                                variant={isHeroPage && !scrolled ? "secondary" : "primary"}
                                size="md"
                                className="rounded-xl"
                            >
                                <Link href="/rooms">Book Now</Link>
                            </Button>
                        </div>

                        {/* Mobile toggle */}
                        <button
                            className={cn("md:hidden p-2 rounded-xl transition-colors", textColor)}
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div
                className={cn(
                    "fixed inset-0 z-40 md:hidden transition-all duration-300",
                    mobileOpen ? "pointer-events-auto" : "pointer-events-none"
                )}
            >
                {/* Backdrop */}
                <div
                    className={cn(
                        "absolute inset-0 bg-ocean-dark/60 backdrop-blur-sm transition-opacity duration-300",
                        mobileOpen ? "opacity-100" : "opacity-0"
                    )}
                    onClick={() => setMobileOpen(false)}
                />

                {/* Drawer */}
                <div
                    className={cn(
                        "absolute top-0 right-0 h-full w-72 bg-coconut shadow-luxury-lg transition-transform duration-300",
                        mobileOpen ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    <div className="p-6 pt-20 flex flex-col gap-1">
                        {NAV_LINKS.map((link) =>
                            link.children ? (
                                <div key={link.label}>
                                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-warmgray mb-1 mt-4 px-3">
                                        {link.label}
                                    </p>
                                    {link.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            className="block px-3 py-2.5 rounded-xl text-ocean-dark font-sans text-base hover:bg-coconut-dark transition-colors"
                                        >
                                            {child.label}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="block px-3 py-2.5 rounded-xl text-ocean-dark font-sans text-base hover:bg-coconut-dark transition-colors"
                                >
                                    {link.label}
                                </Link>
                            )
                        )}

                        <div className="mt-auto pt-6 border-t border-coconut-darker flex flex-col gap-3">
                            <Link
                                href="/auth/login"
                                className="block text-center font-sans text-sm text-ocean py-2"
                            >
                                Sign In
                            </Link>
                            <Button variant="primary" fullWidth>
                                <Link href="/rooms">Book Now</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
