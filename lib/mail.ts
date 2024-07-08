import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const domain = process.env.NEXT_PUBLIC_URL
export const sendTwoFactorEmail = async (email: string, token: string) => {

    await resend.emails.send({
        from: 'comatherapy@digitalleads.es',
        to: email,
        subject: '2FA Code',
        html: `<p>Your 2FA code: ${token}</p>`
    })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {

    const resetLink = `${domain}/auth/new-password?token=${token}`

    await resend.emails.send({
        from: 'comatherapy@digitalleads.es',
        to: email,
        subject: 'Reset your password',
        html: `<a href="${resetLink}">Click here to reset your password</a>`
    })
}

export const sendVerificationEmail = async (email: string, token: string, userName: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`

    const res = await resend.emails.send({
        from: 'C.O.M.A <comatherapy@digitalleads.es>',
        to: email,
        subject: 'Confirma tu cuenta en C.O.M.A',
        html: `  <div style="background-color: #d2d2d6; padding: 20px;">
                <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #a5a4aa;  border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 16px;">
                            <img src="https://res.cloudinary.com/dbni5k4lu/image/upload/v1718879733/LOGO_HORIZONTAL_945PX_ewdjry.svg" alt="Logo" style="display: block; margin: 0 auto; width: 240px; height: 135px;">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 16px;">
                            <h4 style="text-align: center; font-size: 23px; line-height: 28px; color: #1e1e30; font-weight: 900; letter-spacing: 0; margin-top: 30px;">
                                ¡Hola ${userName}!
                            </h4>
                            <p style="text-align: center; font-size: 16px; color: #1e1e30; line-height: 1.5; margin-bottom: 30px;">
                                Gracias por unirte a nuestro Centro. Estamos emocionados de tenerte a bordo.
                            </p>
                            <div style="text-align: center;">
                                <img src="https://res.cloudinary.com/dbni5k4lu/image/upload/v1696620761/bienvenidos_rorsvf.jpg" alt="Welcome" style="display: block; margin: 0 auto; width: 100%; height: 100px; object-fit: cover;">
                            </div>
                            <p style="text-align: center; font-size: 16px; color: #1e1e30; line-height: 1.5; margin-top: 30px; margin-bottom: 30px;">
                                Para comenzar a disfrutar de nuestros servicios, por favor completa los siguientes pasos:
                            </p>
                            <ol style="font-size: 16px; color: #1e1e30; line-height: 1.5; margin-bottom: 30px;">
                                <li>Confirma tu cuenta, verificando tu dirección de correo electrónico.</li>
                                <li>Completa tu perfil personal.</li>
                                <li>Reserva tu Asesoría en C.O.M.A</li>
                            </ol>
                            <div style="text-align: center;">
                                <a href="${confirmLink}" style="display: inline-block; text-decoration: none; background-color: #1e1e30; color: #ffffff; font-size: 18px; font-weight: 500; text-align: center; padding: 12px 40px; border-radius: 5px; margin-bottom: 30px;">
                                    Confirmar cuenta
                                </a>
                            </div>
                            <p style="text-align: center; font-size: 14px; color: #ed1c24; line-height: 1.5; margin-bottom: 0; font-weight: 900;">
                                ¡Gracias nuevamente y disfruta de tu experiencia en nuestro Centro!
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 16px; text-align: center;">
                            <span style="font-size: 12px; color: #555454;">Si tu no has solicitado una cuenta en C.O.M.A ignora este mensaje.</span>
                        </td>           
                    </tr>
                    <tr>
                        <td style="padding: 16px; text-align: center;">
                            <span style="font-size: 12px; color: #555454;">Mensaje enviado por C.O.M.A.</span>
                        </td>           
                    </tr>
                </table>
            </div>`
    })
    console.log('[EMAIL VERIFICATION 2] -> ', { res });
}

export const sendVerificationEmailWhitAppointment = async (email: string, token: string, userName: string, password: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`

    const res = await resend.emails.send({
        from: 'C.O.M.A <comatherapy@digitalleads.es>',
        to: email,
        subject: 'Confirma tu cuenta en C.O.M.A',
        html: `  <div style="background-color: #d2d2d6; padding: 20px;">
                <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #a5a4aa;  border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 16px;">
                            <img src="https://res.cloudinary.com/dbni5k4lu/image/upload/v1718879733/LOGO_HORIZONTAL_945PX_ewdjry.svg" alt="Logo" style="display: block; margin: 0 auto; width: 240px; height: 135px;">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 16px;">
                            <h4 style="text-align: center; font-size: 23px; line-height: 28px; color: #1e1e30; font-weight: 900; letter-spacing: 0; margin-top: 30px;">
                                ¡Hola ${userName}!
                            </h4>
                            <p style="text-align: center; font-size: 16px; color: #1e1e30; line-height: 1.5; margin-bottom: 30px;">
                                Gracias por unirte a nuestro Centro. Estamos emocionados de tenerte a bordo. Nuestro equipo esta tramitando tu cita. Se te enviará un Email de Confirmación de Cita en menos de 24hs
                            </p>
                            <div style="text-align: center;">
                                <img src="https://res.cloudinary.com/dbni5k4lu/image/upload/v1696620761/bienvenidos_rorsvf.jpg" alt="Welcome" style="display: block; margin: 0 auto; width: 100%; height: 100px; object-fit: cover;">
                            </div>
                            <p style="text-align: center; font-size: 16px; color: #1e1e30; line-height: 1.5; margin-top: 30px; margin-bottom: 30px;">
                                Para comenzar a disfrutar de nuestros servicios, por favor completa los siguientes pasos:
                            </p>
                            <ol style="font-size: 16px; color: #1e1e30; line-height: 1.5; margin-bottom: 30px;">
                                <li>Confirma tu cuenta, verificando tu dirección de correo electrónico.</li>
                                <li>Accede a tu cuenta en C.O.M.A con tu email y tu password </br>
                                <strong>Email: </strong> ${email}  </br>
                                <strong>Contraseña: </strong> ${password} </br>
                                   *Esta contraseña ha sido generada automaticametne, puedes cambiarla en tu perfil de usuario en la web</li>
                                <li>Completa tu perfil personal.</li>
                                <li>Espera a recibir tu email de confirmación de cita online: Una vez confirmada tu reserva, recibirás información detallada sobre tu cita online.</li>
                        <li>Realiza el pago: Cuando se te asigne una cita, realiza el pago en el enlace proporcionado en el email de confirmación de cita. Una vez efectuado el pago, la cita quedará fijada. Si el pago no se realiza en los tres días desde la recepción del email, la cita se cancelará y deberás sacar otra cita.</li>   
                            </ol>
                            <div style="text-align: center;">
                                <a href="${confirmLink}" style="display: inline-block; text-decoration: none; background-color: #1e1e30; color: #ffffff; font-size: 18px; font-weight: 500; text-align: center; padding: 12px 40px; border-radius: 5px; margin-bottom: 30px;">
                                    Confirmar cuenta
                                </a>
                            </div>
                            <p style="text-align: center; font-size: 14px; color: #ed1c24; line-height: 1.5; margin-bottom: 0; font-weight: 900;">
                                ¡Gracias nuevamente y disfruta de tu experiencia en nuestro Centro!
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 16px; text-align: center;">
                            <span style="font-size: 12px; color: #555454;">Si tu no has solicitado una cuenta en C.O.M.A ignora este mensaje.</span>
                        </td>           
                    </tr>
                    <tr>
                        <td style="padding: 16px; text-align: center;">
                            <span style="font-size: 12px; color: #555454;">Mensaje enviado por C.O.M.A.</span>
                        </td>           
                    </tr>
                </table>
            </div>`
    })
    console.log('[EMAIL VERIFICATION 3] -> ', { res });
}

export const sendConfirmAppointmentEmail = async (email: string, userName: string) => {
    const res = await resend.emails.send({
        from: 'C.O.M.A <comatherapy@digitalleads.es>',
        to: email,
        subject: 'Tu cita será confirmada en breve',
        html: `  <div style="background-color: #d2d2d6; padding: 20px;">
        <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #a5a4aa;  border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <tr>
                <td style="padding: 16px;">
                    <img src="https://res.cloudinary.com/dbni5k4lu/image/upload/v1718879733/LOGO_HORIZONTAL_945PX_ewdjry.svg" alt="Logo" style="display: block; margin: 0 auto; width: 240px; height: 135px;">
                </td>
            </tr>
            <tr>
                <td style="padding: 0 16px;">
                    <h4 style="text-align: center; font-size: 23px; line-height: 28px; color: #1e1e30; font-weight: 900; letter-spacing: 0; margin-top: 30px;">
                        ¡Hola ${userName}!
                    </h4>
                    <p style="text-align: center; font-size: 16px; color: #1e1e30; line-height: 1.5; margin-bottom: 30px;">
                        Nuestro equipo esta tramitando tu cita. Se te enviará un Email de Confirmación de Cita en menos de 24hs
                    </p>
                    <div style="text-align: center;">
                        <img src="https://res.cloudinary.com/dbni5k4lu/image/upload/v1718883738/Appointment-Setting-through-Phone-940x438_xsi0r0.jpg" alt="Welcome" style="display: block; margin: 0 auto; width: 100%; height: 100px; object-fit: cover;">
                    </div>
                    <p style="text-align: center; font-size: 16px; color: #1e1e30; line-height: 1.5; margin-top: 30px; margin-bottom: 30px;">
                        ¿Cuáles son los siguientes pasos?:
                    </p>
                    <ol style="font-size: 16px; color: #1e1e30; line-height: 1.5; margin-bottom: 30px;">
                        <li>Espera a recibir tu email de confirmación de cita online: Una vez confirmada tu reserva, recibirás información detallada sobre tu cita online.</li>
                        <li>Realiza el pago: Cuando se te asigne una cita, realiza el pago en el enlace proporcionado en el email de confirmación de cita. Una vez efectuado el pago, la cita quedará fijada. Si el pago no se realiza en los tres días desde la recepción del email, la cita se cancelará y deberás sacar otra cita.</li>                        
                    
                    </ol>
                   
                    <p style="text-align: center; font-size: 14px; color: #ed1c24; line-height: 1.5; margin-bottom: 0; font-weight: 900;">
                        ¡Gracias nuevamente y disfruta de tu experiencia en nuestro Centro!
                    </p>
                </td>
            </tr>
            <tr>
                <td style="padding: 16px; text-align: center;">
                    <span style="font-size: 12px; color: #555454;">Si tu no has solicitado una cuenta en C.O.M.A ignora este mensaje.</span>
                </td>           
            </tr>
            <tr>
                <td style="padding: 16px; text-align: center;">
                    <span style="font-size: 12px; color: #555454;">Mensaje enviado por C.O.M.A.</span>
                </td>           
            </tr>
        </table>
    </div>`
    })
}

interface PropsEmailForTherapist {
    email: string,
    userName: string,
    therapistName: string,
    coupleName: string,
    situation: string,
    message: string,
    service: string
}
export const sendTherapistAppointmentEmail = async ({ email, userName, therapistName, coupleName, situation, message, service }: PropsEmailForTherapist) => {
    const res = await resend.emails.send({
        from: 'C.O.M.A <comatherapy@digitalleads.es>',
        to: email,
        subject: 'datos de la cita a programar',
        html: `  <div style="background-color: #d2d2d6; padding: 20px;">
        <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #a5a4aa;  border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <tr>
                <td style="padding: 16px;">
                    <img src="https://res.cloudinary.com/dbni5k4lu/image/upload/v1718879733/LOGO_HORIZONTAL_945PX_ewdjry.svg" alt="Logo" style="display: block; margin: 0 auto; width: 240px; height: 135px;">
                </td>
            </tr>
            <tr>
                <td style="padding: 0 16px;">
                    <h4 style="text-align: center; font-size: 23px; line-height: 28px; color: #1e1e30; font-weight: 900; letter-spacing: 0; margin-top: 30px;">
                        ¡Hola ${therapistName}!
                    </h4>
                    <p style="text-align: center; font-size: 16px; color: #1e1e30; line-height: 1.5; margin-bottom: 30px;">
Estos son  los datos de la nueva cita pendente por confirmas de ${userName}                    </p>
                    <div style="text-align: center;">
                        <img src="https://res.cloudinary.com/dbni5k4lu/image/upload/v1718883738/Appointment-Setting-through-Phone-940x438_xsi0r0.jpg" alt="Welcome" style="display: block; margin: 0 auto; width: 100%; height: 100px; object-fit: cover;">
                    </div>
                    <p style="text-align: center; font-size: 16px; color: #1e1e30; line-height: 1.5; margin-top: 30px; margin-bottom: 30px;">
                       Cita:
                    </p>
                    <ol style="font-size: 16px; color: #1e1e30; line-height: 1.5; margin-bottom: 30px;">
                        <li>nombre del solicitante: ${userName}</li>
                        <li>Nombre de la pareja: ${coupleName}</li>      
                           <li>Situación: ${situation}</li>                      
                              <li>Message: ${message}</li>    
                  <li>Servicio:  ${service}</li>  
                    </ol>
                   
                    <p style="text-align: center; font-size: 14px; color: #ed1c24; line-height: 1.5; margin-bottom: 0; font-weight: 900;">
                        ¡Gracias nuevamente y disfruta de tu experiencia en nuestro Centro!
                    </p>
                </td>
            </tr>
            <tr>
                <td style="padding: 16px; text-align: center;">
                    <span style="font-size: 12px; color: #555454;">Si tu no has solicitado una cuenta en C.O.M.A ignora este mensaje.</span>
                </td>           
            </tr>
            <tr>
                <td style="padding: 16px; text-align: center;">
                    <span style="font-size: 12px; color: #555454;">Mensaje enviado por C.O.M.A.</span>
                </td>           
            </tr>
        </table>
    </div>`
    })
}


export const sendCancelAppointmentEmail = async (email: string, userName: string) => {
    const res = await resend.emails.send({
        from: 'C.O.M.A <comatherapy@digitalleads.es>',
        to: email,
        subject: 'Tu cita ha sido cancelada',
        html: `  <div style="background-color: #d2d2d6; padding: 20px;">
        <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #a5a4aa; border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <tr>
                <td style="padding: 16px;">
                    <img src="https://res.cloudinary.com/dbni5k4lu/image/upload/v1718879733/LOGO_HORIZONTAL_945PX_ewdjry.svg" alt="Logo" style="display: block; margin: 0 auto; width: 240px; height: 135px;">
                </td>
            </tr>
            <tr>
                <td style="padding: 0 16px;">
                    <h4 style="text-align: center; font-size: 23px; line-height: 28px; color: #1e1e30; font-weight: 900; letter-spacing: 0; margin-top: 30px;">
                        Hola ${userName},
                    </h4>
                    <p style="text-align: center; font-size: 16px; color: #1e1e30; line-height: 1.5; margin-bottom: 30px;">
                        Lamentamos informarte que tu cita ha sido cancelada.
                    </p>
                    <div style="text-align: center;">
                        <img src="https://res.cloudinary.com/dbni5k4lu/image/upload/v1718883738/Appointment-Setting-through-Phone-940x438_xsi0r0.jpg" alt="Appointment Cancelled" style="display: block; margin: 0 auto; width: 100%; height: 100px; object-fit: cover;">
                    </div>
                    <p style="text-align: center; font-size: 16px; color: #1e1e30; line-height: 1.5; margin-top: 30px; margin-bottom: 30px;">
                        Si deseas reprogramar tu cita, por favor visita nuestro sitio web o contáctanos directamente.
                    </p>
                    <p style="text-align: center; font-size: 14px; color: #ed1c24; line-height: 1.5; margin-bottom: 0; font-weight: 900;">
                        Agradecemos tu comprensión y esperamos verte pronto en nuestro Centro.
                    </p>
                </td>
            </tr>
            <tr>
                <td style="padding: 16px; text-align: center;">
                    <span style="font-size: 12px; color: #555454;">Si no solicitaste esta cita, por favor ignora este mensaje.</span>
                </td>
            </tr>
            <tr>
                <td style="padding: 16px; text-align: center;">
                    <span style="font-size: 12px; color: #555454;">Mensaje enviado por C.O.M.A.</span>
                </td>
            </tr>
        </table>
    </div>`
    });
}


export const sendConfirmedAppointmentEmail = async (email: string, userName: string, appointmentDate: string, appointmentTime: string, paymentLink: string, linkMeet: string) => {
    const res = await resend.emails.send({
        from: 'C.O.M.A <comatherapy@digitalleads.es>',
        to: email,
        subject: 'Tu cita ha sido confirmada',
        html: `  <div style="background-color: #d2d2d6; padding: 20px;">
        <table style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #a5a4aa; border-radius: 4px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
            <tr>
                <td style="padding: 16px;">
                    <img src="https://res.cloudinary.com/dbni5k4lu/image/upload/v1718879733/LOGO_HORIZONTAL_945PX_ewdjry.svg" alt="Logo" style="display: block; margin: 0 auto; width: 240px; height: 135px;">
                </td>
            </tr>
            <tr>
                <td style="padding: 0 16px;">
                    <h4 style="text-align: center; font-size: 23px; line-height: 28px; color: #1e1e30; font-weight: 900; letter-spacing: 0; margin-top: 30px;">
                        ¡Hola ${userName}!
                    </h4>
                    <p style="text-align: center; font-size: 16px; color: #1e1e30; line-height: 1.5; margin-bottom: 30px;">
                        Nos complace informarte que tu cita ha sido confirmada. Aquí están los detalles:
                    </p>
                    <p style="text-align: center; font-size: 16px; color: #1e1e30; line-height: 1.5; margin-top: 30px; margin-bottom: 30px;">
                        Fecha: ${appointmentDate}
                    </p>
                     <p style="text-align: center; font-size: 16px; color: #1e1e30; line-height: 1.5; margin-top: 30px; margin-bottom: 30px;">
                        Hora: ${appointmentTime}
                    </p>
                    <p style="text-align: center; font-size: 16px; color: #1e1e30; line-height: 1.5; margin-top: 30px; margin-bottom: 30px;">
                        Enlace de Pago: <a href="${paymentLink}" style="color: #1e90ff;">${paymentLink}</a>
                    </p>
                        <p style="text-align: center; font-size: 16px; color: #1e1e30; line-height: 1.5; margin-top: 30px; margin-bottom: 30px;">
                        Enlace de GoogleMeets: <a href="${linkMeet}" style="color: #1e90ff;">${linkMeet}</a>
                    </p>
                    <div style="text-align: center;">
                        <img src="https://res.cloudinary.com/dbni5k4lu/image/upload/v1718883738/Appointment-Setting-through-Phone-940x438_xsi0r0.jpg" alt="Appointment Confirmed" style="display: block; margin: 0 auto; width: 100%; height: 100px; object-fit: cover;">
                    </div>
                    <p style="text-align: center; font-size: 16px; color: #1e1e30; line-height: 1.5; margin-top: 30px; margin-bottom: 30px;">
                        Tienes tres días desde la recepción de este email para realizar el pago o la cita se anulará automáticamente. Una vez se confirme el pago, se te enviará el enlace de Google Meets para la cita.
                    </p>
                    <p style="text-align: center; font-size: 14px; color: #ed1c24; line-height: 1.5; margin-bottom: 0; font-weight: 900;">
                        ¡Gracias y esperamos verte pronto!
                    </p>
                </td>
            </tr>
            <tr>
                <td style="padding: 16px; text-align: center;">
                    <span style="font-size: 12px; color: #555454;">Si no has solicitado una cita en C.O.M.A, por favor ignora este mensaje.</span>
                </td>
            </tr>
            <tr>
                <td style="padding: 16px; text-align: center;">
                    <span style="font-size: 12px; color: #555454;">Mensaje enviado por C.O.M.A.</span>
                </td>
            </tr>
        </table>
    </div>`
    });
}
