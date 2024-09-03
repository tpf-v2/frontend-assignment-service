import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../redux/userSlice';

const TokenManager = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, expirationTime } = useSelector((state) => state.user);

  useEffect(() => {
    if (!token) return;

    const timeRemaining = expirationTime - Date.now();

    if (timeRemaining <= 0) {
      // El token ya expiró, borra y redirige a iniciar sesion
      dispatch(clearUser());
      navigate('/');
    } else {
      // Configura el setTimeout para borrar el token y redirigir cuando expire
      const timeoutId = setTimeout(() => {
        dispatch(clearUser());
        navigate('/');
      }, timeRemaining);

      // Limpia el timeout si el componente se desmonta o el token cambia
      return () => clearTimeout(timeoutId);
    }
  }, [dispatch, token, expirationTime, navigate]);

  return null; // Este componente no renderiza nada
};

export default TokenManager;
