import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

interface EmailVerification {
  emailVerificationLink?: string;
}

export const EmailVerification = ({
  emailVerificationLink,
}: EmailVerification) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <div style={logoDiv}></div>
        <Text style={tertiary}>Verify Your Email</Text>
        <Heading style={secondary}>
          Click the following button to verify your email
        </Heading>
        <div style={buttonContainer}>
          <Button style={button} href={emailVerificationLink}>
            Verify Your Email
          </Button>
        </div>
        <Text style={paragraph}>Not expecting this email?</Text>
        <Text style={paragraph}>
          Contact{" "}
          <Link href="mailto:appleshop.com" style={link}>
            applestore.com
          </Link>{" "}
          if you cannot login to your account.
        </Text>
      </Container>
      <Text style={footer}>Securely powered by Apple Store.</Text>
    </Body>
  </Html>
);

export default EmailVerification;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
};

const logoDiv = {
  fontWeight: "bold",
  color: "#8ec25d",
  display: "flex",
  justifyItems: "center",
  gap: "1",
  fontSize: "1.25rem",
  lineHeight: "1.75rem",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  boxShadow: "0 5px 10px rgba(20,50,70,.2)",
  marginTop: "20px",
  maxWidth: "360px",
  margin: "0 auto",
  padding: "68px 20px 130px",
};

const button = {
  fontSize: "14px",
  backgroundColor: "#28a745",
  color: "#fff",
  lineHeight: 1.5,
  borderRadius: "0.5em",
  padding: "12px 24px",
  textAlign: "center" as const,
  margin: "0 auto",
};

const tertiary = {
  color: "#0a85ea",
  fontSize: "11px",
  fontWeight: 700,
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  height: "16px",
  letterSpacing: "0",
  lineHeight: "16px",
  margin: "16px 8px 8px 8px",
  textTransform: "uppercase" as const,
  textAlign: "center" as const,
};

const secondary = {
  color: "#000",
  display: "inline-block",
  fontFamily: "HelveticaNeue-Medium,Helvetica,Arial,sans-serif",
  fontSize: "20px",
  fontWeight: 500,
  lineHeight: "24px",
  marginBottom: "0",
  marginTop: "0",
  textAlign: "center" as const,
};

const buttonContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "20px 0",
  textAlign: "center" as const,
};

const paragraph = {
  color: "#444",
  fontSize: "15px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  letterSpacing: "0",
  lineHeight: "23px",
  padding: "0 40px",
  margin: "0",
  textAlign: "center" as const,
};

const link = {
  color: "#444",
  textDecoration: "underline",
};

const footer = {
  color: "#000",
  fontSize: "12px",
  fontWeight: 800,
  letterSpacing: "0",
  lineHeight: "23px",
  margin: "0",
  marginTop: "20px",
  fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
};
