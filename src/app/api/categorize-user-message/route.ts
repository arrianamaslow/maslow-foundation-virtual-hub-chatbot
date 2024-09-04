import handleError from '@/serverSide/utils/handleError'
import { z } from 'zod'
import { NextRequest } from 'next/server'
import { request_schema } from '@/serverSide/gptComponents/categorizeUserMessage/schema'
import { categorizeUserMessage } from '@/serverSide/gptComponents/categorizeUserMessage/categorizeUserMessage'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'

export async function POST(req: NextRequest) {
  try {
    const { chatMessages }: z.infer<typeof request_schema> = await parseAndValidateRequest(
      req,
      request_schema
    )

    const { categories } = await categorizeUserMessage({ chatMessages })
    return Response.json({ categories })
  } catch (error: any) {
    return handleError(error)
  }
}
