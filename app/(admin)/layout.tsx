import LeftSideBar from "@/components/layout/LeftSideBar";
import TopBar from "@/components/layout/TopBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex max-md:flex-col">
      <LeftSideBar />
      <TopBar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
