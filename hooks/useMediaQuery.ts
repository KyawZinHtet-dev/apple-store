import { useEffect, useState } from "react";
export default function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const onChangeHandler = () => setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChangeHandler);
    return () => mediaQuery.removeEventListener("change", onChangeHandler);
  }, [query]);

  return matches;
}
