const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input input');
const sendButton = document.querySelector('.chat-input button');

const API_URL = 'https://free.gpt.ge';
const API_KEY = 'sk-HA6lLBnFgi7ZHzo91e00947c401844F687E487Cb9fFfB298';

async function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message, 'user-message');
        chatInput.value = '';
        
        try {
            const response = await fetch(`${API_URL}/v1/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {role: "system", content: "You are a helpful assistant."},
                        {role: "user", content: message}
                    ]
                })
            });

            const data = await response.json();
            
            if (data.choices && data.choices.length > 0) {
                const aiReply = data.choices[0].message.content;
                addMessage(aiReply, 'ai-message');
            } else {
                addMessage('抱歉，我现在无法回答您的问题。请稍后再试。', 'ai-message');
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('抱歉，发生了一些错误。请稍后再试。', 'ai-message');
        }
    }
}

function addMessage(text, className) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

sendButton.addEventListener('click', sendMessage);

chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
    }
});

// 搜索框相关的代码
const searchContainer = document.querySelector('.search-container');
const searchBox = document.querySelector('.search-box');
const nav = document.querySelector('nav');

searchBox.addEventListener('focus', () => {
    searchContainer.classList.add('active');
    nav.classList.add('search-active');
});

searchBox.addEventListener('blur', () => {
    searchContainer.classList.remove('active');
    nav.classList.remove('search-active');
});