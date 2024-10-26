import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import UploadFile from "../components/UploadFile";
import ClosedAlert from "../components/ClosedAlert";

const UploadView = () => {
  const { projectType } = useParams();  // Extrae el projectType desde la URL
  const period = useSelector((state) => state.period);

  // Mapeo entre el parámetro de la URL y las variables del estado de period
  const projectActiveKeyMap = {
    "initial-project": "initial_project_active",
    "intermediate-project": "intermediate_project_active",
    "final-project": "final_project_active"
  };

  const activeKey = projectActiveKeyMap[projectType];  // Obtén la clave correspondiente de period

  // Comprueba si el campo activo correspondiente es verdadero
  const isProjectActive = period[activeKey];

  return (
    <div>
      {isProjectActive ? (
        <UploadFile projectType={projectType} />
      ) : (
        <ClosedAlert message="No se aceptan más entregas." />
      )}
    </div>
  );
};

export default UploadView;
