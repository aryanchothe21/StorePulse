
function isValidName(name) {
  if (typeof name !== 'string') return false;
  const length = name.trim().length;
  return length >= 20 && length <= 60;
}


function isValidAddress(address) {
  if (typeof address !== 'string') return false;
  return address.trim().length > 0 && address.trim().length <= 400;
}

function isValidPassword(password) {
  if (typeof password !== 'string') return false;
  const lengthOk = password.length >= 8 && password.length <= 16;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return lengthOk && hasUppercase && hasSpecialChar;
}

function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

module.exports = {
  isValidName,
  isValidAddress,
  isValidPassword,
  isValidEmail,
};
