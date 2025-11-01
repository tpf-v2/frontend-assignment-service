import React, { useState, useEffect } from "react";
import { Typography, Container, Box, CircularProgress, Button, Link, Alert } from "@mui/material";
import { useSelector } from "react-redux";
import MySnackbar from "../UI/MySnackBar";
import { Root, Title } from "../../components/Root";
import { getPeriodIdeas, editIdeaContent, editIdeaStatus } from "../../api/ideas";
import { EditIdeaModal, EditType } from "./EditIdeaModal";
import SubmitButton from "../../components/Buttons/SubmitButton";
import { EditButton } from "../Buttons/CustomButtons"
import { useNavigate } from "react-router-dom";
import { getGroupByIdSimple } from "../../api/getGroupById";

const ExploreIdeas = () => {
  const navigate = useNavigate();
  const handleNavigation = (url) => {
    navigate(url);
  };
  const user = useSelector((state) => state.user);
  const period = useSelector((state) => state.period);

  const [ideas, setIdeas] = useState([]);
  const [userRoleAndPeriod, setUserRoleAndPeriod] = useState(undefined);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingIdea, setEditingIdea] = useState();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openStatusModal, setOpenChangeStatusModal] = useState(false);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    const getUserRole = async () => {
      if (!user || !period) return null;

      if (user.temporal_role === 'student') {
        setUserRoleAndPeriod({role: 'student', period_id: user.period_id});
      } else {
        setUserRoleAndPeriod({role: 'tutor', period_id: period.id}); // aux: distinguir entre admin y tutor ]
      }
        
    };

    getUserRole();
  }, [user, period]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        if (!period || !user || !userRoleAndPeriod) return null;
        console.log("--- period:", period);
        setLoading(true);
        const response = await getPeriodIdeas(userRoleAndPeriod.period_id, user);
        setIdeas(response);
        // Obtener equipo para usarlo en los botones
        if (user.temporal_role === 'student' && !!user.group_id && user.group_id !== 0) {
          const team = await getGroupByIdSimple(user, user.group_id);
          setTeam(team);
        }
      } catch (error) {
        console.error("Error al obtener las ideas del cuatrimestre", error);
        setNotification({
          open: true,
          message:
            "Error al obtener las ideas del cuatrimestre",
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [user, userRoleAndPeriod]);

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

  const isMyIdea = (idea) => {
    return idea.student_id === user.id;
  }

  const handleEditIdea = async (handleCloseModal, editType) => {
    try {      
      // Hago request
      let ideaResult;
      if (editType === EditType.CONTENT) {
        ideaResult = await editIdeaContent(editingIdea, period.id, user);
      } else if (editType === EditType.STATUS) {
        ideaResult = await editIdeaStatus(editingIdea, period.id, user);        
      }
      // Adapto lista inmediatamente, con su resultado
      setIdeas((prevData) =>
        prevData.map((prevIdea) => (prevIdea.id === editingIdea.id ? ideaResult : prevIdea))
      )
      setNotification({
        open: true,
        message: `Se editó idea exitosamente`,
        status: "success",
      });
      handleCloseModal();
    } catch (error) {
      console.error("Error al editar idea", error);
      setNotification({
        open: true,
        message:
          "Error al editar idea",
        status: "error",
      });
    }
  }

  return (
    <Container maxWidth="md">
      <Root>
        <Title variant="h5" align="center">Ideas</Title>
        <Typography>
        En este espacio se pueden ver las ideas propuestas por estudiantes de este cuatrimestre.
        Se muestra email de autores de las ideas, para facilitar el contacto para el armado de equipos.
        Si se obtiene la aprobación de un/a tutor/a, luego, de querer elegirla se debe completar el formulario de equipos
        indicando la opción "Ya tengo tema y tutor".
        </Typography>
        {/* Si no hay ideas */}  
        {ideas?.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Aún no hay ideas propuestas por estudiantes este cuatrimestre.
          </Alert>
        )}
        {/* Botones para estudiantes*/}
        {user.temporal_role === 'student' &&
          <SubmitButton
            url="/propose-idea"
            title="Proponer Idea"
            width="100%"
            handleSubmit={() => handleNavigation("/propose-idea")}
            disabled={team && team.pre_report_date == null}
          /> // [VER]: en este punto no tienen equipo! --> Ok, y da disabled=false, correcto.
        }
        <SubmitButton
          url="/public"
          title="Ver proyectos anteriores"
          width="100%"
          handleSubmit={() => handleNavigation("/public")}
          //disabled={team && team.pre_report_date == null} // Aux: me parece que siempre pueden verlos, no hay condición
          variant='outlined'
        />
        {/* Renderizado de ideas */}
        {ideas?.map((idea) => (
          <Box key={idea?.id} sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 2}}>
            {/* Botón en mismo renglón que título */}
            <Box
              sx={{ 
                display: 'flex', 
                gap: 2,
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'                
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">               
                {idea?.title}
              </Typography>
              
              {isMyIdea(idea) && (
                <EditButton
                  onClick={() => {
                    setEditingIdea(idea);
                    setOpenEditModal(true)
                  }}
                  sx={{ml: "auto"}} // a la derecha
                />
              )}
            </Box>

            <Typography variant="body1">{idea?.description}</Typography>
            
            <Typography variant="body2" mt={1}>
              Propuesta por: {idea?.student?.name} {idea?.student?.last_name} ({idea?.student?.email})
            </Typography>
            <Typography variant="body2">
              Equipo: {idea?.full_team ? "Completo" : "Aún buscando integrantes"} {""}
              {isMyIdea(idea) && (
                <Link
                  component="span"
                  onClick={() => {setEditingIdea(idea); setOpenChangeStatusModal(true)}}
                  underline="always"
                  sx={{ color: "grey", fontWeight: "bold", cursor: "pointer"}}
                >
                  Cambiar
                </Link>
              )}
            </Typography>
          </Box>        
        ))}
                      
      </Root>
      {/* Modals para editar el contenido y el full_team */}

      <EditIdeaModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        data={editingIdea}
        setData={setEditingIdea}
        
        handleConfirm={handleEditIdea}
        
        editType={EditType.CONTENT}
        titleText={"Editar"}
        okButtonText={"Guardar"}
      />

      <EditIdeaModal
        open={openStatusModal}
        setOpen={setOpenChangeStatusModal}
        data={editingIdea}
        setData={setEditingIdea}
        
        handleConfirm={handleEditIdea}
        
        editType={EditType.STATUS}
        titleText={"Cambiar Estado de"}
        okButtonText={"Confirmar"}
      />
      
      
      <MySnackbar
        open={notification.open}
        handleClose={handleSnackbarClose}
        message={notification.message}
        status={notification.status}
      />
    </Container>
  );
  
};

export default ExploreIdeas;
