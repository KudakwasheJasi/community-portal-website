import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST', 'smtp.gmail.com'),
      port: this.configService.get('SMTP_PORT', 587),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('SMTP_USER', 'your-email@gmail.com'),
        pass: this.configService.get('SMTP_PASS', 'your-app-password'),
      },
    });
  }

  async sendEventRegistrationConfirmation(
    userEmail: string,
    userName: string,
    eventTitle: string,
    eventDate: Date,
    eventLocation: string,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: `"Community Portal" <${this.configService.get('SMTP_USER', 'noreply@communityportal.com')}>`,
        to: userEmail,
        subject: `Event Registration Confirmed: ${eventTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Event Registration Confirmed!</h2>
            <p>Dear ${userName},</p>
            <p>You have successfully registered for the following event:</p>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2c5aa0;">${eventTitle}</h3>
              <p><strong>Date:</strong> ${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString()}</p>
              <p><strong>Location:</strong> ${eventLocation}</p>
            </div>
            <p>We look forward to seeing you there!</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The Community Portal Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Event registration confirmation email sent to ${userEmail}`);
    } catch (error) {
      console.error(
        'Failed to send event registration confirmation email:',
        error,
      );
      // Don't throw error to avoid breaking the registration process
    }
  }

  async sendEventRegistrationNotificationToOrganizer(
    organizerEmail: string,
    organizerName: string,
    userName: string,
    userEmail: string,
    eventTitle: string,
  ): Promise<void> {
    try {
      const mailOptions = {
        from: `"Community Portal" <${this.configService.get('SMTP_USER', 'noreply@communityportal.com')}>`,
        to: organizerEmail,
        subject: `New Registration for Your Event: ${eventTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">New Event Registration!</h2>
            <p>Dear ${organizerName},</p>
            <p>Great news! Someone has registered for your event:</p>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #2c5aa0;">${eventTitle}</h3>
              <p><strong>New Registrant:</strong> ${userName} (${userEmail})</p>
            </div>
            <p>You can view all registrations in your event dashboard.</p>
            <p>Best regards,<br>The Community Portal Team</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(
        `Event registration notification sent to organizer ${organizerEmail}`,
      );
    } catch (error) {
      console.error(
        'Failed to send event registration notification to organizer:',
        error,
      );
      // Don't throw error to avoid breaking the registration process
    }
  }
}
