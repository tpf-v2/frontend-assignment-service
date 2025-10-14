
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import UploadFile from "../components/UploadFile";
import ClosedAlert from "../components/ClosedAlert";
import ChangeDescription from "../components/ChangeDescription";
import { getGroupById } from "../api/getGroupById";

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
  const isProjectActive = period[activeKey];
  let delivered = false;
  if (group && projectType=="final-project" && !!group.final_report_date) {
    delivered = true;
  }
  if (group && projectType=="initial-project" && !!group.pre_report_date) {
    delivered = true;
  }
  if (group && projectType=="intermediate-project" && !!group.intermediate_report_date) {
    delivered = true;
  }
  let msg = delivered ? "Tu equipo ya ha realizado esta entrega." : "Tu equipo no ha realizado esta entrega aún."
  // TODO: poner spinning circle al cargar el mensaje "Tu equipo ya entregó"
  return (
    <div>
      {isProjectActive ? (
        <UploadFile projectType={projectType} headerInfo={msg} loadingHeaderInfo={loading} />
      ) : (
        <ClosedAlert message="No se aceptan más entregas." />
      )
      }
      {
        (delivered && projectType == "final-project") ? <ChangeDescription projectType={"final-project"} headerInfo={null} user={user} group={group}/> : null
      }
    </div>
  );
};

export default UploadView;
