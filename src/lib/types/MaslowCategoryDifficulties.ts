export enum DifficultyOptions {
  Hard,
  Medium,
  Easy,
  Na
}
export const MaslowCategoryDifficulties = {
  'Drugs & Alcohol usage': DifficultyOptions.Hard,
  Offending: DifficultyOptions.Hard,
  Safety: DifficultyOptions.Hard,
  'Physical Wellbeing': DifficultyOptions.Medium,
  'Emotional & Mental Wellbeing': DifficultyOptions.Medium,
  'Personal Growth': DifficultyOptions.Medium,
  Finances: DifficultyOptions.Medium,
  'Social Connection & Impact': DifficultyOptions.Easy,
  'Significant Relationships': DifficultyOptions.Easy,
  Accommodation: DifficultyOptions.Easy,
  'Skills & Vocation': DifficultyOptions.Easy,
  Other: DifficultyOptions.Na
}
