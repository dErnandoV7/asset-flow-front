export type AssetIdentity = {
    id: number,
    symbol: string,
    canonicalName: string
}

export type Asset = {
    purchasePrice: number,
    quantity: number,
    type: string,
    walletName: string
}
