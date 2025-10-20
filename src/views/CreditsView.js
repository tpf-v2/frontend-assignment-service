import React from 'react';
import { Typography, Link, Card, CardContent, Avatar, Stack, Box, Divider, Button } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Credits() {
  const navigate = useNavigate();
  
  const teams = [
    {
      period: "1º y 2º cuatrimestre 2024",
      description: 'Desarrollo inicial del sistema',
      members: [
        { name: 'Alejo Villores', github: 'https://github.com/alejovillores', linkedin: 'https://www.linkedin.com/in/alejo-villores-0050331b9/' },
        { name: 'Victoria Abril Lopez', github: 'https://github.com/vickyylopezz', linkedin: 'https://www.linkedin.com/in/victoria-abril-lopez/' },
        { name: 'Ivan Pfaab', github: 'https://github.com/ivanpfaab', linkedin: 'https://www.linkedin.com/in/ivan-pfaab/' },
        { name: 'Celeste Dituro', github: 'https://github.com/celedituro', linkedin: 'https://www.linkedin.com/in/celeste-dituro/' }
      ],
      tutor_gender_string: "Tutor",
      tutor: "Mg. Ing. Carlos Fontela",
    },
    {
      period: "1º y 2º cuatrimestre 2025",
      description: 'Mejoras y nuevas funcionalidades',
      members: [
        { name: 'Maria Fernanda Pont Tovar', github: 'https://github.com/Maferep', linkedin: '' },
        { name: 'Roberto Dario Seminara', github: 'https://github.com/tario', linkedin: '' },
        { name: 'Aldana Lescano Maier', github: 'https://github.com/Aldy09', linkedin: '' },
        { name: 'Joaquín Emanuel Hetrea', github: 'https://github.com/JoaquinHetrea', linkedin: '' },
      ],
      tutor_gender_string: "Tutora",
      tutor: "Ing. Maia Naftali",
    }
  ];

  return (
    <Box
      sx={{
        padding: '40px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          size="medium"
          variant="contained"
          sx={{ 
            position: 'absolute', 
            left: 20, 
            top: "40px", 
            zIndex: 1,
            backgroundColor: 'white',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'grey.100'
            }
          }}
        >
          Volver
        </Button>
      <Card
        sx={{
          maxWidth: 750,
          width: '100%',
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <CardContent>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            Créditos
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" paragraph sx={{ fontStyle: 'italic' }}>
            Este sitio web fue desarrollado como parte del Trabajo Profesional de Ingeniería en Informática en la Facultad de Ingeniería (UBA).
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" color="primary" align="center" gutterBottom>
            Contribuidores
          </Typography>

          <Stack spacing={3} sx={{ mt: 4, mx: 4 }}>
            {teams.map((team, teamIndex) => (
            <>
              <Box key={teamIndex} sx={{ mb: 5 }}>
                {teamIndex > 0 && <Divider sx={{ my: 3, opacity: 0.6 }} />}
                <Typography variant="h6" color="textPrimary" align="center" gutterBottom>
                  {team.period} {team.year}
                </Typography>
                <Typography variant="body1" color="textSecondary" align="center" sx={{ mb: 2 }}>
                  {team.description}
                </Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  {team.members.map((member, memberIndex) => (
                    <Box
                      key={memberIndex}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: '8px',
                        transition: 'background 0.3s ease',
                        '&:hover': { backgroundColor: grey[200] },
                      }}
                    >
                      <Avatar sx={{ bgcolor: blue[500], mr: 2 }}>{member.name[0]}</Avatar>
                      <Box>
                        <Typography variant="body1" color="textPrimary" sx={{ fontWeight: 500 }}>
                          {member.name}
                        </Typography>
                        <Typography variant="body2" color="primary">
                          <Link href={member.github} target="_blank" color="primary" underline="hover">
                            GitHub
                          </Link>
                          {' | '}
                          <Link href={member.linkedin} target="_blank" color="primary" underline="hover">
                            LinkedIn
                          </Link>
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" color="textPrimary" align="center" sx={{ mt: 3 }}>
                {team.tutor_gender_string}
              </Typography>
              <Typography variant="body1" color="textPrimary" align="center" sx={{ fontWeight: 500 }}>
                {team.tutor}
              </Typography>
            </>
            ))}
          </Stack>
          
        </CardContent>
      </Card>
    </Box>
  );
}

export default Credits;
