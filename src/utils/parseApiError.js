const parseApiError = (error) => {
    if (!error || !error.message) {
        return "Something went wrong. Please try again.";
    }

    if (!error.response || !error.response.data) {
        return error.message || "Something went wrong. Please try again.";
    }
    const data = error.response.data

    if (typeof data === 'string') {
        return data;
    }

    if (typeof data.error === 'string') {
        return data.error;
    }

    if (Array.isArray(data.non_field_errors)) {
        return data.non_field_errors[0];
    }

    if (data === Object.keys(data)) {
        const keys = Object.keys(data);
        if (Array.isArray(data[keys[0]])) {
            return data[keys[0]][0];
        }
        if (typeof data[keys[0]] === 'string') {
            return data[keys[0]];
        }
    }
    
    return "An unexpected error occurred.";
}

export default parseApiError