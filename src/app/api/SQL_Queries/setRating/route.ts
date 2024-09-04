import getSupabaseClient from '@/serverSide/utils/supabaseClient'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { request_schema } from './schema'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'

export async function POST(req: NextRequest) {
  const client = getSupabaseClient()
  const { rating, userId }: z.infer<typeof request_schema> = await parseAndValidateRequest(
    req,
    request_schema
  )

  if (client) {
    const response = await client
      .from('users')
      .update({
        likertScore: rating
      })
      .eq('userId', userId)

    return Response.json(response)
  }
}
