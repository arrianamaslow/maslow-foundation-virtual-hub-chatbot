import React, { useState } from 'react'
import style from './DateInput.module.css'

export type DateInputProps = {
  setDate: (newDate: string, isValid: boolean) => void
  questionText: string
}

type dateState = {
  day: string
  month: string
  year: string
}

type dateValueError = {
  day: boolean
  month: boolean
  year: boolean
  wholeDate: boolean
}

const DateInput: React.FC<DateInputProps> = ({ setDate, questionText }) => {
  const [dateSelected, setDateSelected] = useState<dateState>({ day: '', month: '', year: '' })
  const [previousDateSelected, setPreviousDateSelected] = useState<string>()
  const [dateSelectedValueError, setDateSelectedValueError] = useState<dateValueError>({
    day: false,
    month: false,
    year: false,
    wholeDate: false
  })

  const isValidNumberBetweenRangeInclusive = (value: string, min: number, max: number) => {
    if (!/^\d+$/.test(value)) return false
    const integer = parseInt(value)
    if (integer < min || integer > max) return false
    return true
  }

  const checkDateValid = () => {
    // do not validate until all fields have a value
    if (!dateSelected.day || !dateSelected.month || !dateSelected.year) return

    const monthRangeInvalid = !isValidNumberBetweenRangeInclusive(dateSelected.month, 1, 12)

    const yearRangeInvalid = !isValidNumberBetweenRangeInclusive(
      dateSelected.year,
      1900,
      new Date().getFullYear()
    )

    const dayRangeInvalid = !isValidNumberBetweenRangeInclusive(dateSelected.day, 1, 31)

    let wholeDateInvalid = false

    const monthSelected = parseInt(dateSelected.month)
    const yearSelected = parseInt(dateSelected.year)
    const daySelected = parseInt(dateSelected.day)
    if (!dayRangeInvalid && !monthRangeInvalid && !yearRangeInvalid) {
      const validatedDate = new Date(yearSelected, monthSelected - 1, daySelected)
      if (
        validatedDate.getDate() !== daySelected ||
        validatedDate.getMonth() + 1 !== monthSelected ||
        validatedDate.getFullYear() !== yearSelected
      ) {
        wholeDateInvalid = true
      }
    }
    setDateSelectedValueError({
      day: dayRangeInvalid,
      month: monthRangeInvalid,
      year: yearRangeInvalid,
      wholeDate: wholeDateInvalid
    })

    const newDateSelected = `${yearSelected}-${monthSelected}-${daySelected}`
    if (!dayRangeInvalid && !monthRangeInvalid && !yearRangeInvalid && !wholeDateInvalid) {
      setDate(newDateSelected, true)
      setPreviousDateSelected(newDateSelected)
    } else {
      setDate(newDateSelected, false)
    }
  }

  return (
    <div className='md:h-[77px] h-[72px]'>
      <div className='text-left md:text-[1.313rem] text-[17px] font-normal font-lato'>
        {questionText}
      </div>
      <div className={style.dateInputsContainer}>
        <input
          data-testid='day'
          type='text'
          name={'day'}
          className={`w-[69px] text-center pr-0 pl-0  ${dateSelectedValueError.day && '!border-[#FF0000]'}`}
          placeholder='DD'
          maxLength={2}
          onChange={(e) => {
            setDateSelected({ ...dateSelected, day: e.currentTarget.value })
          }}
          onBlur={checkDateValid}
        />
        <input
          data-testid='month'
          type='text'
          name={'month'}
          className={`w-[69px] text-center pr-0 pl-0 ${dateSelectedValueError.month && '!border-[#FF0000]'}`}
          maxLength={2}
          placeholder='MM'
          onChange={(e) => {
            setDateSelected({ ...dateSelected, month: e.currentTarget.value })
          }}
          onBlur={checkDateValid}
        />
        <input
          data-testid='year'
          type='text'
          className={`w-[79px] text-center pr-0 pl-0 ${dateSelectedValueError.year && '!border-[#FF0000]'}`}
          name={'year'}
          placeholder='YYYY'
          maxLength={4}
          onChange={(e) => {
            setDateSelected({ ...dateSelected, year: e.currentTarget.value })
          }}
          onBlur={checkDateValid}
        />
      </div>
      {(dateSelectedValueError.day ||
        dateSelectedValueError.month ||
        dateSelectedValueError.year ||
        dateSelectedValueError.wholeDate) && (
        <div className={style.errorMessageText}>Must be a valid date</div>
      )}
    </div>
  )
}

export default DateInput
