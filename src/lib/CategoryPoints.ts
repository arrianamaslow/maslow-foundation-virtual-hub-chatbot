import { MaslowCategoryFulfilment } from '@/lib/types/MaslowCategoryFulfilment'

export const mandatoryDataForAllCategories = {
  Accommodation: ['Location', 'Quality of accommodation', 'Long-term stability', 'Conformability'],
  'Significant Relationships': [
    'Frequency of contact with friends and family',
    'Important people they rely on',
    'Romantic relationship',
    'Pets'
  ],
  'Social Connection & Impact': [
    'Interest in other people',
    'Relationship with people they live with',
    'Involvement in group activities',
    'Relationship with locals'
  ],
  'Physical Wellbeing': [
    'Impact of physical health on daily tasks',
    'Exercise frequency',
    'Balanced diet',
    'Sleep quality'
  ],
  'Skills & Vocation': [
    'Highest level of education',
    'Skills in current job',
    'Current job',
    'Previous jobs'
  ],
  'Emotional & Mental Wellbeing': [
    'Optimism of the future',
    'Confidence in yourself',
    'Energy to spare',
    'Regular feelings of Anxiety',
    'Interest in new things'
  ],
  'Drugs & Alcohol usage': [
    'Current frequency of drinking',
    'Current frequency of taking drugs',
    'Usage alone or social',
    'Control of usage'
  ],
  Finances: ['Debt', 'Gambling', 'Affordability of lifestyle', 'Consistency of income'],
  'Personal Growth': [
    'Personal development in past year',
    'Plans for the future',
    'Recent achievements',
    'Ambitions and goals'
  ],
  Safety: [
    'Feeling safe at work',
    'Feeling safe at home',
    'Feeling safe in neighborhood',
    'Feeling safe in social circles'
  ],
  Offending: []
}

export const categoryFulfilmentData: MaslowCategoryFulfilment = {
  Accommodation: {
    Location: 'Unfulfilled',
    'Quality of accommodation': 'Unfulfilled',
    'Long-term stability': 'Unfulfilled',
    Conformability: 'Unfulfilled'
  },

  'Drugs & Alcohol usage': {
    'Current frequency of drinking': 'Unfulfilled',
    'Current frequency of taking drugs': 'Unfulfilled',
    'usage alone or social': 'Unfulfilled',
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
    'Impact of physical health on daily tasks': 'Unfulfilled',
    'Exercise frequency': 'Unfulfilled',
    'Balanced diet': 'Unfulfilled',
    'Sleep quality': 'Unfulfilled'
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
    'Plans for the future': 'Unfulfilled',
    'Recent achievements': 'Unfulfilled',
    'Ambitions and goals': 'Unfulfilled'
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
    'Relationship with locals': 'Unfulfilled'
  },
  'Significant Relationships': {
    'Frequency of contact with friends and family': 'Unfulfilled',
    'Important people they rely on': 'Unfulfilled',
    'Romantic relationship': 'Unfulfilled',
    Pets: 'Unfulfilled'
  },
  'Skills & Vocation': {
    'Highest level of education': 'Unfulfilled',
    'Skills in current job': 'Unfulfilled',
    'Current job': 'Unfulfilled',
    'Previous jobs': 'Unfulfilled'
  }
}
