'use client'
import Button from '@/components/Button/Button'
import React, { useEffect, useState } from 'react'
import Confirmation from '@/components/Confirmation/Confirmation'
import Image from 'next/image'
import FeedbackPopup from '@/components/FeedbackPopup/FeedbackPopup'
import { useAppSelector } from '@/lib/hooks'
import moment from 'moment-timezone'
const ics = require('ics')

export default function BookingConfirmationPage() {
  const title = 'Maslow initial appointment'
  const description =
    'A chat so that we can offer you support and help refer you to appropriate services'
  const location = 'Phone call'
  const userIdFromState: number | undefined = useAppSelector((state) => state.userId.data)
  const appointmentDateFromState: string = useAppSelector((state) => state.booking.data)

  const [userId, setUserId] = useState(NaN)
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)
  const [showOverlay, setShowOverlay] = useState(false)

  const formatDateForOutlook = (date: Date): string => {
    const tzDate = moment.tz(date, 'Europe/London')
    return tzDate.format('YYYY-MM-DDTHH:mm:ss')
  }
  const formatDateForGoogle = (date: Date): string => {
    const tzDate = moment.tz(date, 'Europe/London')
    const formatForGoogleCalendar = 'YYYYMMDDTHHmmss[Z]'
    return tzDate.utc().format(formatForGoogleCalendar)
  }

  const createAndDownloadICS = (startDate: Date) => {
    const event = {
      start: [
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        startDate.getHours(),
        startDate.getMinutes()
      ],
      duration: { hours: 0, minutes: 30 },
      title,
      description,
      location,
      organizer: { name: 'Maslow Foundation' }
    }

    ics.createEvent(event, (error: any, value: any) => {
      if (error) {
        return
      }

      const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = 'appointment.ics'
      document.body.appendChild(link)
      link.click()

      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    })
  }

  useEffect(() => {
    if (userIdFromState) {
      setUserId(userIdFromState)
    } else {
      const userIdFromLocalStorage = window.localStorage.getItem('userId')
      if (userIdFromLocalStorage) {
        setUserId(Number(userIdFromLocalStorage))
      }
    }

    if (appointmentDateFromState !== '') {
      setAppointmentDate(new Date(appointmentDateFromState))
      setLoading(false)
    } else {
      const appointmentDateFromLocalStorage = window.localStorage.getItem('appointmentDate')
      if (appointmentDateFromLocalStorage) {
        setAppointmentDate(new Date(appointmentDateFromLocalStorage))
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      setShowOverlay(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <></> // Display a loading indicator
  }

  //if no date by here, then no point finishing the flow

  let googleCalendarUrl = '/'
  let outlookCalendarUrl = '/'
  if (appointmentDate) {
    const finishDate = new Date(appointmentDate.getTime())
    finishDate.setMinutes(appointmentDate.getMinutes() + 30)

    const outlookStartDate = formatDateForOutlook(appointmentDate)
    const outlookEndDate = formatDateForOutlook(finishDate)
    const googleStartDate = formatDateForGoogle(appointmentDate)
    const googleEndDate = formatDateForGoogle(finishDate)

    googleCalendarUrl = `https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(title)}&dates=${googleStartDate}/${googleEndDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`
    outlookCalendarUrl = `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description)}&location=${location}&startdt=${outlookStartDate}&enddt=${outlookEndDate}`
  }

  return (
    <div className={'flex flex-col w-full h-[75vh] justify-center'}>
      <FeedbackPopup
        isOpen={showOverlay}
        setIsOpen={setShowOverlay}
        userId={userId}
      ></FeedbackPopup>
      <div className='flex flex-col gap-4 m-auto'>
        <Confirmation
          date={
            appointmentDate
              ? appointmentDate.toLocaleDateString('en-GB', { timeZone: 'Europe/London' })
              : ''
          }
          time={
            appointmentDate
              ? appointmentDate.toLocaleTimeString('en-GB', {
                  timeZone: 'Europe/London',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : ''
          }
        />
        <div className='flex justify-center'>
          {appointmentDate && (
            <Button
              isDisabled={false}
              text='Add to calendar'
              buttonType='tertiary'
              onClick={() => {
                createAndDownloadICS(appointmentDate)
              }}
            />
          )}
        </div>

        {appointmentDate && (
          <div className='flex items-center flex-row justify-center gap-3'>
            {
              <a href={outlookCalendarUrl}>
                <Image
                  src='/img/outlook-icon.svg'
                  alt={'add to outlook calendar'}
                  width={25}
                  height={25}
                />
              </a>
            }
            <a href={googleCalendarUrl}>
              <Image
                src='/img/google-calendar-icon.svg'
                alt={'add to google calendar'}
                width={25}
                height={25}
              />
            </a>
          </div>
        )}
        {!appointmentDate && <p className='subtitle'> You can now close this window.</p>}
      </div>
    </div>
  )
}
