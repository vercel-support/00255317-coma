import Header from "@/components/custom ui/Header";
import Footer from "@/components/custom ui/footer";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full overflow-hidden">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
