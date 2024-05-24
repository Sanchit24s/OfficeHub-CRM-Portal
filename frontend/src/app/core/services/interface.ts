export interface Holiday {
    _id: string,
    date: string,
    name: string,
    description?: string,
}

export interface Employee {
    employeeId: string,
    userName: string,
    date: Date,
    checkIn: Date,
    checkOut: Date,
    status: string,
    profileImage: string;
}

export interface Users {
    _id?: string;
    profileImage?: string;
    employeeId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    designation?: string;
    role?: string;
    createdAt?: Date;
    gender?: string;
    currentAddress?: string | null;
    currentCity?: string | null;
    currentState?: string | null;
    currentCountry?: string | null;
    currentPinCode?: string | null;
    permanentAddress?: string | null;
    permanentCity?: string | null;
    permanentState?: string | null;
    permanentCountry?: string | null;
    permanentPinCode?: string | null;
    bloodGroup?: string;
    dateOfBirth?: Date;
    age?: string;
    marriedStatus?: string;
    anniversaryDate?: Date;
    haveChildren?: string;
    partnerName?: string;
    childrenNames?: string;
    workExperience?: string;
    educationalQualifications?: string;
    certifications?: string;
    skills?: string;
}

export interface notifications{
    employeeId?: string;
    title?: string;
    description?: string;
    date?: Date;
}

