/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import ChatInput from '@/components/ChatInput/ChatInput'
import '@testing-library/jest-dom'

jest.mock('@/components/EnterButton/EnterButton', () => {
  const MockButton = ({ isDisabled, onClick }: any) => (
    <button disabled={isDisabled} onClick={onClick}></button>
  )
  return MockButton
})

describe('<ChatInput />', () => {
  it('renders correctly', () => {
    const tree = render(<ChatInput onSend={() => {}} />)
    expect(tree).toMatchSnapshot()
  })

  it('can be submitted by the submit button and it will output the correct inputted text', () => {
    const mockFunction = jest.fn()
    render(<ChatInput onSend={mockFunction} />)
    const inputField = screen.getByRole('textbox')
    fireEvent.change(inputField, { target: { value: 'LLAMA' } })
    const submitField = screen.getByRole('button')
    fireEvent.click(submitField)
    expect(mockFunction).toHaveBeenCalledWith('LLAMA')
  })

  it('can be submitted by the return key and it will output the correct inputted text', () => {
    const mockFunction = jest.fn()
    render(<ChatInput onSend={mockFunction} />)
    const inputField = screen.getByRole('textbox')
    fireEvent.change(inputField, { target: { value: 'LLAMA' } })
    fireEvent.keyDown(inputField, { key: 'Enter', code: 'Enter', keyCode: 13 })
    expect(mockFunction).toHaveBeenCalledWith('LLAMA')
  })
})
