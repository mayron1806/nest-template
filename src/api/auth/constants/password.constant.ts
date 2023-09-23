export const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]/;
// tempo em minutos para link de reset expurar
export const expires_in_reset_password = 1000 * 60 * 30; // 30 minutes
export const password_lenght = {
  min: 5,
  max: 50,
};
