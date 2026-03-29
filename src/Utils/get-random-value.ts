
export const getRandomValue = (
  min: number = 0, 
  max: number = 1000000
): number => {
  // Ensure min is actually smaller than max to avoid errors
  const start = Math.min(min, max);
  const end = Math.max(min, max);
  
  return Math.floor(Math.random() * (end - start + 1)) + start;
};


