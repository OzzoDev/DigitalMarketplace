import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'
import mongoose from 'mongoose'
import { Products } from './collections/Products/Products'
import { Media } from './collections/Meida'
import { ProductFiles } from './collections/ProductFile'
import { Orders } from './collections/Orders'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Clean all registered models to avoid OverwriteModelError
Object.keys(mongoose.models).forEach((modelName) => {
  delete mongoose.models[modelName]
})

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
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
  collections: [Users, Products, Media, ProductFiles, Orders],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET! || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || false,
  }),
  sharp,
  plugins: [payloadCloudPlugin()],
})
