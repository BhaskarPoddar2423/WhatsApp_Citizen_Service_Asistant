const { GoogleGenerativeAI } = require('@google/generative-ai');
const rules = require('../utils/rules');
const prompts = require('../utils/prompts');
const whatsappService = require('./whatsappService');

require('dotenv').config();

// In-memory session store (simple for this task)
// Map<phoneNumber, Context>
const sessions = new Map();

// Gemini Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function processMessage(phoneNumber, messageObj) {
    try {
        // 1. Get or Create Session
        let context = sessions.get(phoneNumber) || { history: [] };
        let userMessage = '';

        // Extract Text from Message Object
        if (messageObj.type === 'text') {
            userMessage = messageObj.text.body;
        } else {
            // Handle other types if needed, or ignore as per prompt ("Extract... Text message body")
            // If photo, we might need it for Step 4 of Grievance
            if (messageObj.type === 'image') {
                userMessage = '[ATTACHMENT: PHOTO]';
            } else {
                userMessage = '[UNSUPPORTED_TYPE]';
            }
        }

        console.log(`Received from ${phoneNumber}: ${userMessage}`);

        // 2. Rule-Based Check
        const ruleResult = rules.getRuleResponse(userMessage, context);

        let replyText = '';
        let structuredData = null;

        if (ruleResult.match) {
            console.log('Rule matched');
            replyText = ruleResult.message;
            if (ruleResult.contextUpdate) {
                context = { ...context, ...ruleResult.contextUpdate };
            }
        } else {
            console.log('No rule matched. Calling Gemini...');
            // 3. Gemini Fallback
            if (process.env.GEMINI_API_KEY) {
                try {
                    // Start chat logic
                    const historyText = context.history.slice(-5).map(m => `${m.role}: ${m.text}`).join('\n');

                    const prompt = `${prompts.SYSTEM_PROMPT}

Previous conversation:
${historyText}

Citizen: ${userMessage}

Respond as the helpful government chatbot. Remember to include [STRUCTURED_DATA] block if you've collected enough information for a service request.`;

                    const result = await model.generateContent(prompt);
                    const response = result.response.text();

                    // Parse response (simplified)
                    replyText = response.replace(/\[STRUCTURED_DATA\][\s\S]*?\[\/STRUCTURED_DATA\]/, '').trim();

                    // Detect Structured Data
                    const structuredMatch = response.match(/\[STRUCTURED_DATA\]([\s\S]*?)\[\/STRUCTURED_DATA\]/);
                    if (structuredMatch) {
                        console.log('Structured Data Collected:', structuredMatch[1]);
                        // Logic to save to DB would go here
                    }

                } catch (err) {
                    console.error('Gemini Error:', err);
                    replyText = "I'm having trouble connecting right now. Please try again later.";
                }
            } else {
                replyText = "Gemini API Key not configured. Using fallback.";
                // Could fall back to Default Rule Message
            }
        }

        // 4. Send Reply
        if (replyText) {
            await whatsappService.sendMessage(phoneNumber, replyText);

            // Update History
            context.history.push({ role: 'Citizen', text: userMessage });
            context.history.push({ role: 'Bot', text: replyText });

            // Save Session
            sessions.set(phoneNumber, context);
        }

    } catch (error) {
        console.error('Error in processMessage:', error);
    }
}

module.exports = {
    processMessage
};
