import { styled } from '@mui/system';
import { Card } from '@mui/material';

export const AddCardStyled = styled(Card)(({ theme }) => ({
    width: '200px',
    height: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    border: '2px dashed #bbb',
    backgroundColor: '#f8f8f8',
    cursor: 'pointer',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  }));