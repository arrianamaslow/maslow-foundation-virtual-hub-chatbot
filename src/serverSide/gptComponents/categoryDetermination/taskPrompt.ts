import { MaslowWheelCategory } from '@/lib/types/MaslowWheelCategory'

export const getTaskPrompt = (categoriesToChooseFrom: MaslowWheelCategory[]) => {
  return `Read the ENTIRE conversation history which has been passed to you. Based on the conversation so far, 
    choose a suitable topic to discuss from this list of topics: [${categoriesToChooseFrom.join(', ')}]. Return your answer as a JSON object with a single "category" field. The chosen topic should be returned as the value in the category field, IDENTICALLY to that in the list`
}
