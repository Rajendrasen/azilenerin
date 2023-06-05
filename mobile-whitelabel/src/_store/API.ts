/* tslint:disable */
//  This file was automatically generated and should not be edited.

export enum UserRole {
  employee = "employee",
  manager = "manager",
  admin = "admin",
  superAdmin = "superAdmin",
}


export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser:  {
    __typename: "User",
    id: string,
    companyId: string,
    company:  {
      __typename: "Company",
      id: string,
      name: string,
    } | null,
    emailAddress: string,
    password: string | null,
    role: UserRole,
    firstName: string | null,
    lastName: string | null,
    title: string | null,
    avatar: string | null,
    lastLogin: string | null,
    referrals:  Array< {
      __typename: "Referral",
      id: string,
      companyId: string,
      contact:  {
        __typename: "Contact",
        id: string,
        firstName: string,
        lastName: string,
      } | null,
      user:  {
        __typename: "User",
        id: string,
        firstName: string | null,
        lastName: string | null,
      } | null,
      jobId: string,
      note: string | null,
      message: string | null,
      referralDate: string | null,
    } | null >,
    totalReferrals: number | null,
    active: boolean,
  } | null,
};
