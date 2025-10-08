import React from "react";
import { useSelector } from "react-redux";
import TeamDataTable from "../../../Algorithms/GroupDataTable";

const TeamsTable = ({dataListToRender = null}) => {
  const title = "Equipos";
  const period = useSelector((state) => state.period);
  const endpoint = `/groups/?period=${period.id}`;

  const teams = Object.values(useSelector((state) => state.groups))
  .sort((a, b) => a.group_number - b.group_number)
  .map(({ version, rehydrated, ...rest }) => rest)
  .filter((item) => Object.keys(item).length > 0);

  // Caso prop no cargada aún
  if (dataListToRender === undefined) return;

  // Si le estoy pasando una dataListToRender, es que la estoy llamando para la Verificación previa
  // a algoritmos, y no quiero que haga ningún fetch
  if (dataListToRender !== null) {
    return (
          <TeamDataTable
            items={dataListToRender}
            enableAdd={false}
            enableEdit={false}
            enableFilterButtons={false}
          />
    );
  } else {
    // Si no le pasé nada, es el uso por defecto que ya existía, es para mostrar tabla de Estudiantes
    return (
      <TeamDataTable endpoint={endpoint} items={teams} title={title}/>
    );
  }
};

export default TeamsTable;
