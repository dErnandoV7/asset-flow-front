export type AssetIdentity = {
    id: number,
    symbol: string,
    canonicalName: string
}

export type Asset = {
    id: number,
    purchasePrice: number,
    quantity: number,
    type: string,
    typeCanonicalName: string,
    walletName: string,
    walletId: number,
    identifyId: number
}

export type BuyAssetType = { identifyId: number, price: number, quantity: number, walletId: number }

export type AssetOrderByType = "quantity" | "purchasePrice"
export type AssetFilterType = "investment" | "savings" | "checking"