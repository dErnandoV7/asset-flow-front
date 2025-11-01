export type CreateWallet = {
    name: string,
    type: WalletType
}

export type WalletType = "checking" | "savings" | "investment"

export type Wallet = {
    name: string,
    type: WalletType,
    typeMasq: string,
    createdAt: string,
    countAsset: number
}