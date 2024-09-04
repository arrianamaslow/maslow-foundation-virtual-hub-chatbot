import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ObjectState {
  data: string[]
}
const initialState: ObjectState = {
  data: []
}

export const availableTimesSlice = createSlice({
  name: 'object',
  initialState,
  reducers: {
    setAvailableTimes: (state, action: PayloadAction<any>) => {
      state.data = action.payload
    }
  }
})

export const { setAvailableTimes } = availableTimesSlice.actions
export default availableTimesSlice.reducer
