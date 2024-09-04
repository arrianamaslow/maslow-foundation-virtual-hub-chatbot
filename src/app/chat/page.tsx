'use client'
import React, { useRef, useState, useEffect } from 'react'
import ChatInput from '@/components/ChatInput/ChatInput'
import Message from '@/components/Message/Message'
import Button from '@/components/Button/Button'
import { useRouter } from 'next/navigation'
import OpenAI from 'openai'
import { useAppSelector } from '@/lib/hooks'
import { z } from 'zod'
import { postRequest } from '@/lib/functions/postRequest'
import { ChatBotState } from '@/lib/types/ChatBotState'
import { categoryFulfilmentData } from '@/lib/CategoryPoints'
import { request_schema } from '../../serverSide/utils/processMessageAndGetResponse/schema'
import Divider from '@/components/Divider/Divider'
import TypingIndicator from '@/components/TypingIndicator/TypingIndicator'

export default function ChatPage() {
  const [currentState, setCurrentState] = useState<ChatBotState>({
    chatMessages: [
      {
        content: `Hi, I’m Masbot! I’m here to learn more about you so that when you book a call with one of our coordinators after our chat, they’ll know exactly what you need support with. What’s on your mind?`,
        role: 'assistant'
      } as OpenAI.ChatCompletionMessageParam
    ],
    lastBotMessageCategory: 'Other',
    categoryFulfilment: categoryFulfilmentData,
    ended: false
  })
  const router = useRouter()
  const userIdFromState: number | undefined = useAppSelector((state) => state.userId.data)
  const [userId, setUserId] = useState<number>(NaN)

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const chatContentRef = useRef<HTMLDivElement>(null)
  const latestMessageRef = useRef<HTMLDivElement>(null)

  const [isInitialRender, setIsInitialRender] = useState<boolean>(true)
  const [chatContentMarginTop, setChatContentMarginTop] = useState<number | null>(null)
  const [isGeneratingBotMessage, setIsGeneratingBotMessage] = useState<boolean>(false)

  async function sendMessage(message: string) {
    const userMessage: OpenAI.ChatCompletionMessageParam = {
      content: message,
      role: 'user'
    }

    const currentStateWithUserMessage: ChatBotState = {
      ...currentState,
      chatMessages: [...currentState.chatMessages, userMessage]
    }
    setCurrentState({ ...currentStateWithUserMessage })

    const formBody: z.infer<typeof request_schema> = {
      currentState: currentStateWithUserMessage as any
    }
    setIsGeneratingBotMessage(true)
    const response = await fetch(`/api/process-message-and-get-response`, {
      cache: 'no-store',
      method: 'POST',
      body: JSON.stringify(formBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      const { currentState } = await response.json()
      setCurrentState({ ...currentState })
    }
    setIsGeneratingBotMessage(false)
  }

  function scrollToLatestMessage() {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Any margin top related code here is to ensure the whitespace in the chat content will shrink as the height of the chat content grows.
  // This ensures that when the user scrolls up, they don't scroll into unnecessary white space.
  // When the chat content is at least the height of the scrollable container, the margin top will be 0.
  function updateMarginTop() {
    if (latestMessageRef.current && chatContentRef.current && chatContainerRef.current) {
      if (
        chatContentRef.current.clientHeight <= chatContainerRef.current.clientHeight &&
        chatContentMarginTop !== 0
      ) {
        setChatContentMarginTop(
          chatContainerRef.current.clientHeight - chatContentRef.current.clientHeight - 8
          // This '8' corresponds to the pt-[8px] on the chat container, but there is seemingly no easy way to get styling using js
        )
      } else {
        setChatContentMarginTop(0)
      }
    }
  }

  function waitForScrollThenUpdateMarginTop() {
    const observer = new IntersectionObserver(
      ([latestMessageRefDiv]) => {
        if (latestMessageRefDiv.isIntersecting) {
          updateMarginTop()
          observer.disconnect()
        }
      },
      { threshold: 1.0 }
    )
    if (latestMessageRef.current) {
      observer.observe(latestMessageRef.current)
    }
    return () => {
      if (latestMessageRef.current) {
        observer.unobserve(latestMessageRef.current)
      }
    }
  }

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (isInitialRender) {
      updateMarginTop()
      scrollToLatestMessage()
      setIsInitialRender(false)
    } else {
      scrollToLatestMessage()
      waitForScrollThenUpdateMarginTop()
    }
  }, [currentState.chatMessages])

  useEffect(() => {
    if (userIdFromState) {
      setUserId(userIdFromState)
    } else {
      const userIdFromLocalStorage = window.localStorage.getItem('userId')
      if (userIdFromLocalStorage) {
        setUserId(Number(userIdFromLocalStorage))
      }
    }
  }, [])

  return (
    <div className='fixed h-[100dvh] bottom-0 flex flex-col items-center w-screen overflow-y-none bg-neutral-100 justify-between'>
      <div className='align-top flex justify-around items-end w-full md:py-[24px] py-[16px]'>
        <div>
          <img
            className='min-w-[107px] max-w-[172px] w-[20vw] flex justify-center'
            src='/img/maslow-title-logo-variation.svg'
          />
        </div>
      </div>
      <div className='flex flex-col w-full h-[calc(100dvh-48px)] md:max-w-[56vw] md:mb-[5vh] md:py-[4vh] md:max-h-[85vh] bg-white items-center md:rounded-xl'>
        <div
          ref={chatContainerRef}
          className='overflow-y-auto overflow-x-hidden flex flex-col flex-1 mb-[8px] px-[16px] md:px-[6vw] w-full md:noVisualScrollbar pt-[8px]'
        >
          <div
            ref={chatContentRef}
            className='flex flex-col gap-y-[24px] md:gap-y-[32px]'
            style={{ marginTop: `${chatContentMarginTop ? chatContentMarginTop + 'px' : 'auto'}` }}
          >
            <div
              className={`w-full [&>*]:[&>*]:text-[14px] [&>*]:[&>*]:text-neutral-500 mb-[-12px]`}
            >
              <Divider dividerText='Start of chat' />
            </div>
            {currentState.chatMessages &&
              currentState.chatMessages.map((msg, index) => (
                <Message openAiMessage={msg} key={index} />
              ))}
            {isGeneratingBotMessage && <TypingIndicator />}
            {currentState.ended && (
              <div className='flex flex-col justify-center items-center my-8'>
                <Button
                  text='Book in call'
                  onClick={() => {
                    postRequest(
                      '/api/SQL_Queries/setMaslowInformation',
                      { state: currentState, userId },
                      z.any()
                    )
                    router.push('/booking-date')
                  }}
                  buttonType='primary'
                />
              </div>
            )}

            <div ref={latestMessageRef} />
          </div>
        </div>
        <div className='flex w-full md:max-w-[56vw] px-[16px] md:px-[6vw] pb-[24px] h-fit'>
          <ChatInput onSend={(text) => sendMessage(text)} />
        </div>
      </div>
    </div>
  )
}
