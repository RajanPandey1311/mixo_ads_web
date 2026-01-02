import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignService } from '../services/api';
import type { Campaign, CampaignInsights } from '../types';
import { StatusBadge } from '../components/Campaign/StatusBadge';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { ErrorMessage } from '../components/Common/ErrorMessage';
import {
    ArrowLeft,
    TrendingUp,
    MousePointerClick,
    Target,
    DollarSign,
    Calendar,
    Wallet,
    Activity
} from 'lucide-react';
import {
    formatCurrency,
    formatNumber,
    formatPercentage,
    formatDate,
    getPlatformColor
} from '../utils/formatters';

export const CampaignDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [insights, setInsights] = useState<CampaignInsights | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [campaignData, insightsData] = await Promise.all([
                    campaignService.getCampaignById(id),
                    campaignService.getCampaignInsights(id),
                ]);

                setCampaign(campaignData.campaign);
                setInsights(insightsData.insights);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch campaign details');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        if (id) {
            setIsLive(true);
            const eventSource = campaignService.createSSEConnection(
                id,
                (data) => {
                    setInsights(data);
                },
                () => {
                    setIsLive(false);
                }
            );

            return () => {
                eventSource.close();
                setIsLive(false);
            };
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error || !campaign) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ErrorMessage message={error || 'Campaign not found'} onRetry={() => navigate('/')} />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
            </button>

            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 mb-8">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">{campaign.name}</h1>
                        <div className="flex items-center gap-3">
                            <StatusBadge status={campaign.status} />
                            {isLive && (
                                <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    Live Updates
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {campaign.platforms.map((platform) => (
                            <span
                                key={platform}
                                className={`${getPlatformColor(platform)} text-white text-sm font-semibold px-4 py-2 rounded-lg`}
                            >
                                {platform.toUpperCase()}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary-100 p-3 rounded-lg">
                            <Wallet className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Budget</p>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(campaign.budget)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-accent-100 p-3 rounded-lg">
                            <Calendar className="w-6 h-6 text-accent-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Daily Budget</p>
                            <p className="text-xl font-bold text-gray-900">{formatCurrency(campaign.daily_budget)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Activity className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Created</p>
                            <p className="text-xl font-bold text-gray-900">{formatDate(campaign.created_at)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {insights && (
                <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Metrics</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-600">Impressions</h3>
                                <TrendingUp className="w-5 h-5 text-primary-600" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-2">{formatNumber(insights.impressions)}</p>
                            <p className="text-xs text-gray-500">Total views</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-600">Clicks</h3>
                                <MousePointerClick className="w-5 h-5 text-accent-600" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-2">{formatNumber(insights.clicks)}</p>
                            <p className="text-xs text-gray-500">CTR: {formatPercentage(insights.ctr)}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-600">Conversions</h3>
                                <Target className="w-5 h-5 text-green-600" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-2">{formatNumber(insights.conversions)}</p>
                            <p className="text-xs text-gray-500">Rate: {formatPercentage(insights.conversion_rate)}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-medium text-gray-600">Total Spend</h3>
                                <DollarSign className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(insights.spend)}</p>
                            <p className="text-xs text-gray-500">CPC: {formatCurrency(insights.cpc)}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Detailed Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700 font-medium">Click-Through Rate (CTR)</span>
                                    <span className="text-lg font-bold text-primary-600">{formatPercentage(insights.ctr)}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700 font-medium">Cost Per Click (CPC)</span>
                                    <span className="text-lg font-bold text-accent-600">{formatCurrency(insights.cpc)}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700 font-medium">Conversion Rate</span>
                                    <span className="text-lg font-bold text-green-600">{formatPercentage(insights.conversion_rate)}</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700 font-medium">Budget Remaining</span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {formatCurrency(campaign.budget - insights.spend)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700 font-medium">Budget Used</span>
                                    <span className="text-lg font-bold text-orange-600">
                                        {formatPercentage((insights.spend / campaign.budget) * 100)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700 font-medium">Cost Per Conversion</span>
                                    <span className="text-lg font-bold text-purple-600">
                                        {formatCurrency(insights.spend / insights.conversions)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
