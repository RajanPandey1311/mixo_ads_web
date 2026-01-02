import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Home, RefreshCw, } from 'lucide-react';

export const Header: React.FC = () => {
    const location = useLocation();
    const [isRefreshing, setIsRefreshing] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const handleRefresh = () => {
        setIsRefreshing(true);
        window.location.reload();
    };

    return (
        <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-primary-600 to-accent-600 p-2 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold gradient-text">Mixo Ads</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Campaign Dashboard</p>
                        </div>
                    </div>

                    <nav className="flex items-center gap-3">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isActive('/')
                                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-semibold'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            <Home className="w-4 h-4" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </Link>

                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                            title="Refresh Dashboard"
                        >
                            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </nav>
                </div>
            </div>
        </header>
    );
};
