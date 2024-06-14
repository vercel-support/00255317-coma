import Container from "@/components/custom ui/container";
import { TitleAdmin } from "@/components/custom ui/title-admin";

import { PrivateRoute } from "@/lib/routes";
import { LayoutDashboard } from "lucide-react";

const DashboardPage = async () => {
  return (
    <Container className="min-h-[100vh] pt-10 w-full">
      <TitleAdmin
        title={PrivateRoute.DASHBOARD.title}
        icon={<LayoutDashboard />}
        url={PrivateRoute.DASHBOARD.href}
      />

      <div className="w-full mx-auto sm:px-6 lg:px-8">cards</div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="w-full md:w-1/2">chart</span>
        <span className="w-full md:w-1/2">cards</span>
      </div>
    </Container>
  );
};

export default DashboardPage;
