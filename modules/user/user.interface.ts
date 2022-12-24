/* eslint-disable @typescript-eslint/indent */
export interface User {
  id: number
  name: string
  password: string
  department: 'software' | 'hr'
  email: string
  createdat: Date
  isactive: boolean
  token: string
  description?: string
  slug: string
}

export type UserProfile = Pick<User, 'name' | 'department' | 'description' | 'email' | 'slug' | 'id'>
