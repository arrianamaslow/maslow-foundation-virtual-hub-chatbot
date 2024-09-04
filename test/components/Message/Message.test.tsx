/**
 * @jest-environment jsdom
 */

import { render } from '@testing-library/react'
import Message from '@/components/Message/Message'

describe('<Message />', () => {
  const messageText = 'hello'

  it('renders user message correctly and "user" role is passed as param correctly', () => {
    const message = render(<Message openAiMessage={{ role: 'user', content: messageText }} />)
    expect(message).toMatchSnapshot()
  })

  it('renders assistant message correctly and "assistant" role is passed as param correctly', () => {
    const message = render(<Message openAiMessage={{ role: 'assistant', content: messageText }} />)
    expect(message).toMatchSnapshot()
  })

  it('passes text to user message as param correctly', () => {
    const message = render(<Message openAiMessage={{ role: 'user', content: messageText }} />)
    expect(message.getByText(messageText)).not.toBeNull()
  })

  it('passes text to assistant message as param correctly', () => {
    const message = render(<Message openAiMessage={{ role: 'assistant', content: messageText }} />)
    expect(message.getByText(messageText)).not.toBeNull()
  })

  it('renders user and assistant messages with same text differently', () => {
    const userMessage = render(<Message openAiMessage={{ role: 'user', content: messageText }} />)
    const assistantMessage = render(
      <Message openAiMessage={{ role: 'assistant', content: messageText }} />
    )
    expect(userMessage.asFragment()).not.toEqual(assistantMessage.asFragment())
  })
})
