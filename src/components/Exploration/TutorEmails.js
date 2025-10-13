import React, { useState, useEffect } from "react";
import { Typography, Container, Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import MySnackbar from "../UI/MySnackBar";
import { Root, Title } from "../../components/Root";
import { getTutorsData } from "../../api/dashboardStats";

const TutorEmails = () => {
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(false);  

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {    
    const fetchTutors = async () => {
      if (!user || !period) return null;
      try {
        setLoading(true);
        // Obtenemos tutores y ordenamos en orden alfabético
        const fetchedTutors = await getTutorsData(period.id, user);
        const sortedTutors = fetchedTutors.sort((a, b) => a.last_name.localeCompare(b.last_name));
        setTutors(sortedTutors);
      } catch (error) {
        console.error("Error al obtener tutores", error);
        setNotification({
          open: true,
          message:
            "Error al obtener tutores",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchTutors();
  }, [user, period]);

  if (loading)
    return (
        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="300px"
        >
        <CircularProgress />
        </Box>
  );

  return (
    <Container maxWidth="xs">
      <Root>
        <Title variant="h5" align="center">
          Tutores {period.id}<br />
          Mail de Contacto
          </Title>
        {tutors?.map((tutor) => (
          <Box key={tutor?.id} sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>            
            <Box
              sx={{ 
                display: 'flex', 
                gap: 2,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">               
                {tutor?.name} {tutor?.last_name}
              </Typography>
                            
            </Box>

            <Typography variant="body1">{tutor?.email}</Typography>            
          </Box>        
        ))}
                      
      </Root>  
      
      <MySnackbar
        open={notification.open}
        handleClose={handleSnackbarClose}
        message={notification.message}
        status={notification.status}
      />
    </Container>
  );
  
};

export default TutorEmails;
