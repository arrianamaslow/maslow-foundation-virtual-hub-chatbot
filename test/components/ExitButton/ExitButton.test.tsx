/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ExitButton from '@/components/ExitButton/ExitButton'

describe('<ExitButton />', () => {
  it('renders correctly', () => {
    const tree = render(<ExitButton onClick={() => {}} />)
    expect(tree).toMatchSnapshot()
  })
  it('fires a click event', () => {
    const clickEvent = jest.fn()
    render(<ExitButton onClick={clickEvent} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(clickEvent).toHaveBeenCalled()
  })
})
