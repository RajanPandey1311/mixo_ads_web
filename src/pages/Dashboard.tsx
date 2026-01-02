import React, { useState, useEffect } from 'react';
import { campaignService } from '../services/api';
import type { Campaign, AggregateInsights } from '../types';
import { CampaignCard } from '../components/Campaign/CampaignCard';
import { MetricCard } from '../components/Metrics/MetricCard';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { ErrorMessage } from '../components/Common/ErrorMessage';
import {
    TrendingUp,
    MousePointerClick,
    Target,
    DollarSign,
    Search,
    Filter
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';

interface DashboardProps {
    onRefresh?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onRefresh }) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [insights, setInsights] = useState<AggregateInsights | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | Campaign['status']>('all');

    const fetchData = async (retryCount = 0) => {
        try {
            setLoading(true);
            setError(null);

            const [campaignsData, insightsData] = await Promise.all([
                campaignService.getCampaigns(),
                campaignService.getInsights(),
            ]);

            setCampaigns(campaignsData.campaigns);
            setInsights(insightsData.insights);
        } catch (err: any) {
            if (err.response?.status === 504 && retryCount < 2) {
                console.log(`Retrying after 504 error (attempt ${retryCount + 1})...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return fetchData(retryCount + 1);
            }
            setError(err instanceof Error ? err.message : 'Failed to fetch data. Please try refreshing.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (onRefresh) {
            (window as any).refreshDashboard = fetchData;
        }
    }, [onRefresh]);

    const filteredCampaigns = campaigns.filter((campaign) => {
        const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ErrorMessage message={error} onRetry={fetchData} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in dark:text-white">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Campaign Overview</h2>
                <p className="text-gray-600 dark:text-gray-300">Monitor and analyze your advertising campaigns</p>
            </div>

            {insights && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Total Impressions"
                        value={formatNumber(insights.total_impressions)}
                        icon={TrendingUp}
                    />
                    <MetricCard
                        title="Total Clicks"
                        value={formatNumber(insights.total_clicks)}
                        icon={MousePointerClick}
                    />
                    <MetricCard
                        title="Total Conversions"
                        value={formatNumber(insights.total_conversions)}
                        icon={Target}
                    />
                    <MetricCard
                        title="Total Spend"
                        value={formatCurrency(insights.total_spend)}
                        icon={DollarSign}
                    />
                </div>
            )}

            {insights && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Campaign Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Active</span>
                                <span className="text-lg font-bold text-green-600">{insights.active_campaigns}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Paused</span>
                                <span className="text-lg font-bold text-yellow-600">{insights.paused_campaigns}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Completed</span>
                                <span className="text-lg font-bold text-gray-600">{insights.completed_campaigns}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Average Performance</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">CTR</span>
                                <span className="text-lg font-bold text-primary-600">{formatPercentage(insights.avg_ctr)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">CPC</span>
                                <span className="text-lg font-bold text-accent-600">{formatCurrency(insights.avg_cpc)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">Conv. Rate</span>
                                <span className="text-lg font-bold text-green-600">{formatPercentage(insights.avg_conversion_rate)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl shadow-md p-6 text-white">
                        <h3 className="text-sm font-medium mb-4 opacity-90">Total Campaigns</h3>
                        <p className="text-5xl font-bold mb-2">{insights.total_campaigns}</p>
                        <p className="text-sm opacity-75">Across all platforms</p>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Campaigns ({filteredCampaigns.length})
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredCampaigns.map((campaign) => (
                        <CampaignCard
                            key={campaign.id}
                            campaign={campaign}
                        />
                    ))}
                </div>
                {filteredCampaigns.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-500">No campaigns found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};
