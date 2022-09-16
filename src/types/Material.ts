import Stage from "./Stage";

interface Material {
    ownerId: string, //check
    custom: boolean,//check
    scraped: boolean,//check
    generic: boolean,//check
    expectedLifespan: number,//check
    shortName: string, //check
    description: string,//check
    additionalSources: string[],
    link: string[],
    stages:[Stage] 
    declaredUnit: {
        declaredUnit: number,
        declaredValue: number,
        mass: number,
        massUnit: number

    },
    epdInfo: {
        epdSpecificationForm: number,//check
        epdProductIndustryType: number,//check
        issuedAt: string,//check
        validTo: string//check

    },
    transport:{
        fuelType: string,
        transportType: string,
        distance: {value: number, unit: string},
        capacityUtilizationInclEmpty: {value: number, unit: string},
        massPerDeclaredUnit: {value: number, unit: string},
        capacityUtilizationVolume: {value: number, unit:string}
      },
    tags: string[]
    }
    
    export default Material;