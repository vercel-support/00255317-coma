"use client";
import { authorizeRoles } from "@/actions/user.action";
import LeftSideBar from "@/components/layout/LeftSideBar";
import TopBar from "@/components/layout/TopBar";
import { UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loading from "../loading";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    setLoading(true);
    const aut = async () => {
      const authorize = await authorizeRoles([UserRole.ADMIN]);
      if (!authorize) {
        setLoading(false);
        router.push("/");
      }
    };
    aut();
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  } else {
    return (
      <div className="flex max-md:flex-col">
        <LeftSideBar />
        <TopBar />
        <div className="flex-1">{children}</div>
      </div>
    );
  }
}
