/**
 * @jest-environment jsdom
 */

import ProgressBar from '@/components/ProgressBar/ProgressBar'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('<ProgressBar />', () => {
  it('renders correctly', () => {
    const tree = render(<ProgressBar totalSegments={6} currentSegment={4} />)
    expect(tree).toMatchSnapshot()
  })

  it('has no completed segments when currentSegment is 0', () => {
    const { container } = render(<ProgressBar totalSegments={5} currentSegment={0} />)
    const allSegments = container.querySelectorAll('div:not(.segmentContainer)')
    expect(allSegments[0].className).toEqual('notDoneSegment')
    expect(allSegments[1].className).toEqual('notDoneSegment')
    expect(allSegments[2].className).toEqual('notDoneSegment')
    expect(allSegments[3].className).toEqual('notDoneSegment')
    expect(allSegments[4].className).toEqual('notDoneSegment')
  })

  it('has one completed segment when currentSegment is 1', () => {
    const { container } = render(<ProgressBar totalSegments={5} currentSegment={1} />)
    const allSegments = container.querySelectorAll('div:not(.segmentContainer)')
    expect(allSegments[0].className).toEqual('doneSegment')
    expect(allSegments[1].className).toEqual('notDoneSegment')
    expect(allSegments[2].className).toEqual('notDoneSegment')
    expect(allSegments[3].className).toEqual('notDoneSegment')
    expect(allSegments[4].className).toEqual('notDoneSegment')
  })

  it('has four completed segments when currentSegment is 4', () => {
    const { container } = render(<ProgressBar totalSegments={5} currentSegment={4} />)
    const allSegments = container.querySelectorAll('div:not(.segmentContainer)')
    expect(allSegments[0].className).toEqual('doneSegment')
    expect(allSegments[1].className).toEqual('doneSegment')
    expect(allSegments[2].className).toEqual('doneSegment')
    expect(allSegments[3].className).toEqual('doneSegment')
    expect(allSegments[4].className).toEqual('notDoneSegment')
  })

  it('has five completed segments when currentSegment is 5', () => {
    const { container } = render(<ProgressBar totalSegments={5} currentSegment={5} />)
    const allSegments = container.querySelectorAll('div:not(.segmentContainer)')
    expect(allSegments[0].className).toEqual('doneSegment')
    expect(allSegments[1].className).toEqual('doneSegment')
    expect(allSegments[2].className).toEqual('doneSegment')
    expect(allSegments[3].className).toEqual('doneSegment')
    expect(allSegments[4].className).toEqual('doneSegment')
  })

  it('has five segments in the progress bar when totalSegments is 5', () => {
    const { container } = render(<ProgressBar totalSegments={5} currentSegment={3} />)
    const allSegments = container.querySelectorAll('div:not(.segmentContainer)')
    expect(allSegments.length).toBe(5)
  })
})
