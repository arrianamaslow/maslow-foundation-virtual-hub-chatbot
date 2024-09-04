/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import EnterButton from '@/components/EnterButton/EnterButton'

describe('<EnterButton />', () => {
  it('renders correctly', () => {
    const tree = render(<EnterButton isDisabled={false} onClick={() => {}} />)
    expect(tree).toMatchSnapshot()
  })
  it('fires a click event', () => {
    const clickEvent = jest.fn()
    render(<EnterButton isDisabled={false} onClick={clickEvent} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(clickEvent).toHaveBeenCalled()
  })

  it('is not clickable when disabled', () => {
    const clickEvent = jest.fn()
    render(<EnterButton isDisabled={true} onClick={clickEvent} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(clickEvent).not.toHaveBeenCalled()
  })
})
