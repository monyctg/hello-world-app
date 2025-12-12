// ... inside app/actions.ts

export async function sendTestEmail(formData: FormData) {
  const targetEmail = formData.get('email') as string;

  console.log("--- STARTING EMAIL TEST (SMTP2GO) ---");
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.smtp2go.com',
    port: Number(process.env.SMTP_PORT) || 2525,
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    console.log("Verifying SMTP connection...");
    await transporter.verify();
    console.log("SMTP Connection Successful!");

    // Use a sender you VERIFIED in SMTP2GO
    const sender = 'im@magfar.com'; 

    const info = await transporter.sendMail({
      from: `"Test Bot" <${sender}>`,
      to: targetEmail,
      subject: "Test Email from SMTP2GO",
      text: "It works! SMTP2GO is connected.",
      html: "<h1>Success!</h1><p>Your email system is working via SMTP2GO.</p>",
    });

    console.log("Message sent: %s", info.messageId);
    return { success: true, message: "Email sent successfully!" };

  } catch (error: any) {
    console.error("EMAIL ERROR:", error);
    return { success: false, message: error.message || "Unknown error" };
  }
}