export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value);
};

export const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(date);
};

export const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
};

export const getPlatformColor = (platform: string): string => {
    const colors: Record<string, string> = {
        meta: 'bg-blue-500',
        google: 'bg-red-500',
        linkedin: 'bg-blue-700',
        other: 'bg-gray-500',
    };
    return colors[platform.toLowerCase()] || colors.other;
};

export const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
        active: 'bg-green-500',
        paused: 'bg-yellow-500',
        completed: 'bg-gray-500',
    };
    return colors[status.toLowerCase()] || colors.active;
};
