// src/components/TimeSelector.tsx
import React from 'react'
import Button from '../Button/Button'
type TimeslotPickerProps = {
  date: Date
  times: string[]
  selectedTime: string | null
  handleSelection: (time: string) => void
}

const TimeslotPicker: React.FC<TimeslotPickerProps> = ({
  times,
  date,
  selectedTime,
  handleSelection
}) => {
  const numOfRows = Math.ceil(times.length / 2)
  const optionsWeekday: Intl.DateTimeFormatOptions = { weekday: 'long' }
  const optionsDay: Intl.DateTimeFormatOptions = { day: 'numeric' }
  const optionsMonth: Intl.DateTimeFormatOptions = { month: 'long' }
  const optionsYear: Intl.DateTimeFormatOptions = { year: 'numeric' }

  const weekday = new Intl.DateTimeFormat('en-GB', optionsWeekday).format(date)
  const day = new Intl.DateTimeFormat('en-GB', optionsDay).format(date)
  const month = new Intl.DateTimeFormat('en-GB', optionsMonth).format(date).toUpperCase()
  const year = new Intl.DateTimeFormat('en-GB', optionsYear).format(date)

  const dayMonth = `${day} ${month}`

  return (
    <div className='flex w-full flex-col justify-start gap-y-[48px] md:gap-y-[80px]'>
      <p className='font-baskervald text-[1.625rem] md:text-[3.125rem]'>{`${weekday}, ${dayMonth} ${year}`}</p>
      <div className='flex w-full'>
        <div
          className={`ml-auto gap-x-8 gap-y-[16px] grid grid-flow-col md:grid-rows-none md:ml-0 md:grid-flow-row md:grid-cols-5 md:w-full ${getGridRowStyle(numOfRows)}`}
        >
          {times.map((time, i) => (
            <div className='w-fit' key={i}>
              <Button
                text={time}
                isDisabled={false}
                buttonType={selectedTime === time ? `primary` : `secondary`}
                onClick={() => {
                  handleSelection(time)
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getGridRowStyle(num: number): string {
  const rowStyle = [
    'grid-rows-1',
    'grid-rows-2',
    'grid-rows-3',
    'grid-rows-4',
    'grid-rows-5',
    'grid-rows-6',
    'grid-rows-7',
    'grid-rows-8',
    'grid-rows-9',
    'grid-rows-10'
  ]
  if (num > 10) {
    return rowStyle[rowStyle.length - 1]
  }
  return rowStyle[num - 1]
}

export default TimeslotPicker
