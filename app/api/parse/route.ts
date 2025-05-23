// parse.js
import { OllamaLLM } from "langchain_ollama";
import { ChatPromptTemplate } from "langchain_core.prompts";

// Set up the template for the AI model
const template = `
You are tasked with extracting specific information from the following text content: {dom_content}.
Please follow these instructions carefully:

1. **Extract Information:** Only extract the information that directly matches the provided description: {parse_description}.
2. **No Extra Content:** Do not include any additional text, comments, or explanations in your response.
3. **Empty Response:** If no information matches the description, return an empty string ('').
4. **Direct Data Only:** Your output should contain only the data that is explicitly requested, with no other text.
`;

// Initialize the Ollama model
const model = new OllamaLLM({ model: "llama3" });

// Function to process the content with the AI model
async function parseWithOllama(domChunks, parseDescription) {
  const prompt = ChatPromptTemplate.fromTemplate(template);
  const chain = prompt | model;

  const parsedResults = [];

  for (let i = 0; i < domChunks.length; i++) {
    const chunk = domChunks[i];
    try {
      const response = await chain.invoke({
        dom_content: chunk,
        parse_description: parseDescription,
      });

      console.log(`Parsed batch: ${i + 1} of ${domChunks.length}`);
      parsedResults.push(response);
    } catch (error) {
      console.error("Error parsing chunk:", error);
      parsedResults.push(""); // In case of an error, push an empty string
    }
  }

  return parsedResults.join("\n");
}

export default { parseWithOllama };
