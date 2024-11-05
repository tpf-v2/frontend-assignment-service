import React from 'react';
import { Typography, Link, Card, CardContent, Avatar, Stack, Box, Divider } from '@mui/material';
import { blue, grey } from '@mui/material/colors';

function Credits() {
  const teamMembers = [
    { name: 'Alejo Villores', github: 'https://github.com/alejovillores', linkedin: 'https://www.linkedin.com/in/alejo-villores-0050331b9/' },
    { name: 'Victoria Abril Lopez', github: 'https://github.com/vickyylopezz', linkedin: 'https://www.linkedin.com/in/victoria-abril-lopez/' },
    { name: 'Ivan Pfaab', github: 'https://github.com/ivanpfaab', linkedin: 'https://www.linkedin.com/in/ivan-pfaab/' },
    { name: 'Celeste Dituro', github: 'https://github.com/celedituro', linkedin: 'https://www.linkedin.com/in/celeste-dituro/' }
  ];

  return (
    <Box
      sx={{
        padding: '40px',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        sx={{
          maxWidth: 750,
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
          borderRadius: '16px',
        }}
      >
        <CardContent>
          <Typography variant="h4" align="center" color="primary" gutterBottom>
            Créditos
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" paragraph sx={{ fontStyle: 'italic' }}>
            Este sitio web fue desarrollado como parte de un Trabajo Profesional de Ingeniería en Informática en la Facultad de Ingeniería (UBA).
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" color="textPrimary" align="center" gutterBottom>
            Integrantes del equipo
          </Typography>

          <Stack spacing={2} sx={{ mt: 2, mx: 4 }}>
            {teamMembers.map((member, index) => (
              <Box
                key={index}
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
                  {/* Links para GitHub y LinkedIn (puedes descomentarlos cuando tengas las URLs) */}
                  <Typography variant="body2" color="primary">
                    <Link href={member.github} target="_blank" color="primary" underline="hover">
                      GitHub
                    </Link>{' '}
                    |{' '}
                    <Link href={member.linkedin} target="_blank" color="primary" underline="hover">
                      LinkedIn
                    </Link>
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" color="textPrimary" align="center" sx={{ mt: 3 }}>
            Tutor
          </Typography>
          <Typography variant="body1" color="textPrimary" align="center" sx={{ fontWeight: 500 }}>
          Mg. Ing. Carlos Fontela
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Credits;
