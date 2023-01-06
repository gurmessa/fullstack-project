import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, UserState } from './userTypes'

const initialState: UserState = {
  activeUser: undefined,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setActiveUser(state, action: PayloadAction<User>) {
      state.activeUser = action.payload
    },
  },
})

export const { setActiveUser } = userSlice.actions
export default userSlice.reducer
