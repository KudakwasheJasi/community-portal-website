import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor() {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP_USER and SMTP_PASS environment variables must be set');
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.transporter = createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER!,
          pass: process.env.SMTP_PASS!,
        },
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      throw new Error(`Failed to create email transporter: ${error}`);
    }
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
  }

  async sendEventRegistrationEmail(userEmail: string, eventTitle: string): Promise<void> {
    const subject = `Registration Confirmed for ${eventTitle}`;
    const html = `
      <h1>Event Registration Confirmed</h1>
      <p>You have successfully registered for: <strong>${eventTitle}</strong></p>
      <p>Thank you for joining our community event!</p>
    `;
    await this.sendEmail(userEmail, subject, html);
  }
}
