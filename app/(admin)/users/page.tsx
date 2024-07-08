import { UsersClient } from "@/components/admin/user/users-client";
import HeaderAdminBox from "@/components/custom ui/HeaderAdminBox";
import Container from "@/components/custom ui/container";
import { FlexContainer } from "@/components/custom ui/flex-container";
import { getUsers } from "@/data/user.data";
import { CustomError } from "@/lib/custom-error.class";
import { PiUsersThreeBold } from "react-icons/pi";

const UsersPage = async () => {
  const { error, message, data, code } = await getUsers();
  if (error) throw new CustomError(message, code);
  return (
    <Container className="min-h-[100vh] pt-10">
      <HeaderAdminBox
        icon={<PiUsersThreeBold className="text-white h-20 w-20" />}
        title={"Usuarios"}
        titleBigDetail={data?.length ?? 0}
        titleBoxLeft={""}
        contentBoxLeft={undefined}
        titleBoxRight={""}
        contentBoxRight={undefined}
      />
      <FlexContainer className="gap-8">
        <UsersClient data={data!} />
      </FlexContainer>
    </Container>
  );
};

export default UsersPage;
