/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import DateInput, { DateInputProps } from '@/components/DateInput/DateInput'

const defaultProps: DateInputProps = {
  setDate: () => {},
  questionText: ''
}

describe('<DateInput/>', () => {
  it('renders correctly', () => {
    const tree = render(<DateInput {...defaultProps} />)
    expect(tree).toMatchSnapshot()
  })

  it('has a day input field of type text, with placeholder text', () => {
    render(<DateInput {...defaultProps} />)
    const dayField = screen.getByTestId('day')
    expect(dayField).toHaveAttribute('type', 'text')
    expect(dayField).toHaveAttribute('placeholder', 'DD')
  })

  it('has a month input field of type text, with placeholder text', () => {
    render(<DateInput {...defaultProps} />)
    const monthField = screen.getByTestId('month')
    expect(monthField).toHaveAttribute('type', 'text')
    expect(monthField).toHaveAttribute('placeholder', 'MM')
  })

  it('has a year input field of type text with placeholder text', () => {
    render(<DateInput {...defaultProps} />)
    const yearField = screen.getByTestId('year')
    expect(yearField).toHaveAttribute('type', 'text')
    expect(yearField).toHaveAttribute('placeholder', 'YYYY')
  })

  it('runs the validation checker for the current value for the date, and calls the date update function where valid', () => {
    const dateSetter = jest.fn()
    render(<DateInput setDate={dateSetter} questionText='' />)

    const dayField = screen.getByTestId('day')
    fireEvent.change(dayField, { target: { value: '06' } })

    const monthField = screen.getByTestId('month')
    fireEvent.change(monthField, { target: { value: '08' } })

    const yearField = screen.getByTestId('year')
    fireEvent.change(yearField, { target: { value: '1991' } })

    fireEvent.blur(yearField)
    expect(dateSetter).toHaveBeenCalledWith('1991-8-6', true)
  })

  it('accepts a valid leap day as valid', () => {
    const dateSetter = jest.fn()
    render(<DateInput setDate={dateSetter} questionText='' />)

    const dayField = screen.getByTestId('day')
    fireEvent.change(dayField, { target: { value: '29' } })

    const monthField = screen.getByTestId('month')
    fireEvent.change(monthField, { target: { value: '02' } })

    const yearField = screen.getByTestId('year')
    fireEvent.change(yearField, { target: { value: '2024' } })

    fireEvent.blur(yearField)
    expect(dateSetter).toHaveBeenCalledWith('2024-2-29', true)
  })

  it('creates a div informing the user that their selection is invalid upon receiving an invalid date', () => {
    const dateSetter = jest.fn()
    render(<DateInput setDate={dateSetter} questionText='' />)

    const dayField = screen.getByTestId('day')
    fireEvent.change(dayField, { target: { value: 'this is not a valid date' } })

    const monthField = screen.getByTestId('month')
    fireEvent.change(monthField, { target: { value: 'this is not a valid date' } })

    const yearField = screen.getByTestId('year')
    fireEvent.change(yearField, { target: { value: 'this is not a valid date' } })

    fireEvent.blur(yearField)
    const complaintDiv = screen.getByText('Must be a valid date')
    expect(complaintDiv).not.toBeNull()
    expect(complaintDiv).toHaveClass('errorMessageText')
    expect(dateSetter).toHaveBeenCalledWith(expect.anything(), false)
  })

  it('does not accept an out of higher bound year', () => {
    const dateSetter = jest.fn()
    render(<DateInput setDate={dateSetter} questionText='' />)

    const dayField = screen.getByTestId('day')
    fireEvent.change(dayField, { target: { value: '06' } })

    const monthField = screen.getByTestId('month')
    fireEvent.change(monthField, { target: { value: '08' } })

    const yearField = screen.getByTestId('year')
    fireEvent.change(yearField, { target: { value: (new Date().getFullYear() + 1).toString() } })

    fireEvent.blur(yearField)
    const complaintDiv = screen.getByText('Must be a valid date')
    expect(complaintDiv).not.toBeNull()
    expect(complaintDiv).toHaveClass('errorMessageText')
    expect(dateSetter).toHaveBeenCalledWith(expect.anything(), false)
    expect(dayField).not.toHaveClass(`w-[69px] pr-0 !border-[#FF0000]`)
    expect(monthField).not.toHaveClass(`w-[69px] pr-0 !border-[#FF0000]`)
    expect(yearField).toHaveClass(`w-[79px] pr-0 !border-[#FF0000]`)
  })

  it('does not accept an out of lower bound year', () => {
    const dateSetter = jest.fn()
    render(<DateInput setDate={dateSetter} questionText='' />)

    const dayField = screen.getByTestId('day')
    fireEvent.change(dayField, { target: { value: '06' } })

    const monthField = screen.getByTestId('month')
    fireEvent.change(monthField, { target: { value: '08' } })

    const yearField = screen.getByTestId('year')
    fireEvent.change(yearField, { target: { value: '1899' } })

    fireEvent.blur(yearField)
    const complaintDiv = screen.getByText('Must be a valid date')
    expect(complaintDiv).not.toBeNull()
    expect(complaintDiv).toHaveClass('errorMessageText')
    expect(dateSetter).toHaveBeenCalledWith(expect.anything(), false)
    expect(dayField).not.toHaveClass(`w-[69px] pr-0 !border-[#FF0000]`)
    expect(monthField).not.toHaveClass(`w-[69px] pr-0 !border-[#FF0000]`)
    expect(yearField).toHaveClass(`w-[79px] pr-0 !border-[#FF0000]`)
  })

  it('does not accept an out of lower bound month', () => {
    const dateSetter = jest.fn()
    render(<DateInput setDate={dateSetter} questionText='' />)

    const dayField = screen.getByTestId('day')
    fireEvent.change(dayField, { target: { value: '06' } })

    const monthField = screen.getByTestId('month')
    fireEvent.change(monthField, { target: { value: '00' } })

    const yearField = screen.getByTestId('year')
    fireEvent.change(yearField, { target: { value: '2023' } })

    fireEvent.blur(yearField)
    const complaintDiv = screen.getByText('Must be a valid date')
    expect(complaintDiv).not.toBeNull()
    expect(complaintDiv).toHaveClass('errorMessageText')
    expect(dateSetter).toHaveBeenCalledWith(expect.anything(), false)
    expect(dayField).not.toHaveClass(`w-[69px] pr-0 !border-[#FF0000]`)
    expect(monthField).toHaveClass(`w-[69px] pr-0 !border-[#FF0000]`)
    expect(yearField).not.toHaveClass(`w-[79px] pr-0 !border-[#FF0000]`)
  })

  it('does not accept an out of higher bound month', () => {
    const dateSetter = jest.fn()
    render(<DateInput setDate={dateSetter} questionText='' />)

    const dayField = screen.getByTestId('day')
    fireEvent.change(dayField, { target: { value: '06' } })

    const monthField = screen.getByTestId('month')
    fireEvent.change(monthField, { target: { value: '13' } })

    const yearField = screen.getByTestId('year')
    fireEvent.change(yearField, { target: { value: '2023' } })

    fireEvent.blur(yearField)
    const complaintDiv = screen.getByText('Must be a valid date')
    expect(complaintDiv).not.toBeNull()
    expect(complaintDiv).toHaveClass('errorMessageText')
    expect(dateSetter).toHaveBeenCalledWith(expect.anything(), false)
    expect(dayField).not.toHaveClass(`w-[69px] pr-0 !border-[#FF0000]`)
    expect(monthField).toHaveClass(`w-[69px] pr-0 !border-[#FF0000]`)
    expect(yearField).not.toHaveClass(`w-[79px] pr-0 !border-[#FF0000]`)
  })

  it('does not accept an out of lower bound day', () => {
    const dateSetter = jest.fn()
    render(<DateInput setDate={dateSetter} questionText='' />)

    const dayField = screen.getByTestId('day')
    fireEvent.change(dayField, { target: { value: '00' } })

    const monthField = screen.getByTestId('month')
    fireEvent.change(monthField, { target: { value: '11' } })

    const yearField = screen.getByTestId('year')
    fireEvent.change(yearField, { target: { value: '2023' } })

    fireEvent.blur(yearField)
    const complaintDiv = screen.getByText('Must be a valid date')
    expect(complaintDiv).not.toBeNull()
    expect(complaintDiv).toHaveClass('errorMessageText')
    expect(dateSetter).toHaveBeenCalledWith(expect.anything(), false)
    expect(dayField).toHaveClass(`w-[69px] pr-0 !border-[#FF0000]`)
    expect(monthField).not.toHaveClass(`w-[69px] pr-0 !border-[#FF0000]`)
    expect(yearField).not.toHaveClass(`w-[79px] pr-0 !border-[#FF0000]`)
  })

  it('does not accept an out of higher bound day', () => {
    const dateSetter = jest.fn()
    render(<DateInput setDate={dateSetter} questionText='' />)

    const dayField = screen.getByTestId('day')
    fireEvent.change(dayField, { target: { value: '32' } })

    const monthField = screen.getByTestId('month')
    fireEvent.change(monthField, { target: { value: '11' } })

    const yearField = screen.getByTestId('year')
    fireEvent.change(yearField, { target: { value: '2023' } })

    fireEvent.blur(yearField)
    const complaintDiv = screen.getByText('Must be a valid date')
    expect(complaintDiv).not.toBeNull()
    expect(complaintDiv).toHaveClass('errorMessageText')
    expect(dateSetter).toHaveBeenCalledWith(expect.anything(), false)
    expect(dayField).toHaveClass(`w-[69px] pr-0 !border-[#FF0000]`)
    expect(monthField).not.toHaveClass(`w-[69px] pr-0 !border-[#FF0000]`)
    expect(yearField).not.toHaveClass(`w-[79px] pr-0 !border-[#FF0000]`)
  })

  it('does not accept a an invalid leap day', () => {
    const dateSetter = jest.fn()
    render(<DateInput setDate={dateSetter} questionText='' />)

    const dayField = screen.getByTestId('day')
    fireEvent.change(dayField, { target: { value: '29' } })

    const monthField = screen.getByTestId('month')
    fireEvent.change(monthField, { target: { value: '02' } })

    const yearField = screen.getByTestId('year')
    fireEvent.change(yearField, { target: { value: '2023' } })

    fireEvent.blur(yearField)
    const complaintDiv = screen.getByText('Must be a valid date')
    expect(complaintDiv).not.toBeNull()
    expect(complaintDiv).toHaveClass('errorMessageText')
    expect(dateSetter).toHaveBeenCalledWith(expect.anything(), false)
  })

  it('does not respond when day is missing', () => {
    const dateSetter = jest.fn()
    render(<DateInput setDate={dateSetter} questionText='' />)

    const monthField = screen.getByTestId('month')
    fireEvent.change(monthField, { target: { value: '08' } })

    const yearField = screen.getByTestId('year')
    fireEvent.change(yearField, { target: { value: '1991' } })

    fireEvent.blur(yearField)
    expect(dateSetter).not.toHaveBeenCalled()
    const complaintDiv = screen.queryByText('Must be a valid date')
    expect(complaintDiv).toBeNull()
  })

  it('does not respond when month is missing', () => {
    const dateSetter = jest.fn()
    render(<DateInput setDate={dateSetter} questionText='' />)

    const dayField = screen.getByTestId('day')
    fireEvent.change(dayField, { target: { value: '06' } })

    const yearField = screen.getByTestId('year')
    fireEvent.change(yearField, { target: { value: '1991' } })

    fireEvent.blur(yearField)
    expect(dateSetter).not.toHaveBeenCalledWith()
    const complaintDiv = screen.queryByText('Must be a valid date')
    expect(complaintDiv).toBeNull()
  })

  it('does not respond when year is missing', () => {
    const dateSetter = jest.fn()
    render(<DateInput setDate={dateSetter} questionText='' />)

    const dayField = screen.getByTestId('day')
    fireEvent.change(dayField, { target: { value: '06' } })

    const monthField = screen.getByTestId('month')
    fireEvent.change(monthField, { target: { value: '08' } })

    fireEvent.blur(monthField)
    expect(dateSetter).not.toHaveBeenCalled()
    const complaintDiv = screen.queryByText('Must be a valid date')
    expect(complaintDiv).toBeNull()
  })

  it('does not accept errors from multiple fields', () => {
    const dateSetter = jest.fn()
    render(<DateInput setDate={dateSetter} questionText='' />)

    const dayField = screen.getByTestId('day')
    fireEvent.change(dayField, { target: { value: '00' } })

    const monthField = screen.getByTestId('month')
    fireEvent.change(monthField, { target: { value: '13' } })

    const yearField = screen.getByTestId('year')
    fireEvent.change(yearField, { target: { value: '2023' } })

    fireEvent.blur(yearField)
    const complaintDiv = screen.getByText('Must be a valid date')
    expect(complaintDiv).not.toBeNull()
    expect(dateSetter).toHaveBeenCalledWith(expect.anything(), false)
    expect(dayField).toHaveClass(`w-[69px] pr-0 !border-[#FF0000]`)
    expect(monthField).toHaveClass(`w-[69px] pr-0 !border-[#FF0000]`)
    expect(yearField).not.toHaveClass(`w-[79px] pr-0 !border-[#FF0000]`)
  })
})
