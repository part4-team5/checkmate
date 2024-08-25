import useMediaQuery from "./useMediaQuery";

export default function useBreakPoint() {
	return { isMobile: useMediaQuery("(width < 768px)"), isTablet: useMediaQuery("(768px <= width < 1200px)"), isDesktop: useMediaQuery("(1200px <= width)") };
}
