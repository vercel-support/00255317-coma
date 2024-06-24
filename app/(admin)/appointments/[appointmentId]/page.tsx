import AppointmentAgreeForm from "@/components/admin/appointments/form";
import HeaderAdminBox from "@/components/custom ui/HeaderAdminBox";
import Container from "@/components/custom ui/container";
import { getAppointmentById } from "@/data/appoinments.data";
import { CustomError } from "@/lib/custom-error.class";
import { Calendar } from "lucide-react";
import { FaRegCalendarAlt } from "react-icons/fa";

const AppointmentPage = async ({
  params,
}: {
  params: { appointmentId: string };
}) => {
  let loading = true;
  const { data, code, error, message } = await getAppointmentById({
    id: params.appointmentId,
  });
  if (error || !data) throw new CustomError(message, code);
  loading = false;
  return (
    <Container>
      <HeaderAdminBox
        icon={<FaRegCalendarAlt className="text-white h-20 w-20" />}
        title={`${data?.user?.name.toUpperCase()}`}
        titleBigDetail={`${data.service?.name}`}
        titleBoxLeft={""}
        contentBoxLeft={undefined}
        titleBoxRight={""}
        contentBoxRight={undefined}
        back
      />
      {loading ? <>cargando ..</> : <AppointmentAgreeForm initialData={data} />}
    </Container>
  );
};

export default AppointmentPage;
