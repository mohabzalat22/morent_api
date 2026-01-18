import { toast } from "sonner";

/**
 * Displays a toast notification based on the API response or error.
 *
 * @param {Object} response - The response object from the API or the error object.
 * @param {boolean} isError - Force treat as error (useful for catch blocks).
 */
export const showToast = (response, isError = false) => {
  if (!response) {
    toast.error("An unexpected error occurred.");
    return;
  }

  // Handle Axios error structure
  if (response.response && response.response.data) {
    response = response.response.data;
    isError = true;
  }

  const success = response.success === true && !isError;
  
  if (success) {
    toast.success(response.message || "Operation successful");
  } else {
    let message = response.message || "An error occurred";

    // Extract validation error if available
    if (response.errors && typeof response.errors === 'object') {
      const firstErrorKey = Object.keys(response.errors)[0];
      if (firstErrorKey && Array.isArray(response.errors[firstErrorKey])) {
        message = response.errors[firstErrorKey][0];
      }
    }

    toast.error(message);
  }
};
