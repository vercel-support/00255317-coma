import { Button } from "@/components/ui/button";
import { PrivateRoute } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-600">
      <div className="space-y-6 text-center">
        <div className="flex items-center space-x-6">
          <Image
            src="/logo-gesapp-white.svg"
            alt="Gesapp"
            width={150}
            height={150}
          />
          <h1 className="text-6xl font-extrabold text-primary drop-shadow-xl text-white">
            GESAPP{" "}
          </h1>
        </div>
        <p className="text-white text-lg">
          TPV + Gestor de negocio para pequeñas y medianas empresas B2C.
        </p>{" "}
        <div>
          <Link href={PrivateRoute.DASHBOARD.href}>
            <Button variant="secondary" size="lg">
              Entrar
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
