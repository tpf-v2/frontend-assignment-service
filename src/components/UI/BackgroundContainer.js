import React from 'react';
import { styled } from '@mui/system';
import fiubaImg from '../../assets/backgroundFiuba.png'; 

const StyledBackgroundContainer = styled('div')({
  backgroundImage: `url(${fiubaImg})`,
  backgroundRepeat: 'no-repeat', // Evitar que la imagen se repita
  backgroundSize: 'cover', // Cubrir toda el área disponible
  position: 'fixed', // Mantener el fondo fijo
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  opacity: 0.8, // Ajusta la opacidad según sea necesario
  zIndex: -1, // Asegúrate de que el fondo esté detrás del contenido
});

const BackgroundContainer = () => {
  return <StyledBackgroundContainer />;
};

export default BackgroundContainer;