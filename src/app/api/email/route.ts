import { NextRequest, NextResponse } from "next/server";

// POST /api/email — send transactional emails via Resend
export async function POST(request: NextRequest) {
    const body = await request.json();
    const { type, ...data } = body;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "bookings@logaguesthouse.lk";

    if (!RESEND_API_KEY) {
        // Graceful degradation — log and return OK
        console.warn("[Email] RESEND_API_KEY not configured. Email not sent:", { type, data });
        return NextResponse.json({ message: "Email queued (not configured)" });
    }

    let subject = "";
    let html = "";

    if (type === "booking_confirmation") {
        subject = `Booking Confirmed — Loga Guest House (#${data.booking_id?.slice(0, 8).toUpperCase()})`;
        html = buildBookingConfirmationEmail(data);
    } else if (type === "contact") {
        subject = `New Contact Form: ${data.subject} — ${data.name}`;
        html = buildContactEmail(data);
    } else {
        return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
    }

    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: `Loga Guest House <${FROM_EMAIL}>`,
                to: [data.email],
                subject,
                html,
            }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Email send failed");
        }

        return NextResponse.json({ message: "Email sent successfully" });
    } catch (err: unknown) {
        console.error("[Email] Send failed:", err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Email failed" },
            { status: 500 }
        );
    }
}

function buildBookingConfirmationEmail(data: any): string {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family: 'DM Sans', Arial, sans-serif; background: #FAF7F2; margin: 0; padding: 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(11,61,107,0.08);">
    <div style="background: linear-gradient(135deg, #0B3D6B, #2D6A4F); padding: 32px 32px 24px; text-align: center;">
      <h1 style="font-family: Georgia, serif; color: #fff; font-size: 28px; margin: 0 0 4px;">🌴 Loga Guest House</h1>
      <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin: 0;">Booking Confirmation</p>
    </div>
    <div style="padding: 32px;">
      <h2 style="font-family: Georgia, serif; color: #0B3D6B; font-size: 22px; margin: 0 0 8px;">Your booking is confirmed!</h2>
      <p style="color: #6B6560; font-size: 14px; line-height: 1.7;">Dear ${data.name}, thank you for choosing Loga Guest House. We can't wait to welcome you.</p>
      <div style="background: #FAF7F2; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <table style="width: 100%; font-size: 13px; color: #6B6560;">
          <tr><td style="padding: 6px 0; font-weight: 600; color: #0B3D6B;">Booking ID</td><td style="text-align: right;">#${data.booking_id?.slice(0, 8).toUpperCase()}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; color: #0B3D6B;">Room</td><td style="text-align: right;">${data.room_title}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; color: #0B3D6B;">Check-in</td><td style="text-align: right;">${data.check_in}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; color: #0B3D6B;">Check-out</td><td style="text-align: right;">${data.check_out}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: 600; color: #0B3D6B;">Guests</td><td style="text-align: right;">${data.guests}</td></tr>
          <tr style="border-top: 1px solid #E5DDD0;"><td style="padding: 10px 0 6px; font-weight: 700; color: #0B3D6B;">Total</td><td style="text-align: right; font-weight: 700; color: #0B3D6B; font-size: 15px;">${data.total}</td></tr>
        </table>
      </div>
      <p style="color: #6B6560; font-size: 13px; line-height: 1.7; margin: 0 0 16px;">Check-in is from <strong>2:00 PM</strong> and check-out by <strong>11:00 AM</strong>. We have power backup, 100 Mbps WiFi, and 24/7 security.</p>
      <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}" style="display: inline-block; background: #25D366; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-size: 13px; font-weight: 600;">💬 WhatsApp Us</a>
    </div>
    <div style="border-top: 1px solid #F0EBE0; padding: 16px 32px; text-align: center;">
      <p style="color: #6B6560; font-size: 11px; margin: 0;">Loga Guest House · Sri Lanka · ${process.env.NEXT_PUBLIC_EMAIL}</p>
    </div>
  </div>
</body>
</html>`;
}

function buildContactEmail(data: any): string {
    return `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 24px;">
    <h2 style="color: #0B3D6B; font-family: Georgia, serif;">New Contact Form Submission</h2>
    <table style="width: 100%; font-size: 14px; color: #333;">
      <tr><td style="padding: 6px 0; font-weight: 700;">Name:</td><td>${data.name}</td></tr>
      <tr><td style="padding: 6px 0; font-weight: 700;">Email:</td><td>${data.email}</td></tr>
      <tr><td style="padding: 6px 0; font-weight: 700;">Phone:</td><td>${data.phone || "—"}</td></tr>
      <tr><td style="padding: 6px 0; font-weight: 700;">Subject:</td><td>${data.subject}</td></tr>
    </table>
    <p style="color: #555; font-size: 14px; line-height: 1.6; border-left: 3px solid #C9A96E; padding-left: 12px; margin: 16px 0;">${data.message}</p>
    <a href="mailto:${data.email}" style="display: inline-block; background: #0B3D6B; color: #fff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 13px;">Reply to ${data.name}</a>
  </div>
</body>
</html>`;
}
