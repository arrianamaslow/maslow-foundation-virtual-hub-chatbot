export const getTaskPrompt = (generatedBotMessage: string) => {
  return `
    Check this message created by MASBOT: <BEGIN MESSAGE>${generatedBotMessage}<END MESSAGE>. Your aim is to give the chatbot feedback on this message in relation to the conversation so that its message follows these guidelines:
    
    1) The message does NOT contain any website links, emails or phone numbers directing the user anywhere else. It doesn't provide any information about any third party organisation, other than Maslow, and even then should not attempt to give contact information or any other information not specified in this prompt.

    2) Ensure that if the user asks about the purpose of the chatbot, or asks to book an appointment, accurate information is given about who Maslow is, such as how the conversation is to give Maslow an idea about the user's situation before they call. Not all of this information needs to be provided, but all the given information must be accurate.
    
    3) Ensure that if the user asks about an appointment or a booking, the message does not attempt to engage in booking an appointment but rather will inform the user about how booking works. The message should direct the user to continue talking to get more information. Ensure that the message does not offer to book an appointment. The message should instead say that a button will appear on screen when enough information has been gathered. If the information given back in the message is all true in relation to the above point, then it is fine to send, it is only if it is incorrect that it shouldn't be approved

    If the message is sensible and does not break any of these rules, then the message can be approved (and the boolean for this set to true). If any of the above points are not met, then the message should not be approved and ALL required suggestions should be given. In this case, the boolean should be set to false. However, you should approve unless there is a reasonable cause of concern.

    If the message is approved, and approved is set to true, there MUST still be a "suggestions" key, and you should put "None" in this field.

     Return your answer as a boolean in a JSON, under the key 'approved', and a string under the key 'suggestions'.
     `
}
