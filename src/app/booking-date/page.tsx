'use client'

import Calendar from '@/components/Calendar/Calendar'
import React, { useState, useEffect } from 'react'
import ProgressWrapper from '@/components/ProgressWrapper/ProgressWrapper'
import { setBookingDate } from '@/lib/features/bookingSlice'
import { useAppDispatch } from '@/lib/hooks'
import { useRouter } from 'next/navigation'
import { postRequest } from '@/lib/functions/postRequest'
import { z } from 'zod'
import { setAvailableTimes } from '@/lib/features/availableTimesSlice'

export default function BookingDatePage() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [selectedDate, setSelectedDate] = useState<Date>()
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [availableDateTimesByDate, setAvailableDateTimesByDate] = useState<Map<String, Date[]>>(
    new Map()
  )

  const formatDateToString = (date: Date): string => {
    let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date)
    let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date)
    let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date)
    return `${year}-${month}-${day}`
  }

  async function getFutureAvailableDateTimes() {
    const { availableDateTimes } = await postRequest(
      '/api/SQL_Queries/getAvailableDateTimes',
      {
        dateStringInStartMonth: new Date()
      },
      z.any()
    )

    const availableDateTimesByDateMap: Map<string, Date[]> = new Map()

    availableDateTimes.forEach((dateTimeString: string) => {
      const dateTime = new Date(dateTimeString)
      const date: string = dateTime.toISOString().split('T')[0]

      if (availableDateTimesByDateMap.has(date)) {
        availableDateTimesByDateMap.get(date)?.push(dateTime)
      } else {
        availableDateTimesByDateMap.set(date, [dateTime])
      }
    })

    setAvailableDates(Array.from(availableDateTimesByDateMap.keys()).map((date) => new Date(date)))
    setAvailableDateTimesByDate(availableDateTimesByDateMap)
  }

  useEffect(() => {
    const init = async () => {
      await getFutureAvailableDateTimes()
    }

    init()
  }, [])

  async function handleClick() {
    if (selectedDate) {
      try {
        window.localStorage.setItem('appointmentDate', selectedDate.toISOString())
      } catch {}
      dispatch(setBookingDate(selectedDate.toISOString()))

      let availableTimes: string[] = []

      if (availableDateTimesByDate) {
        availableDateTimesByDate.get(formatDateToString(selectedDate))?.forEach((dateTime) => {
          const availableTimeUnformatted = new Date(dateTime)
          const timeFormatOptions: Intl.DateTimeFormatOptions = { timeStyle: 'short' }
          const availableTime = new Intl.DateTimeFormat('en-GB', timeFormatOptions).format(
            availableTimeUnformatted
          )
          availableTimes.push(availableTime)
        })
      }

      try {
        window.localStorage.setItem('availableTimes', availableTimes.toString())
      } catch {}
      dispatch(setAvailableTimes(availableTimes))

      router.push('/booking-slot')
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center w-full bg-neutral-100 justify-start md:pb-[60px]'>
      <div className='align-top flex justify-around items-end w-full md:py-[24px] py-[16px]'>
        <div>
          <img
            className='min-w-[107px] max-w-[172px] w-[20vw] flex justify-center'
            src='/img/maslow-title-logo-variation.svg'
          />
        </div>
      </div>
      <div className='w-full flex-grow md:max-w-[840px] flex justify-center'>
        <div className='w-full md:max-h-[883px] flex-grow'>
          <ProgressWrapper
            stepHeaderText='Step One: Please choose a date below.'
            currentProgressSegment={1}
            totalProgressSegments={2}
            backButtonUrl='/chat'
            isContinueDisabled={!selectedDate}
            onContinueClicked={handleClick}
          >
            <Calendar availableDates={availableDates} onSelect={setSelectedDate} />
          </ProgressWrapper>
        </div>
      </div>
    </div>
  )
}
