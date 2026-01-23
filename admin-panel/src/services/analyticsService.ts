// Analytics Service - Fetch and aggregate chatbot analytics data
import { supabase } from './supabase';

export interface AnalyticsFilters {
    startDate: string;
    endDate: string;
    channel?: string;
    category?: string;
    status?: string;
}

export interface KPIData {
    totalConversations: number;
    uniqueCitizens: number;
    resolvedCount: number;
    resolutionRate: number;
    avgResolutionHours: number;
    overdueCount: number;
    overdueRate: number;
    pendingCount: number;
    previousPeriod: {
        totalConversations: number;
        resolvedCount: number;
    };
}

export interface TimeSeriesPoint {
    date: string;
    count: number;
}

export interface CategoryBreakdown {
    category: string;
    count: number;
    percentage: number;
}

export interface ChannelBreakdown {
    channel: string;
    count: number;
    percentage: number;
}

export interface StatusBreakdown {
    status: string;
    count: number;
    percentage: number;
}

export interface HeatmapCell {
    day: number; // 0-6 (Sun-Sat)
    hour: number; // 0-23
    count: number;
}

export interface TopIntent {
    subCategory: string;
    category: string;
    count: number;
    resolvedCount: number;
    resolutionRate: number;
}

// Get KPI metrics for dashboard cards
export async function getAnalyticsKPIs(filters: AnalyticsFilters): Promise<KPIData> {
    const { startDate, endDate, channel, category } = filters;

    // Calculate previous period for trend comparison
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const periodDays = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
    const prevStartDate = new Date(startDateObj.getTime() - periodDays * 24 * 60 * 60 * 1000).toISOString();
    const prevEndDate = startDate;

    // Current period query
    let query = supabase
        .from('service_requests')
        .select('id, citizen_id, status, created_at, resolved_at, sla_due_at', { count: 'exact' })
        .gte('created_at', startDate)
        .lte('created_at', endDate);

    if (channel) query = query.eq('channel', channel);
    if (category) query = query.eq('category', category);

    const { data: currentData, count: totalCount } = await query;

    // Previous period query for trends
    let prevQuery = supabase
        .from('service_requests')
        .select('id, status', { count: 'exact' })
        .gte('created_at', prevStartDate)
        .lt('created_at', prevEndDate);

    if (channel) prevQuery = prevQuery.eq('channel', channel);
    if (category) prevQuery = prevQuery.eq('category', category);

    const { data: prevData, count: prevTotal } = await prevQuery;

    // Calculate metrics
    const records = currentData || [];
    const uniqueCitizens = new Set(records.map(r => r.citizen_id)).size;
    const resolvedRecords = records.filter(r => r.status === 'resolved' || r.status === 'closed');
    const pendingRecords = records.filter(r => ['new', 'in_progress', 'under_review'].includes(r.status));
    const overdueRecords = records.filter(r => r.sla_due_at && new Date(r.sla_due_at) < new Date());

    // Average resolution time (in hours)
    let totalResolutionHours = 0;
    let resolutionCount = 0;
    resolvedRecords.forEach(r => {
        if (r.resolved_at && r.created_at) {
            const hours = (new Date(r.resolved_at).getTime() - new Date(r.created_at).getTime()) / (1000 * 60 * 60);
            totalResolutionHours += hours;
            resolutionCount++;
        }
    });

    const prevRecords = prevData || [];
    const prevResolved = prevRecords.filter(r => r.status === 'resolved' || r.status === 'closed').length;

    return {
        totalConversations: totalCount || 0,
        uniqueCitizens,
        resolvedCount: resolvedRecords.length,
        resolutionRate: totalCount ? (resolvedRecords.length / totalCount) * 100 : 0,
        avgResolutionHours: resolutionCount ? totalResolutionHours / resolutionCount : 0,
        overdueCount: overdueRecords.length,
        overdueRate: totalCount ? (overdueRecords.length / totalCount) * 100 : 0,
        pendingCount: pendingRecords.length,
        previousPeriod: {
            totalConversations: prevTotal || 0,
            resolvedCount: prevResolved,
        },
    };
}

// Get conversation volume over time
export async function getConversationVolume(filters: AnalyticsFilters): Promise<TimeSeriesPoint[]> {
    const { startDate, endDate, channel, category } = filters;

    let query = supabase
        .from('service_requests')
        .select('created_at')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: true });

    if (channel) query = query.eq('channel', channel);
    if (category) query = query.eq('category', category);

    const { data } = await query;

    // Group by date
    const dateMap = new Map<string, number>();
    (data || []).forEach(record => {
        const date = new Date(record.created_at).toISOString().split('T')[0];
        dateMap.set(date, (dateMap.get(date) || 0) + 1);
    });

    // Fill in missing dates
    const result: TimeSeriesPoint[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        result.push({
            date: dateStr,
            count: dateMap.get(dateStr) || 0,
        });
        current.setDate(current.getDate() + 1);
    }

    return result;
}

// Get breakdown by category
export async function getCategoryBreakdown(filters: AnalyticsFilters): Promise<CategoryBreakdown[]> {
    const { startDate, endDate, channel } = filters;

    let query = supabase
        .from('service_requests')
        .select('category')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

    if (channel) query = query.eq('channel', channel);

    const { data } = await query;

    const categoryMap = new Map<string, number>();
    (data || []).forEach(record => {
        const cat = record.category || 'unknown';
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
    });

    const total = data?.length || 1;
    return Array.from(categoryMap.entries()).map(([category, count]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1),
        count,
        percentage: (count / total) * 100,
    }));
}

// Get breakdown by channel
export async function getChannelBreakdown(filters: AnalyticsFilters): Promise<ChannelBreakdown[]> {
    const { startDate, endDate, category } = filters;

    let query = supabase
        .from('service_requests')
        .select('channel')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

    if (category) query = query.eq('category', category);

    const { data } = await query;

    const channelMap = new Map<string, number>();
    (data || []).forEach(record => {
        const ch = record.channel || 'unknown';
        channelMap.set(ch, (channelMap.get(ch) || 0) + 1);
    });

    const total = data?.length || 1;
    return Array.from(channelMap.entries()).map(([channel, count]) => ({
        channel: channel.charAt(0).toUpperCase() + channel.slice(1),
        count,
        percentage: (count / total) * 100,
    }));
}

// Get breakdown by status
export async function getStatusBreakdown(filters: AnalyticsFilters): Promise<StatusBreakdown[]> {
    const { startDate, endDate, channel, category } = filters;

    let query = supabase
        .from('service_requests')
        .select('status')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

    if (channel) query = query.eq('channel', channel);
    if (category) query = query.eq('category', category);

    const { data } = await query;

    const statusMap = new Map<string, number>();
    (data || []).forEach(record => {
        const st = record.status || 'unknown';
        statusMap.set(st, (statusMap.get(st) || 0) + 1);
    });

    const total = data?.length || 1;
    const statusLabels: Record<string, string> = {
        new: 'New',
        in_progress: 'In Progress',
        under_review: 'Under Review',
        resolved: 'Resolved',
        closed: 'Closed',
        rejected: 'Rejected',
    };

    return Array.from(statusMap.entries()).map(([status, count]) => ({
        status: statusLabels[status] || status,
        count,
        percentage: (count / total) * 100,
    }));
}

// Get peak usage heatmap (hour x day of week)
export async function getPeakUsageHeatmap(filters: AnalyticsFilters): Promise<HeatmapCell[]> {
    const { startDate, endDate, channel, category } = filters;

    let query = supabase
        .from('service_requests')
        .select('created_at')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

    if (channel) query = query.eq('channel', channel);
    if (category) query = query.eq('category', category);

    const { data } = await query;

    // Initialize matrix
    const matrix: number[][] = Array(7).fill(null).map(() => Array(24).fill(0));

    (data || []).forEach(record => {
        const date = new Date(record.created_at);
        const day = date.getDay(); // 0-6
        const hour = date.getHours(); // 0-23
        matrix[day][hour]++;
    });

    // Flatten to cells
    const cells: HeatmapCell[] = [];
    for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
            cells.push({ day, hour, count: matrix[day][hour] });
        }
    }

    return cells;
}

// Get top intents (most common sub_categories)
export async function getTopIntents(filters: AnalyticsFilters, limit: number = 10): Promise<TopIntent[]> {
    const { startDate, endDate, channel, category } = filters;

    let query = supabase
        .from('service_requests')
        .select('category, sub_category, status')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

    if (channel) query = query.eq('channel', channel);
    if (category) query = query.eq('category', category);

    const { data } = await query;

    const intentMap = new Map<string, { category: string; count: number; resolved: number }>();

    (data || []).forEach(record => {
        const key = record.sub_category || 'General';
        const existing = intentMap.get(key) || { category: record.category, count: 0, resolved: 0 };
        existing.count++;
        if (record.status === 'resolved' || record.status === 'closed') {
            existing.resolved++;
        }
        intentMap.set(key, existing);
    });

    return Array.from(intentMap.entries())
        .map(([subCategory, data]) => ({
            subCategory,
            category: data.category,
            count: data.count,
            resolvedCount: data.resolved,
            resolutionRate: data.count ? (data.resolved / data.count) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
}
