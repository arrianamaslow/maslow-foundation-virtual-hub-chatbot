'use client'
import React, { useState } from 'react'
import Button from '@/components/Button/Button'
import Confirmation from '@/components/Confirmation/Confirmation'
import ChatInput from '@/components/ChatInput/ChatInput'
import Divider from '@/components/Divider/Divider'
import ExitButton from '@/components/ExitButton/ExitButton'
import Calendar from '@/components/Calendar/Calendar'
import StarRating from '@/components/StarRating/StarRating'
import BackButton from '@/components/BackButton/BackButton'
import ProgressBar from '@/components/ProgressBar/ProgressBar'
import TextArea from '@/components/TextArea/TextArea'
import TextInput from '@/components/TextInput/TextInput'
import DateInput from '@/components/DateInput/DateInput'
import Message from '@/components/Message/Message'

const timesExample = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00'
]

export default function IndexPage() {
  function handleClick() {
    alert('stuff was clicked')
  }

  function onBlur(Value: string) {
    alert('Value:' + Value)
  }

  const [rating, setRating] = useState(3)

  return (
    <div className='p-4 ml-auto mr-auto w-5/6'>
      <ProgressBar totalSegments={6} currentSegment={4} />
      {/* <PreferredMethodOfContact /> */}
      <ChatInput onSend={(msg) => alert(msg)} />
      <ExitButton onClick={() => void 0} />
      Some content here.
      <h1>Header 1</h1>
      <h2>Header 2</h2>
      <h3>Header 3</h3>
      <h3 className='font-baskervald'>Header 3 Baskervald</h3>
      <h4>Header 4</h4>
      <div className='subtitle'>subtitle</div>
      <div className='body-large-desktop'>body large desktop</div>
      <h2>Header above divide</h2>
      <Divider dividerText='Example divider text' />
      <h2>Header below divide</h2>
      <button>Click me</button>
      <Button text='click me' isDisabled={false} onClick={handleClick} buttonType='primary' />
      <Button text='click me' isDisabled={false} onClick={handleClick} buttonType='secondary' />
      <Button text='click me' isDisabled={false} onClick={handleClick} buttonType='tertiary' />
      <br></br>
      <Confirmation date={'4th of July'} time={'10am'} />
      <StarRating setRating={setRating} rating={rating} />
      <TextArea
        placeholder='I thought masbot was...'
        label='write some feedback (optional)'
        onBlur={(value) => {
          alert('Value: ' + value)
        }}
      />
      <div className='w-96'>
        <Message openAiMessage={{ role: 'user', content: 'hi' }} />
        <Message openAiMessage={{ role: 'assistant', content: 'hi' }} />
      </div>
      <Calendar availableDates={[new Date(2024, 6, 3)]} onSelect={(date: Date) => alert(date)} />
      <DateInput
        setDate={(date: string, isValid: boolean) => alert(date)}
        questionText='Whens your date of birth?'
      />
      <BackButton href='https://www.google.co.uk' />
      <TextInput
        questionText='What is your name?'
        placeholderText='John Smith'
        validation={(message) => {
          return message.length >= 8 ? '' : 'Must be 8 characters or longer'
        }}
      />
      <Button
        text={'hi'}
        isDisabled={false}
        buttonType={`secondary`}
        onClick={() => {
          ;() => {}
        }}
      />
    </div>
  )
}
