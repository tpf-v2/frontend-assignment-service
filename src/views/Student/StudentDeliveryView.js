import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Box, CircularProgress } from "@mui/material";
import { getGroupById } from "../../api/getGroupById";
import StudentOverview from "../../components/UI/Dashboards/Student/StudentOverview";
import StudentInfo from "../../components/UI/Dashboards/Student/StudentInfo";
import ClosedAlert from "../../components/ClosedAlert";
import PresentationDateCard from "../../components/UI/Dashboards/Student/PresentationDateCard";
import StudentSidebar from "./StudentSidebar";

const StudentDeliveryView = () => {
    const dispatch = useDispatch();
    const [team, setTeam] = useState(null)
    const user = useSelector((state) => state.user);
    const isStudent = user?.temporal_role === 'student';
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();
    const period = useSelector((state) => state.period);
    useEffect(() => {
        const fetchTeam = async () => {
            const _team = await dispatch(getGroupById(user, user.group_id));
            setTeam(_team)
            setLoading(false)
        }
        fetchTeam()
    }, [user.group_id])
    if(!isStudent) {
        navigate("/")
    }
    let studentOverview = loading ? <CircularProgress/> : ((!!team && !!user.group_id) ? (<StudentOverview group_id={user.group_id} team={team} />) : <ClosedAlert message="No tienes equipo aún."></ClosedAlert>)
    return (
        <Container maxWidth="lg" sx={{ display: "flex", mt: 5 }}>
        <Box sx={{ flex: 1, mr: 8, mt: 8 }}>
        <StudentInfo />
        <Box sx={{ mb: 1 }} />
        {!loading && team.exhibition_date && <PresentationDateCard presentationDate={team.exhibition_date}/>}
        {<StudentSidebar selectedMenu={null} handleNavigation={navigate} />}
        </Box>
        <Box sx={{ flex: 2 }}>
        <Box>
            {studentOverview}
        </Box>
        </Box>
    </Container>)
}

export default StudentDeliveryView