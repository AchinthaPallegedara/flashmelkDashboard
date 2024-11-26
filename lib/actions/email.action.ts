import {
  AdminSendEmail,
  CustomerConfirmBookingSendEmail,
  CustomerSendEmail,
} from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function getPackageDetails(
  packageType: string
): { name: string; price: string } | null {
  // Map of package types to their new names and prices
  const packageDetails: Record<string, { name: string; price: string }> = {
    // Photography packages
    "P-basic": { name: "Photo Basic Session", price: "7 500" },
    "P-standard": { name: "Photo Standard Session", price: "14 500" },
    "P-professional": { name: "Photo Professional Session", price: "22 500" },
    // Video packages
    "V-basic": { name: "Video Basic Session", price: "11 500" },
    "V-standard": { name: "Video Standard Session", price: "18 500" },
    "V-professional": { name: "Video Professional Session", price: "26 500" },
    // CYC Wall packages
    "C-professional": { name: "CYC Wall Professional", price: "22 500" },
    "C-platinum": { name: "CYC wall Platinum", price: "35 000" },
    // Individual packages
    "Individual-QuickSession": {
      name: "Individual Quick Session",
      price: "10 000",
    },
    "Individual-Branding&Creative": {
      name: "Individual Branding & Creative",
      price: "25 000",
    },
    "Individual-Executive": { name: "Individual Executive", price: "10 000" },
    // Family packages
    FamilySession: { name: "Family Session", price: "15 000" },
    "Family-Maternity": { name: "Family Maternity", price: "25 000" },
    "Family-ALLINCLUSIVESession": {
      name: "Family All-Inclusive Session",
      price: "25 000",
    },
    // Graduation packages
    "Graduation-ALLINCLUSIVESession": {
      name: "Graduation All-Inclusive Session",
      price: "25 000",
    },
    "Graduation-QuickSession": {
      name: "Graduation Quick Session",
      price: "85 00",
    },
    "Graduation-StandardSession": {
      name: "Graduation Standard Session",
      price: "14 000",
    },
    // Model Portfolio packages
    "ModelPortfolio-Pro": { name: "Model Portfolio Pro", price: "45 000" },
    "ModelPortfolio-Standard": {
      name: "Model Portfolio Standard",
      price: "30 000",
    },
  };

  // Retrieve details if the package exists
  if (packageDetails[packageType]) {
    return packageDetails[packageType];
  }

  // Return null if package type doesn't exist
  return null;
}

export async function ConfirmBookingEmail({
  customerName,
  cus_email,
  bookingId,
  BookingDate,
  BookingStartTime,
  BookingEndTime,
  BookingType,
}: {
  customerName: string;
  cus_email: string;
  bookingId: string;
  BookingDate: string;
  BookingStartTime: string;
  BookingEndTime: string;
  BookingType: string;
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
        BookingType: getPackageDetails(BookingType)?.name || "null",
        BookingPrice: getPackageDetails(BookingType)?.price || "Known",
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
