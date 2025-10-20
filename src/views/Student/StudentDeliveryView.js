import { useSelector, useDispatch } from "react-redux";
import { Container, Box, CircularProgress } from "@mui/material";
import StudentOverview from "../../components/UI/Dashboards/Student/StudentOverview";
import StudentInfo from "../../components/UI/Dashboards/Student/StudentInfo";


const StudentDeliveryView = () => { 
    const user = useSelector((state) => state.user);
    console.log("user gid: %s %s", user, user.group_id)
    let studentOverview = !!user.group_id ? (<StudentOverview group_id={user.group_id} />) : null
    console.log("studentOverview is null: %s", studentOverview == null)
    return (<Container maxWidth="lg" sx={{ display: "flex", mt: 5 }}>
        <Box sx={{ flex: 1, mr: 8, mt: 8 }}>
        <StudentInfo />
        <Box sx={{ mb: 1 }} />
       
        </Box>
        <Box sx={{ flex: 2 }}>
        <Box>
            {studentOverview}
        </Box>
        </Box>
    </Container>)
}

export default StudentDeliveryView