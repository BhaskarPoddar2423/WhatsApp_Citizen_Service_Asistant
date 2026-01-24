// Ported from frontend src/services/geminiService.ts (getDemoResponse function)

// Helper to get menu
function getFollowUpMenu(lang) {
    if (lang === 'hi') {
        return `
---
🔄 *कुछ और मदद चाहिए?*

📄 बिल भुगतान | 📝 शिकायत | 📋 प्रमाण पत्र | 🏪 लाइसेंस | ℹ️ VMC जानकारी

जो चाहिए वो टाइप करें!`;
    }
    if (lang === 'hinglish') {
        return `
---
🔄 *Kuch aur help chahiye?*

📄 Bill Payment | 📝 Complaint | 📋 Certificate | 🏪 License | ℹ️ VMC Info

Jo chahiye woh type karein!`;
    }
    return `
---
🔄 *Need anything else?*

📄 Pay Bills | 📝 File Complaint | 📋 Certificates | 🏪 Licenses | ℹ️ VMC Info

Type what you need!`;
}

// Rule Engine Logic
function getRuleResponse(userMessage, context) {
    const msg = userMessage.toLowerCase().trim();
    const lang = context.language || 'en';

    // 0. Language Selection
    if (!context.language && (msg === '1' || msg === '2' || msg === '3' || msg.includes('english') || msg.includes('hindi') || msg.includes('hinglish'))) {
        let selectedLang = 'en';
        let confirmMsg = '';

        if (msg === '1' || msg.includes('english')) {
            selectedLang = 'en';
            confirmMsg = `✅ *Language set to English!*

How can I help you today?

📄 *Pay Bills* - Property Tax, Water Tax
📝 *File Complaint* - Roads, Water, Garbage
📋 *Certificates* - Birth, Income, Caste (Info & Links)
🏪 *Licenses* - Shop, Trade, Building (Info & Links)
🔍 *Track Status* - Check your request status
ℹ️ *VMC Info* - Office timings, contacts

Type what you need or choose from above!`;
        } else if (msg === '2' || msg.includes('hindi')) {
            selectedLang = 'hi';
            confirmMsg = `✅ *भाषा हिंदी में सेट हो गई!*

मैं आपकी क्या मदद कर सकता/सकती हूं?

📄 *बिल भुगतान* - प्रॉपर्टी टैक्स, पानी टैक्स
📝 *शिकायत दर्ज करें* - सड़क, पानी, कचरा
📋 *प्रमाण पत्र* - जन्म, आय, जाति (जानकारी और लिंक)
🏪 *लाइसेंस* - दुकान, व्यापार, भवन (जानकारी और लिंक)
🔍 *स्थिति जांचें* - अपनी अर्जी की स्थिति देखें
ℹ️ *VMC जानकारी* - ऑफिस समय, संपर्क

जो चाहिए वो टाइप करें!`;
        } else {
            selectedLang = 'hinglish';
            confirmMsg = `✅ *Language Hinglish mein set ho gayi!*

Main aapki kaise help kar sakta/sakti hoon?

📄 *Bill Payment* - Property Tax, Water Tax
📝 *Complaint Daalein* - Roads, Pani, Kachra
📋 *Certificates* - Birth, Income, Caste (Info aur Links)
🏪 *Licenses* - Dukaan, Trade, Building (Info aur Links)
🔍 *Status Check* - Apni application ka status dekhein
ℹ️ *VMC Info* - Office timing, contacts

Jo chahiye woh type karein!`;
        }

        return {
            match: true, // Rule matched
            message: confirmMsg,
            contextUpdate: { language: selectedLang }
        };
    }

    // 2. Keyword Matching
    // ... (Flows from frontend)

    // --- Bill Payment ---
    if (msg.includes('bill') || msg.includes('pay') || msg.includes('tax') || msg.includes('bijli') || msg.includes('paani') || msg.includes('vera')) {
        // ... (Simplified for brevity, or full implementation if needed)
        // For now, implementing the core router logic structure
        return {
            match: true,
            message: `💳 *Bill Payment Services*

Select a bill to pay:
• ⚡ Electricity Bill
• 💧 Water Bill  
• 🏠 Property Tax

Using official VMC & Provider Gateways.`,
            contextUpdate: { currentFlow: 'bill_payment' }
        };
    }

    // Default: No rule match
    return { match: false };
}

module.exports = {
    getRuleResponse
};
