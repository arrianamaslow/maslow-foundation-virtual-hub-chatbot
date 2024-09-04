import getSupabaseClient from '@/serverSide/utils/supabaseClient'
import { NextRequest } from 'next/server'
import { request_schema } from './schema'
import { z } from 'zod'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'
import { generateScoreAndSummaries } from '@/serverSide/utils/processMessageAndGetResponse/generateScoreAndSummaries'
import { fetchWithRetry } from '@/lib/requests/helpers/apiRetry'

export async function POST(req: NextRequest) {
  const client = getSupabaseClient()
  const { state, userId }: z.infer<typeof request_schema> = await parseAndValidateRequest(
    req,
    request_schema
  )

  const scoreAndSummaryOverview = await fetchWithRetry({
    apiCall: () => {
      return generateScoreAndSummaries(state)
    },
    maxRetries: 3
  })

  console.log('###########################################')
  console.log(scoreAndSummaryOverview)
  if (client) {
    const response = await client.from('users').update(scoreAndSummaryOverview).eq('userId', userId)

    return Response.json(response)
  }
}
