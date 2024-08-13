import useMediaQuery from "./useMediaQuery";

export default function useBreakPoint() {
	return { isMobile: useMediaQuery("(width < 744px)"), isTablet: useMediaQuery("(744px <= width < 1200px)"), isDesktop: useMediaQuery("(1200px <= width)") };
}
