import { useState } from 'react'

type TextAreaProps = {
  placeholder: string
  label: string
  onBlur: (value: string) => void
}

const TextArea: React.FC<TextAreaProps> = ({ placeholder, label, onBlur }) => {
  const [value, setValue] = useState('')
  return (
    <div className='flex items-center w-screen'>
      <div className='flex flex-col w-[35rem]'>
        <label className='text-xl'> {label} </label>
        <textarea
          className='border-2 border-zinc-600 rounded-lg p-5 text-xl placeholder:italic placeholder:text-xl'
          id='additional_info'
          name='additional_info'
          rows={4}
          cols={20}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          onBlur={(e) => onBlur(value)}
        />
      </div>
    </div>
  )
}

export default TextArea
