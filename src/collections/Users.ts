import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminField, isAdminOrSelf } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Pengguna', plural: 'Pengguna' },
  auth: { tokenExpiration: 60 * 60 * 8, maxLoginAttempts: 5, lockTime: 10 * 60 * 1000 },
  admin: { useAsTitle: 'email', group: 'Pengaturan', defaultColumns: ['name', 'email', 'role'] },
  access: {
    // The very first user can always be created from the admin's "create first user" screen.
    create: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Nama' },
    {
      name: 'role',
      type: 'select',
      label: 'Peran',
      required: true,
      defaultValue: 'admin',
      saveToJWT: true,
      access: { update: isAdminField },
      options: [
        { label: 'Admin (semua akses)', value: 'admin' },
        { label: 'Editor (konten saja)', value: 'editor' },
      ],
    },
  ],
}
