import React from 'react';
import type { Campaign } from '../../types';
import { getStatusColor } from '../../utils/formatters';

interface StatusBadgeProps {
    status: Campaign['status'];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const statusConfig = {
        active: { label: 'Active', color: 'bg-green-100 text-green-800 border-green-200' },
        paused: { label: 'Paused', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        completed: { label: 'Completed', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const config = statusConfig[status];

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(status)}`} />
            {config.label}
        </span>
    );
};
