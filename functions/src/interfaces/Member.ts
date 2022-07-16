export default interface Member {
  ID: number;
  admin: boolean;
  code: string;
  credit: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  stripeID: string;
}
