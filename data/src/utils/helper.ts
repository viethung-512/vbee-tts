export const getPercent = ({
  total,
  current,
}: {
  total: number;
  current: number;
}) => {
  if (total <= 0 || total < current) return 0;
  return Math.round((current / total) * 100);
};
