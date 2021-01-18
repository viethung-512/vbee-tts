import { useState, useEffect } from 'react';

function usePromiseSubscription<T>(
  promiseOrFunction: (...args: any[]) => Promise<T>,
  defaultValue: T
) {
  const [state, setState] = useState({
    value: defaultValue,
    error: null,
    isPending: true,
  });

  useEffect(() => {
    const promise =
      typeof promiseOrFunction === 'function'
        ? promiseOrFunction()
        : promiseOrFunction;

    let isSubscribed = true;
    promise
      .then(value =>
        isSubscribed ? setState({ value, error: null, isPending: false }) : null
      )
      .catch(error =>
        isSubscribed
          ? setState({ value: defaultValue, error: error, isPending: false })
          : null
      )
      .finally(() => {});

    return () => {
      isSubscribed = false;
    };
  }, [promiseOrFunction, defaultValue]);

  const { value, error, isPending } = state;

  return { value, error, isPending };
}

export default usePromiseSubscription;
