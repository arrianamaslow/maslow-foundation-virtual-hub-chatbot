import { getTaskPrompt } from './taskPrompt'
import { request_schema } from './schema'
import { response_schema } from './schema'
import { validateJson } from '@/serverSide/utils/validation/request'
import { z } from 'zod'
import OpenAI from 'openai'
import { DataPointFulfilmentStatus } from '@/lib/types/DataPointFulfilmentStatus'
import { MaslowWheelCategories, MaslowWheelCategory } from '@/lib/types/MaslowWheelCategory'
import { MaslowCategoryFulfilment } from '@/lib/types/MaslowCategoryFulfilment'
import { DataPointFulfilmentRecord } from '@/lib/types/DataPointFulfilmentRecord'
import { getGptResponse } from '@/lib/functions/getGptResponse'

// Use GPT to choose a category based on conv history
async function getNewCategoryFromDifficulty(
  categoriesToChooseFrom: MaslowWheelCategory[],
  chatMessages: OpenAI.ChatCompletionMessageParam[]
) {
  const taskPrompt = getTaskPrompt(categoriesToChooseFrom)
  const response = await getGptResponse(chatMessages, taskPrompt, response_schema, false)

  return { category: response }
}

function getCategoryWithAttentionNeeded(
  categoryFulfilment: MaslowCategoryFulfilment,
  lastCategory: MaslowWheelCategory
): MaslowWheelCategory {
  let returnCategory: MaslowWheelCategory = 'Other'
  for (const [category, pointsList] of Object.entries(categoryFulfilment)) {
    for (const [point, pointStatus] of Object.entries(pointsList as DataPointFulfilmentRecord)) {
      if ((pointStatus as DataPointFulfilmentStatus) === 'Requires attention') {
        if (category == lastCategory) {
          returnCategory = category
        } else {
          return category as MaslowWheelCategory
        }
      }
    }
  }
  return returnCategory
}

function getLeastUnfulfilledCategory(
  categoryFulfilment: MaslowCategoryFulfilment,
  listOfCategories: MaslowWheelCategory[],
  alwaysChooseFromList: boolean
): MaslowWheelCategory {
  let leastUnfulfilledCount = Number.POSITIVE_INFINITY
  let leastUnfulfilledCategory: MaslowWheelCategory = 'Other'
  let number_of_equally_unfullfilled_points = 0

  if (alwaysChooseFromList && listOfCategories.length > 0) {
    leastUnfulfilledCategory = listOfCategories[0]
  }
  for (const category of listOfCategories) {
    let unfulfilledCount = getNumberOfUnfulfilledDataPoints(category, categoryFulfilment)
    if (unfulfilledCount <= leastUnfulfilledCount && unfulfilledCount > 0) {
      if (unfulfilledCount == leastUnfulfilledCount) {
        number_of_equally_unfullfilled_points += 1
      } else {
        leastUnfulfilledCount = unfulfilledCount
        leastUnfulfilledCategory = category
      }
    }
  }
  if (number_of_equally_unfullfilled_points == listOfCategories.length - 1) {
    return 'Other'
  } else {
    return leastUnfulfilledCategory
  }
}

function getNumberOfUnfulfilledDataPoints(
  category: MaslowWheelCategory,
  categoryFulfilment: MaslowCategoryFulfilment
) {
  if (!categoryFulfilment[category]) {
    return 0
  }
  let unfulfilledCount = 0
  for (const [dataPoint, status] of Object.entries(categoryFulfilment[category])) {
    if (status == 'Unfulfilled') {
      unfulfilledCount++
    }
  }
  return unfulfilledCount
}

export async function categoryDetermination(req: any) {
  const {
    chatMessages,
    previousUserMessageCategories,
    categoryFulfilment,
    lastBotMessageCategory
  }: z.infer<typeof request_schema> = await validateJson(req, request_schema)

  let chosenCategory: MaslowWheelCategory = getCategoryWithAttentionNeeded(
    categoryFulfilment as MaslowCategoryFulfilment,
    lastBotMessageCategory
  )
  if (chosenCategory != 'Other') {
    return { category: chosenCategory }
  }
  //Runs if categories relating to the previous user message
  chosenCategory = getLeastUnfulfilledCategory(
    categoryFulfilment as MaslowCategoryFulfilment,
    previousUserMessageCategories,
    true
  )
  if (chosenCategory != 'Other') {
    return { category: chosenCategory }
  }
  /*Still need to check:
        -If all previous categories were fully fulfilled
        -If previous categories is empty
        */
  const unfulfilledCategoriesArray: MaslowWheelCategory[] = []
  for (const category of MaslowWheelCategories) {
    if (
      !previousUserMessageCategories.includes(category) &&
      category != 'Other' &&
      getNumberOfUnfulfilledDataPoints(category, categoryFulfilment as MaslowCategoryFulfilment) > 0
    ) {
      unfulfilledCategoriesArray.push(category)
    }
  }
  if (unfulfilledCategoriesArray.length == 0) {
    return { category: 'Other' }
  }

  chosenCategory = getLeastUnfulfilledCategory(
    categoryFulfilment as MaslowCategoryFulfilment,
    unfulfilledCategoriesArray,
    false
  )
  if (chosenCategory != 'Other') {
    return { category: chosenCategory }
  }
  //Chat GPT chooses best category for flow
  return getNewCategoryFromDifficulty(unfulfilledCategoriesArray, chatMessages)
}
