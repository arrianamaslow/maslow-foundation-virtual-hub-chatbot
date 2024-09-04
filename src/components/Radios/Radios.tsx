import React, { useEffect, useState } from 'react'
import CheckBox from '@/components/CheckBox/CheckBox'

export type RadiosProps = {
  radioGroupName: string
  radioValues: string[]
  defaultSelectedIndex?: number
  radioClickedCallback: React.Dispatch<React.SetStateAction<string>>
}

const Radios: React.FC<RadiosProps> = ({
  radioGroupName,
  radioValues,
  defaultSelectedIndex,
  radioClickedCallback
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(defaultSelectedIndex)

  const onRadioChange = (newSelectedIndex: number) => {
    setSelectedIndex(newSelectedIndex)
    radioClickedCallback(radioValues[newSelectedIndex])
  }

  useEffect(() => {
    if (
      !(defaultSelectedIndex === undefined) &&
      defaultSelectedIndex >= 0 &&
      defaultSelectedIndex < radioValues.length
    ) {
      onRadioChange(defaultSelectedIndex)
    }
  }, [])

  return (
    <div className='flex md:h-[20px] min-w-[8rem]'>
      {radioValues.map((radioValue, index) => (
        <div key={index} className=' min-w-[8rem]'>
          <label
            tabIndex={index}
            className='flex gap-2 items-center md:h-[20px]'
            data-testid={`mock-radio-option-${index}`}
          >
            <CheckBox tickIsActive={selectedIndex === index} />
            <input
              type='radio'
              name={radioGroupName}
              className='hidden'
              onChange={(e) => {
                onRadioChange(index)
              }}
              checked={selectedIndex === index}
            />
            {radioValue}
          </label>
        </div>
      ))}
    </div>
  )
}

export default Radios
