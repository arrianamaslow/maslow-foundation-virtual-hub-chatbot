import handleError from '@/serverSide/utils/handleError'
import { z } from 'zod'
import { NextRequest } from 'next/server'
import { request_schema } from '@/serverSide/gptComponents/getCategoryFulfilment/schema'
import { getCategoryFulfilment } from '@/serverSide/gptComponents/getCategoryFulfilment/getCategoryFulfilment'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'

export async function POST(req: NextRequest) {
  try {
    const { chatMessages, mandatoryData, category }: z.infer<typeof request_schema> =
      await parseAndValidateRequest(req, request_schema)

    const { message } = await getCategoryFulfilment({ chatMessages, mandatoryData, category })
    return Response.json({ message })
  } catch (error: any) {
    return handleError(error)
  }
}
