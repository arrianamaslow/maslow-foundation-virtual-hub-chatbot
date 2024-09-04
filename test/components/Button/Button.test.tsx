/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react'
import Button, { ButtonProps } from '@/components/Button/Button'
import '@testing-library/jest-dom'
const defaultProps: ButtonProps = {
  text: 'placeholder text',
  isDisabled: false,
  onClick: jest.fn(),
  buttonType: 'primary'
}

describe('<Button />', () => {
  it('renders correctly', () => {
    const { container } = render(<Button {...defaultProps} />)
    expect(container).toMatchSnapshot()
  })

  it('renders differently for enabled and disabled', () => {
    const enabledPrimary = render(
      <Button {...defaultProps} isDisabled={false} buttonType='primary' />
    )
    const disabledPrimary = render(
      <Button {...defaultProps} isDisabled={true} buttonType='primary' />
    )

    const enabledSecondary = render(
      <Button {...defaultProps} isDisabled={false} buttonType='secondary' />
    )
    const disabledSecondary = render(
      <Button {...defaultProps} isDisabled={true} buttonType='secondary' />
    )

    const enabledTertiary = render(
      <Button {...defaultProps} isDisabled={false} buttonType='tertiary' />
    )
    const disabledTertiary = render(
      <Button {...defaultProps} isDisabled={true} buttonType='tertiary' />
    )

    expect(enabledPrimary.asFragment()).not.toEqual(disabledPrimary.asFragment())
    expect(enabledSecondary.asFragment()).not.toEqual(disabledSecondary.asFragment())
    expect(enabledTertiary.asFragment()).not.toEqual(disabledTertiary.asFragment())
  })

  it('renders differently for different button styles', () => {
    const enabledPrimary = render(
      <Button {...defaultProps} isDisabled={false} buttonType='primary' />
    )
    const enabledSecondary = render(
      <Button {...defaultProps} isDisabled={false} buttonType='secondary' />
    )
    const enabledTertiary = render(
      <Button {...defaultProps} isDisabled={false} buttonType='tertiary' />
    )

    const disabledPrimary = render(
      <Button {...defaultProps} isDisabled={true} buttonType='primary' />
    )
    const disabledSecondary = render(
      <Button {...defaultProps} isDisabled={true} buttonType='secondary' />
    )
    const disabledTertiary = render(
      <Button {...defaultProps} isDisabled={true} buttonType='tertiary' />
    )

    expect(enabledPrimary.asFragment()).not.toEqual(enabledSecondary.asFragment())
    expect(enabledSecondary.asFragment()).not.toEqual(enabledTertiary.asFragment())
    expect(enabledTertiary.asFragment()).not.toEqual(enabledPrimary.asFragment())

    expect(disabledPrimary.asFragment()).not.toEqual(disabledSecondary.asFragment())
    expect(disabledSecondary.asFragment()).not.toEqual(disabledTertiary.asFragment())
    expect(disabledTertiary.asFragment()).not.toEqual(disabledPrimary.asFragment())
  })

  it('fires event on click', () => {
    const clickEvent = jest.fn()
    render(<Button {...defaultProps} onClick={clickEvent} />)

    const buttonElement = screen.getByRole('button')
    fireEvent.click(buttonElement)

    expect(clickEvent).toHaveBeenCalled()
  })

  it('does not fire event when disabled', () => {
    const clickEvent = jest.fn()
    render(<Button {...defaultProps} isDisabled={true} onClick={clickEvent} />)

    const buttonElement = screen.getByRole('button')
    fireEvent.click(buttonElement)

    expect(clickEvent).not.toHaveBeenCalled()
  })
})
