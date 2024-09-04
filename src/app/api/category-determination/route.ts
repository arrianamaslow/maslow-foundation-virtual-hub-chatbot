import handleError from '@/serverSide/utils/handleError'
import { z } from 'zod'
import { NextRequest } from 'next/server'
import { request_schema } from '@/serverSide/gptComponents/categoryDetermination/schema'
import { categoryDetermination } from '@/serverSide/gptComponents/categoryDetermination/categoryDetermination'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'

export async function POST(req: NextRequest) {
  try {
    const {
      chatMessages,
      previousUserMessageCategories,
      categoryFulfilment,
      lastBotMessageCategory
    }: z.infer<typeof request_schema> = await parseAndValidateRequest(req, request_schema)

    const { category } = await categoryDetermination({
      chatMessages,
      previousUserMessageCategories,
      categoryFulfilment,
      lastBotMessageCategory
    })
    return Response.json({ category })
  } catch (error: any) {
    return handleError(error)
  }
}
