'use client'
import React, { useEffect } from 'react'
import TimeslotPicker from '@/components/TimeslotPicker/TimeslotPicker'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setBookingDate } from '@/lib/features/bookingSlice'
import { useRouter } from 'next/navigation'
import moment from 'moment-timezone'
import { postRequest } from '@/lib/functions/postRequest'
import { z } from 'zod'
import ProgressWrapper from '@/components/ProgressWrapper/ProgressWrapper'
import BackButton from '@/components/BackButton/BackButton'

export default function BookingSlotPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const timeZone = 'Europe/London'
  const appointmentDateFromState = useAppSelector((state) => state.booking.data)

  const backButtonUrl = '/booking-date'

  const availableTimesFromState: string[] = useAppSelector((state) => state.availableTimes.data)
  const userIdFromState: number | undefined = useAppSelector((state) => state.userId.data)

  const [appointmentDate, setAppointmentDate] = useState<string>('')
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [isAppointmentDateFromStateValid, _] = useState<boolean>(
    moment.tz(appointmentDateFromState, timeZone).isValid()
  )
  const [userId, setUserId] = useState(NaN)

  useEffect(() => {
    if (userIdFromState) {
      setUserId(userIdFromState)
    } else {
      const userIdFromLocalStorage = window.localStorage.getItem('userId')
      if (userIdFromLocalStorage) {
        setUserId(Number(userIdFromLocalStorage))
      }
    }

    if (isAppointmentDateFromStateValid) {
      setAppointmentDate(appointmentDateFromState)
    } else {
      const appointmentDateFromLocalStorage = window.localStorage.getItem('appointmentDate')
      if (appointmentDateFromLocalStorage) {
        setAppointmentDate(appointmentDateFromLocalStorage)
      } else {
        router.push('/booking-date')
      }
    }
    if (availableTimesFromState.length > 0) {
      setAvailableTimes(availableTimesFromState)
    } else {
      const availableTimesFromLocalStorage = window.localStorage.getItem('availableTimes')
      if (availableTimesFromLocalStorage) {
        setAvailableTimes(availableTimesFromLocalStorage.split(','))
      }
    }
  }, [isAppointmentDateFromStateValid, router])

  async function handleClick() {
    const appointmentDateTime = moment.tz(appointmentDate, timeZone)
    if (selectedTime) {
      const [hours, mins] = selectedTime.split(':').map((numString) => {
        return parseInt(numString, 10)
      })
      appointmentDateTime.set({ hour: hours, minute: mins, second: 0, millisecond: 0 })
    }
    try {
      window.localStorage.setItem('appointmentDate', appointmentDateTime.toISOString())
    } catch {}
    dispatch(setBookingDate(appointmentDateTime.toISOString()))
    const { status } = await postRequest(
      '/api/SQL_Queries/setAppointmentDateTime',
      { date: appointmentDateTime, userId },
      z.any()
    )
    if (status === 200) {
      router.push('/booking-confirmation')
    } else {
      alert(
        'We apologise but the appointment slot that you have chosen has just been taken by another user, please select another appointment time'
      )
      router.push('/booking-date')
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center w-full bg-neutral-100 justify-start md:pb-[60px]'>
      <div className='align-top grid grid-cols-3 w-full md:py-[24px] py-[16px] md:grid-cols-1'>
        <div className='h-[40px] md:hidden flex ml-[10px]'>
          <BackButton href={backButtonUrl} />
        </div>
        <div className='flex justify-center'>
          <img
            className='w-full min-w-[107px] max-w-[172px] flex justify-center'
            src='/img/maslow-title-logo-variation.svg'
          />
        </div>
      </div>
      <div className='w-full flex-grow md:max-w-[840px] flex justify-center'>
        <div className='w-full md:max-h-[883px] flex-grow'>
          <ProgressWrapper
            isContinueDisabled={selectedTime === ''}
            stepHeaderText='Step Two: Please choose a time below:'
            onContinueClicked={handleClick}
            backButtonUrl={backButtonUrl}
            currentProgressSegment={2}
            totalProgressSegments={2}
          >
            {appointmentDate && (
              <TimeslotPicker
                times={availableTimes}
                date={new Date(appointmentDate)}
                selectedTime={selectedTime}
                handleSelection={(time: string) => setSelectedTime(time)}
              />
            )}
          </ProgressWrapper>
        </div>
      </div>
    </div>
  )
}
