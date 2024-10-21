import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import StatCard from "./StatCard";
import { useSelector } from "react-redux";

const ContentIntermediateProject = (
  loadingIntermediateProjects,
  deliveries
) => {
  let groupsData = Object.values(useSelector((state) => state.groups))
    .sort((a, b) => a.id - b.id)
    .map(({ version, rehydrated, ...rest }) => rest) // Filtra las propiedades 'version' y 'rehydrated'
    .filter((item) => Object.keys(item).length > 0); // Elimina objetos vacíos

  return (
    <>
      {groupsData && (
        <Box mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Grupos que entregaron"
                value={loadingIntermediateProjects ? -1 : deliveries.length}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Grupos que faltan entregar"
                value={
                  loadingIntermediateProjects
                    ? -1
                    : groupsData.length - deliveries.length
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StatCard
                title="Total de grupos"
                value={loadingIntermediateProjects ? -1 : groupsData.length}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default ContentIntermediateProject;
