
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import UploadFile from "../components/UploadFile";
import ChangeDescription from "../components/ChangeDescription";
import { getGroupById } from "../api/getGroupById";
import { styled } from "@mui/system";
import {
  Paper,
  Container,
  Alert
} from "@mui/material";
const Root = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(10),
  padding: theme.spacing(4),
  boxShadow: theme.shadows[10],
}));
const UploadView = () => {
  const dispatch = useDispatch();
  const { projectType } = useParams();  // Extrae el projectType desde la URL
  const id = useSelector((state) => state.user.group_id);
  const period = useSelector((state) => state.period);
  const user = useSelector((state) => state.user);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getGroup = async () => {
      try {
        setGroup(await dispatch(getGroupById(user,id)))
        setLoading(false)
      } catch (error) {
        console.error("Error al obtener datos para el upload:", error);
      } 
    };
    getGroup();
  }, []);

  // Mapeo entre el parámetro de la URL y las variables del estado de period
  const projectActiveKeyMap = {
    "initial-project": "initial_project_active",
    "intermediate-project": "intermediate_project_active",
    "final-project": "final_project_active"
  };

  const activeKey = projectActiveKeyMap[projectType];  // Obtén la clave correspondiente de period

  // Comprueba si el campo activo correspondiente es verdadero
  // TODO:WARNING: un nuevo tipo de proyecto, como PPS, requiere cambiar este código o producirá un mensaje incorrecto

  const isProjectActive = period[activeKey];
  let delivered = false;
  let date_delivery = ""
  if (group && projectType=="final-project" && !!group.final_report_date) {
    delivered = true;
    date_delivery = group.final_report_date.substring(0,10)
  }
  if (group && projectType=="initial-project" && !!group.pre_report_date) {
    delivered = true;
    date_delivery = group.pre_report_date.substring(0,10)
  }
  if (group && projectType=="intermediate-project" && !!group.intermediate_assigment_date) {
    delivered = true;
    date_delivery = group.intermediate_assigment_date.substring(0,10)
  }
  let msg = delivered ? `Tu equipo ya realizó esta entrega el ${date_delivery}.` : "Tu equipo no ha realizado esta entrega aún."
  // TODO: poner spinning circle al cargar el mensaje "Tu equipo ya entregó"
  return (
    <Container maxWidth="sm">
      <Root>
      {isProjectActive ? (
        <UploadFile projectType={projectType} headerInfo={msg} loadingHeaderInfo={loading} />
      ) : (
        <Alert severity="info">No se aceptan más entregas.</Alert>
      )
      }
      {
        (delivered && projectType == "final-project") ? <ChangeDescription projectType={"final-project"} headerInfo={null} user={user} group={group}/> : null
      }
      </Root>
    </Container>
  );
};

export default UploadView;
