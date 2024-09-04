/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import Divider from '@/components/Divider/Divider'
import '@testing-library/jest-dom'

describe('<Divider />', () => {
  it('renders correctly', () => {
    const container = render(<Divider />)
    expect(container).toMatchSnapshot()
  })

  it('renders text on divider', () => {
    render(<Divider dividerText='hello' />)
    const dividerText = screen.getByTestId('divider-container')
    expect(dividerText).toHaveTextContent('hello')
  })

  it('has no text if undefined', () => {
    render(<Divider />)
    const dividerText = screen.getByTestId('divider-container')
    expect(dividerText).toHaveTextContent('')
  })
})
