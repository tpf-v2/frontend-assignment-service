import { styled } from '@mui/system';
import { Typography} from '@mui/material';
export const TitleSimple = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
}));

export const Title = styled(Typography)(({ theme }) => ({
  marginBottom: 0,
  color: "#0072C6",
  textAlign: "center",
  fontSize: "2rem",
  fontWeight: "bold",
  flexGrow: 1,
}));

export const TitleTop = styled(Typography)(({ theme }) => ({
  color: "#0072C6",
  textAlign: "center",
  fontSize: "1rem",
  fontWeight: "bold",
  flexGrow: 1,
  overflowWrap: "break-word",
}));
  

export const TitleSpaced = styled(Typography)(({ theme }) => ({
marginBottom: theme.spacing(2),
color: "#0072C6",
textAlign: "center",
fontSize: "2rem",
fontWeight: "bold",
}));

export const ShadowTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0),
  color: '#0072C6',
  textAlign: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
}));

export const FlexGrowTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  color: '#0072C6',
  textAlign: 'center',
  fontSize: '2rem',
  fontWeight: 'bold',
  flexGrow: 1, // Asegura que ocupa todo el espacio
}));
