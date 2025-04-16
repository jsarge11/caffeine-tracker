export const getSleepMgCombo = (sleepMgCombo) => {
  const [hours, mg] = sleepMgCombo.split("_");
  return { hours, mg };
};
