import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface CustomerSendEmailProps {
  userFirstname: string;
}
interface CustomerConfirmSendEmailProps {
  userFirstname: string;
  bookingId: string;
  BookingDate: string;
  BookingStartTime: string;
  BookingEndTime: string;
  BookingType: string;
  BookingPrice: string;
}

interface EmailTemplateProps {
  firstName: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
}) => (
  <div>
    <h1>Welcome, {firstName}!</h1>
  </div>
);

export const CustomerConfirmBookingSendEmail = ({
  userFirstname,
  BookingType,
  BookingDate,
  BookingStartTime,
  BookingEndTime,
  BookingPrice,
}: CustomerConfirmSendEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Booking is confirmed</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://img.flashmelk.com/flashmeemaillogo.png`}
          width="170"
          height="50"
          alt="flashmelk"
          style={logo}
        />
        <Text style={paragraph}>Hi {userFirstname},</Text>
        <Text style={paragraph}>
          Your booking has been confirmed. Here are the details:
          <ul>
            <li style={paragraph}>Session: {BookingType}</li>
            <li style={paragraph}>Price:Rs.{BookingPrice}</li>
            <li style={paragraph}>Booking Date: {BookingDate}</li>
            <li style={paragraph}>Start Time: {BookingStartTime}</li>
            <li style={paragraph}>End Time: {BookingEndTime}</li>
          </ul>
        </Text>
        <Text style={paragraph}>
          If you have any questions or need further assistance, please feel free
          to contact us at any time.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href="tel:+94777201502">
            Call Now
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          The Flashmelk team
        </Text>
        <Hr style={hr} />
        <Text style={newFooter}>
          © 2024 Flashmelk. All rights reserved. Powered by DSLR Rent Lk.
        </Text>
        <Text style={newFooter}>
          Design & Developed by{" "}
          <a
            href="https://claviq.com"
            style={{ color: "#8898aa", textDecoration: "none" }}
          >
            Claviq
          </a>
        </Text>
      </Container>
    </Body>
  </Html>
);

export const CustomerSendEmail = ({
  userFirstname,
}: CustomerSendEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Booking is submitted</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://img.flashmelk.com/flashmeemaillogo.png`}
          width="170"
          height="50"
          alt="flashmelk"
          style={logo}
        />
        <Text style={paragraph}>Hi {userFirstname},</Text>
        <Text style={paragraph}>
          We have received your booking request and we are currently processing
          it. You will receive a confirmation email once your booking is
          confirmed.
        </Text>
        <Text style={paragraph}>
          If you have any questions or need further assistance, please feel free
          to contact us at any time.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href="tel:+94777201502">
            Call Now
          </Button>
        </Section>
        <Text style={paragraph}>
          Best,
          <br />
          The Flashmelk team
        </Text>
        <Hr style={hr} />
        <Text style={newFooter}>
          © 2024 Flashmelk. All rights reserved. Powered by DSLR Rent Lk.
        </Text>
        <Text style={newFooter}>
          Design & Developed by{" "}
          <a
            href="https://claviq.com"
            style={{ color: "#8898aa", textDecoration: "none" }}
          >
            Claviq
          </a>
        </Text>
      </Container>
    </Body>
  </Html>
);

export const AdminSendEmail = ({ userFirstname }: CustomerSendEmailProps) => (
  <Html>
    <Head />
    <Preview>New Booking Requsted</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src={`https://img.flashmelk.com/flashmeemaillogo.png`}
          width="170"
          height="50"
          alt="flashmelk"
          style={logo}
        />
        <Text style={paragraph}>Hi {userFirstname},</Text>
        <Text style={paragraph}>
          You have a new booking request. Please check the dashboard for more
          information
        </Text>

        <Section style={btnContainer}>
          <Button style={button} href="https://dashboard.flashmelk.com">
            Dashboard
          </Button>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          © 2024 Flashmelk. All rights reserved. Powered by DSLR Rent Lk.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
};

const logo = {
  margin: "0 auto",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#FFAB11",
  borderRadius: "3px",
  color: "#000000",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
};

const newFooter = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "14px",
};
