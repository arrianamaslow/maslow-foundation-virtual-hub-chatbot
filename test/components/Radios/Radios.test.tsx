/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react'
import Radios, { RadiosProps } from '@/components/Radios/Radios'
import '@testing-library/jest-dom'

jest.mock('@/components/CheckBox/CheckBox', () => {
  const MockCheckBox = ({ tickIsActive }: { tickIsActive: boolean }) => {
    return <p> {tickIsActive ? 'CHECKENABLED' : 'CHECKDISABLED'}</p>
  }
  MockCheckBox.displayName = 'MockCheckBox'
  return MockCheckBox
})

const defaultProps: RadiosProps = {
  radioValues: ['hello', 'world', 'everyone'],
  radioGroupName: 'test',
  radioClickedCallback: () => {}
}

describe('<Radios />', () => {
  it('renders correctly', () => {
    const { container } = render(<Radios {...defaultProps} />)

    expect(container).toMatchSnapshot()
  })

  it('renders one selected radio if given a default to tick', () => {
    render(<Radios {...defaultProps} defaultSelectedIndex={1} />)

    const radioButtonOne = screen.getByTestId('mock-radio-option-0')
    const radioButtonTwo = screen.getByTestId('mock-radio-option-1')
    const radioButtonThree = screen.getByTestId('mock-radio-option-2')

    expect(radioButtonOne).toHaveTextContent('CHECKDISABLED')
    expect(radioButtonTwo).toHaveTextContent('CHECKENABLED')
    expect(radioButtonThree).toHaveTextContent('CHECKDISABLED')
  })

  it('renders a un-selected radio when defaultSelectedIndex is not set', () => {
    render(<Radios {...defaultProps} />)

    const checkEnabled = screen.queryByText('CHECKENABLED')
    expect(checkEnabled).toBeFalsy()
  })

  it('changes selected radio on button on click', () => {
    render(<Radios {...defaultProps} defaultSelectedIndex={1} />)

    const radioButtonOne = screen.getByTestId('mock-radio-option-0')
    const radioButtonTwo = screen.getByTestId('mock-radio-option-1')
    const radioButtonThree = screen.getByTestId('mock-radio-option-2')

    expect(radioButtonOne).toHaveTextContent('CHECKDISABLED')
    expect(radioButtonTwo).toHaveTextContent('CHECKENABLED')
    expect(radioButtonThree).toHaveTextContent('CHECKDISABLED')

    fireEvent.click(radioButtonOne)

    expect(radioButtonOne).toHaveTextContent('CHECKENABLED')
    expect(radioButtonTwo).toHaveTextContent('CHECKDISABLED')
    expect(radioButtonThree).toHaveTextContent('CHECKDISABLED')
  })

  it('calls callback function on button click', () => {
    const callbackCheck = jest.fn()
    render(<Radios {...defaultProps} radioClickedCallback={callbackCheck} />)

    const firstButton = screen.getByTestId('mock-radio-option-0')
    fireEvent.click(firstButton)

    expect(callbackCheck).toHaveBeenCalledWith('hello')

    const secondButton = screen.getByTestId('mock-radio-option-1')
    fireEvent.click(secondButton)

    expect(callbackCheck).toHaveBeenCalledWith('world')
  })

  it('callback function called on initialisation', () => {
    const callbackCheck = jest.fn()
    render(
      <Radios {...defaultProps} defaultSelectedIndex={1} radioClickedCallback={callbackCheck} />
    )

    expect(callbackCheck).toHaveBeenCalledWith('world')
  })

  it('renders four radio buttons when four radioValues are passed', () => {
    render(
      <Radios
        {...defaultProps}
        radioValues={['go falafel', 'rustica', 'bundobust', 'northern monk']}
        defaultSelectedIndex={1}
      />
    )

    const radioButtons = screen.getAllByRole('radio')
    expect(radioButtons.length).toBe(4)
  })
})
