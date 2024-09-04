/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Confirmation from '@/components/Confirmation/Confirmation'

describe('<Confirmation />', () => {
  it('renders correctly', () => {
    const tree = render(<Confirmation date='August 2, 216 BCE' time='13:48' />)
    expect(tree).toMatchSnapshot()
  })
})
