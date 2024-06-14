import authConfig from "@/auth.config"
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation"
import { getUserById } from "@/data/user.data"
import { db } from "@/lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { UserRole } from "@prisma/client"
import NextAuth from "next-auth"

import { getAccountByUserId } from "./data/account"
import { PublicRoute } from "./lib/routes"

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: PublicRoute.LOGIN.href,
        error: PublicRoute.ERROR.href,
    },
    events: {
        async linkAccount({ user }) {
            await db.user.update({
                where: { id: user.id },
                data: {
                    emailVerified: new Date(),
                    acepTerms: true,
                },
            })
        }
    },
    callbacks: {
        async signIn({ user, account }) {
            // Allow OAuth email verification
            if (account?.provider !== 'credentials') return true
            if (!user.id) return false
            const existingUser = await getUserById(user.id)
            if (!existingUser?.emailVerified) return false
            //if (!existingUser?.permission) return false
            //if (existingUser?.role !== UserRole.ADMIN) return false

            if (existingUser.isTwoFactorEnabled) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
                if (!twoFactorConfirmation) return false

                await db.twoFactorConfirmation.delete({
                    where: {
                        id: twoFactorConfirmation.id,
                    }
                })
            }
            return true
        },
        //@ts-ignore
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                session.user.role = token.role as UserRole
            }
            if (session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
            }
            if (session.user) {
                session.user.name = token.name as string
                session.user.email = token.email as string
                session.user.image = token.image as string
                session.user.role = token.role as UserRole
                session.user.permission = token.permission as boolean
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
                session.user.isOAuth = token.isOAuth as boolean
                session.user.employeeId = token.employeeId as string
            }
            return session
        },
        async jwt({ token }) {

            if (!token.sub) return token

            const existingUser = await getUserById(token.sub)
            if (!existingUser) return token
            const existingAccount = await getAccountByUserId(existingUser.id)

            token.id = existingUser.id
            token.isOAuth = !!existingAccount
            token.name = existingUser.name
            token.email = existingUser.email
            token.image = existingUser.image
            token.role = existingUser.role
            token.permission = existingUser.permission
            token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
            token.employeeId = existingUser.employeeId
            return token
        },
    },
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
})