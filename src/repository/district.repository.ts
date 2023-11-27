import { CreateDistrictDto } from "../dto/district.dto";
import District, { IDistrictModel } from "../models/district.model";


export class DistrictRepository {

    constructor(private districtModel: IDistrictModel) { }

    async createDistrict(createDistrictDto: CreateDistrictDto) {
        const district = new this.districtModel(createDistrictDto);
        return district.save();
    }

    async getAllDistrict() {
        return this.districtModel.find({});
    }
}


export const districtRepository = new DistrictRepository(District);