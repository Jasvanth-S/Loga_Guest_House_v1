"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Users, Search } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { format, addDays } from "date-fns";

export function BookingWidget() {
    const router = useRouter();
    const [checkIn, setCheckIn] = useState(format(new Date(), "yyyy-MM-dd"));
    const [checkOut, setCheckOut] = useState(
        format(addDays(new Date(), 2), "yyyy-MM-dd")
    );
    const [guests, setGuests] = useState(2);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams({
            check_in: checkIn,
            check_out: checkOut,
            guests: guests.toString(),
        });
        router.push(`/rooms?${params}`);
    };

    return (
        <form
            onSubmit={handleSearch}
            className="glass-card rounded-2xl md:rounded-full p-2 md:p-1.5 flex flex-col md:flex-row gap-0 shadow-luxury-lg"
        >
            {/* Check-in */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-white/30">
                <CalendarDays size={18} className="text-sand shrink-0" />
                <div className="flex-1 min-w-0">
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-ocean-dark/70 block">
                        Check-in
                    </label>
                    <input
                        type="date"
                        value={checkIn}
                        min={format(new Date(), "yyyy-MM-dd")}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full font-sans text-sm font-medium text-ocean-dark bg-transparent focus:outline-none cursor-pointer"
                        required
                    />
                </div>
            </div>

            {/* Check-out */}
            <div className="flex-1 flex items-center gap-3 px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-white/30">
                <CalendarDays size={18} className="text-sand shrink-0" />
                <div className="flex-1 min-w-0">
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-ocean-dark/70 block">
                        Check-out
                    </label>
                    <input
                        type="date"
                        value={checkOut}
                        min={checkIn}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full font-sans text-sm font-medium text-ocean-dark bg-transparent focus:outline-none cursor-pointer"
                        required
                    />
                </div>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-3 px-4 py-3 md:py-2 border-b md:border-b-0 md:border-r border-white/30">
                <Users size={18} className="text-sand shrink-0" />
                <div>
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-ocean-dark/70 block">
                        Guests
                    </label>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="w-6 h-6 rounded-full border border-ocean/30 text-ocean flex items-center justify-center hover:bg-ocean hover:text-white hover:border-ocean transition-colors duration-150 text-sm font-bold"
                        >
                            −
                        </button>
                        <span className="font-sans text-sm font-medium text-ocean-dark w-4 text-center">
                            {guests}
                        </span>
                        <button
                            type="button"
                            onClick={() => setGuests(Math.min(10, guests + 1))}
                            className="w-6 h-6 rounded-full border border-ocean/30 text-ocean flex items-center justify-center hover:bg-ocean hover:text-white hover:border-ocean transition-colors duration-150 text-sm font-bold"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="px-2 py-2 md:py-1.5">
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full md:w-auto rounded-xl md:rounded-full px-6"
                    icon={<Search size={16} />}
                    iconPosition="left"
                >
                    Search Rooms
                </Button>
            </div>
        </form>
    );
}
