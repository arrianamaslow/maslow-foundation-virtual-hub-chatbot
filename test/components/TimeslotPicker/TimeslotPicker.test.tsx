/**
 * @jest-environment jsdom
 */

import TimeslotPicker from '@/components/TimeslotPicker/TimeslotPicker'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

jest.mock('@/components/Button/Button', () => {
  const MockButton = ({ text, onClick, buttonType }: any) => (
    <button onClick={onClick} data-testid={text} className={buttonType}></button>
  )
  return MockButton
})

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

describe('<TimeslotPicker />', () => {
  it('renders correctly', () => {
    const tree = render(
      <TimeslotPicker
        times={timesExample}
        date={new Date(2024, 6, 6)}
        selectedTime={''}
        handleSelection={() => {}}
      />
    )
    expect(tree).toMatchSnapshot()
  })

  it('has a button for every time in the timesExample list', () => {
    render(
      <TimeslotPicker
        times={timesExample}
        date={new Date(Date.now())}
        selectedTime={''}
        handleSelection={() => {}}
      />
    )
    timesExample.forEach((time) => {
      const button = screen.getByTestId(time)
      expect(button).toBeInTheDocument()
    })
  })

  it('has buttons which are clickable', () => {
    const timeSetter = jest.fn()
    render(
      <TimeslotPicker
        times={timesExample}
        date={new Date(Date.now())}
        selectedTime={''}
        handleSelection={timeSetter}
      />
    )
    timesExample.forEach((time) => {
      const button = screen.getByTestId(time)
      fireEvent.click(button)
      expect(timeSetter).toHaveBeenCalled()
    })
  })
})
