import useSWR from 'swr';
import { useMemo } from 'react';
import { useCallback } from 'react';
// utils
import {fetcher, endpoints, api, apiOpen} from 'src/utils/axios';
// types
import { IUserAccountBillingHistory, IUserProfile} from 'src/types/user';

// ----------------------------------------------------------------------

export function useGetUser() {
  const URL = endpoints.auth.me;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      profile: data?.Value as IUserProfile,
      userLoading: isLoading,
      userError: error,
      userValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetInvoices() {
  const URL = endpoints.user.invoices;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      invoices: data?.Value as IUserAccountBillingHistory[],
      invoicesLoading: isLoading,
      invoicesError: error,
      invoicesValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}


export function useUpgradePlan() {
  const URL = endpoints.user.upgradePlan;

  const upgradePlan = useCallback(async (newPlan: string) => {
    try {
        const response = await api.post(`${URL}?newPlan=${newPlan}`);      return response.data;
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
      throw error;
    }
  }, [URL]);

  return upgradePlan;
}

export function useUpdateProfile() {
    const URL = endpoints.user.updateProfile;
    
    const updateProfile = useCallback(async (data: any) => {
        try {
            const response = await api.post(URL, data);
            return response.data;
        } catch (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }
    }, [URL]);
    
    return updateProfile;
}

export function useCreateProfile() {
    const URL = "https://coloreabackend-dev-apim.azure-api.net/coloreabackend-reg/profile/create?subscription-key=0b7848d7be3d44bf9269139e0aeabc61";
    
    const createProfile = useCallback(async (data: any) => {
        try {
            const response = await apiOpen.post(URL, data);
            return response.data;
        } catch (error) {
            console.error('Failed to create profile:', error);
            throw error;
        }
    }, [URL]);
    
    return createProfile;
}