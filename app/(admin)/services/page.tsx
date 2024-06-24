import { ServicesClient } from "@/components/admin/services/service-client";
import Container from "@/components/custom ui/container";
import { getAllServices } from "@/data/services.data";
import { CustomError } from "@/lib/custom-error.class";
import React from "react";

const ServicesPage = async () => {
  let loading = true;
  const { error, message, data, code } = await getAllServices();
  if (error || !data) throw new CustomError(message, code);
  loading = false;
  return (
    <Container>
      <ServicesClient services={data} loading={loading} />
    </Container>
  );
};

export default ServicesPage;
