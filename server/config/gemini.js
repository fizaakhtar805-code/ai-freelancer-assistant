const generateAIContent = async (prompt) => {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: prompt },
      ],
    }),
  })

  const data = await response.json()

  if (!response.ok || data.error) {
    throw new Error(data.error?.message || "AI request failed")
  }

  return data.choices[0].message.content
}

module.exports = generateAIContent