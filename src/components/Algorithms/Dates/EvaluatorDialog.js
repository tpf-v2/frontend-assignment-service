import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Grid, List, ListItem, ListItemIcon, Checkbox, ListItemText, DialogActions, Button } from "@mui/material";
import { useSelector } from "react-redux";

const EvaluatorDialog = ({ open, handleClose, handleEvaluatorDialogClose }) => {
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
                    <ListItemText
                      primary={tutor.name + " " + tutor.last_name}
                    />
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
                {tutors
                  .slice(Math.ceil((2 * tutors.length) / 3))
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={() => {
              //TODO: call backend
              handleEvaluatorDialogClose();
              console.log("Evaluadores seleccionados:", selectedTutors);
            }}
            color="primary"
          >
            Confirmar
          </Button>
        </DialogActions>
    </Dialog>
  );
};

export default EvaluatorDialog;
