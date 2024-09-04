import { blockFalseInfoReviewer } from '@/serverSide/gptComponents/blockFalseInfoReviewer/blockFalseInfoReviewer'
import { request_schema } from '@/serverSide/gptComponents/blockFalseInfoReviewer/schema'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'
import { NextRequest } from 'next/server'
import { z } from 'zod'

export async function POST(req: NextRequest) {
  const { chatMessages, generatedBotMessage }: z.infer<typeof request_schema> =
    await parseAndValidateRequest(req, request_schema)
  const { approved, suggestions } = await blockFalseInfoReviewer({
    chatMessages,
    generatedBotMessage
  })
  return Response.json({ approved, suggestions })
}
