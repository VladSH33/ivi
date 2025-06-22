import { useRef, useEffect } from "react";

type UseObserverParams = {
  ref: React.RefObject<HTMLElement>;
  canLoad: boolean;
  isLoading: boolean;
  callback: () => void;
};

export const useObserver = ({
  ref,
  canLoad,
  isLoading,
  callback,
}: UseObserverParams): void => {
  const observer = useRef(null);
  useEffect(() => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();
    const cb: IntersectionObserverCallback = function (entries, observer) {
      if (entries[0].isIntersecting && canLoad) {
        callback();
      }
    };

    observer.current = new IntersectionObserver(cb);
    observer.current.observe(ref.current);
  }, [isLoading, canLoad, callback, ref]);
};
