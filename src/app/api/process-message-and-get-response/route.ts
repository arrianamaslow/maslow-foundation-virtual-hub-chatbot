import { NextRequest } from 'next/server'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'
import { request_schema } from '@/serverSide/utils/processMessageAndGetResponse/schema'
import { z } from 'zod'
import handleError from '@/serverSide/utils/handleError'
import { processMessageAndGetResponse } from '@/serverSide/utils/processMessageAndGetResponse/processMessageAndGetReponse'

export async function POST(req: NextRequest) {
  try {
    const { currentState }: z.infer<typeof request_schema> = await parseAndValidateRequest(
      req,
      request_schema
    )

    await processMessageAndGetResponse(currentState)

    return Response.json({ currentState })
  } catch (error: any) {
    return handleError(error)
  }
}
