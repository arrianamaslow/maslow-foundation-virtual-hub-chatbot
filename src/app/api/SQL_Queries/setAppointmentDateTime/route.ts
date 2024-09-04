import getSupabaseClient from '@/serverSide/utils/supabaseClient'
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { request_schema } from './schema'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'

export async function POST(req: NextRequest) {
  const client = getSupabaseClient()
  const { date, userId }: z.infer<typeof request_schema> = await parseAndValidateRequest(
    req,
    request_schema
  )

  if (client) {
    const { data } = await client
      .from('appointmentSlots')
      .update({ userId: userId })
      .eq('appointmentDateTime', date.toISOString())
      .select()

    if (data?.length === 0) {
      return Response.json({ status: 500 })
    }
    return Response.json({ status: 200 })
  }
}
