const DataPointFulfilmentStatuses = [
  'Fulfilled',
  'Unfulfilled',
  'Requires attention',
  'Prefer not to say'
]

export type DataPointFulfilmentStatus = (typeof DataPointFulfilmentStatuses)[number]

export const isDataPointFulfilmentStatus = (status: any): status is DataPointFulfilmentStatus =>
  DataPointFulfilmentStatuses.includes(status)
