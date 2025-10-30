import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
import { getGroupById } from "../../api/getGroupById";
import StudentOverview from "../../components/UI/Dashboards/Student/StudentOverview";
import StudentInfo from "../../components/UI/Dashboards/Student/StudentInfo";
import ClosedAlert from "../../components/ClosedAlert";

const StudentDeliveryView = () => {
    const dispatch = useDispatch();
    const [team, setTeam] = useState(null)
    const user = useSelector((state) => state.user);
    const period = useSelector((state) => state.period);
    useEffect(() => {
        const fetchTeam = async () => {
            const _team = await dispatch(getGroupById(user, user.group_id));
            setTeam(_team)
            console.log("got team: %s", _team)
        }
        fetchTeam()
    }, [user.group_id])
    console.log("user gid: %s %s", user, user.group_id)
    let studentOverview = (!!team && !!user.group_id) ? (<StudentOverview group_id={user.group_id} team={team} period={period} />) : <ClosedAlert message="No tienes equipo aún."></ClosedAlert>
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