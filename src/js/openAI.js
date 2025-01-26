import axios from "axios";

const openAI = {
    apiKey: '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',
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini-2024-07-18',
    maxLength: 200, // 응답의 길이
    temperature: 0.5, // 응답의 창의성 (0.0 ~ 1.0) 창의성을 올리면 엉뚱한 답변이 나올수 있음.
    send: async (messages, message, callback, data) => {
        try {
            const userMessage
                = { role: 'user', content: message};
            callback((prev) => [...prev, userMessage]); // 사용자 메시지 추가
            const sendMessages = JSON.parse(JSON.stringify(userMessage));
            sendMessages.content = `${message}. ${JSON.stringify(data)} 내용을 ${openAI.maxLength}자로 요약해줘.
            카테고리별 요약을 문자으로 요약해줘. 다른사람에게 대화하듯이 문장으로 만들어줘. 반말로 설명해줘`;
            await axios({
                method: 'POST',
                url: openAI.url,
                headers: {
                    'Content-Type':
                        'application/json',
                    Authorization: `Bearer ${openAI.apiKey}`, // OpenAI API 키//
                },
                data: {
                    model: openAI.model,
                    messages: [...messages,
                        sendMessages],
                    temperature:
                    openAI.temperature,
                },
            }).then(
                response => {
                    console.log(response.data.choices[0].message);
                    callback((prev) => [...prev,
                        response.data.choices[0].message]); // 봇 메시지 추가
                }
            )
        } catch (error) {
            console.error('Error:', error);
            alert('문제가 발생했습니다. 다시 시도해주세요.');
        }
    }

}

export default openAI