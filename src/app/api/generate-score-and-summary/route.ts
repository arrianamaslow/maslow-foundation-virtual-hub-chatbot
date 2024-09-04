import handleError from '@/serverSide/utils/handleError'
import { z } from 'zod'
import { NextRequest } from 'next/server'
import { request_schema } from '@/serverSide/gptComponents/generateScoreAndSummary/schema'
import { generateScoreAndSummary } from '@/serverSide/gptComponents/generateScoreAndSummary/generateScoreAndSummary'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'

export async function POST(req: NextRequest) {
  try {
    const { chatMessages, category }: z.infer<typeof request_schema> =
      await parseAndValidateRequest(req, request_schema)

    const { score, summary } = await generateScoreAndSummary({ chatMessages, category })
    return Response.json({ score, summary })
  } catch (error: any) {
    return handleError(error)
  }
}
