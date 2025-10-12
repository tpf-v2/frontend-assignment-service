
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useParams } from 'react-router-dom';
import UploadFile from "../components/UploadFile";
import ClosedAlert from "../components/ClosedAlert";
import { getStudentInfo } from "../api/handleStudents";

const UploadView = () => {
  const dispatch = useDispatch();
  const { projectType } = useParams();  // Extrae el projectType desde la URL
  const id = useSelector((state) => state.user.group_id);
  const period = useSelector((state) => state.period);
  const user = useSelector((state) => state.user);
  let userData = null
  useEffect(() => {
    const getData = async () => {
      try {
        if (period == undefined){
          return
        }
        console.log(period)
        userData = await dispatch(getStudentInfo(user));
      } catch (error) {
        console.error("Error al obtener datos para el upload:", error);
      } 
    };
    getData();
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
  if (userData && projectType=="final-project" && !!userData.final_report_date) {
    delivered = true;
  }
  if (userData && projectType=="initial-project" && !!userData.pre_report_date) {
    delivered = true;
  }
  if (userData && projectType=="intermediate-project" && !!userData.intermediate_report_date) {
    delivered = true;
  }
  let msg = delivered ? "Tu equipo ya ha realizado esta entrega." : "Tu equipo no ha realizado esta entrega aún."
  //  
  return (
    <div>
      {isProjectActive ? (
        <UploadFile projectType={projectType} headerInfo={msg} />
      ) : (
        <ClosedAlert message="No se aceptan más entregas." />
      )}
    </div>
  );
};

export default UploadView;
