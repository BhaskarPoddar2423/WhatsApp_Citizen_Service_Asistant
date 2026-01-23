// Chat Header Component - WhatsApp Style

import React from 'react';

interface ChatHeaderProps {
    isOnline?: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ isOnline = true }) => {
    return (
        <div className="chat-header">
            <div className="header-profile">
                <div className="bot-avatar emoji-avatar">🏛️</div>
                <div className="header-info">
                    <h1>VMC Citizen Services</h1>
                    <span className="status-badge">
                        {isOnline ? 'online' : 'connecting...'}
                    </span>
                </div>
            </div>
            <div className="card-actions">
                <button className="icon-btn" title="Menu">⋮</button>
            </div>
        </div>
    );
};