import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    verify: {
      generateEmailHTML: ({ token, user }) => {
        return `<p>Hello ${user.email}, please verify your email by clicking</p>`
      },
      generateEmailSubject: () => 'Please verify your email',
    },
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: 'role',
      defaultValue: 'user',
      required: true,
      // admin: {
      //   condition: () => false,
      // },
      type: 'select',
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
    },
  ],
}
