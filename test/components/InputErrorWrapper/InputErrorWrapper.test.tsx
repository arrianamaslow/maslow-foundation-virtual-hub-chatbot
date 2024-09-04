/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import InputErrorWrapper, {
  InputErrorWrapperProps
} from '@/components/InputErrorWrapper/InputErrorWrapper'
import '@testing-library/jest-dom'
jest.mock('@/components/CheckBox/CheckBox', () => ({ tickIsActive }: { tickIsActive: boolean }) => {
  ;<div>{tickIsActive ? '✔' : ''}</div>
})

const DEFAULT_ERROR_MESSAGE = 'ERROR'

const defaultProps: InputErrorWrapperProps = {
  children: <p>CHILDREN</p>,
  errorMessage: DEFAULT_ERROR_MESSAGE
}

describe('<InputErrorWrapper />', () => {
  it('should render as expected', () => {
    const { container } = render(<InputErrorWrapper {...defaultProps} />)

    expect(container).toMatchSnapshot()
  })

  it('displays error message and image', () => {
    const { container } = render(<InputErrorWrapper {...defaultProps} />)
    const errorImage = screen.getByAltText('Exclamation mark')

    expect(container.textContent).toContain(DEFAULT_ERROR_MESSAGE)
    expect(errorImage).toHaveAttribute('src', '/img/exclamation-mark.svg')
  })

  it('does not display an error message or image when error message prop is empty', () => {
    const { container } = render(<InputErrorWrapper {...defaultProps} errorMessage='' />)

    expect(container.textContent).not.toContain(DEFAULT_ERROR_MESSAGE)
    expect(container.getElementsByTagName('img').length).toEqual(0)
  })

  it('displays a red border around the input when there is an error message', () => {
    render(<InputErrorWrapper {...defaultProps} />)

    const outerBoxElement = screen.getByTestId('outerBox')
    expect(outerBoxElement).toHaveClass('redBorder')
  })

  it('does not display a red border around the input when there is no error message', () => {
    render(<InputErrorWrapper {...defaultProps} errorMessage='' />)

    const outerBoxElement = screen.getByTestId('outerBox')
    expect(outerBoxElement).not.toHaveClass('redBorder')
  })
})
