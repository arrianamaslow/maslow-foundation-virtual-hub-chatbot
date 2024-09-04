export const MaslowWheelCategories = [
  'Drugs & Alcohol usage',
  'Physical Wellbeing',
  'Emotional & Mental Wellbeing',
  'Personal Growth',
  'Social Connection & Impact',
  'Significant Relationships',
  'Accommodation',
  'Finances',
  'Safety',
  'Skills & Vocation',
  'Offending',
  'Other'
] as const

export type MaslowWheelCategory = (typeof MaslowWheelCategories)[number]

export const isMaslowWheelCategory = (category: any): category is MaslowWheelCategory =>
  MaslowWheelCategories.includes(category)

export function areMaslowWheelCategories(value: any): boolean {
  for (let i = 0; i < value.length; i++) {
    if (!isMaslowWheelCategory(value[i])) {
      return false
    }
  }
  return true
}
