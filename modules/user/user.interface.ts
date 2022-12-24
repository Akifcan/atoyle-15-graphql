export interface User {
  id: number
  name: string
  password: string
  department: 'software' | 'hr'
  email: string
  createdat: Date
  isactive: boolean
  token: string
}
