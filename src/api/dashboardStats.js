import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

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

export const getDashboardData = async (cuatrimestre, user) => {
  const studentEndpoint = "/students/";
  const answersEndpoint = "/forms/answers";
  const topicsEndpoint = "/topics/";
  const tutorsEndpoint = `/tutors/periods/${cuatrimestre}`;

  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };

  try {
    const responseStudent = await axios.get(`${BASE_URL}${studentEndpoint}`, config);
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
        { name: "4 Integrante", cantidad: null },
      ],
    };

    data.studentCard = responseStudent.data.length;
    data.topicsCard = responseTopics.data.length;
    data.tutorsCard = responseTutors.data.length;

    var clusteredGroups = countResponsesByStudentLength(responseAnswers.data);
    console.log(clusteredGroups);
    data.answersChart[0].cantidad = clusteredGroups[1] || 0;
    data.answersChart[1].cantidad = clusteredGroups[2] || 0;
    data.answersChart[2].cantidad = clusteredGroups[3] || 0;
    data.answersChart[3].cantidad = clusteredGroups[4] || 0;

    return data; // Retorna la data
  } catch (error) {
    throw error; // Lanza el error para manejarlo en el componente
  }
};
