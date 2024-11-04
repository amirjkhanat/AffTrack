import { Metadata } from "next";
import DashboardTab from "@/components/reports/dashboard-tab";

export const metadata: Metadata = {
  title: "Dashboard - AffTrack",
  description: "View your affiliate tracking metrics and performance.",
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <DashboardTab />
    </div>
  );
}