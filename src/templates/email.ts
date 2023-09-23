export const getActiveAccountEmailTemplate = (token: string): string => {
  return `http://54.225.89.18:8080/api/auth/active/${token}`;
};
