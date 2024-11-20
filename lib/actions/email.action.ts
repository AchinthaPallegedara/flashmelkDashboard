import {
  AdminSendEmail,
  CustomerConfirmBookingSendEmail,
  CustomerSendEmail,
} from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function ConfirmBookingEmail({
  customerName,
  cus_email,
  bookingId,
  BookingDate,
  BookingStartTime,
  BookingEndTime,
}: {
  customerName: string;
  cus_email: string;
  bookingId: string;
  BookingDate: string;
  BookingStartTime: string;
  BookingEndTime: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Flashmelk <info@flashmelk.com>",
      to: [cus_email],
      subject: "Booking Confirmation",
      react: CustomerConfirmBookingSendEmail({
        userFirstname: customerName,
        bookingId: bookingId,
        BookingDate: BookingDate,
        BookingStartTime: BookingStartTime,
        BookingEndTime: BookingEndTime,
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function CreateBookingEmail({
  customerName,
  cus_email,
}: {
  customerName: string;
  cus_email: string;
}) {
  try {
    const { data, error } = await resend.batch.send([
      {
        from: "Flashmelk <info@flashmelk.com>",
        to: ["flashmelkinfo@gmail.com"],
        subject: "New Booking Request",
        react: AdminSendEmail({ userFirstname: "Vinod" }),
      },
      {
        from: "Flashmelk <info@flashmelk.com>",
        to: [cus_email],
        subject: "Booking Submission",
        react: CustomerSendEmail({ userFirstname: customerName }),
      },
    ]);

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
