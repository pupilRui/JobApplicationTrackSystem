const API_BASE_URL = 'http://localhost:8080';

export const login = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    });
    return response.json();
};

export const register = async (username, password) => {
    // console.log("registering!!!!!!!!!!!!!!")
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
    });
    return response.json();
};

export const logout = async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST', // or GET, depending on your backend setup
        credentials: 'include'
    });
};
