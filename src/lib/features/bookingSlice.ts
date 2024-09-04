import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ObjectState {
  data: string
}
const initialState: ObjectState = {
  data: ''
}

export const bookingSlice = createSlice({
  name: 'object',
  initialState,
  reducers: {
    setBookingDate: (state, action: PayloadAction<any>) => {
      state.data = action.payload
    }
  }
})

export const { setBookingDate } = bookingSlice.actions
export default bookingSlice.reducer
