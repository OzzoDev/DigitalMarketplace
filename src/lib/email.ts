import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY,
  },
})

// ✅ Define compatible structure manually
export const emailAdapter = {
  sendEmail: async ({
    to,
    subject,
    html,
    text,
  }: {
    to: string
    subject: string
    html: string
    text?: string
  }) => {
    await transporter.sendMail({
      to,
      from: 'onboarding@resend.dev',
      subject,
      html,
      text,
    })
  },
}
