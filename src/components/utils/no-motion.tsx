// Disable all framer-motion animations
export const noMotionProps = {
  initial: false,
  animate: false,
  exit: false,
  transition: { duration: 0 },
  variants: undefined
};

// Wrapper to disable motion
export const NoMotion = ({ children }: { children: React.ReactNode }) => {
  return <div style={{ all: 'unset' }}>{children}</div>;
};