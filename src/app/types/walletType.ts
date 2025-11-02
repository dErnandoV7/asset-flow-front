export type CreateWallet = {
    name: string,
    type: TypeWallet
}

export type TypeWallet = "checking" | "savings" | "investment"

export type Wallet = {
    id: number,
    name: string,
    type: TypeWallet,
    typeMasq: string,
    countAsset: number
    createdAt: string,
}