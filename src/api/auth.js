import axios from 'axios';
import { setUser } from "../redux/slices/userSlice";

const BASE_URL = process.env.REACT_APP_API_URL;

export function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

export const authenticateUser = (email, password) => async (dispatch) => {
    try {
        const response = await axios.post(`${BASE_URL}/connect`, new URLSearchParams({
            username: email,
            password: password,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        const decodedToken = parseJwt(response.data.access_token);
        const data = decodedToken.sub;

        // Obtener el tiempo de expiración del token
        const expirationTime = decodedToken.exp * 1000; // Convertir de segundos a milisegundos

        const userData = {
            id: data.id,
            name: data.name,
            last_name: data.last_name,
            role: data.role,
            email: email,
            token: response.data.access_token,
            expirationTime // Almacena el tiempo de expiración
        };

        // Guarda el usuario y el token en Redux
        dispatch(setUser(userData));

        return data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.detail || 'Error al iniciar sesión');
        } else {
            throw new Error('Error de red o del servidor');
        }
    }
}

export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}/request-password-reset`, { email });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.detail || 'Error al solicitar recuperación de contraseña');
        } else {
            throw new Error('Error de red o del servidor');
        }
    }
};

export const resetPasswordWithToken = async (password, token) => {
    try {
        const response = await axios.post(`${BASE_URL}/reset-password-confirm`, { password, token });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.detail || 'Error al restablecer contraseña. El token puede haber expirado.');
        } else {
            throw new Error('Error de red o del servidor');
        }
    }
};
