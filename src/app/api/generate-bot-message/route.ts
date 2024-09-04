import handleError from '@/serverSide/utils/handleError'
import { z } from 'zod'
import { NextRequest } from 'next/server'
import { request_schema } from '@/serverSide/gptComponents/generateBotMessage/schema'
import { generateBotMessage } from '@/serverSide/gptComponents/generateBotMessage/generateBotMessage'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'

export async function POST(req: NextRequest) {
  try {
    const { chatMessages, questionToAsk }: z.infer<typeof request_schema> =
      await parseAndValidateRequest(req, request_schema)

    const { message } = await generateBotMessage({ chatMessages, questionToAsk })
    return Response.json({ message })
  } catch (error: any) {
    return handleError(error)
  }
}
