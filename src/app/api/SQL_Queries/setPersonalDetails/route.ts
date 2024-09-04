import getSupabaseClient from '@/serverSide/utils/supabaseClient'
import { NextRequest } from 'next/server'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'
import { z } from 'zod'
import { request_schema } from './schema'
export async function POST(req: NextRequest) {
  const client = getSupabaseClient()
  let userId: number = -1
  const {
    fullName,
    dateOfBirth,
    location,
    email,
    phoneNumber,
    preferredContactMethod
  }: z.infer<typeof request_schema> = await parseAndValidateRequest(req, request_schema)
  if (client) {
    const { data } = await client
      .from('users')
      .insert([
        {
          fullName,
          dateOfBirth,
          location,
          email,
          phoneNumber,
          preferredContactMethod
        }
      ])
      .select()
      .limit(1)
    if (data) {
      userId = data[0].userId
    }
    return Response.json({ userId })
  }
}
