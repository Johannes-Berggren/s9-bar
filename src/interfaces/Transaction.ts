export default interface Transaction {
  ID: number;
  amount: number;
  created: number;
  creditsUsed: number;
  description: string;
  itemID: number;
  memberID: number;
}
