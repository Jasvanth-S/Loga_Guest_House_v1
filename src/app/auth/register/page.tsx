"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { User, Mail, Lock, Phone } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", password: "", confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData((p) => ({ ...p, [field]: e.target.value }));

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        setLoading(true);
        try {
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: { full_name: formData.name, phone: formData.phone },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
            toast.success("Account created! Please check your email to verify.");
            router.push("/auth/login");
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-16 bg-coconut">
                <div className="max-w-sm mx-auto w-full">
                    <Link href="/" className="font-serif text-2xl text-ocean-dark italic block mb-10">
                        Loga <span className="font-sans text-sm font-normal not-italic text-warmgray">Guest House</span>
                    </Link>

                    <h1 className="font-serif text-heading-2 text-ocean-dark mb-1">Create Account</h1>
                    <p className="font-sans text-sm text-warmgray mb-8">Join Loga and manage your stays</p>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <Input label="Full Name" type="text" value={formData.name}
                            onChange={handleChange("name")} icon={<User size={16} />}
                            placeholder="Jane Smith" required />
                        <Input label="Email Address" type="email" value={formData.email}
                            onChange={handleChange("email")} icon={<Mail size={16} />}
                            placeholder="you@example.com" required />
                        <Input label="Phone Number" type="tel" value={formData.phone}
                            onChange={handleChange("phone")} icon={<Phone size={16} />}
                            placeholder="+1 234 567 8900"
                            hint="Used for booking confirmations" />
                        <Input label="Password" type="password" value={formData.password}
                            onChange={handleChange("password")} icon={<Lock size={16} />}
                            placeholder="Min 8 characters" required autoComplete="new-password" />
                        <Input label="Confirm Password" type="password" value={formData.confirmPassword}
                            onChange={handleChange("confirmPassword")} icon={<Lock size={16} />}
                            placeholder="Repeat password" required autoComplete="new-password" />

                        <p className="font-sans text-xs text-warmgray">
                            By creating an account you agree to our{" "}
                            <Link href="/terms" className="text-ocean hover:underline">Terms</Link> and{" "}
                            <Link href="/privacy" className="text-ocean hover:underline">Privacy Policy</Link>.
                        </p>

                        <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
                            Create Account
                        </Button>
                    </form>

                    <p className="font-sans text-sm text-warmgray text-center mt-6">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-ocean font-medium hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>

            <div className="hidden lg:block lg:w-1/2 relative">
                <Image src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=85"
                    alt="Join Loga Guest House" fill priority className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-palm-dark/60 to-ocean/40" />
                <div className="absolute top-1/2 left-10 right-10 -translate-y-1/2 text-center">
                    <p className="font-serif text-4xl text-white mb-3">Join Our <span className="italic text-sand-light">Community</span></p>
                    <p className="font-sans text-sm text-white/70">Members enjoy early access to deals, loyalty rewards, and seamless booking management.</p>
                </div>
            </div>
        </div>
    );
}
