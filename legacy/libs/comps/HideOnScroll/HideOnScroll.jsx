import { Slide, useScrollTrigger } from "@quimera/thirdparty";

function HideOnScroll({ children }) {
  // const { children, window } = props
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  // const trigger = useScrollTrigger({ target: window ? window() : undefined })
  // const trigger = useScrollTrigger({ target: window || undefined })
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default HideOnScroll;
