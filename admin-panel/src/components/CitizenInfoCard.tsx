// Citizen Info Card Component
import React from 'react';
import type { CitizenSummary } from '../types/adminTypes';

interface CitizenInfoCardProps {
    citizen: CitizenSummary;
}

export const CitizenInfoCard: React.FC<CitizenInfoCardProps> = ({ citizen }) => {
    const getInitials = (name: string | null) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getLanguageLabel = (lang: string | null) => {
        switch (lang) {
            case 'hi':
                return 'Hindi';
            case 'hinglish':
                return 'Hinglish';
            case 'en':
            default:
                return 'English';
        }
    };

    return (
        <div className="citizen-card">
            <div className="citizen-card__header">
                <div className="citizen-card__avatar">
                    {getInitials(citizen.name)}
                </div>
                <div className="citizen-card__name-section">
                    <h3 className="citizen-card__name">{citizen.name || 'Unknown Citizen'}</h3>
                    <span className="citizen-card__language">{getLanguageLabel(citizen.language)}</span>
                </div>
            </div>

            <div className="citizen-card__details">
                <div className="citizen-card__row">
                    <span className="citizen-card__icon">P</span>
                    <div className="citizen-card__info">
                        <span className="citizen-card__label">Phone</span>
                        <span className="citizen-card__value">{citizen.phone || 'Not provided'}</span>
                    </div>
                </div>

                <div className="citizen-card__row">
                    <span className="citizen-card__icon">W</span>
                    <div className="citizen-card__info">
                        <span className="citizen-card__label">WhatsApp</span>
                        <span className="citizen-card__value">{citizen.whatsapp_number || 'Not provided'}</span>
                    </div>
                </div>

                <div className="citizen-card__row">
                    <span className="citizen-card__icon">A</span>
                    <div className="citizen-card__info">
                        <span className="citizen-card__label">Address</span>
                        <span className="citizen-card__value">{citizen.address || 'Not provided'}</span>
                    </div>
                </div>

                <div className="citizen-card__row">
                    <span className="citizen-card__icon">T</span>
                    <div className="citizen-card__info">
                        <span className="citizen-card__label">Total Requests</span>
                        <span className="citizen-card__value">{citizen.total_requests ?? 0}</span>
                    </div>
                </div>
            </div>

            {citizen.risk_flags && citizen.risk_flags.length > 0 && (
                <div className="citizen-card__flags">
                    <span className="citizen-card__flags-title">Risk Flags</span>
                    <div className="citizen-card__flags-list">
                        {citizen.risk_flags.map((flag, index) => (
                            <span key={index} className="citizen-card__flag">
                                {flag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
