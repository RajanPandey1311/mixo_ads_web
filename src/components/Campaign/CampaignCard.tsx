import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Campaign, CampaignInsights } from '../../types';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatNumber, formatPercentage, formatRelativeTime, getPlatformColor } from '../../utils/formatters';
import { TrendingUp, MousePointerClick, Target, DollarSign } from 'lucide-react';

interface CampaignCardProps {
    campaign: Campaign;
    insights?: CampaignInsights;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, insights }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/campaign/${campaign.id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 cursor-pointer card-hover"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{campaign.name}</h3>
                    <StatusBadge status={campaign.status} />
                </div>
                <div className="flex gap-2">
                    {campaign.platforms.map((platform) => (
                        <span
                            key={platform}
                            className={`${getPlatformColor(platform)} capitalize text-white text-xs font-semibold px-3 py-1 rounded-full`}
                        >
                            {platform}
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Budget</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(campaign.budget)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Daily Budget</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(campaign.daily_budget)}</p>
                </div>
            </div>

            {insights && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                    <p className="text-xs text-gray-500 mb-3">Performance Metrics</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary-600" />
                            <div>
                                <p className="text-xs text-gray-500">Impressions</p>
                                <p className="text-sm font-semibold text-gray-900">{formatNumber(insights.impressions)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MousePointerClick className="w-4 h-4 text-accent-600" />
                            <div>
                                <p className="text-xs text-gray-500">CTR</p>
                                <p className="text-sm font-semibold text-gray-900">{formatPercentage(insights.ctr)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-green-600" />
                            <div>
                                <p className="text-xs text-gray-500">Conversions</p>
                                <p className="text-sm font-semibold text-gray-900">{formatNumber(insights.conversions)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-blue-600" />
                            <div>
                                <p className="text-xs text-gray-500">Spend</p>
                                <p className="text-sm font-semibold text-gray-900">{formatCurrency(insights.spend)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
                Created {formatRelativeTime(campaign.created_at)}
            </div>
        </div>
    );
};
