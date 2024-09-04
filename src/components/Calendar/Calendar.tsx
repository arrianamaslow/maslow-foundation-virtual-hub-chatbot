'use client'
import { useState } from 'react'
import { DayPicker, getDefaultClassNames, Matcher } from 'react-day-picker'
import { format } from 'date-fns'

type CalendarProps = {
  availableDates: Date[]
  onSelect: (date: Date) => void
}

const Calendar: React.FC<CalendarProps> = ({ availableDates, onSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [displayedDate, setDisplayedDate] = useState<Date>(new Date())
  const style = getDefaultClassNames()
  const formatWeekdayName = (date: any) => format(date, 'eee').toLocaleUpperCase()

  const notAvailableMatcher: Matcher = (day: Date) => {
    return !availableDates
      .toLocaleString('en-GB', { timeZone: 'Europe/London' })
      .includes(day.toLocaleString('en-GB', { timeZone: 'Europe/London' }).split(',')[0])
  }

  return (
    <div className={`flex w-full justify-center h-full`}>
      <DayPicker
        required={false}
        mode='single'
        fixedWeeks={true}
        formatters={{
          formatWeekdayName
        }}
        numberOfMonths={1}
        pagedNavigation
        showOutsideDays
        startMonth={new Date()}
        weekStartsOn={1}
        selected={selectedDate}
        month={displayedDate}
        onSelect={(date: Date | undefined) => {
          /* When a user deselects a date, the date passed in here would be undefined.
          Setting the state used by the month property to undefined would set the month page to be to the current month in time, as opposed to staying on the month currently being viewed.
          Having a separate state, and updating this only when date is truthy, solves this issue.
          Also, `selected` should still be set to undefined to deselect the button visually, and will also disable the continue button, as desired. */
          if (date) {
            setDisplayedDate(date)
          }
          setSelectedDate(date)
          onSelect(date as Date)
        }}
        disabled={[
          notAvailableMatcher,
          { dayOfWeek: [0, 6] },
          { before: availableDates[0] },
          { after: availableDates[availableDates.length - 1] }
        ]}
        classNames={{
          root: `${style.root} w-full h-full`,
          day: `${style.day}`,
          day_button: `text-[21px] w-[44px] h-[44px] font-normal`,
          weekday: `text-[12px] w-[26px] font-normal`,
          weekdays: `border-t-2 py-[10px] flex flex-row w-full justify-around`,
          weeks: `${style.weeks} flex flex-col justify-around h-full`,
          week: `${style.week} flex flex-row w-full justify-around py-[4px]`,
          nav: `flex flex-row w-full justify-between px-[32px] py-[16px]`,
          button_previous: `${style.button_previous} disabled:fill-[#D9D9D9]`,
          months: `${style.months} w-full h-full relative`,
          month: `${style.month} flex flex-col h-full`,
          today: `rounded-lg bg-[#D9D9D9]`,
          selected: `rounded-lg bg-black text-white`,
          disabled: 'opacity-25',
          outside: 'opacity-25',
          hidden: 'opacity-25',
          caption_label: 'text-[21px]',
          month_caption: 'absolute self-center md:top-[4px] top-[14px]'
        }}
      />
    </div>
  )
}

export default Calendar
