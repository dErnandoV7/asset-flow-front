import z from "zod"

export const createAssetSchema = z.object({
    identifyId: z.number()
        .refine((n) => Number.isInteger(n), "O ID do Ativo deve ser um número inteiro."),

    walletId: z.number()
        .refine((n) => Number.isInteger(n), "O ID do Carteira deve ser um número inteiro."),

    price:
        z.number()
            .refine((n) => n > 0, "A valor unitário do ativo deve ser um valor positivo."),

    quantity: z.number()
        .refine((n) => n > 0, "A quantidade a ser transferida deve ser um valor positivo.")
})

export type createAssetType = z.infer<typeof createAssetSchema>