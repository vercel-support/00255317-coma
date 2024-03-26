import { Poppins } from "next/font/google";
import { Logo } from "@/components/custom ui/logo";

const font = Poppins({
  subsets: ["latin"],
  weight: "600",
});

interface HeaderProps {
  label: string;
}
export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <Logo />
    </div>
  );
};
