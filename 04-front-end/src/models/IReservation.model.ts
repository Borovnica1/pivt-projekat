export interface IReservation {
  reservationId: number;
  firstName: string;
  lastName: string;
  phoneNumber: number;
  email: string;
  reservationDate: string;
  reservationDuration: number;
  status: "pending" | "confirmed";
  tableId: number;
  userId: number;
}