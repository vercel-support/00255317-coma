import { UsersClient } from "@/components/admin/user/users-client";
import Container from "@/components/custom ui/container";
import { FlexContainer } from "@/components/custom ui/flex-container";
import { TitleAdmin } from "@/components/custom ui/title-admin";
import { getUsers } from "@/data/user.data";
import { CustomError } from "@/lib/custom-error.class";
import { PrivateRoute } from "@/lib/routes";
import { PiUsersThreeBold } from "react-icons/pi";

const UsersPage = async () => {
  const { error, message, data, code } = await getUsers();
  if (error) throw new CustomError(message, code);
  return (
    <Container className="min-h-[100vh] pt-10">
      <TitleAdmin
        title={PrivateRoute.USERS.title}
        icon={<PiUsersThreeBold />}
        url={PrivateRoute.USERS.href}
      />
      <FlexContainer className="gap-8">
        <UsersClient data={data!} />
      </FlexContainer>
    </Container>
  );
};

export default UsersPage;
