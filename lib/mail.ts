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

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`
    console.log('[EMAIL VERIFICATION 2] -> ', confirmLink);
    const res = await resend.emails.send({
        from: 'comatherapy@digitalleads.es',
        to: email,
        subject: 'Confirm your account',
        html: `<a href="${confirmLink}">Click here to confirm your account</a>`
    })
    console.log('[EMAIL VERIFICATION 3] -> ', { res });
}