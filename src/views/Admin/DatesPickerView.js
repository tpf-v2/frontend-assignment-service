import { Box } from '@mui/material';
import DateRangeSelector from "../../components/DateRangeSelector";

const DatePickerView = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <DateRangeSelector
                title="Elegir un rango de fechas de presentación"
                from_label="Desde"
                to_label="Hasta" />
        </Box>
      );
  };
  
  export default DatePickerView;
  