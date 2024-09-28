import React, { useEffect, useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import Phase from "../../Student/Phase";
import MySnackbar from "../../../MySnackBar";
import { styled } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { getGroupById } from "../../../../../api/getGroupById";

// Estilos
const ContainerStyled = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  border: "1px solid #ccc",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffffff",
  marginTop: theme.spacing(5),
  width: "100%",
  height: "100%"
}));

const TutorGroupLearningPath = ({group_id }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [milestones, setMilestones] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    status: "",
  });

  const handleSnackbarClose = () => {
    setNotification({ ...notification, open: false });
  };

  useEffect(() => {
    const fetchGroupAnswer = async () => {
      try {
        console.log("user: ", user)
        console.log("group_id: ", group_id)
        const group = await dispatch(getGroupById(user, group_id));

        setMilestones([
          {
            phase: "Anteproyecto",
            tasks: [
              { title: "Entregado", completed: group.pre_report_date ? true : false },
              { title: "Aprobado", completed: group.pre_report_approved ? true : false },
            ],
          },
          {
            phase: "Entrega intermedia",
            tasks: [
              { title: "Entregado", completed: group.intermediate_assigment_date ? true : false },
              { title: "Aprobado", completed: group.intermediate_assigment_approved ? true : false },
            ],
          },
        ]);
      } catch (error) {
        console.error(`Error when getting group ${group_id} by id: `, error);
      }
    };

    fetchGroupAnswer();
  }, []);

  return (
    <Container maxWidth="lg">
      <ContainerStyled>
        <Typography variant="h4" align="center" gutterBottom>
          Group {group_id}
        </Typography>
        <Box>
          {milestones.map((phase, index) => (
            <Phase
              key={index}
              phase={phase.phase}
              tasks={phase.tasks}
              circle={false}
            />
          ))}
        </Box>
      </ContainerStyled>
      <MySnackbar
        open={notification.open}
        handleClose={handleSnackbarClose}
        message={notification.message}
        status={notification.status}
      />
    </Container>
  );
};

export default TutorGroupLearningPath;