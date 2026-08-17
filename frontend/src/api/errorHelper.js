
export function getErrorMessage(err) {
  if (err.response && err.response.data) {
    if (err.response.data.error) return err.response.data.error;
    if (err.response.data.message) return err.response.data.message;
  }
  if (err.message) {
    return err.message;
  }
  return 'Something went wrong. Please try again.';
}
