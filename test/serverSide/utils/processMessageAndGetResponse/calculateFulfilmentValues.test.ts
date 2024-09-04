import { MaslowCategoryFulfilment } from '@/lib/types/MaslowCategoryFulfilment'
import { calculateFulfilmentValues } from '@/serverSide/utils/processMessageAndGetResponse/calculateFulfilmentValues'

const mockFulfilmentData: MaslowCategoryFulfilment = {
  Accommodation: {
    Location: 'Unfulfilled',
    'Quality of accommodation': 'Requires attention',
    'Long-term stability': 'Unfulfilled',
    Conformability: 'Unfulfilled'
  },
  'Drugs & Alcohol usage': {
    'Current frequency of drinking': 'Requires attention',
    'Current frequency of taking drugs': 'Unfulfilled',
    'usage alone or social': 'Fulfilled',
    'Control of usage': 'Unfulfilled'
  },
  Offending: {},
  Other: {},
  Safety: {
    'Feeling safe at work': 'Unfulfilled',
    'Feeling safe at home': 'Unfulfilled',
    'Feeling safe in neighborhood': 'Unfulfilled',
    'Feeling safe in social circles': 'Unfulfilled'
  },
  'Physical Wellbeing': {
    'Impact of physical health on daily tasks': 'Fulfilled',
    'Exercise frequency': 'Unfulfilled',
    'Balanced diet': 'Unfulfilled',
    'Sleep quality': 'Fulfilled'
  },
  'Emotional & Mental Wellbeing': {
    'Optimism of the future': 'Unfulfilled',
    'Confidence in yourself': 'Unfulfilled',
    'Energy to spare': 'Unfulfilled',
    'Regular feelings of Anxiety': 'Unfulfilled',
    'Interest in new things': 'Unfulfilled'
  },
  'Personal Growth': {
    'Personal development in past year': 'Unfulfilled',
    'Plans for the future': 'Requires attention',
    'Recent achievements': 'Fulfilled',
    'Ambitions and goals': 'Prefer not to say'
  },
  Finances: {
    Debt: 'Unfulfilled',
    Gambling: 'Unfulfilled',
    'Affordability of lifestyle': 'Unfulfilled',
    'Consistency of income': 'Unfulfilled'
  },
  'Social Connection & Impact': {
    'Interest in other people': 'Unfulfilled',
    'Relationship with people they live with': 'Unfulfilled',
    'Involvement in group activities': 'Unfulfilled',
    'Relationship with locals': 'Prefer not to say'
  },
  'Significant Relationships': {
    'Frequency of contact with friends and family': 'Fulfilled',
    'Important people they rely on': 'Prefer not to say',
    'Romantic relationship': 'Unfulfilled',
    Pets: 'Unfulfilled'
  },
  'Skills & Vocation': {
    'Highest level of education': 'Prefer not to say',
    'Skills in current job': 'Prefer not to say',
    'Current job': 'Requires attention',
    'Previous jobs': 'Unfulfilled'
  }
}

describe('calculateFulfilmentValues()', () => {
  it('correctly counts the correct number of each type of status in a given fulfilment', () => {
    const {
      totalNumberOfCategories,
      numberOfCategoriesResolved,
      numberOfCategoriesRequiringAttention
    } = calculateFulfilmentValues(mockFulfilmentData)

    expect(totalNumberOfCategories).toEqual(41)
    expect(numberOfCategoriesResolved).toEqual(10)
    expect(numberOfCategoriesRequiringAttention).toEqual(4)
  })
})
