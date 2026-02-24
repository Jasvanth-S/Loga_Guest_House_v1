"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/dashboard";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const supabase = createClient();

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            toast.success("Welcome back!");
            router.push(redirect);
            router.refresh();
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
            },
        });
        if (error) toast.error(error.message);
    };

    return (
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-16 bg-coconut">
            <div className="max-w-sm mx-auto w-full">
                <Link href="/" className="font-serif text-2xl text-ocean-dark italic block mb-10">
                    Loga <span className="font-sans text-sm font-normal not-italic text-warmgray">Guest House</span>
                </Link>

                <h1 className="font-serif text-heading-2 text-ocean-dark mb-1">Welcome Back</h1>
                <p className="font-sans text-sm text-warmgray mb-8">Sign in to manage your bookings</p>

                {/* Google OAuth */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 border border-coconut-darker bg-white rounded-xl py-2.5 text-sm font-sans font-medium text-charcoal hover:border-sand/50 hover:shadow-luxury transition-all duration-200 mb-5"
                >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <div className="ornament-divider mb-5">
                    <span className="font-sans text-xs text-warmgray px-2">or sign in with email</span>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail size={16} />}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                    />
                    <div className="relative">
                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<Lock size={16} />}
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 bottom-2.5 text-warmgray hover:text-ocean transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    <div className="flex justify-end">
                        <Link href="/auth/forgot-password" className="font-sans text-xs text-ocean hover:underline">
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
                        Sign In
                    </Button>
                </form>

                <p className="font-sans text-sm text-warmgray text-center mt-6">
                    Don't have an account?{" "}
                    <Link href="/auth/register" className="text-ocean font-medium hover:underline">
                        Create account
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex">
            <Suspense fallback={<div className="w-full lg:w-1/2 flex items-center justify-center">Loading...</div>}>
                <LoginForm />
            </Suspense>

            {/* Right — image (desktop) */}
            <div className="hidden lg:block lg:w-1/2 relative">
                <Image
                    src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=85"
                    alt="Loga Guest House Sri Lanka"
                    fill
                    priority
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-ocean-dark/60 to-palm/30" />
                <div className="absolute bottom-12 left-10 right-10">
                    <div className="glass-card-dark rounded-2xl p-5">
                        <p className="font-serif text-lg italic text-white/90 mb-2">
                            "A magical stay that felt like home, only better."
                        </p>
                        <p className="font-sans text-sm text-white/60">— Sarah M., London</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
