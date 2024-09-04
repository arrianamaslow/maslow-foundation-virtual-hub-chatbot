import { MaslowWheelCategory } from '@/lib/types/MaslowWheelCategory'

export const getTaskPrompt = (mandatoryData: string[], category: MaslowWheelCategory) => {
  const dataPointQuestions = mandatoryData.map((dataPoint) => {
    return `- Does the conversation contain ANY INFORMATION about the user, directly or indirectly related, 
      OR has the user answered in some form, any question in relation to the point: "${dataPoint}" ? \n`
  })

  return `You are checking if sufficient information has been addressed for each of the following points:
    ${dataPointQuestions.join('')}

    
    \n These points are in the context of the category ${category}. 

    Return the points with one of: [Fulfilled, Unfulfilled, Prefer not to say, Requires attention] next to them in a list, stored like this example:  
    {
      "message": {
          "<INSERT POINT 1 HERE>": "Fulfilled",
          "<INSERT POINT 2 HERE>": "Unfulfilled",
          "<INSERT POINT 3 HERE>": "Requires attention",
          "<INSERT POINT 4 HERE>": "Prefer not to say"
      }
    }
    in a JSON object, ensuring the points are named exactly as given to you above.  


    For each point:
    -First, read the entire conversation
    -If the point is mentioned in any capacity, directly or indirectly, by the assistant and the user makes an attempt to ignore answering the point or tries to change the conversation, indicating they do not wish to answer, return "Prefer not to say"
    -If the point is mentioned by the assistant and the user provides minimal information, or any concerning information which is important to be addressed as there may be more information, return "Requires attention". This should be returned in the case of VAGUE RESPONSES
    -If the point, or anything similar to the point, is mentioned by the assistant at any point and the user makes some attempt to answer that point, return "Fulfilled" OR the user provides some answer in any capacity EVEN if negative, return "Fulfilled" REMEMBER THAT SAYING NO MUST BE COUNTED AS GIVING INFORMATION.
    -ONLY in the case where the point is not mentioned by the assistant in any way, return "Unfulfilled". Do NOT return "Unfulfilled" if the user has answered a question which relates to the topic



  IMPORTANT CLARIFICATIONS FOR HANDLING NEGATIVE RESPONSES: 
  -"Fulfilled" is about the existence of information, NOT the content of that information. A user can mention they dont do something, or that something doesn't apply, and this MUST count as answering the question on a topic, and be "Fulfilled".
  -Any negative response, such as "I don't," "Never," "No," or similar, must be considered as providing "Fulfilled." For example on the point of gambling, if the user says, "I don't gamble" or "I never bet," these responses directly address the point and should be categorized as "Fulfilled."



Decision Process:

1- If the assistant asks a question related to the point and the user gives any negative or affirmative response (e.g., "No," "I don't," "Never"), mark it as "Fulfilled."
2- If the user ignores the question or changes the subject, mark it as "Prefer not to say."
3- If the user's response is vague or minimal, indicating the need for further clarification, mark it as "Requires attention."
4- If the point is not mentioned by the assistant in any way and there is no relevant information provided by the user, mark it as "Unfulfilled."





  Ensure your behavior is similar to these 2 examples:

  EXAMPLE 1:
  Assistant - Have you ever gambled?
  User - I don't gamble

  "Gambling" should be set to "Fulfilled" as the user has mentioned that they dont gamble. This DIRECTLY addresses the point of "Gambling"

  Example 2:
  Assistant - How do you feel about the future?
  User - Not good at all
  "Optimism about the future" should be set to "Fulfilled" as the user has provided information about "Optimism about the future"- and that is that they are not optimistic

  You MUST consider these examples and compare them to any judgement you make.
  To decide if something is "Fulfilled"- negate the user's answer and consider if this should be "Fulfilled"- if this is the case, then it MUST be "Fulfilled"
 
  Please think about everything you are doing and have a robust and solid internal justification for your reasoning based on these instructions. Follow these instructions carefully and rigorously scrutinize your answer to ensure it conforms to these instructions.
  `
}
