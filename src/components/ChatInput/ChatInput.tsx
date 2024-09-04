'use client'

import React, { useEffect, useRef, useState } from 'react'
import EnterButton from '../EnterButton/EnterButton'
import style from './ChatInput.module.css'

type ChatInputProps = {
  onSend: (message: string) => void
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState<string>('')

  const inputRef = useRef<HTMLTextAreaElement>(null)

  const submitMessage = () => {
    onSend(message)

    setMessage('')
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.focus()
    }
  }
  const adjustTextAreaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 3 * 24)}px` // Limit to 3 lines
    }
  }

  useEffect(() => {
    adjustTextAreaHeight() // Adjust height on load if there's existing text
  }, [message])

  return (
    <div className='relative flex w-full'>
      <textarea
        ref={inputRef}
        className={`${style.chatInput} noVisualScrollbar`}
        placeholder='Talk Here'
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
        rows={1}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            if (message) {
              submitMessage()
            }
          }
        }}
        maxLength={500}
        style={{ resize: 'none' }}
      />
      <div className='absolute top-0 right-0 h-full flex items-center justify-center pr-[16px]'>
        <EnterButton isDisabled={message.trim() === ''} onClick={submitMessage} />
      </div>
    </div>
  )
}

export default ChatInput
