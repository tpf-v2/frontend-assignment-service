// BackgroundContainer.js
import React from 'react';
import { styled } from '@mui/system';
import fiubaLogo from '../../assets/Logo-fiuba_big_face.png'; 

const StyledBackgroundContainer = styled('div')({
  backgroundImage: `url(${fiubaLogo})`,
  backgroundRepeat: 'repeat',
  backgroundSize: '200px 200px',
  position: 'fixed', // Cambié a 'fixed' para que el fondo cubra toda la pantalla
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0.1, // Ajusta la opacidad según lo desees
  zIndex: -1, // Asegúrate de que el fondo esté detrás del contenido
});

const BackgroundContainer = () => {
  return <StyledBackgroundContainer />;
};

export default BackgroundContainer;