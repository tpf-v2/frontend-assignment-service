import axios from 'axios';
import { setToken, setUser } from "../redux/userSlice";

export function parseJwt(token) {
    // Dividir el token en sus tres partes: header, payload y firma
    var base64Url = token.split('.')[1];
    // Reemplazar caracteres de URL por los correspondientes de base64 y decodificar
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    // Parsear y retornar el JSON
    return JSON.parse(jsonPayload);
}
export const authenticateUser = (email, password) => async (dispatch) =>
    {
    try {
        const response = await axios.post('http://127.0.0.1:8000/connect', new URLSearchParams({
            username: email,
            password: password,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        const data = parseJwt(response.data.access_token).sub
        const userData = {
            id: data.id,
            name: data.name,
            last_name: data.last_name,
            role: data.role,
            email: email,
            token: response.data.access_token
        }
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
