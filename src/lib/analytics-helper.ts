export const getDateRange = (period: string) => {
    const end = new Date();
    const start = new Date();

    switch (period) {
        case '7d':
        case 'week':
            start.setDate(start.getDate() - 7);
            break;
        case '30d':
        case 'month':
            start.setDate(start.getDate() - 30); // Or setMonth(-1) logic
            break;
        case '90d':
            start.setDate(start.getDate() - 90);
            break;
        case '1y':
        case 'year':
            start.setFullYear(start.getFullYear() - 1);
            break;
        case 'today':
            start.setHours(0, 0, 0, 0);
            break;
        default:
            start.setDate(start.getDate() - 7);
    }

    return { start, end };
};

export const formatDate = (date: Date, period: string) => {
    // Basic formattingYYYY-MM-DD
    return date.toISOString().split('T')[0];
};
