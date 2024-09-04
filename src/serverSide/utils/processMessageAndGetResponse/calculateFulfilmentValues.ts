import { DataPointFulfilmentRecord } from '@/lib/types/DataPointFulfilmentRecord'
import { DataPointFulfilmentStatus } from '@/lib/types/DataPointFulfilmentStatus'
import { MaslowCategoryFulfilment } from '@/lib/types/MaslowCategoryFulfilment'
import { MaslowWheelCategory } from '@/lib/types/MaslowWheelCategory'

export const calculateFulfilmentValues = (categoryFulfilment: MaslowCategoryFulfilment) => {
  let totalNumberOfCategories = 0
  let numberOfCategoriesResolved = 0
  let numberOfCategoriesRequiringAttention = 0

  for (let category of Object.keys(categoryFulfilment)) {
    const informationInCategory: DataPointFulfilmentRecord =
      categoryFulfilment[category as MaslowWheelCategory]
    for (let subcategory of Object.keys(informationInCategory)) {
      totalNumberOfCategories++
      const fulfilmentStatus: DataPointFulfilmentStatus =
        informationInCategory[subcategory as string]
      if (fulfilmentStatus === 'Fulfilled' || fulfilmentStatus === 'Prefer not to say') {
        numberOfCategoriesResolved++
      } else if (fulfilmentStatus === 'Requires attention') {
        numberOfCategoriesRequiringAttention++
      }
    }
  }

  return {
    totalNumberOfCategories: totalNumberOfCategories,
    numberOfCategoriesResolved,
    numberOfCategoriesRequiringAttention
  }
}
