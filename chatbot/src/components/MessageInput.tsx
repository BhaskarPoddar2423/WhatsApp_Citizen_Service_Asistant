// Message Input Component with WhatsApp-style Input Area

import React, { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

// Plus Icon SVG
const PlusIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
    </svg>
);

// Sticker/Emoji Icon SVG
const StickerIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363 1.108s-.669 1.959-5.051 1.959c-3.505 0-5.388-1.164-5.607-1.959 0 0 5.912 1.055 10.658 0zM11.804 1.011C5.609 1.011.978 6.033.978 12.228s4.826 10.761 11.021 10.761S23.02 18.423 23.02 12.228c.001-6.195-5.021-11.217-11.216-11.217zM12 21.354c-5.273 0-9.381-3.886-9.381-9.159s3.942-9.548 9.215-9.548 9.548 4.275 9.548 9.548c-.001 5.272-4.109 9.159-9.382 9.159zm3.108-9.751c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"></path>
    </svg>
);

// Microphone Icon SVG
const MicIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2z"></path>
    </svg>
);

// Send Icon SVG
const SendIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path>
    </svg>
);



// Document icon
const DocumentIcon = () => (
    <svg viewBox="0 0 53 53" width="53" height="53">
        <g fill="none" fillRule="evenodd">
            <circle fill="#7f66ff" cx="26.5" cy="26.5" r="26.5"></circle>
            <path fill="#fff" fillRule="nonzero" d="M35.5 14H24.833c-.921 0-1.665.746-1.665 1.667v3.333h-5c-.92 0-1.666.746-1.666 1.667v16.666c0 .92.746 1.667 1.666 1.667h10.667c.92 0 1.666-.747 1.666-1.667v-3.334h5c.922 0 1.667-.746 1.667-1.666V20.167L35.5 14zM28.833 37.333H18.167V20.667h5v11.666c0 .92.744 1.667 1.666 1.667h4v3.334zm5-5H24.833V15.667h5v5c0 .92.746 1.666 1.667 1.666h5v9.334l-2.667.001v-.001zm0-11.666h-2.667v-5l2.667 5z"></path>
        </g>
    </svg>
);

// Photos & Videos icon
const PhotosIcon = () => (
    <svg viewBox="0 0 53 53" width="53" height="53">
        <g fill="none" fillRule="evenodd">
            <circle fill="#fc5b83" cx="26.5" cy="26.5" r="26.5"></circle>
            <path fill="#fff" fillRule="nonzero" d="M35.333 17.667H17.667a1.667 1.667 0 0 0-1.667 1.666v14.167a1.667 1.667 0 0 0 1.667 1.667h17.666a1.667 1.667 0 0 0 1.667-1.667V19.333a1.667 1.667 0 0 0-1.667-1.666zm-13.75 3.75a1.875 1.875 0 1 1 0 3.75 1.875 1.875 0 0 1 0-3.75zm13.334 11.25H18.083l5-6.25 3.333 4.167 5-6.25 3.5 8.333z"></path>
        </g>
    </svg>
);

// Camera icon
const CameraIcon = () => (
    <svg viewBox="0 0 53 53" width="53" height="53">
        <g fill="none" fillRule="evenodd">
            <circle fill="#d3396d" cx="26.5" cy="26.5" r="26.5"></circle>
            <path fill="#fff" fillRule="nonzero" d="M26.5 18.833c-5.247 0-9.5 4.253-9.5 9.5s4.253 9.5 9.5 9.5 9.5-4.253 9.5-9.5-4.253-9.5-9.5-9.5zm0 15.167a5.672 5.672 0 0 1-5.667-5.667A5.672 5.672 0 0 1 26.5 22.667a5.672 5.672 0 0 1 5.667 5.666A5.672 5.672 0 0 1 26.5 34zM35 16.5h-2.5l-1.854-1.854a1.17 1.17 0 0 0-.829-.346h-6.634a1.17 1.17 0 0 0-.829.346L20.5 16.5H18a2.5 2.5 0 0 0-2.5 2.5v15a2.5 2.5 0 0 0 2.5 2.5h17a2.5 2.5 0 0 0 2.5-2.5V19a2.5 2.5 0 0 0-2.5-2.5z"></path>
        </g>
    </svg>
);

// Contact icon
const ContactIcon = () => (
    <svg viewBox="0 0 53 53" width="53" height="53">
        <g fill="none" fillRule="evenodd">
            <circle fill="#0176ff" cx="26.5" cy="26.5" r="26.5"></circle>
            <path fill="#fff" fillRule="nonzero" d="M26.5 20.833a4.167 4.167 0 1 1 0 8.334 4.167 4.167 0 0 1 0-8.334zm0 10.834c4.633 0 9.583 2.283 9.583 3.75v1.916H16.917v-1.916c0-1.467 4.95-3.75 9.583-3.75z"></path>
        </g>
    </svg>
);

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, disabled = false }) => {
    const [message, setMessage] = useState('');
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const attachmentRef = useRef<HTMLDivElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [message]);

    // Close attachment menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (attachmentRef.current && !attachmentRef.current.contains(event.target as Node)) {
                setShowAttachmentMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmedMessage = message.trim();
        if (trimmedMessage && !disabled) {
            onSend(trimmedMessage);
            setMessage('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleAttachmentClick = () => {
        setShowAttachmentMenu(!showAttachmentMenu);
    };

    const handleAttachmentOption = (type: string) => {
        console.log(`Selected attachment type: ${type}`);
        setShowAttachmentMenu(false);
        // TODO: Implement actual file handling
    };

    return (
        <div className="chat-input-container">
            {/* Plus/Attachment Button */}
            <div className="attachment-container" ref={attachmentRef}>
                <button
                    className={`plus-btn ${showAttachmentMenu ? 'active' : ''}`}
                    title="Attach"
                    onClick={handleAttachmentClick}
                >
                    <PlusIcon />
                </button>

                {showAttachmentMenu && (
                    <div className="attachment-popup">
                        <div className="attachment-option" onClick={() => handleAttachmentOption('document')}>
                            <DocumentIcon />
                            <span>Document</span>
                        </div>
                        <div className="attachment-option" onClick={() => handleAttachmentOption('photos')}>
                            <PhotosIcon />
                            <span>Photos & Videos</span>
                        </div>
                        <div className="attachment-option" onClick={() => handleAttachmentOption('camera')}>
                            <CameraIcon />
                            <span>Camera</span>
                        </div>
                        <div className="attachment-option" onClick={() => handleAttachmentOption('contact')}>
                            <ContactIcon />
                            <span>Contact</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Sticker/Emoji Button */}
            <button className="emoji-btn" title="Stickers">
                <StickerIcon />
            </button>

            {/* Message Input */}
            <div className="input-wrapper">
                <textarea
                    ref={textareaRef}
                    className="message-input"
                    placeholder="Type a message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    rows={1}
                />
            </div>

            {/* Send or Microphone Button */}
            {message.trim() ? (
                <button
                    className="send-btn"
                    onClick={() => handleSubmit()}
                    disabled={disabled}
                    title="Send message"
                >
                    <SendIcon />
                </button>
            ) : (
                <button className="mic-btn" title="Voice message">
                    <MicIcon />
                </button>
            )}
        </div>
    );
};