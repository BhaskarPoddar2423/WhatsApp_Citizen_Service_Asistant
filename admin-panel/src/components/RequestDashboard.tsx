// Request Dashboard Component
import React, { useState, useEffect } from 'react';
import { RequestList } from './RequestList';
import {
    fetchAllRequests,
    getDashboardStats,
} from '../services/adminService';
import type { ServiceRequest } from '../types/adminTypes';

interface DashboardStats {
    total: number;
    pending: number;
    overdue: number;
    resolvedToday: number;
}

export const RequestDashboard: React.FC = () => {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        total: 0,
        pending: 0,
        overdue: 0,
        resolvedToday: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        status: '',
        priority: '',
        search: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRequests, setTotalRequests] = useState(0);
    const pageSize = 20;

    useEffect(() => {
        loadData();
    }, [filters, currentPage]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [requestsResult, statsResult] = await Promise.all([
                fetchAllRequests(currentPage, pageSize, filters),
                getDashboardStats(),
            ]);
            setRequests(requestsResult.requests);
            setTotalRequests(requestsResult.total);
            setStats(statsResult);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(totalRequests / pageSize);

    return (
        <div className="dashboard">
            {/* Stats Cards */}
            <div className="dashboard__stats">
                <div className="stat-card">
                    <div className="stat-card__icon stat-card__icon--total">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="stat-card__content">
                        <span className="stat-card__value">{stats.total}</span>
                        <span className="stat-card__label">Total Requests</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card__icon stat-card__icon--pending">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="stat-card__content">
                        <span className="stat-card__value">{stats.pending}</span>
                        <span className="stat-card__label">Pending</span>
                    </div>
                </div>

                <div className="stat-card stat-card--warning">
                    <div className="stat-card__icon stat-card__icon--overdue">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.29 3.86L1.82 18C1.64 18.31 1.55 18.67 1.55 19.03C1.55 19.39 1.64 19.74 1.82 20.05C2 20.36 2.26 20.62 2.57 20.8C2.88 20.98 3.23 21.08 3.59 21.08H20.33C20.69 21.08 21.04 20.98 21.35 20.8C21.66 20.62 21.92 20.36 22.1 20.05C22.28 19.74 22.37 19.39 22.37 19.03C22.37 18.67 22.28 18.31 22.1 18L13.63 3.86C13.45 3.56 13.19 3.31 12.89 3.13C12.59 2.95 12.24 2.86 11.89 2.86C11.54 2.86 11.19 2.95 10.89 3.13C10.59 3.31 10.33 3.56 10.15 3.86H10.29Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="stat-card__content">
                        <span className="stat-card__value">{stats.overdue}</span>
                        <span className="stat-card__label">Overdue</span>
                    </div>
                </div>

                <div className="stat-card stat-card--success">
                    <div className="stat-card__icon stat-card__icon--resolved">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="stat-card__content">
                        <span className="stat-card__value">{stats.resolvedToday}</span>
                        <span className="stat-card__label">Resolved Today</span>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="dashboard__filters">
                <div className="filter-group">
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="Search by ID or description..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <select
                        className="filter-select"
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="complaint">Complaints</option>
                        <option value="certificate">Certificates</option>
                        <option value="payment">Payments</option>
                    </select>
                </div>

                <div className="filter-group">
                    <select
                        className="filter-select"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="under_review">Under Review</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div className="filter-group">
                    <select
                        className="filter-select"
                        value={filters.priority}
                        onChange={(e) => handleFilterChange('priority', e.target.value)}
                    >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>

                <button className="filter-btn" onClick={() => setFilters({ category: '', status: '', priority: '', search: '' })}>
                    Clear Filters
                </button>
            </div>

            {/* Request List */}
            <RequestList requests={requests} isLoading={isLoading} />

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="dashboard__pagination">
                    <button
                        className="pagination-btn"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                    >
                        ← Previous
                    </button>
                    <span className="pagination-info">
                        Page {currentPage} of {totalPages} ({totalRequests} total)
                    </span>
                    <button
                        className="pagination-btn"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};
