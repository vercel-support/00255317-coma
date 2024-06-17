import AppoinmentForm from "@/components/custom ui/AppoinmentForm";
import SectionComponent from "@/components/custom ui/SectionComponent";
import WindowComponent from "@/components/custom ui/WindowComponent";
import { Logo } from "@/components/custom ui/logo";
import { Button } from "@/components/ui/button";
import { PrivateRoute } from "@/lib/routes";
import { Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  FaChartLine,
  FaComment,
  FaHeart,
  FaLeaf,
  FaMedal,
  FaShieldAlt,
  FaUserFriends,
} from "react-icons/fa";
import { GiScreaming } from "react-icons/gi";
export default function Home() {
  return (
    <main className="flex  flex-col items-center justify-center ">
      {/* HERO */}
      <section
        id={"hero"}
        className="w-screen h-full flex flex-col items-center justify-start pt-20 gap-6 pb-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brandingThird to-brandingSecond mb-12"
      >
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center p-6  gap-y-8">
          {/* columna 1 */}
          <div className="w-full flex flex-col items-center">
            <h1 className="text-5xl text-white text-center leading-relaxed mb-4">
              Despierta a un nuevo amanecer en tu relación con la
              <br />
              <span className="text-branding bg-brandingThird rounded-md p-2 font-extrabold ">
                asesoría matrimonial y de parejas de C.O.M.A
              </span>
            </h1>
            <p className="w-3/4 text-white text-center mb-4">
              Mejora la comunicación, resuelve conflictos y recupera la chispa
              en tu relación, en nuestro Centro Calificado de Exelencia.
            </p>
            <Button variant={"secondary"}>Reserva tu Asesoría ahora</Button>
          </div>

          {/* columna 2 */}

          {/* contenedor de ventana */}
          <div className=" w-full h-full flex flex-col items-center justify-center gap-8">
            {/* ventana con pareja */}
            <div className="relative w-[300px] h-[300px] bg-brandingThird  rounded-t-full border-8 border-white overflow-visible shadow-2xl">
              <div className="absolute top-[-148px] left-[-210px] w-[650px] h-[650px]">
                <Image
                  src="/pareja.png"
                  width={900}
                  height={900}
                  alt="pareja"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full h-full mb-12 px-8 flex flex-col items-center justify-center py-8 gap-4">
        <div className="flex flex-col items-start gap-2 mb-4">
          <span className="flex items-center gap-2">
            <div className="bg-brandingSecond h-8 w-8 rounded-lg flex items-center justify-center">
              <Crown className="text-white" />
            </div>
            <h2 className="text-left text-3xl uppercase text-branding dark:text-white">
              Lo que Nos Hace Únicos
            </h2>
          </span>
          <p>
            En C.O.M.A, ofrecemos terapias personalizadas de alta calidad para
            aquellos que buscan un bienestar integral en su relación matrimonial
            o de pareja. El Rabino Gabriel Curdi se dedica a proporcionar
            atención exclusiva y asesorías innovadoras que realmente marcan la
            diferencia.
          </p>
        </div>
        <div className="flex items-center justify-center pt-6">
          <div className="rounded-3xl w-full h-[600px] md:h-[200px] flex flex-col md:flex-row items-center p-6 justify-center bg-brandingSecond shadow-lg">
            <div className="w-1/4 h-1/4 flex flex-col gap-2 items-center justify-center  text-white font-bold text-center p-2 ">
              <span className="flex flex-col gap-2 items-center justify-center ">
                <FaUserFriends className="text-2xl" />
                Asesorías personalizadas y exclusivas
              </span>
            </div>
            <div className="w-1/4 h-1/4 flex items-center justify-center ">
              <div
                className="h-full md:h-[240px] 
                  min-w-[750%] md:min-w-full bg-brandingThird rounded-2xl flex  flex-col gap-2  items-center justify-center  text-white font-bold text-center p-2 "
              >
                <FaMedal className="text-2xl" />
                Atención profesional de primera clase
              </div>
            </div>
            <div className="w-1/4 h-1/4 flex  flex-col gap-2  items-center justify-center text-white font-bold text-center  p-2 ">
              <span className="flex flex-col gap-2 items-center justify-center ">
                <FaChartLine className="text-2xl" />
                Resultados visibles y duraderos
              </span>
            </div>
            <div className="w-1/4 h-1/4 flex  flex-col gap-2 items-center justify-center   text-white font-bold text-center p-2  ">
              <span className="flex flex-col gap-2 items-center justify-center ">
                <FaLeaf className="text-2xl" />
                Enfoque holístico para un bienestar integral
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full mb-12">
        <div className="w-full h-full flex max-md:flex-col items-center md:items-start justify-between p-16 gap-16">
          <div className="relative min-w-[300px] h-[300px] bg-brandingSecond  rounded-t-full border-8 border-brandingThird overflow-visible shadow-2xl">
            <div className="absolute -top-[37px] -left-[75px] w-[750px] h-[750px]">
              <Image
                src="/pareja2.webp"
                width={450}
                height={450}
                alt="pareja"
                className="object-contain"
              />
            </div>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-full h-full flex flex-col items-center md:items-start gap-2 mb-4">
              <span className="flex items-center justify-center gap-2">
                <div className="bg-brandingSecond h-8 w-8 rounded-lg flex items-center justify-center">
                  <Crown className="text-white" />
                </div>
                <h2 className="text-3xl text-branding dark:text-white">
                  ¿Qué podemos hacer por ti?
                </h2>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="bg-neutral rounded-md shadow-xl p-6 w-full h-full">
                <span className="w-full flex flex-col items-start gap-2">
                  <div className="bg-brandingThird h-8 w-8 rounded-lg flex items-center justify-center">
                    <FaComment className="text-white" />
                  </div>
                  <h3 className="text-branding font-extrabold uppercase">
                    Mejorar la comunicación
                  </h3>
                </span>

                <p>Aprende a comunicarte de manera efectiva y empática.</p>
              </div>

              <div className="bg-neutral rounded-md shadow-xl p-6 w-full h-full">
                <span className="w-full flex flex-col items-start gap-2">
                  <div className="bg-brandingThird h-8 w-8 rounded-lg flex items-center justify-center">
                    <GiScreaming className="text-white" />
                  </div>
                  <h3 className="text-branding font-extrabold uppercase">
                    Resolver conflictos
                  </h3>
                </span>

                <p>
                  Herramientas para manejar y resolver diferencias de manera
                  constructiva.
                </p>
              </div>

              <div className="bg-neutral rounded-md shadow-xl p-6 w-full h-full">
                <span className="w-full flex flex-col items-start gap-2">
                  <div className="bg-brandingThird h-8 w-8 rounded-lg flex items-center justify-center">
                    <FaHeart className="text-white" />
                  </div>
                  <h3 className="text-branding font-extrabold uppercase">
                    Fortalecer la intimidad emocional{" "}
                  </h3>
                </span>

                <p>Conecta a un nivel más profundo y significativo.</p>
              </div>

              <div className="bg-neutral rounded-md shadow-xl p-6 w-full h-full">
                <span className="w-full flex flex-col items-start gap-2">
                  <div className="bg-brandingThird h-8 w-8 rounded-lg flex items-center justify-center">
                    <FaShieldAlt className="text-white" />
                  </div>
                  <h3 className="text-branding font-extrabold uppercase">
                    Construir confianza y fidelidad
                  </h3>
                </span>

                <p>
                  Estrategias para fortalecer la confianza y mantener la
                  fidelidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="w-full px-4">
          <div className="w-full mx-auto text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">
              ¿Cómo consigo cita?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Para conseguir tu cita con nosotros, sigue estos sencillos pasos:
            </p>
            <div className="bg-white shadow-md rounded-lg p-8 mx-auto max-w-lg">
              <ol className="list-decimal list-inside">
                <li className="mb-4">
                  <span className="font-semibold">Rellena el formulario:</span>{" "}
                  Completa el formulario de reserva con tu información personal
                  y detalles de contacto.
                </li>
                <li className="mb-4">
                  <span className="font-semibold">Confirma tu email:</span>{" "}
                  Revisa tu correo electrónico y confirma tu dirección de email
                  para validar tu reserva.
                </li>
                <li className="mb-4">
                  <span className="font-semibold">
                    Espera a recibir tu email de confirmación de cita online:
                  </span>{" "}
                  Una vez confirmada tu reserva, recibirás información detallada
                  sobre tu cita online.
                </li>
                <li>
                  <span className="font-semibold">Realiza el pago:</span> Cuando
                  se te asigne una cita, realiza el pago en el enlace
                  proporcionado en el email de confirmación de cita. Una vez
                  efectuado el pago, la cita quedará fijada. Si el pago no se
                  realiza en los tres días desde la recepción del email, la cita
                  se cancelará y deberás sacar otra cita.
                </li>
              </ol>
              <p className="mt-8 text-sm text-gray-500">
                Debido a la alta demanda, hay una espera de una semana a semana
                y media para la asignación de citas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SectionComponent
        title={"Lo que dicen nuestros pacientes"}
        sectionId={"reviews"}
        nextSectionId="contact"
        children={<p>reviews y testimonios</p>}
      />
      <SectionComponent
        nextSectionId={"price"}
        title={"Reserva tu cita"}
        sectionId={"contact"}
        className="w-full bg-branding"
      >
        <AppoinmentForm />{" "}
      </SectionComponent>
    </main>
  );
}
