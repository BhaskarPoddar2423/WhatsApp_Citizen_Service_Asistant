const express = require('express');
const cors = require('cors');
const chatService = require('./services/chatService');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// WhatsApp Webhook Verification
app.get('/webhook/whatsapp', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            console.error('Verification failed. Token mismatch.');
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
});

// WhatsApp Message Handler
app.post('/webhook/whatsapp', async (req, res) => {
    // Return a 200 OK immediately to acknowledge receipt
    res.sendStatus(200);

    try {
        const body = req.body;
        // Check if this is a WhatsApp event
        if (body.object) {
            if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
                const message = body.entry[0].changes[0].value.messages[0];
                const phoneNumber = message.from;
                const messageType = message.type;
                
                // We only handle text messages for now, or other types if needed (photo handling is in prompt logic)
                // But the prompt says "Extract... Text message body".
                // We'll pass the whole message object to service to handle types.
                
                await chatService.processMessage(phoneNumber, message);
            }
        }
    } catch (error) {
        console.error('Error processing webhook:', error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
