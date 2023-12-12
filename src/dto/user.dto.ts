

export interface AuthUserDto {
    emailOrUsername: string;
    password: string;
}

export interface CreateUserDto {
    name: string;
    email: string;
    mobile: string;
    password: string;
    isPasswordChanged: boolean;
    role: string;
}

export interface BookAppointmentDto {
    name: string;
    email: string;
    mobile: string;
    gender: string;
    age: string;
    occupation: string;
    address: string;
    appointmentDt: Date;
    presentComplain: string;
    pastMedicalHistory: string;
    familySevereDisease: string;
    familySevereDiseaseSide: string;
    familySevereDiseaseMember: string;
    familySevereDiseaseDetail: string;
    smoking: string;
    alcoholic: string;
    drugAddict: string;
}

export interface PatientDetailDto {
    userId: string;
    gender: string;
    age: number;
    occupation: string;
    address: string;
    presentComplain: string;
    pastMedicalHistory: string;
    familySevereDisease: string;
    familySevereDiseaseSide: string;
    familySevereDiseaseMember: string;
    familySevereDiseaseDetail: string;
    smoking: string;
    alcoholic: string;
    drugAddict: string;
}


export interface CreateAppointmentDto {
    date: Date;
    doctorId: string;
    userId: string;
}