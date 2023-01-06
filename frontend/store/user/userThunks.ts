import { Dispatch } from '@reduxjs/toolkit'
import API from 'store/api'
import { Urls } from 'store/urls'
import { User } from './userTypes'
import { setActiveUser } from './userSlice'

export const loginUser = ({ username, password }: { username: string; password: string }) => async (
  dispatch: Dispatch,
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { data: user }: { data: User } = await API.post(Urls.Login(), { username, password })
    return user
  } catch (err) {
    throw err
  }
}

export const logoutUser = async (dispatch: Dispatch) => {
  // eslint-disable-next-line no-useless-catch
  try {
    await API.post(Urls.Logout())
  } catch (err) {
    throw err
  }
}

export const loadActiveUser = () => async (dispatch: Dispatch) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const { data: user }: { data: User } = await API.get(Urls.User())
    dispatch(setActiveUser(user))
    return user
  } catch (err) {
    throw err
  }
}
