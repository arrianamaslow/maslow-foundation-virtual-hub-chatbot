import { determineIfConversationShouldEnd } from '@/serverSide/gptComponents/determineIfConversationShouldEnd/determineIfConversationShouldEnd'
import { NextRequest } from 'next/server'
import { request_schema } from '@/serverSide/gptComponents/determineIfConversationShouldEnd/schema'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'
import { z } from 'zod'
import handleError from '@/serverSide/utils/handleError'

export async function POST(req: NextRequest) {
  try {
    const reqBody: z.infer<typeof request_schema> = await parseAndValidateRequest(
      req,
      request_schema
    )
    const { shouldEndConversation, justification } = await determineIfConversationShouldEnd(reqBody)
    return Response.json({ shouldEndConversation, justification })
  } catch (error: any) {
    return handleError(error)
  }
}
