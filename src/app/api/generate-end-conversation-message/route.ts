import { z } from 'zod'
import { NextRequest } from 'next/server'
import { request_schema } from '@/serverSide/gptComponents/generateEndConversationMessage/schema'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'
import { generateEndConversationMessage } from '@/serverSide/gptComponents/generateEndConversationMessage/generateEndConversationMessage'

export async function POST(req: NextRequest) {
  const { chatMessages }: z.infer<typeof request_schema> = await parseAndValidateRequest(
    req,
    request_schema
  )
  const { message } = await generateEndConversationMessage({ chatMessages })

  return Response.json({ message })
}
