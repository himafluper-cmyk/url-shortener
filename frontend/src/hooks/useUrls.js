import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useUrls = (params = {}) =>
  useQuery({
    queryKey: ['urls', params],
    queryFn: async () => {
      const { data } = await api.get('/urls', { params });
      return data;
    },
    staleTime: 30_000,
  });

export const useUrl = (id) =>
  useQuery({
    queryKey: ['url', id],
    queryFn: async () => {
      const { data } = await api.get(`/urls/${id}`);
      return data;
    },
    enabled: !!id,
  });

export const useDashboardStats = () =>
  useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/urls/stats');
      return data.data;
    },
    staleTime: 60_000,
  });

export const useCreateUrl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post('/urls', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to shorten URL'),
  });
};

export const useDeleteUrl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/urls/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('URL deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Delete failed'),
  });
};

export const useUpdateUrl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => api.patch(`/urls/${id}`, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['url', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['urls'] });
      toast.success('URL updated');
    },
  });
};
