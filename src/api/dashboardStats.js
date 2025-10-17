import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL;

const countResponsesByStudentLength = (responses) => {
  const countMap = {};

  if (!responses) return;
  responses.forEach((response) => {
    const studentCount = response.students.length;

    if (countMap[studentCount]) {
      countMap[studentCount]++;
    } else {
      countMap[studentCount] = 1;
    }
  });

  return countMap;
};

export const getDashboardData = async (period, user) => {
  const studentEndpoint = `/students/?period=${period}`;
  const answersEndpoint = `/forms/answers?period=${period}`;
  const topicsEndpoint = `/topics/?period=${period}`;
  const tutorsEndpoint = `/tutors/periods/${period}`;

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    params: {
      cache_bust: new Date().getTime(), // add params to avoid caching
    },
  };

  try {
    const responseStudents = await axios.get(`${BASE_URL}${studentEndpoint}`, config);
    const responseTopics = await axios.get(`${BASE_URL}${topicsEndpoint}`, config);
    const responseTutors = await axios.get(`${BASE_URL}${tutorsEndpoint}`, config);
    const responseAnswers = await axios.get(`${BASE_URL}${answersEndpoint}`, config);

    var data = {
      studentCard: null,
      topicsCard: null,
      tutorsCard: null,
      answersChart: [
        { name: "1 Integrantes", cantidad: null },
        { name: "2 Integrantes", cantidad: null },
        { name: "3 Integrantes", cantidad: null },
        { name: "4 Integrantes", cantidad: null },
      ],
      topics: null,
      tutors: null,
      students: null
    };

    data.studentCard = responseStudents.data.length;
    data.topicsCard = responseTopics.data.length;
    data.tutorsCard = responseTutors.data.length;

    data.topics = responseTopics.data;
    data.tutors = responseTutors.data;
    data.students = responseStudents.data;

    var clusteredTeams = countResponsesByStudentLength(responseAnswers.data);
    data.answersChart[0].cantidad = clusteredTeams[1] || 0;
    data.answersChart[1].cantidad = clusteredTeams[2] || 0;
    data.answersChart[2].cantidad = clusteredTeams[3] || 0;
    data.answersChart[3].cantidad = clusteredTeams[4] || 0;

    return data; // Retorna la data
  } catch (error) {
    throw error; // Lanza el error para manejarlo en el componente
  }
};


export const getTutorsData = async (period, user) => {
  const tutorsEndpoint = `/tutors/periods/${period}`;
  const data = {
    "tutors": null
  }
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    params: {
      cache_bust: new Date().getTime(), // add params to avoid caching
    },
  };

  try {
    const responseTutors = await axios.get(`${BASE_URL}${tutorsEndpoint}`, config);
    data.tutors = responseTutors.data;
    return data; // Retorna la data
  } catch (error) {
    throw error; // Lanza el error para manejarlo en el componente
  }
};