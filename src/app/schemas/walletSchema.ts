import z from "zod"
import { TypeWallet } from "../types/walletType"

const typesWallet: TypeWallet[] = ["checking", "investment", "savings"]

export const createWalletSchema = z.object({
    name: z.string()
        .min(1, "Campo nome é obrigatório"),

    type: z.enum(typesWallet, "Campo tipo de carteira é obrigatório")
})