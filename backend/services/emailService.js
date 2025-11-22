const nodemailer = require("nodemailer");

// Konfigurasi email transporter
// Untuk development, bisa menggunakan Gmail atau service email lain
const createTransporter = () => {
  // Jika ada konfigurasi SMTP di .env, gunakan itu
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD
  ) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT == "465", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  // Fallback: Gmail (untuk development, perlu App Password)
  // Atau bisa menggunakan Ethereal Email untuk testing
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  // Development mode: return null untuk simulasi (tidak mengirim email)
  console.warn(
    "⚠️  Email service tidak dikonfigurasi. Email tidak akan terkirim (simulasi mode)."
  );
  console.warn(
    "   Untuk mengaktifkan email, set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD di .env"
  );
  return null;
};

const transporter = createTransporter();

/**
 * Kirim email reset password
 * @param {string} email - Email tujuan
 * @param {string} resetToken - Token untuk reset password
 * @param {string} userName - Nama user
 */
exports.sendPasswordResetEmail = async (email, resetToken, userName) => {
  // Jika transporter tidak ada (development mode), simulasikan pengiriman
  if (!transporter) {
    console.log("\n📧 [SIMULASI] Email Reset Password:");
    console.log(`   To: ${email}`);
    console.log(`   Reset Token: ${resetToken}`);
    console.log(
      `   Reset Link: ${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/reset-password?token=${resetToken}\n`
    );
    return true; // Return true untuk simulasi
  }

  const resetLink = `${
    process.env.FRONTEND_URL || "http://localhost:5173"
  }/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: `"NilaSense" <${
      process.env.SMTP_USER || process.env.GMAIL_USER || "noreply@nilasense.com"
    }>`,
    to: email,
    subject: "Reset Password - NilaSense",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">🐟 NilaSense</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #0891b2; margin-top: 0;">Reset Password</h2>
          
          <p>Halo <strong>${userName}</strong>,</p>
          
          <p>Kami menerima permintaan untuk mereset password akun NilaSense Anda. Jika Anda tidak meminta reset password, abaikan email ini.</p>
          
          <p>Untuk mereset password Anda, klik tombol di bawah ini:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: #0891b2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p>Atau salin dan tempel link berikut ke browser Anda:</p>
          <p style="background: #e5e7eb; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">
            ${resetLink}
          </p>
          
          <p style="color: #ef4444; font-size: 14px;">
            <strong>⚠️ Penting:</strong> Link ini akan kadaluarsa dalam 1 jam. Jangan bagikan link ini kepada siapa pun.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            Jika tombol tidak berfungsi, salin dan tempel URL di atas ke browser web Anda.<br>
            Jika Anda tidak meminta reset password, abaikan email ini dan password Anda tidak akan berubah.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
          <p>© 2025 NilaSense. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
    text: `
Reset Password - NilaSense

Halo ${userName},

Kami menerima permintaan untuk mereset password akun NilaSense Anda.

Untuk mereset password, klik link berikut:
${resetLink}

Link ini akan kadaluarsa dalam 1 jam. Jangan bagikan link ini kepada siapa pun.

Jika Anda tidak meminta reset password, abaikan email ini dan password Anda tidak akan berubah.

© 2025 NilaSense. All rights reserved.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email reset password terkirim:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error mengirim email:", error);
    throw error;
  }
};















