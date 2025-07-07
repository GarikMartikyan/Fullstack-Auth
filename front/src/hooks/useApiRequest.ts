import { useEffect, useState } from 'react';
import { useMessage } from '../contexts/MessageContext.tsx';

type ApiFn<T> = () => Promise<T>;

interface UseApiRequestResult<T> {
  data: T | null;
  error: unknown;
  isLoading: boolean;
  isSuccess: boolean;
  refetch: () => void;
}

export function useApiRequest<T>(
  apiFn: ApiFn<T>,
  { skip = false }: { skip?: boolean } = {},
): UseApiRequestResult<T> {
  const { error: errorMessage } = useMessage();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const fetch = async () => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const result = await apiFn();
      setData(result);
      setIsSuccess(true);
    } catch (err) {
      errorMessage('Something went wrong');
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!skip) {
      fetch();
    }
  }, [skip]);

  return {
    data,
    error,
    isLoading,
    isSuccess,
    refetch: fetch,
  };
}
