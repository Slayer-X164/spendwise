export type DashboardTransaction = {
  merchant: string;
  category: "Food & Dining" | "Transport" | "Entertainment";
  amount: number;
  method: string;
  date: string;
  status: "Completed" | "Pending";
};
