import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { purple } from "@mui/material/colors";

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 275,
  boxShadow: theme.shadows[5],
  backgroundColor: purple[100],
  border: `2px solid ${purple[600]}`,
  textAlign: "center",
  padding: "10px", // Aumentar padding
}));

const calculateTimeLeft = (presentationDate) => {
  const now = new Date();
  const timeDiff = new Date(presentationDate) - now;

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

const PresentationDateCard = (date) => {
  const [timeLeft, setTimeLeft] = useState({});
  const presentationDate = date.presentationDate;
  const dateObject = new Date(presentationDate);
  const formattedDate = dateObject.toLocaleDateString(); // Formato de fecha
  const formattedTime = dateObject.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const now = new Date();

  useEffect(() => {
    if (presentationDate !== "Sin fecha asignada" && now < dateObject) {
      const interval = setInterval(() => {
        setTimeLeft(calculateTimeLeft(presentationDate));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [presentationDate]);

  return (
    <StyledCard>
      <CardContent>
        {presentationDate !== "Sin fecha asignada" ? (
          now < dateObject ? (
            <>
              <Typography fontSize={18} fontWeight="bold" color="text.primary">
                Tu equipo expondrá el:
              </Typography>
              <Typography fontSize={18} fontWeight="bold" color="text.primary">
                {formattedDate}{" "}
                <span style={{ fontWeight: "normal", fontSize: "18px" }}>
                  a las
                </span>{" "}
                {formattedTime}
              </Typography>
              <Typography
                fontWeight="bold"
                fontSize={18}
                sx={{ letterSpacing: 0.5 }}
              >
                <span style={{ fontWeight: "normal", fontSize: "18px" }}>
                  Te quedan
                </span>{" "}
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m{" "}
                {timeLeft.seconds}s
              </Typography>
            </>
          ) : (
            <>
              <Typography color="text.secondary">Tu equipo expuso el</Typography>
              <Typography fontSize={18} fontWeight="bold" color="text.primary">
                {formattedDate}{" "}
                <span style={{ fontWeight: "normal", fontSize: "18px" }}>
                  a las
                </span>{" "}
                {formattedTime}
              </Typography>
            </>
          )
        ) : (
          <Typography color="text.secondary">Sin fecha asignada</Typography>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default PresentationDateCard;
