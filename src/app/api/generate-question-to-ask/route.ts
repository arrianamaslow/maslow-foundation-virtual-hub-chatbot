import handleError from '@/serverSide/utils/handleError'
import { z } from 'zod'
import { NextRequest } from 'next/server'
import { request_schema } from '@/serverSide/gptComponents/generateQuestionToAsk/schema'
import { generateQuestionToAsk } from '@/serverSide/gptComponents/generateQuestionToAsk/generateQuestionToAsk'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'

export async function POST(req: NextRequest) {
  try {
    const { category, chatMessages, dataPoints }: z.infer<typeof request_schema> =
      await parseAndValidateRequest(req, request_schema)

    const { questionToAsk } = await generateQuestionToAsk({ category, chatMessages, dataPoints })
    return Response.json({ questionToAsk })
  } catch (error: any) {
    return handleError(error)
  }
}
