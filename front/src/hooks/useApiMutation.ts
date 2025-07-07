import { useCallback, useState } from 'react';
import { useMessage } from '../contexts/MessageContext.tsx';

type ApiFn<TArgs, TResult> = (args: TArgs) => Promise<TResult>;

interface UseApiMutationResult<TArgs, TResult> {
  mutate: (args: TArgs) => Promise<void>;
  data: TResult | null;
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  reset: () => void;
}

export function useApiMutation<TArgs, TResult>(
  apiFn: ApiFn<TArgs, TResult>,
): UseApiMutationResult<TArgs, TResult> {
  const { error: errorMessage } = useMessage();
  const [data, setData] = useState<TResult | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const mutate = useCallback(
    async (args: TArgs) => {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);
      try {
        const result = await apiFn(args);
        setData(result);
        setIsSuccess(true);
      } catch (err) {
        errorMessage('Something went wrong');
        setError(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFn, errorMessage],
  );

  const reset = () => {
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsSuccess(false);
  };

  return {
    mutate,
    data,
    error,
    isLoading,
    isSuccess,
    reset,
  };
}
