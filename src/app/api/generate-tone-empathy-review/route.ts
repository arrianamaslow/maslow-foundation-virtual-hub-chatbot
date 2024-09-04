import { NextRequest } from 'next/server'
import { request_schema } from '@/serverSide/gptComponents/generateToneEmpathyReview/schema'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'
import { z } from 'zod'
import handleError from '@/serverSide/utils/handleError'
import { generateToneEmpathyReview } from '@/serverSide/gptComponents/generateToneEmpathyReview/generateToneEmpathyReview'

export async function POST(req: NextRequest) {
  try {
    const { chatMessages, generatedBotMessage }: z.infer<typeof request_schema> =
      await parseAndValidateRequest(req, request_schema)

    const { approved, suggestions } = await generateToneEmpathyReview({
      chatMessages,
      generatedBotMessage
    })
    return Response.json({ approved, suggestions })
  } catch (error: any) {
    return handleError(error)
  }
}
