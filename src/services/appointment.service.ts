import { BadRequestError } from "../common/errors/bad-request-error";
import { JwtPayload } from "../common/global";
import { BookAppointmentDto, PatientDetailDto } from "../dto/user.dto";
import { AppointmentRepository, appointmentRepository } from "../repository/appointment.repository";
import { PatientRepository, patientRepository } from "../repository/patient.repository";
import { UserRepository, userRepository } from "../repository/user.repository";
import { USER_TYPE } from "../utils/constants";
import { SlotType } from "../utils/slot.type";
import { AuthService, authService } from "./auth.service";

export class AppointmentService {
    constructor(
        private userRepository: UserRepository,
        private authService: AuthService,
        private patientRepository: PatientRepository,
        private appointmentRepository: AppointmentRepository) {

    }

    async createUserAndBookAppointment(bookAppointmentDto: BookAppointmentDto) {

        const existingUser = await this.userRepository.findOneByEmail(bookAppointmentDto.email);
        if (existingUser) {
            const result = await this.appointmentRepository.createAppointment({ date: bookAppointmentDto.appointmentDt, doctorId: "656daa8ec19d5e392c6d3985", userId: existingUser._id });
            if (!result) return new BadRequestError("Couldn't book the appointment" + result);
            return result;
        } else {
            // Create patient account
            const newUser = await this.createPatientAccount(bookAppointmentDto)
            if (!newUser) return new BadRequestError("Couldn't create the patient");
            // Save patient detail
            const patient = await this.savePatientDetail(newUser._id, bookAppointmentDto)
            if (!patient) return new BadRequestError("Couldn't create the patient detail");
            // Book appointment for User
            const result = await this.appointmentRepository.createAppointment({ date: bookAppointmentDto.appointmentDt, doctorId: "656daa8ec19d5e392c6d3985", userId: newUser._id });
            if (!result) return new BadRequestError("Couldn't book the appointment");
            return result;
        }
    }

    async createPatientAccount(bookAppointmentDto: BookAppointmentDto) {
        return await this.userRepository.saveUser({
            name: bookAppointmentDto.name,
            email: bookAppointmentDto.email,
            mobile: bookAppointmentDto.mobile,
            password: '1234',
            isPasswordChanged: false,
            role: USER_TYPE.PATIENT
        });
    }

    async savePatientDetail(userId: string, bookAppointmentDto: BookAppointmentDto) {
        return await this.patientRepository.addPatientDetail({
            userId: userId,
            gender: bookAppointmentDto.gender,
            age: Number(bookAppointmentDto.age),
            occupation: bookAppointmentDto.occupation,
            address: bookAppointmentDto.address,
            presentComplain: bookAppointmentDto.presentComplain,
            pastMedicalHistory: bookAppointmentDto.pastMedicalHistory,
            familySevereDisease: bookAppointmentDto.familySevereDisease,
            familySevereDiseaseSide: bookAppointmentDto.familySevereDiseaseSide,
            familySevereDiseaseMember: bookAppointmentDto.familySevereDiseaseMember,
            familySevereDiseaseDetail: bookAppointmentDto.familySevereDiseaseDetail,
            smoking: bookAppointmentDto.smoking,
            alcoholic: bookAppointmentDto.alcoholic,
            drugAddict: bookAppointmentDto.drugAddict
        });
    }

    async bookAppointment(userId: string) {

        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) return new BadRequestError('User not found!');

        // const usernameTaken = await this.userRepository.findOneByUsername(user.username);
        // if (usernameTaken) return new BadRequestError('Username is already taken!');

        // user.password = await this.authService.pwdToHash(user.password);

        // const newUser = await this.userRepository.saveUser(user);
        // if (!newUser) return new BadRequestError("Couldn't register the user");

        // if (!UserService.JWT_KEY) return new BadRequestError("JWT key not found");
        // const token = await this.authService.generateJwt({ email: newUser.email, userId: newUser.id }, UserService.JWT_KEY);

        return { email: existingUser.email, name: existingUser };
    }


    async addPatientDetail(patientDetailDto: PatientDetailDto, payload: JwtPayload) {

        const user = await this.userRepository.findById(payload.userId);
        if (!user) return new BadRequestError("User not found");
        patientDetailDto.userId = user._id;
        const patientDetail = await this.patientRepository.addPatientDetail(patientDetailDto)
        if (!patientDetail) return new BadRequestError("Couldn't add patient detail");

        return patientDetail;
    }

    async getAppointmentSlot() {

        const allSlot = [];
        let slot: SlotType[] = [];
        const today = new Date();
        let dateArr: Date[] = [];

        const bookedSlot = await this.appointmentRepository.getAllAppointment();
        for (let k = 0; k < bookedSlot.length; k++) {
            // console.log('--------------------')
            console.log(bookedSlot[k].date.toLocaleString());
        }

        for (let i = 0; i < 6; i++) {
            const nextDate = new Date();
            nextDate.setDate(today.getDate() + i);
            dateArr.push(nextDate);
        }

        for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
            slot = [];

            for (let colIndex = 0; colIndex < dateArr.length; colIndex++) {
                if (bookedSlot.length > 0) {
                    switch (rowIndex) {
                        case 0:
                            this.isDateAvailable(dateArr[colIndex], 9, bookedSlot, slot);
                            break;
                        case 1:
                            this.isDateAvailable(dateArr[colIndex], 10, bookedSlot, slot);
                            break;
                        case 2:
                            this.isDateAvailable(dateArr[colIndex], 11, bookedSlot, slot);
                            break;
                        case 3:
                            this.isDateAvailable(dateArr[colIndex], 13, bookedSlot, slot)
                            break;
                        case 4:
                            this.isDateAvailable(dateArr[colIndex], 14, bookedSlot, slot)
                            break;
                        case 5:
                            this.isDateAvailable(dateArr[colIndex], 15, bookedSlot, slot);
                            break;
                        case 6:
                            this.isDateAvailable(dateArr[colIndex], 16, bookedSlot, slot)
                            break;
                        case 7:
                            this.isDateAvailable(dateArr[colIndex], 17, bookedSlot, slot)
                            break;
                        case 8:
                            this.isDateAvailable(dateArr[colIndex], 18, bookedSlot, slot)
                            break;

                    }



                } else {
                    this.createSlot(rowIndex, slot);
                }
            }
            allSlot.push(slot);

        }

        return { dateArr, allSlot }
    }

    private createSlot(rowIndex: number, slotList: any) {
        if (rowIndex === 0) {
            slotList.push({ time: '09:00 AM', status: "available" });
        } else if (rowIndex === 1) {
            slotList.push({ time: '10:00 AM', status: "available" });
        } else if (rowIndex === 2) {
            slotList.push({ time: '11:00 AM', status: "available" });
        } else if (rowIndex === 3) {
            slotList.push({ time: '01:00 PM', status: "available" });
        } else if (rowIndex === 4) {
            slotList.push({ time: '02:00 PM', status: "available" });
        } else if (rowIndex === 5) {
            slotList.push({ time: '03:00 PM', status: "available" });
        } else if (rowIndex === 6) {
            slotList.push({ time: '04:00 PM', status: "available" });
        } else if (rowIndex === 7) {
            slotList.push({ time: '05:00 PM', status: "available" });
        } else if (rowIndex === 8) {
            slotList.push({ time: '06:00 PM', status: "available" });
        }
    }

    private isDateAvailable(date: Date, hour: number, bookedSlot: any, slot: any): void {
        let dateMatched = false;
        for (let k = 0; k < bookedSlot.length; k++) {
            // console.log('--------------------')
            // console.log(bookedSlot[k].date.toLocaleString())
            // console.log("passed -  dt" + date.getDate() + "  hr" + (hour))
            // console.log("date - " + date.getDate() + "  " + (date.getHours() + 1))
            // console.log("booked -  dt" + bookedSlot[k].date.getDate() + "  hr" + (bookedSlot[k].date.getHours()))
            // console.log('--------------------')
            if (date.getDate() === bookedSlot[k].date.getDate()) {
                if (hour === bookedSlot[k].date.getHours()) {
                    dateMatched = true;
                    bookedSlot.splice(k, 1);
                    break;
                } else {
                    dateMatched = false;
                }
            }
        }

        switch (hour) {
            case 9:
                if (dateMatched) {
                    slot.push({ time: '09:00 AM', status: "booked" });
                } else {
                    slot.push({ time: '09:00 AM', status: "available" });
                }
                break;
            case 10:
                if (dateMatched) {
                    slot.push({ time: '10:00 AM', status: "booked" });
                } else {
                    slot.push({ time: '10:00 AM', status: "available" });
                }
                break;
            case 11:
                if (dateMatched) {
                    slot.push({ time: '11:00 AM', status: "booked" });
                } else {
                    slot.push({ time: '11:00 AM', status: "available" });
                }
                break;
            // 12-01 will be lunch time
            case 13:
                if (dateMatched) {
                    slot.push({ time: '01:00 PM', status: "booked" });
                } else {
                    slot.push({ time: '01:00 PM', status: "available" });
                }
                break;
            case 14:
                if (dateMatched) {
                    slot.push({ time: '02:00 PM', status: "booked" });
                } else {
                    slot.push({ time: '02:00 PM', status: "available" });
                }
                break;
            case 15:
                if (dateMatched) {
                    slot.push({ time: '03:00 PM', status: "booked" });
                } else {
                    slot.push({ time: '03:00 PM', status: "available" });
                }
                break;
            case 16:
                if (dateMatched) {
                    slot.push({ time: '04:00 PM', status: "booked" });
                } else {
                    slot.push({ time: '04:00 PM', status: "available" });
                }
                break;
            case 17:
                if (dateMatched) {
                    slot.push({ time: '05:00 PM', status: "booked" });
                } else {
                    slot.push({ time: '05:00 PM', status: "available" });
                }
                break;
            case 18:
                if (dateMatched) {
                    slot.push({ time: '06:00 PM', status: "booked" });
                } else {
                    slot.push({ time: '06:00 PM', status: "available" });
                }
                break;
        }


    }

    async getAppointmentByDoctorId(doctorId: string) {

        let appointmentList: any[] = [];

        const appointments = await this.appointmentRepository.getAppointmentByDoctorId(doctorId);
        if (!appointments) return new BadRequestError("Couldn't get the appointment");

        for (let k = 0; k < appointments.length; k++) {
            // console.log('--------------------')
            const appointment = { date: appointments[k].date, doctor: appointments[k].doctorId, patient: appointments[k].userId };
            appointmentList.push(appointment);
        }
        return appointmentList;
    }
}

export const appointmentService = new AppointmentService(userRepository, authService, patientRepository, appointmentRepository);