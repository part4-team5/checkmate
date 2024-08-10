import { useEffect, useState } from "react";

export default function useMediaQuery(media: string) {
	//
	// due to a hydration mismatch
	// the initial value must be updated
	// after the very first render occurs
	//
	const [matches, setMatches] = useState(false);

	useEffect(() => {
		const MediaQuery = window.matchMedia(media);
		//
		// initial update
		//
		setMatches(MediaQuery.matches);
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		function handle(event: MediaQueryListEvent) {
			setMatches(MediaQuery.matches);
		}

		MediaQuery.addEventListener("change", handle);
		return () => MediaQuery.removeEventListener("change", handle);
	}, [media]);

	return matches;
}
