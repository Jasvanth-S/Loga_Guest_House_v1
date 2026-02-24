"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/atoms/Button";
import { Input, Textarea, Select } from "@/components/atoms/Input";
import { User, Mail, Phone, Send } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
    name: z.string().min(2, "Name required"),
    email: z.string().email("Valid email required"),
    phone: z.string().optional(),
    subject: z.string().min(1, "Please select a subject"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});
type FormData = z.infer<typeof schema>;

export function ContactForm() {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setLoading(true);
        try {
            await fetch("/api/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "contact", ...data }),
            });
            toast.success("Message sent! We'll reply within 24 hours.");
            reset();
        } catch {
            toast.error("Failed to send. Please WhatsApp us directly.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-luxury p-8">
            <h2 className="font-serif text-heading-3 text-ocean-dark mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Your Name" {...register("name")} error={errors.name?.message}
                        icon={<User size={16} />} placeholder="Jane Smith" required />
                    <Input label="Email" type="email" {...register("email")} error={errors.email?.message}
                        icon={<Mail size={16} />} placeholder="you@example.com" required />
                </div>
                <Input label="Phone (optional)" type="tel" {...register("phone")}
                    icon={<Phone size={16} />} placeholder="+1 234 567 8900" />
                <Select label="Subject" {...register("subject")} error={errors.subject?.message}
                    required options={[
                        { value: "", label: "Select a subject..." },
                        { value: "booking", label: "Room Booking Enquiry" },
                        { value: "addon", label: "Add-on Services" },
                        { value: "special", label: "Special Occasion" },
                        { value: "feedback", label: "Feedback" },
                        { value: "other", label: "Other" },
                    ]} />
                <Textarea label="Message" {...register("message")} error={errors.message?.message}
                    placeholder="Tell us about your travel plans, group size, special requirements..." required />
                <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}
                    icon={<Send size={16} />} iconPosition="right">
                    Send Message
                </Button>
            </form>
        </div>
    );
}
