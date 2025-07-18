import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  ListItemText,
  DialogActions,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { makeEvaluator } from "../../../api/makeEvaluator";
import { unmakeEvaluator } from "../../../api/unmakeEvaluator";
import { setTutors } from "../../../redux/slices/tutorsSlice";

const EvaluatorDialog = ({
  user,
  open,
  handleClose,
  handleEvaluatorDialogClose,
}) => {
  const dispatch = useDispatch();

  const period = useSelector((state) => state.period);
  const tutors = Object.values(useSelector((state) => state.tutors))
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos

  const [selectedTutors, setSelectedTutors] = useState([]);
  const [initialSelectedTutors, setInitialSelectedTutors] = useState([]);

  useEffect(() => {
    const initialSelected = tutors
      .filter((tutor) =>
        tutor.tutor_periods.some(
          (tutorPeriod) =>
            tutorPeriod.period_id === period.id && tutorPeriod.is_evaluator
        )
      )
      .map((tutor) => tutor.id);
    setSelectedTutors(initialSelected);
    setInitialSelectedTutors(initialSelected);
  }, []);

  const handleToggleTutor = (tutor) => {
    setSelectedTutors((prevSelectedTutors) =>
      prevSelectedTutors.includes(tutor.id)
        ? prevSelectedTutors.filter((id) => id !== tutor.id)
        : [...prevSelectedTutors, tutor.id]
    );
  };

  const handleCancel = () => {
    setSelectedTutors(initialSelectedTutors); // Restauramos la selección inicial al cancelar
    handleEvaluatorDialogClose();
  };

  const confirmSelection = async () => {
    try {
      // Filtra solo los tutores nuevos que no estaban inicialmente seleccionados
      const newEvaluators = selectedTutors.filter(
        (tutorId) => !initialSelectedTutors.includes(tutorId)
      );

      const deleteEvaluators = initialSelectedTutors.filter(
        (tutorId) => !selectedTutors.includes(tutorId)
      );
      // Llama a makeEvaluator solo para los evaluadores nuevos
      for (const tutorId of newEvaluators) {
        await makeEvaluator(period.id, tutorId, user);
      }

      for (const tutorId of deleteEvaluators) {
        await unmakeEvaluator(period.id, tutorId, user);
      }
      // Actualizamos el flag is_evaluator a true solo en los tutores seleccionados
      const updatedTutors = tutors.map((tutor) => {
        if (newEvaluators.includes(tutor.id)) {
          const update = {
            ...tutor,
            tutor_periods: tutor.tutor_periods.map((tutorPeriod) =>
              tutorPeriod.period_id === period.id
                ? { ...tutorPeriod, is_evaluator: true }
                : tutorPeriod
            ),
          };
          return update;
        }
        return tutor;
      });

      // Llamar a la acción para actualizar el estado global de los tutores
      dispatch(setTutors(updatedTutors));

      setInitialSelectedTutors((prevInitial) => [
        ...prevInitial,
        ...newEvaluators,
      ]);
    } catch (error) {
      console.error("Error al llamar al backend:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Selecciona los Evaluadores</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <List>
              {tutors.slice(0, Math.ceil(tutors.length / 3)).map((tutor) => (
                <ListItem
                  key={tutor.id}
                  button
                  onClick={() => handleToggleTutor(tutor)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedTutors.includes(tutor.id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={tutor.name + " " + tutor.last_name} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={4}>
            <List>
              {tutors
                .slice(
                  Math.ceil(tutors.length / 3),
                  Math.ceil((2 * tutors.length) / 3)
                )
                .map((tutor) => (
                  <ListItem
                    key={tutor.id}
                    button
                    onClick={() => handleToggleTutor(tutor)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedTutors.includes(tutor.id)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={tutor.name + " " + tutor.last_name}
                    />
                  </ListItem>
                ))}
            </List>
          </Grid>
          <Grid item xs={4}>
            <List>
              {tutors.slice(Math.ceil((2 * tutors.length) / 3)).map((tutor) => (
                <ListItem
                  key={tutor.id}
                  button
                  onClick={() => handleToggleTutor(tutor)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedTutors.includes(tutor.id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={tutor.name + " " + tutor.last_name} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="error" variant="outlined">
          Cancelar
        </Button>
        <Button
          onClick={() => {
            confirmSelection();
            handleEvaluatorDialogClose();
          }}
          color="primary"
          variant="contained"
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EvaluatorDialog;
