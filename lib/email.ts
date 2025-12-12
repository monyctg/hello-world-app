import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.smtp2go.com',
  port: Number(process.env.SMTP_PORT) || 2525,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderEmails(order: any, items: any[]) {
  const adminEmail = process.env.ADMIN_EMAIL || 'monyctg@gmail.com';
  
  // MUST be a verified sender in SMTP2GO
  // If you verified 'admin@hiseotools.com', use that.
  // If you verified 'monyctg@gmail.com', use that.
  const senderEmail = 'im@magfar.com'; 

  // 1. Customer Email
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h1 style="color: #14a800;">Order Received</h1>
      <p>Hi ${order.customerName},</p>
      <p>Thank you for your order. We are reviewing it now.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <h3>Order #${order.id}</h3>
      <p><strong>Status:</strong> ${order.status}</p>
      <ul style="padding-left: 20px;">
        ${items.map((item: any) => `
          <li>
            <strong>${item.title}</strong> - $${item.price}
            ${item.customNote ? `<br><small style="color: #666;">Note: ${item.customNote}</small>` : ''}
          </li>
        `).join('')}
      </ul>
      <p><strong>Total: $${Number(order.total).toFixed(2)}</strong></p>
    </div>
  `;

  // 2. Admin Email
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1 style="color: #d32f2f;">New Order Alert!</h1>
      <p><strong>Customer:</strong> ${order.customerName} (<a href="mailto:${order.email}">${order.email}</a>)</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Total:</strong> $${Number(order.total).toFixed(2)}</p>
      <hr>
      <h3>Items:</h3>
      <ul>
        ${items.map((item: any) => `
          <li>${item.title} ${item.customNote ? `(Note: ${item.customNote})` : ''}</li>
        `).join('')}
      </ul>
      <p><a href="https://www.magfar.com/dashboard/orders" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Manage Order</a></p>
    </div>
  `;

  try {
    // Send to Customer
    await transporter.sendMail({
      from: `"Magfar Store" <${senderEmail}>`,
      to: order.email,
      subject: `Order Confirmation #${order.id}`,
      html: customerHtml,
    });

    // Send to Admin
    await transporter.sendMail({
      from: `"Store Bot" <${senderEmail}>`,
      to: adminEmail,
      subject: `New Order #${order.id} - ${order.status}`,
      html: adminHtml,
    });
    console.log("Emails sent successfully via SMTP2GO");
  } catch (error) {
    console.error("Email Error:", error);
  }
}