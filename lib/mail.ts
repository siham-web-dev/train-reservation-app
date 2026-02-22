import nodemailer from 'nodemailer';
import { MAILTRAP_HOST, MAILTRAP_PORT, MAILTRAP_USER, MAILTRAP_PASS } from '@/app/config/constants'

const transporter = nodemailer.createTransport({
    host: MAILTRAP_HOST,
    port: MAILTRAP_PORT,
    auth: {
        user: MAILTRAP_USER,
        pass: MAILTRAP_PASS,
    },
});

export async function sendInvitationEmail(to: string, name: string, invitationLink: string) {
    const mailOptions = {
        from: '"Train Reservation Admin" <admin@trainreservation.com>',
        to: to,
        subject: 'Invitation to Join Train Reservation Platform',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; rounded: 8px;">
                <h2 style="color: #1677ff;">Welcome to the Platform!</h2>
                <p>Hello <strong>${name}</strong>,</p>
                <p>You have been invited to manage a new station on our platform. Please click the button below to set up your account and choose your subscription plan.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${invitationLink}" style="background-color: #1677ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Accept Invitation</a>
                </div>
                <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="color: #1677ff; font-size: 14px; word-break: break-all;">${invitationLink}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error: any) {
        console.error('Nodemailer Error:', error);
        return { error: error.message };
    }
}

export async function sendPasswordResetEmail(to: string, resetLink: string) {
    const mailOptions = {
        from: '"Train Reservation Support" <support@trainreservation.com>',
        to: to,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; rounded: 8px;">
                <h2 style="color: #1677ff;">Password Reset</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
                <p>Click the button below to set a new password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #1677ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
                </div>
                <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
                <p style="color: #1677ff; font-size: 14px; word-break: break-all;">${resetLink}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="color: #999; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error: any) {
        console.error('Nodemailer Error:', error);
        return { error: error.message };
    }
}
