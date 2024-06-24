import { AppointmentsClient } from "@/components/admin/appointments/appointment-client";
import { ServicesClient } from "@/components/admin/services/service-client";
import Container from "@/components/custom ui/container";
import { getAllAppointments } from "@/data/appoinments.data";
import { getAllServices } from "@/data/services.data";
import { CustomError } from "@/lib/custom-error.class";
import React from "react";

const AppointmentsPage = async () => {
  let loading = true;
  const { error, message, data, code } = await getAllAppointments();
  if (error || !data) throw new CustomError(message, code);
  loading = false;
  return (
    <Container>
      <AppointmentsClient appointments={data} loading={loading} />
    </Container>
  );
};

export default AppointmentsPage;
