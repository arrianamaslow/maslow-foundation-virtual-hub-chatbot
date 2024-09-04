/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PreferredMethodOfContact from '@/components/PreferredMethodOfContact/PreferredMethodOfContact'
import { RadiosProps } from '@/components/Radios/Radios'

jest.mock('@/components/Radios/Radios', () => {
  const MockRadio = ({ radioGroupName, radioValues, defaultSelectedIndex }: RadiosProps) => (
    <div data-testid='mock-radio'>
      <p data-testid='mock-radio-group-name'>{radioGroupName}</p>
      {radioValues.map((value, index) => (
        <p key={index} data-testid={`mock-radio-option-${index}`}>
          {value}
        </p>
      ))}
      <p data-testid='mock-default-index-selected'>{defaultSelectedIndex}</p>
    </div>
  )

  return MockRadio
})

describe('<PreferredMethodOfContact />', () => {
  it('renders correctly', () => {
    const tree = render(<PreferredMethodOfContact />)
    expect(tree).toMatchSnapshot()
  })

  it('renders radio component', () => {
    render(<PreferredMethodOfContact />)
    expect(screen.getByTestId('mock-radio')).toBeDefined()
  })

  it('passes expected values to <Radio /> component', () => {
    render(<PreferredMethodOfContact />)
    expect(screen.getByTestId('mock-radio-group-name')).toHaveTextContent(
      'preferredContactMethodRadioButton'
    )
    expect(screen.getByTestId('mock-radio-option-0')).toHaveTextContent('Phone')
    expect(screen.getByTestId('mock-radio-option-1')).toHaveTextContent('Email')
    expect(screen.getByTestId('mock-default-index-selected')).toHaveTextContent('')
  })
})
