import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'
import mongoose from 'mongoose'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// 🧼 Clean all registered models to avoid OverwriteModelError
Object.keys(mongoose.models).forEach((modelName) => {
  delete mongoose.models[modelName]
})

// ✅ now build config cleanly
export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // No global hooks — but this happens before config is used
  email: nodemailerAdapter({
    defaultFromAddress: 'onboarding@resend.dev',
    defaultFromName: 'DigitalHippo',
    transport: nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY,
      },
    }),
  }),
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET! || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [payloadCloudPlugin()],
})
