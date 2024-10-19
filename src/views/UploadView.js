import { useSelector } from "react-redux";

import UploadFile from "../components/UploadFile";
import ClosedAlert from "../components/ClosedAlert";

const UploadView = () => {
    const period = useSelector((state) => state.period);

    return (
        <div>
          {period.initial_project_active ? <UploadFile /> : <ClosedAlert message="No se aceptan más entregas." />}
        </div>
      );
  };
  
  export default UploadView;
  