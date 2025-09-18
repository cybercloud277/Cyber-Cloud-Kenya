const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send contact form notification to admin
const sendContactNotification = async (contactData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Cyber Cloud Kenya Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || 'admin@cybercloudkenya.com',
      subject: `New Contact Form Submission - ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00ff2a;">New Contact Form Submission</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
            <p><strong>Service:</strong> ${contactData.service}</p>
            <p><strong>Subject:</strong> ${contactData.subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #00ff2a;">
              ${contactData.message.replace(/\n/g, '<br>')}
            </div>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div style="margin-top: 20px; text-align: center;">
            <a href="${process.env.FRONTEND_URL}/admin/contacts"
               style="background: #00ff2a; color: black; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
              View in Admin Panel
            </a>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact notification sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending contact notification:', error);
    return { success: false, error: error.message };
  }
};

// Send newsletter subscription confirmation
const sendNewsletterConfirmation = async (email, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Cyber Cloud Kenya" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Cyber Cloud Kenya Newsletter!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00ff2a;">Welcome to Cyber Cloud Kenya!</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p>Hi ${name || 'there'},</p>
            <p>Thank you for subscribing to our newsletter! You'll now receive regular updates about:</p>
            <ul>
              <li>Latest technology trends</li>
              <li>Training program announcements</li>
              <li>Special offers and discounts</li>
              <li>Cyber security tips</li>
              <li>Success stories from our students</li>
            </ul>
            <p>Stay connected with us to enhance your digital skills and stay ahead in the tech world!</p>
          </div>
          <div style="margin-top: 20px; text-align: center;">
            <a href="${process.env.FRONTEND_URL}"
               style="background: #00ff2a; color: black; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
              Visit Our Website
            </a>
          </div>
          <p style="font-size: 12px; color: #666; text-align: center; margin-top: 20px;">
            You can unsubscribe at any time by clicking the link in our emails.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Newsletter confirmation sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending newsletter confirmation:', error);
    return { success: false, error: error.message };
  }
};

// Send newsletter to subscribers
const sendNewsletter = async (subject, content, subscribers) => {
  try {
    const transporter = createTransporter();

    const results = [];

    for (const subscriber of subscribers) {
      const mailOptions = {
        from: `"Cyber Cloud Kenya" <${process.env.EMAIL_USER}>`,
        to: subscriber.email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00ff2a;">${subject}</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
              ${content}
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <a href="${process.env.FRONTEND_URL}"
                 style="background: #00ff2a; color: black; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
                Visit Our Website
              </a>
            </div>
            <p style="font-size: 12px; color: #666; text-align: center; margin-top: 20px;">
              You're receiving this because you subscribed to our newsletter.
              <a href="${process.env.FRONTEND_URL}/unsubscribe?email=${subscriber.email}">Unsubscribe</a>
            </p>
          </div>
        `
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        results.push({ email: subscriber.email, success: true, messageId: info.messageId });
      } catch (error) {
        results.push({ email: subscriber.email, success: false, error: error.message });
      }
    }

    console.log(`Newsletter sent to ${results.filter(r => r.success).length} subscribers`);
    return results;
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
const sendPasswordReset = async (email, resetToken) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"Cyber Cloud Kenya" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00ff2a;">Password Reset Request</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p>You requested a password reset for your Cyber Cloud Kenya account.</p>
            <p>Please click the link below to reset your password:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${resetUrl}"
                 style="background: #00ff2a; color: black; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p><strong>Important:</strong> This link will expire in 10 minutes for security reasons.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendContactNotification,
  sendNewsletterConfirmation,
  sendNewsletter,
  sendPasswordReset
};