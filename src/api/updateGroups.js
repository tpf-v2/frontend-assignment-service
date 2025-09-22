import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

export const confirmGroups = async (user, period, assignments, groups) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  // Crear el body a partir de los equipos
  const body = assignments.map((assignment) => {
    // Encontrar el assignment correspondiente
    const group = groups.find((g) => g.id === assignment.id);

    const tutorPeriod = assignment.tutor.tutor_periods?.find(
      (tp) => tp.period_id === period.id
    );

    return {
      id: assignment.id,
      tutor_period_id: assignment.tutor.period_id
        ? assignment.tutor.period_id
        : tutorPeriod.id,
      assigned_topic_id: assignment.topic.id,
      reviewer_id: group.reviewer_id, // Revisar si hay un reviewer_id
      pre_report_approved: group.pre_report_approved,
      intermediate_assigment_approved: group.intermediate_assigment_approved,
      final_report_approved: group.final_report_approved,
    };
  });

  try {
    const url = `${BASE_URL}/groups/?period=${period.id}`;
    const response = await axios.put(url, body, config); // Enviar el body creado
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateGroup = async (user, periodId, team) => {
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  // Obs a futuro: tantos campos parecen innecesarios para updatear solo el reviewer_id.
  const body = [
    {
      id: team.id,
      tutor_period_id: team.tutor_period_id,
      assigned_topic_id: team.topic.id ? team.topic.id : 0,
      reviewer_id: team.reviewer_id ? team.reviewer_id : 0,
      pre_report_approved: team.pre_report_approved,
      intermediate_assigment_approved: team.intermediate_assigment_approved,
      final_report_approved: team.final_report_approved,
    },
  ];

  try {
    const url = `${BASE_URL}/groups/?period=${periodId}`;
    const response = await axios.put(url, body, config); // Enviar el body creado
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};
