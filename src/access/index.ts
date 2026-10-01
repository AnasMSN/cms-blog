import type { Access, FieldAccess } from 'payload'

type Role = 'admin' | 'editor'
const roleOf = (user: unknown): Role | undefined =>
  (user as { role?: Role } | null)?.role

/** Only admins (e.g. the developer or the business owner). */
export const isAdmin: Access = ({ req: { user } }) => roleOf(user) === 'admin'
export const isAdminField: FieldAccess = ({ req: { user } }) => roleOf(user) === 'admin'

/** Anyone logged in to the admin panel (admin or editor). */
export const isLoggedIn: Access = ({ req: { user } }) => Boolean(user)

/** Public visitors only see published documents; logged-in staff see drafts too. */
export const publishedOrLoggedIn: Access = ({ req: { user } }) => {
  if (user) return true
  return { _status: { equals: 'published' } }
}

/** Admins can edit anyone; editors only themselves. */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (roleOf(user) === 'admin') return true
  return { id: { equals: user.id } }
}
