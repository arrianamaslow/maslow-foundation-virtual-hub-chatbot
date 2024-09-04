/**
 * @jest-environment jsdom
 */

import ProgressWrapper, { ProgressWrapperProps } from '@/components/ProgressWrapper/ProgressWrapper'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BackButtonProps } from '@/components/BackButton/BackButton'
import { ProgressBarProps } from '@/components/ProgressBar/ProgressBar'
import { ButtonProps } from '@/components/Button/Button'

const defaultProps: ProgressWrapperProps = {
  children: <p data-testid='test-child-component'>CHILDREN</p>,
  stepHeaderText: 'test title',
  backButtonUrl: '/back-url',
  currentProgressSegment: 4,
  totalProgressSegments: 4,
  isContinueDisabled: false,
  onContinueClicked: jest.fn()
}

jest.mock('@/components/BackButton/BackButton', () => {
  const MockBackButton = ({ href }: BackButtonProps) => (
    <div>
      <p data-testid='back-button-href'>{href}</p>
    </div>
  )
  return MockBackButton
})

jest.mock('@/components/ProgressBar/ProgressBar', () => {
  const MockProgressBar = ({ totalSegments, currentSegment }: ProgressBarProps) => (
    <div>
      <p data-testid='progress-bar-currentSegment'>{currentSegment}</p>
      <p data-testid='progress-bar-totalSegments'>{totalSegments}</p>
    </div>
  )
  return MockProgressBar
})

jest.mock('@/components/Button/Button', () => {
  const MockButton = ({ isDisabled, onClick, text }: ButtonProps) => (
    <div>
      <button data-testid='button-clickable' onClick={onClick}>
        {text}
      </button>
      <p data-testid='button-isDisabled'>{`${isDisabled}`}</p>
    </div>
  )
  return MockButton
})

describe('<ProgressWrapper />', () => {
  it('renders as expected', () => {
    const tree = render(<ProgressWrapper {...defaultProps} />)
    expect(tree).toMatchSnapshot()
  })

  it('renders children as expected', () => {
    render(<ProgressWrapper {...defaultProps} />)
    const child = screen.getByTestId('test-child-component')
    expect(child).toHaveTextContent(`CHILDREN`)
  })

  it('renders stepHeaderText as expected', () => {
    render(<ProgressWrapper {...defaultProps} />)
    const textContainer = screen.getByTestId('step-header-text')
    expect(textContainer).toHaveTextContent(defaultProps.stepHeaderText)
  })

  it('passes href to <BackButton /> as expected', () => {
    render(<ProgressWrapper {...defaultProps} />)
    const textContainer = screen.getByTestId('back-button-href')
    expect(textContainer).toHaveTextContent(defaultProps.backButtonUrl)
  })

  it('passes currentSegment to <ProgressBar /> as expected', () => {
    render(<ProgressWrapper {...defaultProps} />)
    const textContainer = screen.getByTestId('progress-bar-currentSegment')
    expect(textContainer).toHaveTextContent(`${defaultProps.currentProgressSegment}`)
  })

  it('passes totalSegments to <ProgressBar /> as expected', () => {
    render(<ProgressWrapper {...defaultProps} />)
    const textContainer = screen.getByTestId('progress-bar-totalSegments')
    expect(textContainer).toHaveTextContent(`${defaultProps.totalProgressSegments}`)
  })

  it('passes isDisabled to <Button /> as expected', () => {
    render(<ProgressWrapper {...defaultProps} />)
    const textContainer = screen.getByTestId('button-isDisabled')
    expect(textContainer).toHaveTextContent(`${defaultProps.isContinueDisabled}`)
  })

  it('fires onContinueClicked on button click', () => {
    const mockEvent = jest.fn()
    render(<ProgressWrapper {...defaultProps} onContinueClicked={mockEvent} />)

    const clickableButton = screen.getByTestId('button-clickable')
    fireEvent.click(clickableButton)
    expect(mockEvent).toHaveBeenCalled()
  })
})
