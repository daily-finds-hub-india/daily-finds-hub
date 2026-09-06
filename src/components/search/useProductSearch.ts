'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type SearchProduct = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
};

export type SearchCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

interface SearchResponse {
  success: boolean;
  products?: SearchProduct[];
  categories?: SearchCategory[];
  message?: string;
}

interface SearchResults {
  query: string;
  products: SearchProduct[];
  categories: SearchCategory[];
  error: string | null;
}

interface UseProductSearchResult {
  query: string;
  setQuery: (value: string) => void;
  normalizedQuery: string;
  products: SearchProduct[];
  categories: SearchCategory[];
  isLoading: boolean;
  error: string | null;
  clearSearch: () => void;
}

const emptyResults: SearchResults = {
  query: '',
  products: [],
  categories: [],
  error: null
};

export function useProductSearch(): UseProductSearchResult {
  const [query, setQueryState] = useState('');
  const [results, setResults] = useState<SearchResults>(emptyResults);

  const [isLoading, setIsLoading] = useState(false);

  const timeoutRef = useRef<number | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const normalizedQuery = query.trim();

  const cancelPendingSearch = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  const search = useCallback(
    (searchQuery: string) => {
      cancelPendingSearch();

      if (!searchQuery) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      timeoutRef.current = window.setTimeout(async () => {
        timeoutRef.current = null;

        const controller = new AbortController();

        controllerRef.current = controller;

        try {
          const response = await fetch(
            `/api/search?q=${encodeURIComponent(searchQuery)}`,
            {
              signal: controller.signal
            }
          );

          const data: SearchResponse = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.message || 'Failed to search products.');
          }

          setResults({
            query: searchQuery,
            products: Array.isArray(data.products) ? data.products : [],
            categories: Array.isArray(data.categories) ? data.categories : [],
            error: null
          });
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') {
            return;
          }

          setResults({
            query: searchQuery,
            products: [],
            categories: [],
            error:
              error instanceof Error
                ? error.message
                : 'Failed to search products.'
          });
        } finally {
          if (controllerRef.current === controller) {
            controllerRef.current = null;
            setIsLoading(false);
          }
        }
      }, 200);
    },
    [cancelPendingSearch]
  );

  const setQuery = useCallback(
    (value: string) => {
      setQueryState(value);

      const nextQuery = value.trim();

      if (!nextQuery) {
        cancelPendingSearch();

        setResults(emptyResults);
        setIsLoading(false);

        return;
      }

      search(nextQuery);
    },
    [cancelPendingSearch, search]
  );

  const clearSearch = useCallback(() => {
    cancelPendingSearch();
    setQueryState('');
    setResults(emptyResults);
    setIsLoading(false);
  }, [cancelPendingSearch]);

  useEffect(() => {
    return () => {
      cancelPendingSearch();
    };
  }, [cancelPendingSearch]);

  const hasMatchingResults =
    normalizedQuery !== '' && results.query === normalizedQuery;

  return {
    query,
    setQuery,
    normalizedQuery,

    products: hasMatchingResults ? results.products : [],

    categories: hasMatchingResults ? results.categories : [],

    isLoading: normalizedQuery !== '' && isLoading,

    error: hasMatchingResults ? results.error : null,

    clearSearch
  };
}
