export type User = {
  pk: string
  email: string
  first_name: string
  last_name: string
  is_staff: boolean
}

export type UserState = {
  activeUser?: User
}
