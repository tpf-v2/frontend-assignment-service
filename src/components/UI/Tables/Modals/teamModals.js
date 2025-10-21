import React from "react";
import { useEffect, useState } from "react";
import {
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputLabel,
    RadioGroup,
    Radio,
    FormControlLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";
import { getTutorById, getTutorsForPeriod } from "../../../../utils/getEntitiesUtils";
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
const filter = createFilterOptions();

const CLEARSTRING = "Eliminar integrante";


/* Modals para Agregar equipo, Editar equipo, y Confirmar la edición en caso de conflicto.
 * Puede ocasionarse conflicto sea durante el agregado o durante la edición.
 * Se llama "primer modal" al modal de add o edit, y "segundo modal" al de confirm,
 * ya que el primer modal continúa en pantalla en caso de haber conflictos, y el de confirm
 * se muestra por encima, hasta que se confirme (o se cancele) la operación.
 */
export const TeamModals = ({
  openAddModal, // bools para ver si se debe abrir cada modal
  openEditModal,
  openConfirmModal,
  setOpenAddModal,  // necesarias para cerrar los modals
  setOpenEditModal,
  setOpenConfirmModal,
  handleAddItem, // las acciones al clickear confirmar desde cada modal
  handleEditItem,
  item, // recibido del parent, y su set para flushearlo al salir
  setParentItem,
  conflicts, // para ver si fue x add o edit, y obtener el msg informando qué conflictos hubo; y su set
  setConflictMsg,
  topics, // desglosado en csvTopics y customTopics para que los custom se muestren pero No sean seleccionables
  tutors, // para buscar su email etc a partir de otros datos
  students,
  periodId // para identificar el dato correcto en esas búsquedas
  
}) => {

      const [editedItem, setEditedItem] = useState({});    
      const [newItem, setNewItem] = useState({students: []});
      // Esto hace de handle open edit
      useEffect(() => {
        if (!openEditModal) return;
        // Importante: No continuar si el item ha sido flusheado
        if (!item || Object.keys(item).length === 0) return;

        setEditedItem(item); 

      }, [openEditModal, item]);

      const [editLoading, setEditLoading] = useState(false);
      const [confirmLoading, setConfirmLoading] = useState(false);

      const [topicMoveDecision, setTopicMoveDecision] = useState(undefined);

      // To-Do: Estas funciones deberían ser importables
      // Función para obtener el nombre del topic por su id
      const getTopicNameById = (id) => {
        if (id === "") return // AUX: agrego esta línea, para usar la función desde el modal de confirm, puedo mandarle "" si no tenía tema asignado.
        const topic = topics.csvTopics?.find((t) => t.id === id);        
        return topic ? topic.name : ""; // Si no encuentra el topic, mostrar 'Desconocido'
      };

      /////// Modals ///////
      // Este modal va a ser el de editar directamente (hay add en StudentForm).
      // Conservo la estructura solo x comodidad / analogía con otros archivos de modals.
      const innerEditTeamModal = (bool, handleCloseModal, handleConfirmAction, item, setItem, TitleText, ConfirmButtonText) => {        
        return (
          <Dialog open={bool} onClose={handleCloseModal} maxWidth={false} fullWidth PaperProps={{
            style: {
              height: "90vh",
              maxHeight: "90vh", // Limita la altura máxima para que no desborde
              
              borderRadius: "8px",
              width: '1000px', //
              maxWidth: '90vw', // opcional, por si en pantallas chicas
            },
          }}
          >
            <DialogTitle
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: "#f5f5f5",
                color: "#333",
                padding: "16px 24px",
              }}
            >
              {TitleText} Equipo {item.group_number}
            </DialogTitle>
            <form
              onSubmit={async (e) => {
                e.preventDefault(); // previene el reload del form                
                
                if (editLoading) return;
                setEditLoading(true);
                try {
                  await handleConfirmAction(item, setItem, handleCloseModal);
                } finally {
                  setEditLoading(false);
                }
              }}
            >
              <DialogContent dividers sx={{ padding: "24px 24px 16px" }}>        
                {/* Campos editables */}
                <Grid container spacing={2}>
                {/* Columna izquierda */}
                  <Grid item xs={6} md={6}>
                    
                    {/* Integrantes */}                    
                    <InputLabel sx={{ mb: 2 }}>Integrantes</InputLabel>
                    {item?.students?.map((student, index) => (
                                        
                      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                        <Grid item xs={12}>
                          <Autocomplete
                            disablePortal
                            options={students || []}
                            getOptionLabel={(option) => option.id? `${option.id} - ${option.name} ${option.last_name}` : ""} // cómo mostrar el texto
                            sx={{ width: '100%' }}
                            clearText={CLEARSTRING}
                            renderInput={(students) => <TextField {...students}
                                                          label=""/>}
                            onChange={(event, newValue) => {
                              const newStudents = item.students ? [...item.students] : [];
                              if (newValue) {
                                newStudents[index] = newValue;
                              } else {
                                newStudents[index] = { id: "", name: "", last_name: "" } // dejarlo vacío al quitar la selección
                              }
                              setItem({ ...item, students: newStudents });
                            }}
                            value={item?.students ? item.students[index] : null}
                          />
                        </Grid>
                      </Grid>
                      
                    ))}
                    
                    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                      {item?.students?.length < 4 && (
                          <Grid item xs={12}>                            
                            <Button
                              fullWidth
                              variant="outlined"
                              aria-label="add"
                              startIcon={<AddIcon/>}
                              onClick={() => {
                                const newStudents = [...item.students, { id: "", name: "", last_name: "" }];
                                setItem({ ...item, students: newStudents });
                              }}                              
                            >
                              Agregar Integrante
                            </Button>

                          </Grid>                          
                      )} 
                    </Grid>
                  </Grid>

                  {/* Columna derecha */}
                  <Grid item xs={6} md={6}>

                  {/* Tema y tutor */}
                  <InputLabel sx={{ mb: 2 }}>Tema y Tutor/a</InputLabel>
                  <Grid container spacing={2}>
                    
                    <Grid item xs={12} md={12}>
                      <Autocomplete
                        disablePortal
                        options={topics.csvTopics ?? []}
                        // manera básica: getOptionLabel={(option) => option?.name ?? ""} // cómo mostrar el texto
                        sx={{ width: '100%' }}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id} // <-- esto compara por id
                        clearText="Desasignar tema"                     
                        renderInput={(params) => <TextField {...params} label="Tema"/>} // label es la etiqueta a mostrar
                        value={item?.topic ?? null} // la opción seteada actual
                        
                        // Agrego esto, adaptado de la doc, para permitir Crear tema (una option) que no existe, tipeando
                        // (https://mui.com/material-ui/react-autocomplete/)
                        filterOptions={(options, params) => {
                          const filtered = filter(options, params);
                  
                          const { inputValue } = params;
                          // Suggest the creation of a new value
                          const isExisting = options.some((option) => inputValue === option.name);
                          if (inputValue !== '' && !isExisting) {
                            filtered.push({
                              inputValue,
                              name: `Crear tema: "${inputValue}"`, //
                            });
                          }
                  
                          return filtered;
                        }}
                        getOptionLabel={(option) => {
                          // Value selected with enter, right from the input
                          if (typeof option === 'string') {
                            return option;
                          }
                          // Add "xxx" option created dynamically
                          if (option.inputValue) {
                            return option.inputValue;
                          }
                          // Regular option (lo que mostrábamos en el render básico)
                          return option?.name ?? "";
                        }}
                        onChange={(event, newValue) => {
                          // Si la opción fue un tema nuevo a crear, hay que crear el objeto topic que espera el back,
                          // porque hasta ahora lo tipeado como option es solo texto
                          if (typeof newValue === 'string') {
                            setItem({...item, topic: {name: newValue}});
                          } else if (newValue && newValue.inputValue) {
                            // Create a new value from the user input
                            setItem({...item, topic: {name: newValue.inputValue}});
                          } else {
                            // Else, fue una opción seleccionada de las existentes, la seteamos como de costumbre
                            setItem({ ...item, topic: newValue ?? null})
                          }
                        }}                        
                        renderOption={(props, option) => {
                          if (option.inputValue) {
                            return (
                              <li {...props}>
                                Crear tema: {option.inputValue}
                              </li>
                            );
                          }
                          return <li {...props}>{option?.name}</li>;
                        }}

                      />
                    </Grid>
                    
                    <Grid item xs={12} md={12}>
                      <Autocomplete
                        disablePortal
                        options={getTutorsForPeriod(periodId, tutors) || []}
                        getOptionLabel={(option) => option.name? `${option.name} ${option.last_name}` : ""} // cómo mostrar el texto
                        sx={{ width: '100%' }}
                        clearText="Desasignar tutor"
                        renderInput={(tutors) => <TextField {...tutors}
                                                      label="Tutor/a"/>} // label es la etiqueta a mostrar
                        onChange={(event, newValue) => {    
                          // Tenemos newvalue que es un objeto tutor, no queremos setearlo directamente (completo)
                          // sino que hay que setear un campo suyo
                          const tp = newValue?.tutor_periods.find((tp) => tp.period_id === periodId);
                          if (newValue) {
                            setItem({ ...item, tutor_period_id: tp?.id })                                
                          } else {
                            setItem({ ...item, tutor_period_id: null }) // dejarlo vacío al quitar la selección
                          }
                        }}
                        value={getTutorById(item?.tutor_period_id, periodId, tutors) || null}
                      />
                      </Grid>

                  {/* Las tres preferencias, no editables */}
                  <Grid item xs={12} md={12}>
                  <InputLabel>Preferencias</InputLabel>
                  <TextField
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    label="Preferencia 1"
                    value={item?.preferred_topics?.[0]
                      ? getTopicNameById(item.preferred_topics[0])
                      : ""}
                    disabled
                  />
                  <TextField
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    label="Preferencia 2"
                    value={item?.preferred_topics?.[1]
                      ? getTopicNameById(item.preferred_topics[1])
                      : ""}
                    disabled
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Preferencia 3"
                    variant="outlined"
                    value={item?.preferred_topics?.[2]
                      ? getTopicNameById(item.preferred_topics[2])
                      : ""}
                    disabled
                  />
                  </Grid>
                  </Grid>

                </Grid> 
              </Grid>
              </DialogContent>

              <DialogActions>
                <Button onClick={handleCloseModal} variant="outlined" color="error">
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={editLoading}>
                  {editLoading ? "Guardando..." : ConfirmButtonText}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        )
      };
      const handleCloseAddModal = () => {
        setOpenAddModal(false);
        setNewItem({students: []});
      };

      const handleCloseAddModalWithoutFlushingItem = () => {
        setOpenAddModal(false);
      };
        
      const handleCloseConfirmModal = () => {
        setOpenConfirmModal(false);
        setConflictMsg({msg:[]});
        setTopicMoveDecision(undefined);
      };

      const handleCloseEditModalWithoutFlushingEditedItem = () => {
        setOpenEditModal(false);
        setParentItem(false);
      };

      const handleCloseEditModal = () => {
        setEditedItem({})
        setOpenEditModal(false);
        setParentItem(false);
      };
      
      const editTeamModal = () => {
        // Usa el editedItem para guardar el resultado de las ediciones a enviar
        return innerEditTeamModal(openEditModal, handleCloseEditModal, handleEditItem, editedItem, setEditedItem, "Editar", "Guardar")
      }
      
      const confirmOnConflictTeamModal = () => {
        // Usa el editedItem, por lo que en el medio, no se debe haber flusheado editedItem (ej hay que no cerrar (desde afuera) el modal anterior si hay conflicto)
        // Además, luego de Confirmar se necesita usar desde afuera al editedItem por lo que no hay que flushearlo desde acá sino afuera
        // AUX: acá un if type es edit hacer esto, else hacer lo mismo pero para add, y hay que agregar un blablawithputFlushing para add p q ande - #saludos me voy a cenar
        if (conflicts?.operation === "add") {
          
          return innerConfirmOnConflictModal(openConfirmModal, handleCloseConfirmModal, handleCloseAddModalWithoutFlushingItem, handleAddItem, newItem, setNewItem, "Agregar", "Confirmar");

        } else if (conflicts?.operation === "edit") {
          return innerConfirmOnConflictModal(openConfirmModal, handleCloseConfirmModal, handleCloseEditModalWithoutFlushingEditedItem, handleEditItem, editedItem, setEditedItem, "Editar", "Confirmar");
        }
      }
      
      const innerConfirmOnConflictModal = (bool, handleCloseModal, handleCloseFirstModal, handleActionToConfirm, item, setItem, TitleText, ConfirmButtonText) => {        
        return (
          <Dialog open={bool} onClose={handleCloseModal} maxWidth={false}>
            <DialogTitle
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: "#f5f5f5",
                color: "#333",
                padding: "16px 24px",
              }}
            >
              Conflicto al Intentar {TitleText} Equipo {item.group_number}
            </DialogTitle>
            <form
              onSubmit={ async (e) => {
                e.preventDefault(); // previene el reload del form                           
                
                // Si hubo conflictos de tema y no se decidió nada, volver
                if (conflicts?.msg?.topic_conflicts?.length > 0 && !topicMoveDecision) return;
                if (confirmLoading) return;
                setConfirmLoading(true);
                try {                  
                  // cerramos el modal de confirm
                  //handleCloseModal();
                  // undefined xq no necesitamos que ese handle cierre ningún modal, ya lo cerramos recién
                  
                  // Obtenemos el bool según la decisión de quitar o conservar
                  const moveTopic = topicMoveDecision === "remove";
                  // El true llega hasta la api call y confirma los conflictos! :)
                  await handleActionToConfirm(item, setItem, handleCloseModal, true, moveTopic);
                } finally {
                  setConfirmLoading(false);
                }
              }}
            >
              <DialogContent dividers sx={{ padding: "24px 24px 16px" }}>
                
                {/* Mostrar el / los errores */}

                {conflicts?.msg?.student_conflicts?.length > 0 && (
                  <div>
                    <h4>Estudiantes</h4>
                    <ul>
                      {conflicts?.msg?.student_conflicts?.map((conflict_error, index) => (
                        <li key={index}>{conflict_error}</li>
                      ))}
                    </ul>
                    Confirmar eliminará cada estudiante de su actual equipo y lo agregará a este equipo.                    
                  </div>
                )}

                {conflicts?.msg?.empty_delete_team && (<div>
                  <h4>Equipo vacío</h4>
                  <ul>
                      <li>Se desasignarán todos los integrantes de este equipo</li>                    
                  </ul>
                  Confirmar desasignará todos los integrantes de este equipo y eliminará el equipo.
                </div>
                )}

                {conflicts?.msg?.topic_conflicts?.length > 0 && (
                  <div>
                    <h4>Tema</h4>                    
                    <ul>
                      {conflicts?.msg?.topic_conflicts?.map((conflict_error, index) => (
                        <li key={index}>{conflict_error} {getTopicNameById(item.topic?.id)}</li>
                      ))}
                    </ul>
                    Confirmar asignará el tema a este equipo, y debería ¿quitarlo de su otro equipo o conservarlo también en su otro equipo?
                    <RadioGroup
                      value={topicMoveDecision}
                      onChange={(e) => setTopicMoveDecision(e.target.value)}
                    >
                      <FormControlLabel
                        value="remove"
                        control={<Radio />}
                        label="Quitar"
                      />
                      <FormControlLabel
                        value="keep"
                        control={<Radio />}
                        label="Conservar"
                      />
                    </RadioGroup>
                    {!topicMoveDecision && 
                      <p style={{ color: "red" }}>Se debe seleccionar una opción sobre conflicto de tema.</p>}
                  </div>
                )}
                
                <p><strong>¿Confirmar?</strong></p>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseModal} variant="outlined" color="error">
                  Cancelar
                </Button>
                <Button type="submit" onClick={handleCloseFirstModal} variant="contained" color="primary" disabled={confirmLoading}>
                  {confirmLoading ? "Confirmando..." : ConfirmButtonText}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        )};

      /////////////
      //// Add ////
      // Es todo lo mismo, salvo el título (no lleva item.id), y que no voy a mostrar acá las 3 preferencias
      // El loading tiene que ser un atributo
      const innerAddTeamModal = (bool, handleCloseModal, handleConfirmAction, item, setItem, TitleText, ConfirmButtonText) => {        
        return (
          <Dialog open={bool} onClose={handleCloseModal} maxWidth={false} fullWidth PaperProps={{
            style: {
              height: "90vh",
              maxHeight: "90vh", // Limita la altura máxima para que no desborde
              
              borderRadius: "8px",
              width: '1000px', //
              maxWidth: '90vw', // opcional, por si en pantallas chicas
            },
          }}
          >
            <DialogTitle
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: "#f5f5f5",
                color: "#333",
                padding: "16px 24px",
              }}
            >
              {TitleText} Equipo
            </DialogTitle>
            <form
              onSubmit={async (e) => {
                e.preventDefault(); // previene el reload del form                
                
                if (editLoading) return;
                setEditLoading(true);
                try {
                  await handleConfirmAction(item, setItem, handleCloseModal);
                } finally {
                  setEditLoading(false);
                }
              }}
            >
              <DialogContent dividers sx={{ padding: "24px 24px 16px" }}>        
                {/* Campos a cargar */}
                <Grid container spacing={2}>
                {/* Columna izquierda */}
                  <Grid item xs={6} md={6}>
                    
                    {/* Integrantes */}                    
                    <InputLabel sx={{ mb: 2 }}>Integrantes</InputLabel>
                    {item?.students?.map((student, index) => (
                                        
                      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                        <Grid item xs={12}>
                          <Autocomplete              
                            disablePortal
                            options={students || []}
                            getOptionLabel={(option) => option.id? `${option.id} - ${option.name} ${option.last_name}` : ""} // cómo mostrar el texto
                            sx={{ width: '100%' }}
                            clearText={CLEARSTRING}
                            renderInput={(students) => <TextField {...students}
                                                          label=""/>}
                            onChange={(event, newValue) => {
                              const newStudents = item.students ? [...item.students] : [];
                              if (newValue) {
                                newStudents[index] = newValue;
                              } else {
                                newStudents[index] = { id: "", name: "", last_name: "" } // dejarlo vacío al quitar la selección
                              }
                              setItem({ ...item, students: newStudents });
                            }}
                            value={item?.students ? item.students[index] : null}
                          />
                        </Grid>
                      </Grid>
                      
                    ))}
                    
                    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                      {item?.students?.length < 4 && (
                          <Grid item xs={12}>                            
                            <Button
                              fullWidth
                              variant="outlined"
                              aria-label="add"
                              startIcon={<AddIcon/>}
                              onClick={() => {
                                const newStudents = [...item.students, { id: "", name: "", last_name: "" }];
                                setItem({ ...item, students: newStudents });
                              }}                              
                            >
                              Agregar Integrante
                            </Button>

                          </Grid>                          
                      )} 
                    </Grid>
                  </Grid>

                  {/* Columna derecha */}
                  <Grid item xs={6} md={6}>

                  {/* Tema y tutor */}
                  <InputLabel sx={{ mb: 2 }}>Tema y Tutor/a</InputLabel>
                  <Grid container spacing={2}>

                    <Grid item xs={12} md={12}>
                      <Autocomplete // Igual que en el modal de editar []
                        disablePortal
                        options={topics.csvTopics ?? []}
                        // manera básica: getOptionLabel={(option) => option?.name ?? ""} // cómo mostrar el texto
                        sx={{ width: '100%' }}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id} // <-- esto compara por id
                        clearText="Desasignar tema"                        
                        renderInput={(params) => <TextField {...params} label="Tema"/>} // label es la etiqueta a mostrar
                        value={item?.topic ?? null} // la opción seteada actual
                        
                        // Agrego esto, adaptado de la doc, para permitir Crear tema (una option) que no existe, tipeando
                        // (https://mui.com/material-ui/react-autocomplete/)
                        filterOptions={(options, params) => {
                          const filtered = filter(options, params);
                  
                          const { inputValue } = params;
                          // Suggest the creation of a new value
                          const isExisting = options.some((option) => inputValue === option.name);
                          if (inputValue !== '' && !isExisting) {
                            filtered.push({
                              inputValue,
                              name: `Crear tema: "${inputValue}"`, //
                            });
                          }
                  
                          return filtered;
                        }}
                        getOptionLabel={(option) => {
                          // Value selected with enter, right from the input
                          if (typeof option === 'string') {
                            return option;
                          }
                          // Add "xxx" option created dynamically
                          if (option.inputValue) {
                            return option.inputValue;
                          }
                          // Regular option (lo que mostrábamos en el render básico)
                          return option?.name ?? "";
                        }}
                        onChange={(event, newValue) => {
                          // Si la opción fue un tema nuevo a crear, hay que crear el objeto topic que espera el back,
                          // porque hasta ahora lo tipeado como option es solo texto
                          if (typeof newValue === 'string') {
                            setItem({...item, topic: {name: newValue}});
                          } else if (newValue && newValue.inputValue) {
                            // Create a new value from the user input
                            setItem({...item, topic: {name: newValue.inputValue}});
                          } else {
                            // Else, fue una opción seleccionada de las existentes, la seteamos como de costumbre
                            setItem({ ...item, topic: newValue ?? null})
                          }
                        }}                        
                        renderOption={(props, option) => {
                          if (option.inputValue) {
                            return (
                              <li {...props}>
                                Crear tema: {option.inputValue}
                              </li>
                            );
                          }
                          return <li {...props}>{option?.name}</li>;
                        }}

                      />
                    </Grid>
                    <Grid item xs={12} md={12}>

                      <Autocomplete // igual que en Editar []
                        disablePortal
                        options={getTutorsForPeriod(periodId, tutors) || []}
                        getOptionLabel={(option) => option.name? `${option.name} ${option.last_name}` : ""} // cómo mostrar el texto
                        sx={{ width: '100%' }}
                        clearText="Desasignar tutor"
                        renderInput={(tutors) => <TextField {...tutors}
                                                      label="Tutor/a"/>} // label es la etiqueta a mostrar
                        onChange={(event, newValue) => {    
                          // Tenemos newvalue que es un objeto tutor, no queremos setearlo directamente (completo)
                          // sino que hay que setear un campo suyo
                          const tp = newValue?.tutor_periods.find((tp) => tp.period_id === periodId);
                          if (newValue) {
                            setItem({ ...item, tutor_period_id: tp?.id })                                
                          } else {
                            setItem({ ...item, tutor_period_id: null }) // dejarlo vacío al quitar la selección
                          }
                        }}
                        value={getTutorById(item?.tutor_period_id, periodId, tutors) || null}
                      />
                    </Grid>

                  </Grid>
                  
                  
                  {/* Las tres preferencias, no editables - resulta ser que sí las queremos editables []
                    * No irán a este endpoint de add_team, es otro endpoint el de las answers.
                  */}
                  {/*
                  <InputLabel>Preferencias</InputLabel>
                  <TextField
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    label="Preferencia 1"
                    value={item?.preferred_topics?.[0] ?? ""}
                    disabled={false}
                    onChange={(e) => {
                      const newPreferredTopics = item.preferred_topics ? [...item.preferred_topics] : [];
                      if (e.target.value) {
                        newPreferredTopics[0] = e.target.value;
                      } else {
                        newPreferredTopics[0] = null // dejarlo vacío al quitar la selección
                      }
                      setItem({ ...item, preferred_topics: newPreferredTopics });
                    }}
                  />
                   */}
                 
                  </Grid>

                </Grid> 
              </DialogContent>

              <DialogActions>
                <Button onClick={handleCloseModal} variant="outlined" color="error">
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={editLoading}>
                  {editLoading ? "Guardando..." : ConfirmButtonText}
                </Button>
              </DialogActions>
            </form>
          </Dialog>
        )
      };

      const addTeamModal = () => {
        // Usa el newItem para guardar lo que va a enviar
        return innerAddTeamModal(openAddModal, handleCloseAddModal, handleAddItem, newItem, setNewItem, "Agregar", "Guardar")
      }

  return (
    <>
      {addTeamModal()}
      {editTeamModal()}
      {confirmOnConflictTeamModal()}
    </>
  )
}