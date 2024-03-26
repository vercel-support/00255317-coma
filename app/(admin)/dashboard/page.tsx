import { CardsDashboard } from "@/components/admin/dashboard/cards-dashboard";
import { CashFlowAreaChart } from "@/components/admin/dashboard/cashflow-areachart";
import { ProductsSoldChart } from "@/components/admin/dashboard/products-barchart";
import Container from "@/components/custom ui/container";
import { TitleAdmin } from "@/components/custom ui/title-admin";
import {
  BestSellingProduct,
  getBestSellingProducts,
} from "@/data/products.data";
import {
  getDailyCashFlow,
  getTotalCosts,
  getTotalRevenue,
  getTotalSales,
} from "@/data/sales.data";
import { PrivateRoute } from "@/lib/routes";
import { LayoutDashboard } from "lucide-react";

const DashboardPage = async () => {
  const { data: totalRevenue } = await getTotalRevenue({
    startDate: new Date(),
    endDate: new Date(),
  });
  const { data: totalSales } = await getTotalSales({
    startDate: new Date(),
    endDate: new Date(),
  });
  const { data: totalCost } = await getTotalCosts({
    startDate: new Date(),
    endDate: new Date(),
  });
  const { data: cashFlow } = await getDailyCashFlow({
    startDate: new Date(),
    endDate: new Date(),
  });

  const bestSellingProducts: BestSellingProduct[] =
    await getBestSellingProducts({
      startDate: new Date(),
      endDate: new Date(),
    });

  return (
    <Container className="min-h-[100vh] pt-10 w-full">
      <TitleAdmin
        title={PrivateRoute.DASHBOARD.title}
        icon={<LayoutDashboard />}
        url={PrivateRoute.DASHBOARD.href}
      />

      <div className="w-full mx-auto sm:px-6 lg:px-8">
        <CardsDashboard
          totalRevenue={totalRevenue}
          totalSales={totalSales}
          totalCost={totalCost}
          cashFlow={cashFlow}
        />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="w-full md:w-1/2">
          <ProductsSoldChart data={bestSellingProducts} />
        </span>
        <span className="w-full md:w-1/2">
          <CashFlowAreaChart />
        </span>
      </div>
    </Container>
  );
};

export default DashboardPage;
