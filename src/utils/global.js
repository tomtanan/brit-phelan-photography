let parallaxLock = false;

export const setParallaxLock = (state) => {
  parallaxLock = state; // Update the lock
};

export const getParallaxLock = () => {
  return parallaxLock; // Retrieve the current lock state
};