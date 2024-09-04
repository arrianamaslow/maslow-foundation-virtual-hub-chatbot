import { configureStore } from '@reduxjs/toolkit'
import bookingSlice from './features/bookingSlice'
import availableTimesSlice from './features/availableTimesSlice'
import userIdSlice from './features/userIdSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      booking: bookingSlice,
      availableTimes: availableTimesSlice,
      userId: userIdSlice
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
