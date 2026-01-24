const axios = require('axios');
require('dotenv').config();

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_TOKEN;

const sendMessage = async (to, body) => {
    try {
        await axios({
            method: 'POST',
            url: `https://graph.facebook.com/v22.0/${PHONE_NUMBER_ID}/messages`,
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: {
                messaging_product: 'whatsapp',
                to: to,
                type: 'text',
                text: { body: body }
            }
        });
        console.log(`Message sent to ${to}`);
    } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
    }
};

module.exports = {
    sendMessage
};
