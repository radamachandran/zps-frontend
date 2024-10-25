export interface Leave {
  leaveId: number;
  employeeId: number;
  leaveForTheMonth: string;
  noOfDays: number;
  // Add other properties if necessary
}

export interface Department {
    departmentId: number;
    departmentName: string;
  }
  
  export interface Employee {
    employeeId: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: string;
    phoneNumber: string;
    email: string;
    dateOfJoining: string;
    dateOfLeaving: string;
    designation: string;
    active: boolean;
    department: Department;
    createdOn: string;
    createdBy: string;
    updatedOn: string;
    updatedBy: string;
    empNo: number;
    panCard: string;
    aadharCard:string;
    bankAcNo:string;
    bankName:string;
    ifsc:string;
    uan:string;
  }
  export interface zsalary{
    salaryId:number;
    employeeId: number;
    basic:number;
    conveyance:number;
    house_rent_allowance:number;
    medical_allowance:number;
    special_allowance:number;
    gross_salary:number;
  }

  export interface zdeduction{
    deduction_id:number;
    employee_id: number;
    amount:number;
  }