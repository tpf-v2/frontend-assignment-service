import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const getPeriodsGroup = async (user) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      //const url = `${BASE_URL}/api/tutors/periods`;
      //const response = await axios.get(url, config);
      //return response.data;
      const response = [
        {
          "id": 15,
          "students": [
            {
              "id": 105157,
              "name": "TOMÁS LEONEL",
              "last_name": "APALDETTI",
              "email": "tapaldetti@fi.uba.ar"
            },
            {
              "id": 103963,
              "name": "CAROLINA",
              "last_name": "DI MATTEO",
              "email": "cdimatteo@fi.uba.ar"
            },
            {
              "id": 105554,
              "name": "FRANCISCO",
              "last_name": "ORQUERA LORDA",
              "email": "forqueral@fi.uba.ar"
            },
            {
              "id": 104909,
              "name": "NAZARENO GABRIEL",
              "last_name": "TAIBO",
              "email": "ngtaibo@fi.uba.ar"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 39,
          "tutor_period_id": 14,
          "preferred_topics": [
            39,
            20,
            1
          ]
        },
        {
          "id": 13,
          "students": [
            {
              "id": 100053,
              "name": "GABRIEL IGNACIO",
              "last_name": "BELLETTI",
              "email": "gbelletti@fi.uba.ar"
            },
            {
              "id": 102174,
              "name": "TOMAS GONZALO",
              "last_name": "DEL PUP",
              "email": "tdelpup@fi.uba.ar"
            },
            {
              "id": 100498,
              "name": "FRANCO MARTIN",
              "last_name": "DI MARIA",
              "email": "fdimaria@fi.uba.ar"
            },
            {
              "id": 97013,
              "name": "AMARU GABRIEL",
              "last_name": "DURAN",
              "email": "agduran@fi.uba.ar"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 16,
          "tutor_period_id": 19,
          "preferred_topics": [
            35,
            23,
            16
          ]
        },
        {
          "id": 6,
          "students": [
            {
              "id": 108225,
              "name": "RAFAEL FRANCISCO",
              "last_name": "BERENGUEL IBARRA",
              "email": "rberenguel@fi.uba.ar"
            },
            {
              "id": 108018,
              "name": "BRUNO LUCIANO",
              "last_name": "STARNONE",
              "email": "bstarnone@fi.uba.ar"
            },
            {
              "id": 108111,
              "name": "JULIAN MELMER",
              "last_name": "STIEFKENS",
              "email": "sadeijuop12@gmail.com"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 46,
          "tutor_period_id": 27,
          "preferred_topics": []
        },
        {
          "id": 2,
          "students": [
            {
              "id": 104348,
              "name": "JOAQUIN",
              "last_name": "BETZ RIVERA",
              "email": "jbetz@fi.uba.ar"
            },
            {
              "id": 103924,
              "name": "JOAQUIN FACUNDO",
              "last_name": "FONTELA",
              "email": "jfontela@fi.uba.ar"
            },
            {
              "id": 104429,
              "name": "THIAGO",
              "last_name": "KOVNAT",
              "email": "tkovnat@fi.uba.ar"
            },
            {
              "id": 104105,
              "name": "JONATHAN DAVID",
              "last_name": "ROSENBLATT",
              "email": "jrosenblatt@fi.uba.ar"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 42,
          "tutor_period_id": 26,
          "preferred_topics": []
        },
        {
          "id": 8,
          "students": [
            {
              "id": 90123,
              "name": "GERMAN BERNARDO",
              "last_name": "BOBADILLA CATALAN",
              "email": "gbobadilla@fi.uba.ar"
            },
            {
              "id": 90903,
              "name": "ANTONELLA",
              "last_name": "BRIGLIA",
              "email": "abriglia@fi.uba.ar"
            },
            {
              "id": 94224,
              "name": "JULIAN WEIDER",
              "last_name": "QUINO LOPEZ",
              "email": "jquino@fi.uba.ar"
            },
            {
              "id": 102197,
              "name": "AGUSTIN",
              "last_name": "TESTON",
              "email": "ateston@fi.uba.ar"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 14,
          "tutor_period_id": 20,
          "preferred_topics": [
            39,
            14,
            13
          ]
        },
        {
          "id": 4,
          "students": [
            {
              "id": 96722,
              "name": "FEDERICO EZEQUIEL",
              "last_name": "BOGOVIC",
              "email": "fbogovic@fi.uba.ar"
            },
            {
              "id": 85488,
              "name": "RAMIRO JAVIER",
              "last_name": "GONZALEZ",
              "email": "javrei10@gmail.com"
            },
            {
              "id": 104639,
              "name": "ALEXIS BRIAN",
              "last_name": "HERRERA AGUILAR",
              "email": "abherrera@fi.uba.ar"
            },
            {
              "id": 103207,
              "name": "FRANCISCO NICOLAS",
              "last_name": "VIÑAS",
              "email": "fvinas@fi.uba.ar"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 44,
          "tutor_period_id": 5,
          "preferred_topics": []
        },
        {
          "id": 12,
          "students": [
            {
              "id": 96978,
              "name": "JULIÁN",
              "last_name": "CASSI",
              "email": "Jcassi@fi.uba.ar"
            },
            {
              "id": 93720,
              "name": "DEMIAN EZEQUIEL",
              "last_name": "LOPEZ",
              "email": "demi_lopez@hotmail.com"
            },
            {
              "id": 99390,
              "name": "FRANCISCO",
              "last_name": "SICARDI RIOBO",
              "email": "fsicardi@fi.uba.ar"
            },
            {
              "id": 95242,
              "name": "JUAN SEBASTIÁN",
              "last_name": "ALVAREZ WINDEY",
              "email": "jalvarezw@fi.uba.ar"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 13,
          "tutor_period_id": 11,
          "preferred_topics": [
            1,
            13,
            38
          ]
        },
        {
          "id": 3,
          "students": [
            {
              "id": 104891,
              "name": "CLAUDIA MARCELA",
              "last_name": "COMINOTTI",
              "email": "ccominotti@fi.uba.ar"
            },
            {
              "id": 105658,
              "name": "MARIANA",
              "last_name": "GALDO MARTINEZ",
              "email": "mgaldo@fi.uba.ar"
            },
            {
              "id": 87796,
              "name": "GABRIEL",
              "last_name": "LA TORRE",
              "email": "gala@fi.uba.ar"
            },
            {
              "id": 102876,
              "name": "DYLAN",
              "last_name": "LEDESMA",
              "email": "dledesma@fi.uba.ar"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 43,
          "tutor_period_id": 2,
          "preferred_topics": []
        },
        {
          "id": 7,
          "students": [
            {
              "id": 94773,
              "name": "ALEXANDER EMANUEL",
              "last_name": "CONDO",
              "email": "acondo@fi.uba.ar"
            },
            {
              "id": 101651,
              "name": "FELIPE",
              "last_name": "COPERTINI",
              "email": "fcopertini@fi.uba.ar"
            },
            {
              "id": 81052,
              "name": "CESAR FABIAN",
              "last_name": "LEGUIZAMON",
              "email": "fabi1816@gmail.com"
            },
            {
              "id": 81027,
              "name": "GINO",
              "last_name": "MONTERROSO CARRILLO",
              "email": "gmc.eagles@gmail.com"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 24,
          "tutor_period_id": 24,
          "preferred_topics": [
            31,
            24,
            33
          ]
        },
        {
          "id": 9,
          "students": [
            {
              "id": 106171,
              "name": "MAURICIO",
              "last_name": "DAVICO",
              "email": "mdavico@fi.uba.ar"
            },
            {
              "id": 97112,
              "name": "LUCIA AILEN",
              "last_name": "KASMAN",
              "email": "lkasman@fi.uba.ar"
            },
            {
              "id": 96467,
              "name": "JOSE EDUARDO",
              "last_name": "CHAVEZ CABANILLAS",
              "email": "jchavez@fi.uba.ar"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 36,
          "tutor_period_id": 18,
          "preferred_topics": [
            36,
            13,
            1
          ]
        },
        {
          "id": 5,
          "students": [
            {
              "id": 106308,
              "name": "FRANCISCO",
              "last_name": "DUCA",
              "email": "fduca@fi.uba.ar"
            },
            {
              "id": 108937,
              "name": "PEDRO",
              "last_name": "GRIN",
              "email": "grinpedro99@gmail.com"
            },
            {
              "id": 105853,
              "name": "ANA GABRIELA",
              "last_name": "GUTSON",
              "email": "agutson@fi.uba.ar"
            },
            {
              "id": 106099,
              "name": "TOMÁS JORGE",
              "last_name": "SHIAO",
              "email": "tshiao@fi.uba.ar"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 45,
          "tutor_period_id": 34,
          "preferred_topics": []
        },
        {
          "id": 17,
          "students": [
            {
              "id": 97261,
              "name": "NICOLAS RAFAEL",
              "last_name": "FARFAN LENCINA",
              "email": "niko.f2@gmail.com"
            },
            {
              "id": 93395,
              "name": "JUAN FEDERICO",
              "last_name": "FULD",
              "email": "juanfedericofuld@gmail.com"
            },
            {
              "id": 105703,
              "name": "MARCELO ARIEL",
              "last_name": "RONDAN",
              "email": "mrondan@fi.uba.ar"
            },
            {
              "id": 105558,
              "name": "ARIANA MAGALÍ",
              "last_name": "SALESE D'ASSARO",
              "email": "asalese@fi.uba.ar"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 32,
          "tutor_period_id": 24,
          "preferred_topics": [
            32,
            33,
            7
          ]
        },
        {
          "id": 14,
          "students": [
            {
              "id": 107587,
              "name": "PEDRO",
              "last_name": "GALLINO",
              "email": "pgallino@fi.uba.ar"
            },
            {
              "id": 105798,
              "name": "Tomás Alejandro",
              "last_name": "Grüner",
              "email": "tgruner@fi.uba.ar"
            },
            {
              "id": 108448,
              "name": "JUAN MANUEL",
              "last_name": "POL",
              "email": "jpol@fi.uba.ar"
            },
            {
              "id": 105637,
              "name": "VALENTIN",
              "last_name": "SANTANDER",
              "email": "baja@fi.uba.ar"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 10,
          "tutor_period_id": 4,
          "preferred_topics": [
            31,
            10,
            39
          ]
        },
        {
          "id": 11,
          "students": [
            {
              "id": 105892,
              "name": "LUCIANO MARTIN",
              "last_name": "GAMBERALE",
              "email": "lgamberale@fi.uba.ar"
            },
            {
              "id": 103745,
              "name": "ERICK GABRIEL",
              "last_name": "MARTINEZ QUINTERO",
              "email": "erickm1299@gmail.com"
            },
            {
              "id": 98439,
              "name": "NICOLÁS",
              "last_name": "TORRES DALMAS",
              "email": "ntorresdalma@fi.uba.ar"
            },
            {
              "id": 107378,
              "name": "MIGUEL ANGEL",
              "last_name": "VÁSQUEZ JIMÉNEZ",
              "email": "mvasquezj@fi.uba.ar"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 31,
          "tutor_period_id": 16,
          "preferred_topics": [
            31,
            35,
            19
          ]
        },
        {
          "id": 16,
          "students": [
            {
              "id": 100998,
              "name": "SEBASTIAN BENTO",
              "last_name": "INNEO VEIGA",
              "email": "sinneo@fi.uba.ar"
            },
            {
              "id": 105978,
              "name": "JOAQUIN",
              "last_name": "PRADA",
              "email": "jprada@fi.uba.ar"
            },
            {
              "id": 102730,
              "name": "LUCAS NAHUEL",
              "last_name": "SOTELO GUERREÑO",
              "email": "lsotelo@fi.uba.ar"
            },
            {
              "id": 105980,
              "name": "JOAQUIN MATIAS",
              "last_name": "VELAZQUEZ",
              "email": "jvelazquez@fi.uba.ar"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 1,
          "tutor_period_id": 3,
          "preferred_topics": [
            1,
            40,
            31
          ]
        },
        {
          "id": 18,
          "students": [
            {
              "id": 91378,
              "name": "MATÍAS EZEQUIEL",
              "last_name": "LAFROCE",
              "email": "mlafroce@fi.uba.ar"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 47,
          "tutor_period_id": 25,
          "preferred_topics": []
        },
        {
          "id": 10,
          "students": [
            {
              "id": 87528,
              "name": "RICARDO",
              "last_name": "LUIZAGA",
              "email": "rluizaga@fi.uba.ar"
            },
            {
              "id": 105645,
              "name": "ALEJO TOMÁS",
              "last_name": "MARIÑO",
              "email": "atmarino@fi.uba.ar"
            },
            {
              "id": 102256,
              "name": "Abraham",
              "last_name": "Osco",
              "email": "aosco@fi.uba.ar"
            },
            {
              "id": 106004,
              "name": "Franco",
              "last_name": "Primerano",
              "email": "fprimeranolomba@fi.uba.ar"
            }
          ],
          "period_id": "2C2024",
          "topic_id": 35,
          "tutor_period_id": 18,
          "preferred_topics": [
            35,
            14,
            16
          ]
        }
      ]
  
      return response
    } catch (error) {
      throw new Error('Error fetching cuatrimestres: ' + error.message);
    }
  };