/**
 * @jest-environment jsdom
 */

import { fireEvent, render, screen } from '@testing-library/react'
import BackButton from '@/components/BackButton/BackButton'
import '@testing-library/jest-dom'

const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => {
    return { push: pushMock }
  })
}))

describe('<BackButton />', () => {
  it('renders correctly', () => {
    const tree = render(<BackButton href='/chat' />)
    expect(tree).toMatchSnapshot()
  })

  beforeEach(() => {
    render(<BackButton href='/chat' />)
  })

  it('properly passes the href to its link sub component', async () => {
    const backButton = screen.getByTestId('back-button')
    fireEvent.click(backButton)
    expect(pushMock).toHaveBeenCalledWith('/chat')
  })

  it('renders the link sub component', () => {
    const backButton = screen.getByTestId('back-button')
    expect(backButton).toBeInTheDocument()
    expect(backButton).toBeEnabled()
  })
})
