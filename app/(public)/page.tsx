import SectionComponent from "@/components/custom ui/SectionComponent";
import WindowComponent from "@/components/custom ui/WindowComponent";
import { Logo } from "@/components/custom ui/logo";
import { Button } from "@/components/ui/button";
import { PrivateRoute } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex  flex-col items-center justify-center ">
      {/* HERO */}

      <section
        id={"hero"}
        className="w-screen h-fit overflow-auto flex flex-col items-center justify-start pt-20 gap-6 pb-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brandingThird to-brandingSecond"
      >
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center p-6  gap-y-8">
          {/* columna 1 */}
          <div className="w-full flex flex-col items-center">
            <h1 className="text-4xl text-white text-center leading-relaxed mb-4">
              Despierta a un nuevo amanecer en tu relación con la <br />
              <span className="text-branding bg-brandingThird rounded-md p-2 font-extrabold ">
                asesoría profesional de C.O.M.A
              </span>
            </h1>
            <p className="w-3/4 text-white text-center mb-4">
              Mejora la comunicación, resuelve conflictos y recupera la chispa
              en tu relación.
            </p>
            <Button variant={"secondary"}>Reserva tu Asesoría ahora</Button>
          </div>

          {/* columna 2 */}
          <div className="realtive w-full h-full">
            {/* ventana con pareja */}
            <div className="md:absolute md:left-40 lg:left-80 md:top-30 lg:top-40 w-full h-full flex flex-col items-center gap-8">
              <div className="relative w-[300px] h-[300px] bg-brandingThird  rounded-t-full border-8 border-white overflow-visible shadow-2xl">
                <div className="absolute top-[-114px] left-[-210px] w-[600px] h-[600px]">
                  <Image
                    src="/pareja.png"
                    width={800}
                    height={800}
                    alt="pareja"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionComponent
        title={"¿Por qué elegir C.O.M.A?"}
        sectionId={"profit"}
        nextSectionId="valueCompany"
        children={
          <ul>
            <li>Asesoría personalizada con el Rabino Gabriel Curdi</li>
            <li>Sesiones online y presenciales disponibles</li>
            <li>
              Metodologías basadas en la Terapia Focalizada en las Emociones"
            </li>
          </ul>
        }
      />
      <SectionComponent
        title={"C.O.M.A"}
        description="En C.O.M.A, ofrecemos terapias personalizadas de alta calidad para aquellos que buscan un bienestar integral. El Rabino Gabriel Curdi se dedica a proporcionar atención exclusiva y asesorias innovadoras que realmente marcan la diferencia."
        sectionId={"valueCompany"}
        nextSectionId="reviews"
        children={
          <>
            <h3>Puntos Clave:</h3>
            <ul>
              <li>Asesoría personalizadas y exclusivas</li>
              <li>Atención profesional de primera clase</li>
              <li>Resultados visibles y duraderos</li>
            </ul>
          </>
        }
      />
      <SectionComponent
        title={"Lo que dicen nuestros pacientes"}
        sectionId={"reviews"}
        nextSectionId="contact"
        children={<p>reviews y testimonios</p>}
      />
      <SectionComponent
        nextSectionId={"price"}
        title={"Contacto"}
        sectionId={"contact"}
        className="w-full bg-branding"
      >
        {/* <ContactForm /> */} formulario contacto
      </SectionComponent>
    </main>
  );
}
