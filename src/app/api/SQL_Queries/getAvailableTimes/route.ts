import getSupabaseClient from '@/serverSide/utils/supabaseClient'
import { NextRequest } from 'next/server'
import { parseAndValidateRequest } from '@/serverSide/utils/validation/request'
import { request_schema } from './schema'
import { z } from 'zod'
import formatDate from '@/serverSide/utils/formatDate'

function getNextDay(date: Date): Date {
  const nextDay = new Date(date.getTime())
  nextDay.setDate(date.getDate() + 1)
  return nextDay
}

export async function POST(req: NextRequest) {
  const client = getSupabaseClient()
  const { date }: z.infer<typeof request_schema> = await parseAndValidateRequest(
    req,
    request_schema
  )
  const firstDate = new Date(date)
  const followingDate = getNextDay(firstDate)

  if (client) {
    const { data: appointmentData } = await client
      .from('appointmentSlots')
      .select('appointmentDateTime')
      .is('userId', null)
      .gte('appointmentDateTime', formatDate(firstDate))
      .lte('appointmentDateTime', formatDate(followingDate))
      .order('appointmentDateTime', { ascending: true })
    let availableTimes: string[] = []
    if (appointmentData) {
      availableTimes = appointmentData.map((record: { appointmentDateTime: string }) => {
        const availableTimeUnformatted = new Date(record.appointmentDateTime)
        const optionsTime: Intl.DateTimeFormatOptions = { timeStyle: 'short' }
        const availableTime = new Intl.DateTimeFormat('en-GB', optionsTime).format(
          availableTimeUnformatted
        )
        return availableTime
      })
    }

    return Response.json({ availableTimes })
  }
}
