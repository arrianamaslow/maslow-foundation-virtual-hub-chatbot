/**
 * @jest-environment jsdom
 */

import StarRating from '@/components/StarRating/StarRating'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

function getStars(): any {
  const stars = []
  stars.push(screen.getByAltText("It wasn't helpful at all."))
  stars.push(screen.getByAltText("I didn't find it that useful."))
  stars.push(screen.getByAltText('It was kind of helpful.'))
  stars.push(screen.getByAltText('I found it very helpful.'))
  stars.push(screen.getByAltText('It was exactly what I needed.'))
  return stars
}

describe('<StarRating />', () => {
  it('renders correctly', () => {
    const tree = render(<StarRating setRating={() => {}} rating={3} />)
    expect(tree).toMatchSnapshot()
  })

  it('sets the correct rating when the first star is clicked', () => {
    const testRating = jest.fn()
    render(<StarRating setRating={testRating} rating={3} />)
    const stars = getStars()
    fireEvent.click(stars[0])
    expect(testRating).toHaveBeenCalledWith(1)
  })

  it('sets the correct rating when the second star is clicked', () => {
    const testRating = jest.fn()
    render(<StarRating setRating={testRating} rating={3} />)
    const stars = getStars()
    fireEvent.click(stars[1])
    expect(testRating).toHaveBeenCalledWith(2)
  })

  it('sets the correct rating when the third star is clicked', () => {
    const testRating = jest.fn()
    render(<StarRating setRating={testRating} rating={1} />)
    const stars = getStars()
    fireEvent.click(stars[2])
    expect(testRating).toHaveBeenCalledWith(3)
  })

  it('sets the correct rating when the fourth star is clicked', () => {
    const testRating = jest.fn()
    render(<StarRating setRating={testRating} rating={1} />)
    const stars = getStars()
    fireEvent.click(stars[3])
    expect(testRating).toHaveBeenCalledWith(4)
  })

  it('sets the correct rating when the fifth star is clicked', () => {
    const testRating = jest.fn()
    render(<StarRating setRating={testRating} rating={1} />)
    const stars = getStars()
    fireEvent.click(stars[4])
    expect(testRating).toHaveBeenCalledWith(5)
  })

  it('shows one filled in star when the rating is set to 1', () => {
    render(<StarRating setRating={() => {}} rating={1} />)
    const stars = getStars()
    expect(stars[0]).toHaveAttribute('src', '/img/star-filled-in.svg')
    expect(stars[1]).toHaveAttribute('src', '/img/star-empty.svg')
    expect(stars[2]).toHaveAttribute('src', '/img/star-empty.svg')
    expect(stars[3]).toHaveAttribute('src', '/img/star-empty.svg')
    expect(stars[4]).toHaveAttribute('src', '/img/star-empty.svg')
  })

  it('shows two filled in stars when the rating is set to 2', () => {
    render(<StarRating setRating={() => {}} rating={2} />)
    const stars = getStars()
    expect(stars[0]).toHaveAttribute('src', '/img/star-filled-in.svg')
    expect(stars[1]).toHaveAttribute('src', '/img/star-filled-in.svg')
    expect(stars[2]).toHaveAttribute('src', '/img/star-empty.svg')
    expect(stars[3]).toHaveAttribute('src', '/img/star-empty.svg')
    expect(stars[4]).toHaveAttribute('src', '/img/star-empty.svg')
  })

  it('shows three filled in stars when the rating is set to 3', () => {
    render(<StarRating setRating={() => {}} rating={3} />)
    const stars = getStars()
    expect(stars[0]).toHaveAttribute('src', '/img/star-filled-in.svg')
    expect(stars[1]).toHaveAttribute('src', '/img/star-filled-in.svg')
    expect(stars[2]).toHaveAttribute('src', '/img/star-filled-in.svg')
    expect(stars[3]).toHaveAttribute('src', '/img/star-empty.svg')
    expect(stars[4]).toHaveAttribute('src', '/img/star-empty.svg')
  })

  it('shows four filled in stars when the rating is set to 4', () => {
    render(<StarRating setRating={() => {}} rating={4} />)
    const stars = getStars()
    expect(stars[0]).toHaveAttribute('src', '/img/star-filled-in.svg')
    expect(stars[1]).toHaveAttribute('src', '/img/star-filled-in.svg')
    expect(stars[2]).toHaveAttribute('src', '/img/star-filled-in.svg')
    expect(stars[3]).toHaveAttribute('src', '/img/star-filled-in.svg')
    expect(stars[4]).toHaveAttribute('src', '/img/star-empty.svg')
  })

  it('shows five filled in stars when the rating is set to 5', () => {
    render(<StarRating setRating={() => {}} rating={5} />)
    const stars = getStars()
    expect(stars[0]).toHaveAttribute('src', '/img/star-filled-in.svg')
    expect(stars[1]).toHaveAttribute('src', '/img/star-filled-in.svg')
    expect(stars[2]).toHaveAttribute('src', '/img/star-filled-in.svg')
    expect(stars[3]).toHaveAttribute('src', '/img/star-filled-in.svg')
    expect(stars[4]).toHaveAttribute('src', '/img/star-filled-in.svg')
  })
})
