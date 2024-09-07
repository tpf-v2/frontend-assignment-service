import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import StudentInfo from './StudentInfo'; // Asegúrate de importar el nuevo componente
import Phase from './Phase';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getFormAnswersById } from '../../../../api/getFormAnswersById';

const LearningPath = () => {
    const { cuatrimestre } = useParams();
    const user = useSelector((state) => state.user);
    const [milestones, setMilestones] = useState([]);
  
    useEffect(() => {
      const fetchGroupAnswer = async () => {
        try {
          const response = await getFormAnswersById(user);
          const groupCount = response.data.length;
  
          setMilestones([
            {
              phase: 'Formulario Completo',
              tasks: [
                { title: 'Formulario enviado', completed: groupCount > 0 },
                { title: 'Grupo asignado', completed: groupCount >= 1 },
                { title: 'Tutor asignado', completed: groupCount >= 1 },
              ],
            },
            {
              phase: 'Anteproyecto',
              tasks: [
                { title: 'Borrador entregado', completed: false },
                { title: 'Revisar retroalimentación', completed: false },
              ],
            },
            {
              phase: 'Entrega Intermedia',
              tasks: [
                { title: 'Proyecto finalizado', completed: false },
                { title: 'Enviar para evaluación', completed: false },
              ],
            },
          ]);
        } catch (error) {
          console.error('Error al obtener las respuestas', error);
        }
      };
  
      fetchGroupAnswer();
    }, [user]);
  
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', mt: 5 }}>
        <Box sx={{ flex: 1, mr: 8, mt: 9 }}> {/* Añadir margen superior para centrar con la fase */}
          <StudentInfo user={user} />
        </Box>
        <Box sx={{ flex: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            {cuatrimestre || '2C2024'} - Progreso del Estudiante
          </Typography>
          <Box>
            {milestones.map((phase, index) => (
              <Phase key={index} phase={phase.phase} tasks={phase.tasks} />
            ))}
          </Box>
        </Box>
      </Container>
    );
  };
  
  export default LearningPath;