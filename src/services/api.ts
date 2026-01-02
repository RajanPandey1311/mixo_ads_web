import axios, { AxiosError } from 'axios';
import type {
    CampaignsResponse,
    CampaignResponse,
    InsightsResponse,
    CampaignInsightsResponse,
    ApiError,
} from '../types';

const BASE_URL = 'https://mixo-fe-backend-task.vercel.app';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

let requestQueue: Array<() => void> = [];
let requestCount = 0;
const MAX_REQUESTS = 10;
const TIME_WINDOW = 60000;

const processQueue = () => {
    if (requestQueue.length > 0 && requestCount < MAX_REQUESTS) {
        const nextRequest = requestQueue.shift();
        if (nextRequest) {
            requestCount++;
            nextRequest();
            setTimeout(() => {
                requestCount--;
                processQueue();
            }, TIME_WINDOW / MAX_REQUESTS);
        }
    }
};

api.interceptors.request.use(
    (config) => {
        return new Promise((resolve) => {
            const executeRequest = () => {
                resolve(config);
            };

            if (requestCount < MAX_REQUESTS) {
                requestCount++;
                executeRequest();
                setTimeout(() => {
                    requestCount--;
                    processQueue();
                }, TIME_WINDOW / MAX_REQUESTS);
            } else {
                requestQueue.push(executeRequest);
            }
        });
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
        if (error.response?.status === 429) {
            const retryAfter = error.response.data.retry_after || 60;
            await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
            return api.request(error.config!);
        }
        return Promise.reject(error);
    }
);

export const campaignService = {
    async getCampaigns(): Promise<CampaignsResponse> {
        const response = await api.get<CampaignsResponse>('/campaigns');
        return response.data;
    },

    async getCampaignById(id: string): Promise<CampaignResponse> {
        const response = await api.get<CampaignResponse>(`/campaigns/${id}`);
        return response.data;
    },

    async getInsights(): Promise<InsightsResponse> {
        const response = await api.get<InsightsResponse>('/campaigns/insights');
        return response.data;
    },

    async getCampaignInsights(id: string): Promise<CampaignInsightsResponse> {
        const response = await api.get<CampaignInsightsResponse>(
            `/campaigns/${id}/insights`
        );
        return response.data;
    },

    createSSEConnection(
        campaignId: string,
        onMessage: (data: CampaignInsightsResponse['insights']) => void,
        onError?: (error: Event) => void
    ): EventSource {
        const eventSource = new EventSource(
            `${BASE_URL}/campaigns/${campaignId}/insights/stream`
        );

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (error) {
                console.error('Error parsing SSE data:', error);
            }
        };

        eventSource.onerror = (error) => {
            console.error('SSE connection error:', error);
            if (onError) {
                onError(error);
            }
        };

        return eventSource;
    },
};

export default api;
