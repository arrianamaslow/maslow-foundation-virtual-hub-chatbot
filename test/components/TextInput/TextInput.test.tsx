/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('@/components/InputErrorWrapper/InputErrorWrapper', () => {
  const MockWrapper = ({ errorMessage, children }: any) => (
    <div data-testid={errorMessage}>{children}</div>
  )

  return MockWrapper
})

import TextInput from '@/components/TextInput/TextInput'

describe('<TextInput />', () => {
  it('renders correctly', () => {
    const tree = render(
      <TextInput
        placeholderText=''
        questionText=''
        validation={(value: string) => {
          return 'default text'
        }}
      />
    )
    expect(tree).toMatchSnapshot()
  })

  it('has an input field which is of type text and has placeholder text equal to the value of the placeholder parameter', () => {
    render(
      <TextInput
        placeholderText='placeholder text'
        questionText=''
        validation={(value: string) => {
          return 'default text'
        }}
      />
    )
    const inputField = screen.getByTestId('input-field')
    expect(inputField).toHaveAttribute('type', 'text')
    expect(inputField).toHaveAttribute('placeholder', 'placeholder text')
  })

  it('runs validation when its input field is blured', () => {
    const validation = jest.fn()
    render(<TextInput placeholderText='placeholder text' questionText='' validation={validation} />)
    const inputField = screen.getByTestId('input-field')
    fireEvent.change(inputField, {
      target: { value: 'test string' }
    })
    fireEvent.blur(inputField)
    expect(validation).toHaveBeenCalledWith('test string')
  })

  it('has an input field which displays an error when validation is not met', () => {
    const validation = jest.fn()
    validation.mockReturnValue('invalid-input')
    render(<TextInput placeholderText='placeholder text' questionText='' validation={validation} />)
    const inputField = screen.getByTestId('input-field')
    fireEvent.change(inputField, {
      target: { value: 'test string' }
    })
    fireEvent.blur(inputField)
    const complaintDiv = screen.getByTestId('invalid-input')
    expect(complaintDiv).not.toBeNull()
  })

  it('has an input field which does run validation on change where an error message is displayed', () => {
    const validation = jest.fn()
    validation.mockReturnValue('invalid-input')
    render(<TextInput placeholderText='placeholder text' questionText='' validation={validation} />)
    const inputField = screen.getByTestId('input-field')
    fireEvent.change(inputField, {
      target: { value: 'test string' }
    })
    fireEvent.blur(inputField)
    const complaintDiv = screen.getByTestId('invalid-input')
    expect(complaintDiv).not.toBeNull()
    fireEvent.change(inputField, {
      target: { value: 'test string' }
    })
    expect(validation).toHaveBeenCalledWith('test string')
  })

  it('has an input field which does run validation on change where an error message is not displayed', () => {
    const validation = jest.fn()
    validation.mockReturnValue('invalid-input')
    render(<TextInput placeholderText='placeholder text' questionText='' validation={validation} />)
    const inputField = screen.getByTestId('input-field')
    fireEvent.change(inputField, {
      target: { value: 'test string' }
    })
    expect(validation).toHaveBeenCalledWith('test string')
  })
})
