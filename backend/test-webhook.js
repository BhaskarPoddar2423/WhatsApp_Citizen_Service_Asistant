const axios = require('axios');

const TEST_PAYLOAD = {
    "object": "whatsapp_business_account",
    "entry": [
        {
            "id": "123456789",
            "changes": [
                {
                    "value": {
                        "messaging_product": "whatsapp",
                        "metadata": {
                            "display_phone_number": "15550051234",
                            "phone_number_id": "123456123456"
                        },
                        "contacts": [
                            {
                                "profile": {
                                    "name": "Citizen User"
                                },
                                "wa_id": "911234567890" // Sender Phone
                            }
                        ],
                        "messages": [
                            {
                                "from": "911234567890",
                                "id": "wamid.HBgLMTIzNDU2Nzg5MA==",
                                "timestamp": "1706085600",
                                "text": {
                                    "body": "I want to pay my water bill"
                                },
                                "type": "text"
                            }
                        ]
                    },
                    "field": "messages"
                }
            ]
        }
    ]
};

async function testWebhook() {
    try {
        console.log('Sending Test Webhook...');
        await axios.post('http://localhost:3000/webhook/whatsapp', TEST_PAYLOAD);
        console.log('Webhook Sent Successfully! Check server server logs for "Received from..."');
    } catch (error) {
        console.error('Webhook Failed:', error.message);
    }
}

testWebhook();
