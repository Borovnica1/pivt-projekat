export default interface ITokenData {
  role: "user" | "manager" | "administrator";
  id: number;
  identity: string;
}
