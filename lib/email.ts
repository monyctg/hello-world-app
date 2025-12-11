import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderEmails(order: any, items: any[]) {
  const adminEmail = process.env.ADMIN_EMAIL || 'monyctg@gmail.com'; // Fallback

  // 1. Email Content for Customer
  const customerHtml = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h1>Thank you for your order!</h1>
      <p>Hi ${order.customerName},</p>
      <p>We have received your order. Here are the details:</p>
      <hr>
      <h3>Order ID: #${order.id}</h3>
      <p><strong>Status:</strong> ${order.status}</p>
      <ul>
        ${items.map((item: any) => `
          <li>
            <strong>${item.title}</strong> - $${item.price}
            ${item.customNote ? `<br><small>Note: ${item.customNote}</small>` : ''}
          </li>
        `).join('')}
      </ul>
      <p><strong>Total: $${Number(order.total).toFixed(2)}</strong></p>
      <hr>
      <p>We will review your order and send your license keys shortly.</p>
    </div>
  `;

  // 2. Email Content for Admin
  const adminHtml = `
    <div style="font-family: sans-serif; padding: 20px;">
      <h1>New Order Received!</h1>
      <p><strong>Customer:</strong> ${order.customerName} (${order.email})</p>
      <p><strong>Order ID:</strong> #${order.id}</p>
      <p><strong>Total:</strong> $${Number(order.total).toFixed(2)}</p>
      <ul>
        ${items.map((item: any) => `
          <li>${item.title} ($${item.price})</li>
        `).join('')}
      </ul>
      <p><a href="https://www.magfar.com/dashboard/orders">View in Dashboard</a></p>
    </div>
  `;

  // 3. Send to Customer
  await transporter.sendMail({
    from: `"Magfar Store" <${process.env.SMTP_USER}>`,
    to: order.email,
    subject: `Order Confirmation #${order.id}`,
    html: customerHtml,
  });

  // 4. Send to Admin
  await transporter.sendMail({
    from: `"Magfar Bot" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `New Order: #${order.id} ($${order.total})`,
    html: adminHtml,
  });
}