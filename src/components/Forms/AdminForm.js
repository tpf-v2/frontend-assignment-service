import { Container, Typography, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { ButtonSimple } from '../Root';
const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
  textAlign: 'center',
}));

const ButtonStyled = ButtonSimple;

const AdminForm = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Root>
        <Typography variant="h5">Admin Dashboard</Typography>
        <Box>
          <ButtonStyled
            variant="contained"
            color="primary"
            onClick={() => navigate('/admin-add-topic')}
          >
            Agregar Nuevo Tema
          </ButtonStyled>
          <ButtonStyled
            variant="contained"
            color="primary"
            onClick={() => navigate('/admin-add-corrector')}
          >
            Agregar Tutor
          </ButtonStyled>
        </Box>
      </Root>
    </Container>
  );
};

export default AdminForm;