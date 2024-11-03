export interface Consulta{
    id: number;
    appointmentReason: string;
    appointmentDate: string; // use Date se o valor já for um objeto Date ao invés de string
    appointmentTime: string; // use Date se o valor já for um objeto Date ao invés de string
    problemDescription: string;
    prescribedMedication: string;
    observations: string;
    patientId: number;
}


/*
	"appointment": {
		"id": 1,
		"appointmentReason": "Dor de cabeça paciente ",
		"appointmentDate": "2023-10-02",
		"appointmentTime": "10:33:00",
		"problemDescription": "Paciente apresenta dor intensa na cabeça.",
		"prescribedMedication": "Paracetamol",
		"observations": "Paciente deve retornar em uma semana.",
		"patientId": 1
	}
*/
