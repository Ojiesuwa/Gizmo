const promptChatGpt = (system, prompt) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(import.meta.env.VITE_KEY);

      const systemMessage = {
        role: 'system',
        content: system,
      };

      const apiMessages = [
        {
          role: 'user',
          content: prompt,
        },
      ];

      const apiRequestBody = {
        model: 'gpt-4o-mini',
        messages: [systemMessage, ...apiMessages],
      };

      const requestAction = async () => {
        const response = await fetch(
          'https://api.openai.com/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',

              Authorization: 'Bearer ' + `${import.meta.env.VITE_KEY}`,
            },
            body: JSON.stringify(apiRequestBody),
          }
        );

        const responseData = await response.json();

        const payload = responseData.choices[0].message.content;

        resolve(payload);
      };

      setTimeout(requestAction, 20);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export default promptChatGpt;
