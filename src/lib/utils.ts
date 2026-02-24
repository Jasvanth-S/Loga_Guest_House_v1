import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, parseISO } from "date-fns";

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Date formatting
export function formatDate(date: string | Date, pattern = "dd MMM yyyy"): string {
    const d = typeof date === "string" ? parseISO(date) : date;
    return format(d, pattern);
}

export function formatDateRange(checkIn: string, checkOut: string): string {
    return `${formatDate(checkIn, "dd MMM")} – ${formatDate(checkOut, "dd MMM yyyy")}`;
}

export function timeAgo(date: string): string {
    return formatDistanceToNow(parseISO(date), { addSuffix: true });
}

// Generate WhatsApp booking summary link
export function generateWhatsAppLink(
    phone: string,
    message: string
): string {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encoded}`;
}

export function generateBookingWhatsApp(booking: {
    id: string;
    room_title: string;
    check_in: string;
    check_out: string;
    guests: number;
    total_price: number;
    currency: string;
}): string {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94000000000";
    const message = `
🌴 *Loga Guest House — Booking Confirmation*

📋 Booking ID: #${booking.id.slice(0, 8).toUpperCase()}
🛏️ Room: ${booking.room_title}
📅 Check-in: ${formatDate(booking.check_in)}
📅 Check-out: ${formatDate(booking.check_out)}
👥 Guests: ${booking.guests}
💰 Total: ${booking.currency} ${booking.total_price}

Thank you for choosing Loga Guest House! We look forward to welcoming you. 🙏
  `.trim();

    return generateWhatsAppLink(phone, message);
}

// Truncate text
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return `${text.slice(0, length).trim()}…`;
}

// Generate slug from title
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// Star rating to array
export function getRatingArray(rating: number, max = 5): boolean[] {
    return Array.from({ length: max }, (_, i) => i < Math.round(rating));
}

// Get initials for avatar
export function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

// Validate email
export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
