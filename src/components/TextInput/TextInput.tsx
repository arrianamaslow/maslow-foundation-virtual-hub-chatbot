import React, { useState } from 'react'
import InputErrorWrapper from '../InputErrorWrapper/InputErrorWrapper'
type TextInputProps = {
  placeholderText?: string
  questionText: string
  validation: (value: string) => string
}

const TextInput: React.FC<TextInputProps> = ({ placeholderText, questionText, validation }) => {
  const [message, setMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const runValidation = (inputMessage: string, restrictUpdate: boolean) => {
    const errorMessageReturned = validation(inputMessage)
    if (errorMessageReturned) {
      if (!restrictUpdate) {
        setErrorMessage(errorMessageReturned)
      }
    } else {
      setErrorMessage('')
    }
  }

  return (
    <div className='flex-row md:h-[77px] h-[72px]'>
      <p className='text-left md:text-[1.313rem] text-[17px] font-normal font-lato'>
        {questionText}
      </p>
      <InputErrorWrapper errorMessage={errorMessage}>
        <input
          className={'w-full'}
          data-testid='input-field'
          type='text'
          placeholder={placeholderText}
          onChange={(e) => {
            setMessage(e.currentTarget.value)
            runValidation(e.currentTarget.value, true)
          }}
          onBlur={(e) => {
            runValidation(e.currentTarget.value, false)
          }}
        />
      </InputErrorWrapper>
    </div>
  )
}

export default TextInput
