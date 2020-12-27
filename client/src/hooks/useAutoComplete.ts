// import { PaginateResponse } from '@tts-dev/common';
import { useEffect, useState } from 'react';
import useDebounce from './useDebounce';

function useAutoComplete<T>(
  query: (...args: any[]) => Promise<any>,
  skip: boolean = false
) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchData, setSearchData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    let active = true;

    const fetchData = async (term: string) => {
      setLoading(true);
      const result = await query({ search: term, page: 0, limit: 10 });

      setSearchData(result.docs);
      setLoading(false);
    };

    if (active && !skip) {
      fetchData(debounceSearchTerm);
    }

    return () => {
      active = false;
    };
  }, [debounceSearchTerm, skip, query]);

  return {
    setSearchTerm,
    setSearchData,
    searchData,
    loading,
  };
}

export default useAutoComplete;
