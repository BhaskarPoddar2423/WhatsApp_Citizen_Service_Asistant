const chatService = require('../../services/chatService');
require('dotenv').config();

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

module.exports = async (req, res) => {
    // 1. Handle Webhook Verification (GET)
    if (req.method === 'GET') {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (mode && token) {
            if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                console.log('WEBHOOK_VERIFIED');
                // Return challenge as plain text
                return res.status(200).send(challenge);
            } else {
                console.error('Verification failed. Token mismatch.');
                return res.status(403).send('Forbidden');
            }
        }
        return res.status(400).send('Bad Request');
    }

    // 2. Handle Message Events (POST)
    if (req.method === 'POST') {
        const body = req.body;

        // Respond immediately to avoid timeout
        // (Vercel functions must return a response)
        // Note: For long processing, Vercel might kill execution after response.
        // ideally we process *then* respond, or use background jobs.
        // For this chatbot, we'll await processing to ensure reliability within the 10-60s limit.
        // WhatsApp expects 200 OK quickly, but Vercel lambda usually waits for event loop empty?
        // Actually, if we send res.status(200), the function might end. 
        // Best practice in Vercel: do work, then send response.

        try {
            if (body.object) {
                if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
                    const message = body.entry[0].changes[0].value.messages[0];
                    const phoneNumber = message.from;

                    // Process message
                    await chatService.processMessage(phoneNumber, message);
                }
            }
            return res.status(200).send('EVENT_RECEIVED');
        } catch (error) {
            console.error('Error processing webhook:', error);
            // Still return 200 to WhatsApp to prevent retries of bad payloads
            return res.status(200).send('EVENT_RECEIVED_ERROR');
        }
    }

    // Method Not Allowed
    return res.status(405).send('Method Not Allowed');
};
