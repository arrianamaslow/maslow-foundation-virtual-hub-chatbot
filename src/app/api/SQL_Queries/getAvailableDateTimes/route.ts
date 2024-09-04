import { z } from 'zod'
import formatDate from '@/serverSide/utils/formatDate'
import getSupabaseClient from '@/serverSide/utils/supabaseClient'
import handleError from '@/serverSide/utils/handleError'
import { NextRequest } from 'next/server'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'
import { request_schema } from './schema'

export async function POST(req: NextRequest) {
  try {
    const client = getSupabaseClient()
    const { dateStringInStartMonth }: z.infer<typeof request_schema> =
      await parseAndValidateRequest(req, request_schema)

    const dateInStartMonth = new Date(dateStringInStartMonth)

    if (client) {
      const { data: appointmentSlots } = await client
        .from('appointmentSlots')
        .select('appointmentDateTime')
        .is('userId', null)
        .gte('appointmentDateTime', formatDate(dateInStartMonth))
        .order('appointmentDateTime', { ascending: true })

      if (!appointmentSlots) {
        return Response.json({ availableDateTimes: [] })
      }

      const availableDateTimes: Date[] = appointmentSlots.map(
        (appointmentSlot: { appointmentDateTime: string }) => {
          return new Date(appointmentSlot.appointmentDateTime)
        }
      )

      return Response.json({ availableDateTimes })
    }
  } catch (error: any) {
    return handleError(error)
  }
}
