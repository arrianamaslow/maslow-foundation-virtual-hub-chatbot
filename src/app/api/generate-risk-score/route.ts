import { generateRiskScore } from '@/serverSide/gptComponents/generateRiskScore/generateRiskScore'
import { NextRequest } from 'next/server'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'
import { request_schema } from '@/serverSide/gptComponents/generateRiskScore/schema'
import { z } from 'zod'
import handleError from '@/serverSide/utils/handleError'

export async function POST(req: NextRequest) {
  try {
    const { chatMessages }: z.infer<typeof request_schema> = await parseAndValidateRequest(
      req,
      request_schema
    )
    const { riskScore, explanation } = await generateRiskScore(chatMessages)
    return Response.json({ riskScore, explanation })
  } catch (error: any) {
    return handleError(error)
  }
}
