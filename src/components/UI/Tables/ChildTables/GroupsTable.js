import React from "react";
import { useSelector } from "react-redux";
import TeamDataTable from "../../../Algorithms/GroupDataTable";

const TeamsTable = ({dataListToRender=[]}) => {
  const title = "Equipos";
  const period = useSelector((state) => state.period);
  const endpoint = `/groups/?period=${period.id}`;

  const teams = Object.values(useSelector((state) => state.groups))
  .sort((a, b) => a.group_number - b.group_number)
  .map(({ version, rehydrated, ...rest }) => rest)
  .filter((item) => Object.keys(item).length > 0);

  // Si tiene elementos, la estoy llamando para la Verificación previa a algoritmos,
  // y no quiero que haga ningún fetch
  if (!dataListToRender) return;  
  if (dataListToRender.length > 0) {
    return (
          <TeamDataTable
            items={dataListToRender}
            enableAdd={false}
            enableEdit={false}
            enableFilterButtons={false}
          />
    );
  } if (dataListToRender.length === 0) {
    // Si está vacía, es el uso por defecto que ya existía, es para mostrar tabla de Estudiantes
    return (
      <TeamDataTable endpoint={endpoint} items={teams} title={title}/>
    );
  }
};

export default TeamsTable;
