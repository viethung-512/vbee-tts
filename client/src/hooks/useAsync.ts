import { useRef } from 'react';

const useAsync = () => {
  const ref = useRef(null);

  const startLoading = () => {
    if (ref && ref.current) {
      // @ts-ignore
      ref.current.continuousStart();
    }
  };

  const endLoading = () => {
    if (ref && ref.current) {
      // @ts-ignore
      ref.current.complete();
    }
  };

  return { ref, startLoading, endLoading };
};

export default useAsync;
