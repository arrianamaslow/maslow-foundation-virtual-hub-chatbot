import React from 'react'
import style from './style.module.css'
import Image from 'next/image'
import OpenAI from 'openai'

export type MessageProps = {
  openAiMessage: OpenAI.ChatCompletionMessageParam
}

const Message: React.FC<MessageProps> = ({ openAiMessage }) => {
  const imageSrc =
    openAiMessage.role === 'user' ? '/img/user_icon.svg' : '/img/maslow-logo-colour.svg'
  return (
    <div className={style[`${openAiMessage.role}Div`]}>
      <Image src={imageSrc} alt={openAiMessage.role} width={26} height={54} />
      <div className={style[`${openAiMessage.role}TextBox`]}>
        {openAiMessage.content?.toString()}
      </div>
    </div>
  )
}

export default Message
