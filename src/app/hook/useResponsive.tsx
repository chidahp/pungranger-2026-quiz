import { useEffect, useState } from "react";

type ResponsiveState = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

const BREAKPOINT_MOBILE = 768;
const BREAKPOINT_TABLET = 990;

export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setState({
        isMobile: width < BREAKPOINT_MOBILE,
        isTablet: width >= BREAKPOINT_MOBILE && width < BREAKPOINT_TABLET,
        isDesktop: width >= BREAKPOINT_TABLET,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return state;
};