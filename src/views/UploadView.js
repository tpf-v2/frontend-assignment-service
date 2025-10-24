
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { projectType } = useParams();  // Extrae el projectType desde la URL
  const id = useSelector((state) => state.user.group_id);
  const period = useSelector((state) => state.period);
  const user = useSelector((state) => state.user);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getGroup = async () => {
      try {
        if (id !== 0) {
          setGroup(await dispatch(getGroupById(user,id)))
        } else {
          navigate("/")
        }
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
    "final-project": "final_project_active",
    "pps-report": "pps_report_active"
  };

  const ownershipTypeMap = {
    "initial-project": "groups",
    "intermediate-project": "groups",
    "final-project": "groups",
    "pps-report": "students"
  };

  const hasProjectTitleMap = {
    "initial-project": true,
    "intermediate-project": false,
    "final-project": true,
    "pps-report": false
  };

  const activeKey = projectActiveKeyMap[projectType];  // Obtén la clave correspondiente de period


  function getProjectDeliveredDate() {
    if (projectType=="final-project") {
      return group.final_report_date;
    } else if (projectType=="initial-project") {
      return group.pre_report_date;
    } else if (projectType=="intermediate-project") {
      return group.intermediate_assigment_date;
    } else if (projectType=="pps-report") {
      return user.pps_report_date;
    }
  }

  function getProjectDeliveredMessage() {
    if (projectType == "pps-report") {
      return "Ya realizaste esta entrega el " + getProjectDeliveredDate().substring(0,10) + ".";
    } else {
      return "Tu equipo ya realizó esta entrega el " + getProjectDeliveredDate().substring(0,10) + ".";
    }
  }

  function getProjectNotDeliveredMessage() {
    if (projectType == "pps-report") {
      return "No realizaste esta entrega aún.";
    } else {
      return "Tu equipo no ha realizado esta entrega aún.";
    }
  }

  // Comprueba si el campo activo correspondiente es verdadero
  // TODO:WARNING: un nuevo tipo de proyecto, como PPS, requiere cambiar este código o producirá un mensaje incorrecto

  const isProjectActive = period[activeKey];
  let delivered = false;
  if (group && projectType=="final-project" && !!group.final_report_date) {
    delivered = true;
  }
  if (group && projectType=="initial-project" && !!group.pre_report_date) {
    delivered = true;
  }
  if (group && projectType=="intermediate-project" && !!group.intermediate_assigment_date) {
    delivered = true;
  } else if (projectType=="pps-report" && !!user.pps_report_date) {
    delivered = true;
  }

  let msg = delivered ? getProjectDeliveredMessage() : getProjectNotDeliveredMessage()
  // TODO: poner spinning circle al cargar el mensaje "Tu equipo ya entregó"
  const ownershipType = ownershipTypeMap[projectType];
  const hasProjectTitle = hasProjectTitleMap[projectType];

  return (
    <Container maxWidth="sm">
      <Root>
      {isProjectActive ? (
        <UploadFile projectType={projectType} headerInfo={msg} loadingHeaderInfo={loading} ownershipType={ownershipType} hasProjectTitle={hasProjectTitle} />
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
