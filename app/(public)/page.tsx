import AppoinmentForm from "@/components/custom ui/AppoinmentForm";
import SectionComponent from "@/components/custom ui/SectionComponent";
import WindowComponent from "@/components/custom ui/WindowComponent";
import { Logo } from "@/components/custom ui/logo";
import { Button } from "@/components/ui/button";
import { PrivateRoute } from "@/lib/routes";
import { Crown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IoCalendarOutline } from "react-icons/io5";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MdCommentBank } from "react-icons/md";

import ButtonNextSection from "@/components/custom ui/ButtonNextSection";

const Reviews = [
  {
    id: 1,
    message:
      "“ (...) ESTOY SIN PALABRAS  , usted ha dado en el clavo , con la situación que estoy viviendo, Bendita sea la madre que lo trajo a este mundo . Gracias por ayudarme , es usted un gran sabio , que buena luz le acompaña , (…)“",
    complete:
      "“Con todo respeto me dirijo a usted elogiando su sabiduría, es increíble como después de hablar conmigo pocos minutos  me describe exactamente mi vida y  la de mi pareja , ESTOY SIN PALABRAS  , usted ha dado en el clavo , con la situación que estoy viviendo, Bendita sea la madre que lo trajo a este mundo . Gracias por ayudarme , es usted un gran sabio , que buena luz le acompaña , que dios le de salud para que pueda ayudar a mucha gente como lo ha hecho conmigo , mil gracias todha Rava”",
    name: "",
  },
  {
    id: 2,
    message:
      '" Muchas gracias Rabi, por su tiempo y los consejos que me ha dado. Voy a abrirme a la posibilidad de conocer a alguien respetuoso, bezra Hashem. Gracias por darme su tiempo, y consejo. Shalom"',
    complete: "",
    name: "Eugenia",
  },
  {
    id: 2,
    message:
      "“(…) Muchas gracias al Rabino Gabriel que me ha escuchado y me guiado para retomar las riendas de mi vida y traer shalom a mi hogar, a mi matrimonio y a mi vida. Gracias. ” ",
    complete:
      "“Rabino Gabriel, gracias por su mensaje y buenos deseos. Quiero aprovechar esta oportunidad para darle las gracias por contactarme y ayudarme con sus buenos consejos y su sabiduria. A lo largo de los últimos años he vivido momentos de cambio en my vida. Nuevo pais, nuevo idioma, nuevas costumbres, y finalmente nueva forma de vida desde que encontré la Torah. Muchos cambios los enfrenté de la misma optica que tenia de la vida y por ende algunos aspectos de mi vida se fueron a pique. Hoy por hoy estoy levantando cabeza. Muchas gracias al Rabino Gabriel que me ha escuchado y me guiado para retomar las riendas de mi vida y traer shalom a mi hogar, a mi matrimonio y a mi vida. Gracias Georgina desde Paises Bajos”",
    name: "Georgina",
  },
];
export default function Home() {
  return (
    <main className="flex  flex-col items-center justify-center ">
      {/* HERO */}
      <section
        id={"hero"}
        className="w-full h-full  flex max-md:flex-col items-center justify-start   pt-16 gap-8 pb-4  bg-branding mb-12 px-8"
      >
        {/* columna 1 */}
        <div className="w-full flex flex-col items-center">
          <h1 className="text-5xl text-white text-center leading-relaxed mb-4">
            Despierta a un nuevo amanecer en tu relación con la
            <br />
            <span className="text-brandingSecond rounded-md p-2 font-extrabold ">
              asesoría matrimonial y de parejas de C.O.M.A
            </span>
          </h1>
          <p className="w-3/4 text-white text-center mb-4">
            Mejora la comunicación, resuelve conflictos y recupera la chispa en
            tu relación, en nuestro Centro Calificado de Exelencia.
          </p>
          {/* <Button variant={"secondary"}>Reserva tu Asesoría ahora</Button> */}
        </div>

        {/* columna 2 */}
        {/* contenedor de ventana */}
        <div className=" w-full h-full flex flex-col items-center md:items-end justify-center ">
          {/* ventana con pareja */}
          <div className="relative w-[300px] h-[300px] bg-brandingSecond  rounded-t-full border-8 border-white overflow-visible shadow-2xl">
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
      </section>

      {/* seccion 1 */}
      <section
        className="w-full h-full mb-12 px-20 md:px-36 flex flex-col items-center justify-center py-16 gap-8"
        id={"2"}
      >
        <div className="w-full flex flex-col items-start gap-2 mb-4 ">
          <span className="w-full flex items-center gap-2 ">
            <div className="bg-brandingSecond h-12 min-w-12 rounded-lg flex items-center justify-center">
              <Image
                src={"/ISOTIPO_75PX_V4.svg"}
                width={25}
                height={25}
                alt="isotipo"
              />
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
                  min-w-[720%] md:min-w-full bg-brandingThird rounded-2xl flex  flex-col gap-2  items-center justify-center  text-white font-bold text-center p-2 "
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

      {/* seccion 2 */}
      <section
        className="w-full h-full mb-12 px-20 py-36 bg-[linear-gradient(180deg,#1d428a_30%,#e06287_50%,#ff6a43_75%,#f5dadf_85%,rgba(245,218,223,0)_100%)]"
        id={"3"}
      >
        <div className="w-full h-full flex max-lg:flex-col items-center lg:items-center justify-between  gap-16">
          <div className="relative min-w-[300px] h-[300px] bg-branding  rounded-t-full border-8 border-white overflow-visible shadow-2xl">
            <div className="absolute -top-[63px] -left-[115px] w-[750px] h-[750px]">
              <Image
                src="/pareja2.png"
                width={520}
                height={520}
                alt="pareja"
                className="object-contain"
              />
            </div>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-full h-full flex flex-col items-center md:items-start gap-2 mb-4">
              <span className="flex items-center justify-center gap-2">
                <div className="bg-brandingSecond h-12 min-w-12 rounded-lg flex items-center justify-center">
                  <Image
                    src={"/ISOTIPO_75PX_V4.svg"}
                    width={25}
                    height={25}
                    alt="isotipo"
                  />
                </div>
                <h2 className="text-3xl text-white uppercase">
                  ¿Qué podemos hacer por ti?
                </h2>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="bg-white rounded-md shadow-xl p-6 w-full h-full">
                <span className="w-full flex flex-col items-start gap-2">
                  <div className="bg-brandingThird h-8 w-8 rounded-lg flex items-center justify-center">
                    <FaComment className="text-white" />
                  </div>
                  <h3 className="text-branding font-extrabold uppercase">
                    Mejorar la comunicación
                  </h3>
                </span>

                <p className="dark:text-black">
                  Aprende a comunicarte de manera efectiva y empática.
                </p>
              </div>

              <div className="bg-white rounded-md shadow-xl p-6 w-full h-full">
                <span className="w-full flex flex-col items-start gap-2">
                  <div className="bg-brandingThird h-8 w-8 rounded-lg flex items-center justify-center">
                    <GiScreaming className="text-white" />
                  </div>
                  <h3 className="text-branding font-extrabold uppercase">
                    Resolver conflictos
                  </h3>
                </span>

                <p className="dark:text-black">
                  Herramientas para manejar y resolver diferencias de manera
                  constructiva.
                </p>
              </div>

              <div className="bg-white rounded-md shadow-xl p-6 w-full h-full">
                <span className="w-full flex flex-col items-start gap-2">
                  <div className="bg-brandingThird h-8 w-8 rounded-lg flex items-center justify-center">
                    <FaHeart className="text-white" />
                  </div>
                  <h3 className="text-branding font-extrabold uppercase">
                    Fortalecer la intimidad emocional{" "}
                  </h3>
                </span>

                <p className="dark:text-black">
                  Conecta a un nivel más profundo y significativo.
                </p>
              </div>

              <div className="bg-white rounded-md shadow-xl p-6 w-full h-full">
                <span className="w-full flex flex-col items-start gap-2">
                  <div className="bg-brandingThird h-8 w-8 rounded-lg flex items-center justify-center">
                    <FaShieldAlt className="text-white" />
                  </div>
                  <h3 className="text-branding font-extrabold uppercase">
                    Construir confianza y fidelidad
                  </h3>
                </span>

                <p className="dark:text-black">
                  Estrategias para fortalecer la confianza y mantener la
                  fidelidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* seccion 3 */}
      <section className="w-full mb-12 px-8 md:px-20 lg:px-60 py-16 " id={"4"}>
        <div className="w-full h-fit rounded-xl shadow-lg bg-branding p-12 flex flex-col items-center justify-start text-white gap-2">
          <div className="bg-branding border-2 border-white shadow-white shadow-md h-12 w-12 rounded-lg flex items-center justify-center">
            <Crown className="text-brandingSecond" />
          </div>
          <h2 className="text-4xl font-bold">
            Reserva tu primera Asesoría. <br /> Date prisa,{" "}
            <span className="text-brandingSecond">Cupos Limitados!</span> <br />
          </h2>
          <p>La duración de la asesoría online es de 60 minutos</p>
          <h3 className="text-4xl font-extrabold text-brandingSecond">$ 250</h3>

          <Button className="bg-brandingSecond text-white">
            Pide tu Asesoría
          </Button>
        </div>
      </section>

      {/* seccion 4 */}
      <section className="w-full mb-12 px-8 md:px-36 py-36 " id={"5"}>
        <div className="w-full h-full flex flex-col items-center md:items-start gap-2 mb-4 ">
          <span className="flex items-center justify-center gap-2">
            <div className="bg-brandingThird h-12 min-w-12 rounded-lg flex items-center justify-center">
              <Image
                src={"/ISOTIPO_75PX_V3.svg"}
                width={25}
                height={25}
                alt="isotipo"
              />
            </div>
            <h2 className="text-3xl text-branding dark:text-white uppercase">
              Lo que dicen nuestros pacientes
            </h2>
          </span>
        </div>
        <div className="w-full h-full flex max-lg:flex-col items-center  justify-between gap-8 ">
          <div className="w-full px-16">
            <Carousel className="w-full max-w-sm p-2">
              <CarouselContent>
                {Reviews.map((review, index) => (
                  <CarouselItem key={index}>
                    <div className=" h-full w-full rounded-lg shadow-lg bg-blue-200 dark:bg-branding flex flex-col items-start p-8 z-10">
                      {/* icon box */}
                      <div className="bg-branding dark:bg-brandingThird h-12 w-12 rounded-lg flex items-center justify-center z-20">
                        <MdCommentBank className="text-white h-10 w-10" />
                      </div>
                      <div className="p-2">
                        <p>{review.message}</p>
                      </div>
                      <div>
                        <p className="font-bold">{review.name}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="relative w-[300px] h-[300px] bg-brandingThird  rounded-t-full border-8 border-brandingSecond overflow-visible shadow-2xl">
              <div className="absolute -top-[34px] -left-[15px] w-[750px] h-[750px]">
                <Image
                  src="/pareja4.png"
                  width={320}
                  height={320}
                  alt="pareja"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* seccion 5 */}

      <section className="w-full mb-12 px-8 md:px-36 py-36 " id={"5"}>
        <div className="w-full h-full flex max-md:flex-col items-center md:items-start justify-between  gap-16">
          <div className="relative min-w-[300px] h-[300px] bg-branding  rounded-t-full border-8 border-brandingSecond overflow-visible shadow-2xl">
            <div className="absolute -top-[36px] -left-[19px] w-[750px] h-[750px]">
              <Image
                src="/pareja3.png"
                width={480}
                height={480}
                alt="pareja"
                className="object-contain"
              />
            </div>
          </div>
          <div className="w-full h-full flex flex-col items-center md:items-start gap-2 mb-4 ">
            <span className="flex items-center justify-center gap-2">
              <div className="bg-blue-100 h-12 min-w-12 rounded-lg flex items-center justify-center">
                <Image
                  src={"/ISOTIPO_75PX.svg"}
                  width={25}
                  height={25}
                  alt="isotipo"
                />
              </div>
              <h2 className="text-3xl text-branding dark:text-white uppercase">
                Preguntas Frecuentes
              </h2>
            </span>
            <div className="w-full h-full ">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    ¿Cómo funciona la asesoría online?
                  </AccordionTrigger>
                  <AccordionContent>
                    La asesoría online se realiza a través de plataformas de
                    videoconferencia con Goolge Meets, lo que permite una
                    comunicación directa y efectiva desde la comodidad de tu
                    hogar. Al reservar tu asesoría, recibirás un enlace para
                    acceder a la sesión en la fecha y hora programadas. Durante
                    la sesión, el Rabino Gabriel Curdi, experto terapeuta en
                    relaciones de pareja te guiará a través de estrategias
                    personalizadas para abordar tus inquietudes y mejorar tu
                    relación.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    ¿Cuánto cuesta el servicio?
                  </AccordionTrigger>
                  <AccordionContent>
                    El costo de una sesión de asesoría es de $250 (dolares
                    americanos). Este precio incluye una hora de asesoría
                    personalizada con el Rabino Gabriel Curdi. Además, al
                    reservar tu sesión, estarás contribuyendo al desarrollo
                    continuo de nuestro servicio para seguir ofreciendo el mejor
                    apoyo posible.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>¿Es efectiva la asesoría?</AccordionTrigger>
                  <AccordionContent>
                    Sí, nuestras asesorías son altamente efectivas. La clave del
                    éxito radica en la disposición genuina del cliente para
                    recibir y aplicar los consejos y estrategias proporcionadas
                    por el Rabino Gabriel curdi. Cuando hay apertura,
                    predisposición y una implementación activa de las
                    recomendaciones, C.O.M.A garantiza una mejora significativa
                    en la relación de pareja. La efectividad de nuestras
                    asesorías se basa en un enfoque personalizado y en la
                    participación comprometida de ambas partes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger> ¿Cómo consigo cita?</AccordionTrigger>
                  <AccordionContent>
                    <div className="w-full ">
                      <p className="text-lg text-gray-600 dark:text-white mb-6">
                        Para conseguir tu cita con nosotros, sigue estos
                        sencillos pasos:
                      </p>
                      <div className="bg-white dark:bg-branding shadow-md rounded-lg p-8 w-full">
                        <ol className="list-decimal list-inside">
                          <li className="mb-4">
                            <span className="font-semibold">
                              Rellena el formulario:
                            </span>{" "}
                            Completa el formulario de reserva con tu información
                            personal y detalles de contacto.
                          </li>
                          <li className="mb-4">
                            <span className="font-semibold">
                              Confirma tu email:
                            </span>{" "}
                            Revisa tu correo electrónico y confirma tu dirección
                            de email para validar tu reserva.
                          </li>
                          <li className="mb-4">
                            <span className="font-semibold">
                              Espera a recibir tu email de confirmación de cita
                              online:
                            </span>{" "}
                            Una vez confirmada tu reserva, recibirás información
                            detallada sobre tu cita online.
                          </li>
                          <li>
                            <span className="font-semibold">
                              Realiza el pago:
                            </span>{" "}
                            Cuando se te asigne una cita, realiza el pago en el
                            enlace proporcionado en el email de confirmación de
                            cita. Una vez efectuado el pago, la cita quedará
                            fijada. Si el pago no se realiza en los tres días
                            desde la recepción del email, la cita se cancelará y
                            deberás sacar otra cita.
                          </li>
                        </ol>
                        <p className="mt-8 text-sm text-gray-500 dark:text-white">
                          Debido a la alta demanda, hay una espera de una semana
                          a semana y media para la asignación de citas.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* seccion 6 */}
      <section className="w-full  mb-12 px-8 md:px-36 py-36" id={"3"}>
        {/* div 1 */}
        <div className="w-full h-full flex flex-col items-center md:items-start gap-2 mb-4">
          <span className="flex items-center justify-center gap-2">
            <div className="bg-branding h-12 min-w-12 rounded-lg flex items-center justify-center">
              <IoCalendarOutline className="text-white h-8 w-8" />
            </div>
            <h2 className="text-3xl text-branding dark:text-white uppercase">
              ¿Listos para una transformación?
            </h2>
          </span>
        </div>
        {/* div 2 */}
        <div className="w-full h-full flex max-md:flex-col items-center md:items-center justify-between  gap-16">
          <div className="order-2 md:order-1 w-full h-full flex flex-col items-center justify-center">
            <div className="w-full flex items-center">
              <AppoinmentForm />
            </div>
          </div>

          <div className="order-1 md:order-2 w-full flex flex-col items-center justify-center gap-6">
            <Image
              src="/logo.svg"
              width={250}
              height={250}
              alt="logo"
              className="object-contain"
            />
            <p className="text-center">
              Nuestras plazas son limitadas debido a la excelencia que ofrecemos
              y las reservas se están agotando rápidamente. Asegura tu lugar
              ahora y comienza a vivir una vida más plena y equilibrada.
              ¡Reserva hoy mismo!
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
