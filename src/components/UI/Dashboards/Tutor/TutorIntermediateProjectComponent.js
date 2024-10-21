import { Typography, Box, Link } from "@mui/material";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useSelector } from "react-redux";
import { getIntermediateProject } from "../../../../api/intermeadiateProjects";

const TutorIntermediateProjectComponent = ({ groupId }) => {
  const period = useSelector((state) => state.period);
  const user = useSelector((state) => state.user);
  const [videoUrl, setVideoUrl] = useState(null);

  const loadIntermediateProject = async () => {
    console.log(groupId);

    try {
      const response = await getIntermediateProject(
        groupId,
        user,
        period.period_id
      );
      setVideoUrl(response.intermediate_assigment); // Guarda la URL en el estado
    } catch (error) {
      console.error("Error al cargar la previsualización del video:", error);
    }
  };

  useEffect(() => {
    loadIntermediateProject();
  }, [groupId, user, period]);

  // Función para detectar si el video es de YouTube
  const isYouTubeUrl = (url) => {
    return url.includes("youtube") || url.includes("youtu.be");
  };

  return (
    <>
      <Typography variant="h4" align="center" gutterBottom marginTop={1}>
        Entrega Intermedia
      </Typography>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop={2}
      >
        {videoUrl ? (
          <>
            {/* Si es de YouTube, muestra el reproductor */}
            {isYouTubeUrl(videoUrl) && (
              <ReactPlayer
                url={videoUrl}
                controls
                width="100%"
                height="360px"
              />
            )}

            {/* Siempre muestra el enlace debajo del reproductor o del mensaje */}
            <Typography marginTop={2}>
              Puedes ver el video en el siguiente enlace:{" "}
              <Link href={videoUrl} target="_blank" rel="noopener">
                Ver Video
              </Link>
            </Typography>
          </>
        ) : (
          <Typography>Cargando ...</Typography>
        )}
      </Box>
    </>
  );
};

export default TutorIntermediateProjectComponent;
