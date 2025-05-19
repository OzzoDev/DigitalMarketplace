import { User } from '@/payload-types'
import { Access, CollectionConfig } from 'payload'

const isAdminOrHasAccessToImages =
  (): Access =>
  async ({ req }) => {
    const user = req.user as User

    if (!user) {
      return false
    }

    if (user.role === 'admin') {
      return true
    }

    return {
      user: {
        equals: req.user?.id,
      },
    }
  }

export const Media: CollectionConfig = {
  slug: 'media',
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        return { ...data, user: req.user?.id }
      },
    ],
  },
  access: {
    read: async ({ req }) => {
      const referer = req.headers.get('referer')

      if (!req.user || !referer?.includes('admin')) {
        return true
      }

      return await isAdminOrHasAccessToImages()({ req })
    },
    delete: isAdminOrHasAccessToImages(),
    update: isAdminOrHasAccessToImages(),
  },
  admin: {
    hidden: ({ user }) => user?.role !== 'admin',
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thmbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 768,
        height: undefined,
        position: 'centre',
      },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
  ],
}
