import axios from 'axios';

export const getStudents = async (uids) => {
    // Crea una instancia de URLSearchParams
    const params = new URLSearchParams();

    // Agrega cada uid al objeto de parámetros
    uids.forEach(uid => {
        params.append('user_ids', uid);
    });

    // Realiza la solicitud GET con los parámetros de consulta dinámicos
    const response = await axios.get(`http://127.0.0.1:8000/students/`, { params });
    
    return response;
};