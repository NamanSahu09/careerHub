/**
 * The backend always responds to errors with { success:false, code, message, errors }.
 * This turns any axios error (including network failures where there's no
 * response at all) into that same shape so calling code never has to branch
 * on whether it was a validation error vs. a network error.
 */
export function parseApiError(err) {
  const data = err?.response?.data;
  if (data) {
    return {
      status: err.response.status,
      code: data.code || "UNKNOWN_ERROR",
      message: data.message || "Something went wrong",
      errors: data.errors || [],
    };
  }
  return {
    status: 0,
    code: "NETWORK_ERROR",
    message: "Can't reach the server. Is the backend running?",
    errors: [],
  };
}

/** Maps a backend `errors: [{ field, message }]` array to { field: message } for form display. */
export function fieldErrorMap(errors = []) {
  return errors.reduce((acc, e) => {
    acc[e.field] = e.message;
    return acc;
  }, {});
}
