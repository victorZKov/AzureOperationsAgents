import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useMemo } from 'react';
// utils
import {fetcher, endpoints, IResult} from 'src/utils/axios';
// types
import {IDashboard, ILatestImage} from 'src/types/dashboard';

// ----------------------------------------------------------------------
// Function to fetch the dashboard data
export function useGetDashboard() {
    const URL = endpoints.dashboard.overview;

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

    const memoizedValue = useMemo(
        () => ({
            dashboard: data as IResult,
            dashboardLoading: isLoading,
            dashboardError: error,
            dashboardValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );

    return memoizedValue;
}

// ----------------------------------------------------------------------
// Function to fetch the latest images
export function useGetLatestImages() {
    const URL = endpoints.dashboard.latestimages;
    
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
    
    const memoizedValue = useMemo(
        () => ({
            latestImages: data as IResult,
            latestImagesLoading: isLoading,
            latestImagesError: error,
            latestImagesValidating: isValidating,
        }),
        [data, error, isLoading, isValidating]
    );
    
    return memoizedValue;
    
}

// ----------------------------------------------------------------------
// Function to fetch ideas
export function useGenerateIdeas() {
    const URL = endpoints.dashboard.generateIdeas;

    const postFetcher = async (url: string, { arg }: { arg: { data: any } }): Promise<IResult> => {
        const response = await fetcher(
            url, // Pass URL as a string
            {
                method: 'POST',
                data: arg.data, // Payload sent to the backend
            }
        );

        if (response.StatusCode && response.StatusCode !== 200) {
            throw new Error(response.Value || 'Failed to generate ideas');
        }
        console.log('GENERATION RESPONSE:', response);
        return response as IResult;
    };

    const { trigger, data, error, isMutating } = useSWRMutation(URL, postFetcher);

    const memoizedValue = useMemo(
        () => ({
            generateIdeas: (data: string) => trigger({ data }),
            generateIdeasLoading: isMutating,
            generateIdeasError: error,
            generatedIdeas: data?.Value?.response.split('\n').filter(Boolean) || [],
        }),
        [trigger, data, isMutating, error]
    );

    return memoizedValue;
}
    
// ----------------------------------------------------------------------
// Function to generate an image
export function useGenerateImage() {
    const URL = endpoints.dashboard.generateImage;

    const postFetcher = async (url: string, { arg }: { arg: { data: any } }) => {
        const response = await fetcher(
            url, // Pass URL as a string
            {
                method: 'POST',
                data: arg.data, // Payload sent to the backend
            }
        );


        if (response.StatusCode && response.StatusCode !== 200) {
            throw new Error(response.Value || 'Failed to generate image');
        }
        console.log('GENERATION RESPONSE:', response);
        return response;
    };

    const { trigger, data, error, isMutating } = useSWRMutation(URL, postFetcher);

    const memoizedValue = useMemo(
        () => ({
            generateImage: (data: any) => trigger({ data }),
            generatedImageUrl: data?.Value,
            generateImageLoading: isMutating,
            generateImageError: error,
        }),
        [trigger, data, isMutating, error]
    );

    return memoizedValue;
}