import { db } from "@/lib/db";

export const getAccountByUserId = async (userId: string) => {
    try {
        const account = await db.account.findFirst({
            where: {
                userId
            },


        })

        return account
    } catch (error) {
        console.log('[GET_ACCOUNT_BY_USER_ID] ', { error })
        return null
    }
}