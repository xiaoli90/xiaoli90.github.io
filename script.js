document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.input-wrapper input');
    const sendButton = document.querySelector('.send-btn');
    const features = document.querySelector('.features');
    const h1 = document.querySelector('h1');
    const chatContainer = document.querySelector('.chat-container');
    const clickableItems = document.querySelectorAll('.clickable-item');

    const API_URL = 'https://free.gpt.ge';
    const API_KEY = 'sk-HA6lLBnFgi7ZHzo91e00947c401844F687E487Cb9fFfB298';

    function addMessage(text, className) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container', className);
        
        const iconDiv = document.createElement('div');
        iconDiv.classList.add('message-icon');
        
        if (className === 'user-message') {
            iconDiv.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';
        } else {
            iconDiv.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6v-4h12v4zm0-6H6V7h12v6z"/></svg>';
            iconDiv.classList.add('ai-icon');
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.textContent = text;
        
        messageContainer.appendChild(iconDiv);
        messageContainer.appendChild(messageDiv);
        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage(message) {
        if (message) {
            features.style.display = 'none';
            h1.style.display = 'none';
            chatContainer.style.display = 'block';
            
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

    sendButton.addEventListener('click', () => sendMessage(chatInput.value.trim()));

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage(chatInput.value.trim());
        }
    });

    clickableItems.forEach(item => {
        item.addEventListener('click', () => {
            const itemText = item.textContent.replace(' →', '');
            sendMessage(itemText);
        });
    });

    const infoManageBtn = document.querySelector('.info-manage-btn');
    const popup = document.getElementById('popup');
    const hackerAnimation = document.querySelector('.hacker-animation');
    const ipAddressElement = document.getElementById('ip-address');
    const ipLocationElement = document.getElementById('ip-location');

    async function getIPInfo() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return {
                ip: data.ip,
                location: `${data.country_name_chinese || data.country_name}`,
                city: data.city,
                region: data.region
            };
        } catch (error) {
            console.error('Error fetching IP info:', error);
            return {
                ip: 'Unable to fetch IP',
                location: 'Unable to fetch location',
                city: '',
                region: ''
            };
        }
    }

    function getLocationIcon(country) {
        const icons = {
            '中国': '🇨🇳',
            'China': '🇨🇳',
            '美国': '🇺🇸',
            'United States': '🇺🇸',
            'default': '🌍'
        };
        return icons[country] || icons['default'];
    }

    infoManageBtn.addEventListener('click', async () => {
        popup.style.display = 'block';
        hackerAnimation.style.display = 'flex';
        
        const deviceIcon = document.querySelector('.device-icon');
        const hackerLine = document.createElement('div');
        hackerLine.classList.add('hacker-line');
        deviceIcon.appendChild(hackerLine);
        
        setTimeout(() => {
            deviceIcon.classList.add('danger');
        }, 4000);
        
        const ipInfo = await getIPInfo();
        ipAddressElement.textContent = `您的IP地址是: ${ipInfo.ip}`;
        ipLocationElement.textContent = `您的位置是: ${ipInfo.location}${ipInfo.city ? ', ' + ipInfo.city : ''}${ipInfo.region ? ', ' + ipInfo.region : ''}`;
        
        const locationIcon = document.getElementById('location-icon');
        locationIcon.textContent = getLocationIcon(ipInfo.location);
        
        setTimeout(() => {
            hackerAnimation.style.display = 'none';
        }, 5000);

        setTimeout(() => {
            popup.style.display = 'none';
            deviceIcon.classList.remove('danger');
            hackerLine.remove();
        }, 10000);
    });
});
