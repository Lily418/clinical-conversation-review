import { useCallback, useEffect, useState } from "react";

export const useLocationHash = () => {
    const [locationHash, setLocationHash] = useState(() => window.location.hash);

    const hashChangeHandler = useCallback(() => {
        setLocationHash(window.location.hash);
    }, []);

    useEffect(() => {
      window.addEventListener('hashchange', hashChangeHandler);
      return () => {
        window.removeEventListener('hashchange', hashChangeHandler);
      };
    }, [hashChangeHandler]);
    
    return [locationHash]
  };