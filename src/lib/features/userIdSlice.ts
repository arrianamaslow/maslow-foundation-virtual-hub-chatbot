import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ObjectState {
  data: number | undefined
}
const initialState: ObjectState = {
  data: undefined
}

export const userIdSlice = createSlice({
  name: 'object',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<any>) => {
      state.data = action.payload
    }
  }
})

export const { setUserId } = userIdSlice.actions
export default userIdSlice.reducer
