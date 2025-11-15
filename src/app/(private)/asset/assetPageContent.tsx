"use client"

import { CircleDollarSign, FilterIcon, SearchIcon, SearchX } from "lucide-react"
import { getAssetsAll } from "@/app/services/assetService"
import { useCallback, useEffect, useRef, useState } from "react"
import { ColumnsAssets, Asset, ColumnType } from "./colunas"
import { DataTable } from "@/components/table/table"
import { getCriptWithValue } from "@/app/services/priceCriptoService"
import Alerts from "@/components/sweetAlerts/alerts"
import ColumnTableControll from "@/components/table/ColumnTableControll"
import { Input } from "@/components/ui/input"
import LoadingTable from "@/components/loadingTable"
import { Select, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select"
import { AssetFilterType, AssetOrderByType } from "@/app/types/assetType"
import { getWalletAll } from "@/app/services/walletService"
import { Wallet } from "@/app/types/walletType"
import { Button } from "@/components/ui/button"
import { Activity } from "react"
import { Separator } from "@/components/ui/separator"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import CreateAssetModal from "@/components/modal/createAssetModal"
import { SellAssetModal } from "@/components/modal/SellAssetModal"
import { TransferAssetModal } from "@/components/modal/TransferAssetModal"
import { Spinner } from "@/components/ui/spinner"

export default function AssetPageContent() {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()
    const [assets, setAssets] = useState<Asset[]>([])
    const [wallets, setWallets] = useState<Wallet[] | null>(null)
    const [columnsState, setColumnsState] = useState<ColumnType[]>(() => ColumnsAssets.map((column) => ({ ...column })))
    const [dataCripto, setDataCripto] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false)
    const [filtersOpen, setFiltersOpen] = useState(false)

    const [buyModalData, setBuyModalData] = useState<Pick<Asset, "walletId" | "walletName" | "identifyId"> | null>(null)
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
    const [sellModalData, setSellModalData] = useState<Asset | null>(null)
    const [isSellModalOpen, setIsSellModalOpen] = useState(false)
    const [transferModalData, setTransferModalData] = useState<Asset | null>(null)
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)

    const [search, setSearch] = useState("")
    const [orderBy, setOrderBy] = useState<AssetOrderByType | undefined>(undefined)
    const [filter, setFilter] = useState<AssetFilterType | undefined>(undefined)
    const [walletId, setWalletId] = useState<string | undefined>(undefined)

    const [nextCursor, setNextCursor] = useState<number | undefined>(undefined)
    const [hasMore, setHasMore] = useState<boolean>(true)

    const sentinelRef = useRef<HTMLDivElement | null>(null)
    const assetsRef = useRef<Asset[]>([])
    const dataCriptoRef = useRef<any[]>([])

    const handleBuyAsset = (asset: Asset) => {
        setBuyModalData({
            walletId: asset.walletId,
            walletName: asset.walletName,
            identifyId: asset.identifyId,
        })
        setIsBuyModalOpen(true)
    }
    const handleSellAsset = (asset: Asset) => {
        setSellModalData(asset)
        setIsSellModalOpen(true)
    }

    const handleTransferAsset = (asset: Asset) => {
        setTransferModalData(asset)
        setIsTransferModalOpen(true)
    }

    const getWallets = async () => {
        const { success, data, error } = await getWalletAll()

        if (!success) {
            Alerts.error({ title: "Erro", text: error });
            return;
        }

        if (!data) return;

        setWallets(data as Wallet[])
    }

    type FetchOptions = {
        cursor?: number
        replace?: boolean
    }

    const fetchAssets = useCallback(async ({ cursor, replace = false }: FetchOptions = {}) => {
        if (replace) {
            setLoading(true)
            setHasMore(true)
            setNextCursor(undefined)
            dataCriptoRef.current = []
            setDataCripto([])
        } else {
            setIsFetchingMore(true)
        }

        const { success, data, error, total } = await getAssetsAll({ orderBy, search, filter, walletId, cursorId: cursor })

        if (replace) {
            setLoading(false)
        } else {
            setIsFetchingMore(false)
        }

        if (!success) {
            Alerts.error({ title: "Erro", text: error })
            if (replace) {
                setAssets([])
                assetsRef.current = []
            }
            return
        }

        if (!data || data.length === 0) {
            if (replace) {
                setAssets([])
                assetsRef.current = []
            }
            setHasMore(false)
            setNextCursor(undefined)
            return
        }

        const assetIds = data.map((asset) => asset.typeCanonicalName).join(",")

        let currentCriptoData: any[] = replace ? [] : dataCriptoRef.current

        if (!currentCriptoData || currentCriptoData.length === 0) {
            const { success: successCripto, data: newDataCripto } = await getCriptWithValue(assetIds)

            if (successCripto && newDataCripto?.length) {
                currentCriptoData = newDataCripto
                dataCriptoRef.current = newDataCripto
                setDataCripto(newDataCripto)
            }
        }

        const criptosInArray = currentCriptoData

        const mappedAssets = data.map((asset): Asset => {
            const cripto = criptosInArray.find((c) => c[0] === asset.typeCanonicalName)
            const rendimento = cripto ? calcularRendimento(asset.purchasePrice, cripto[1].brl) : 0

            return {
                purchasePrice: Number(asset.purchasePrice.toFixed(2)).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
                quantity: asset.quantity,
                type: asset.typeCanonicalName,
                walletName: asset.walletName,
                rendimento,
                walletId: asset.walletId,
                identifyId: asset.identifyId,
                id: asset.id,
            }
        })

        const newAssets = replace ? mappedAssets : [...assetsRef.current, ...mappedAssets]
        assetsRef.current = newAssets
        setAssets(newAssets)

        const lastAsset = mappedAssets[mappedAssets.length - 1]

        let hasMoreItems: boolean

        if (typeof total === "number") {
            hasMoreItems = newAssets.length < total
        } else {
            hasMoreItems = Boolean(lastAsset)
        }

        setHasMore(hasMoreItems)
        setNextCursor(hasMoreItems ? lastAsset?.id : undefined)
    }, [orderBy, search, filter, walletId])

    const calcularRendimento = (valorCompra: number, valorAtualDeMercado: number) => (valorAtualDeMercado * 100 / valorCompra) - 100

    const handleEyeIcon = (key: string) => {
        setColumnsState((prevColumns) => prevColumns.map((column) =>
            column.accessorKey === key ? { ...column, show: !column.show } : column
        ))
    }

    useEffect(() => {
        const wlltId = params.get("walletId")
        
        if (wlltId) setWalletId(wlltId)
    }, [])

    useEffect(() => {
        getWallets()
    }, [])

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params_ = new URLSearchParams()

            if (walletId) params_.set("walletId", walletId)

            const queryString = params_.toString()

            if (queryString) {
                router.replace(`${pathname}?${queryString}`)
            } else {
                router.replace(pathname)
            }

            assetsRef.current = []
            setAssets([])
            fetchAssets({ replace: true })
        }, 300)

        return () => clearTimeout(timeout)
    }, [search, orderBy, filter, walletId, pathname, router, fetchAssets])

    useEffect(() => {
        const sentinel = sentinelRef.current

        if (!sentinel) return

        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries

            if (
                entry.isIntersecting &&
                hasMore &&
                !loading &&
                !isFetchingMore &&
                typeof nextCursor === "number"
            ) {
                fetchAssets({ cursor: nextCursor })
            }
        }, { rootMargin: "200px", threshold: 0.1 })

        observer.observe(sentinel)

        return () => {
            observer.disconnect()
        }
    }, [fetchAssets, hasMore, isFetchingMore, loading, nextCursor])

    return (
        <div className="w-full mt-14 md:mt-0 p-3">
            <div className="max-w-[1100px] m-auto lg:mt-20">
                <div className=" pb-3 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-3xl mb-2">
                            <CircleDollarSign size={24} />
                            <h2>Seus <strong className="text-primary">Ativos</strong></h2>
                        </div>
                    </div>

                    <p className="text-muted-foreground text-[16px] max-w-[80%] mb-4">Visualização e gerenciamento de todas os seus <span className="font-bold">Ativos</span>.</p>

                </div>
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between flex-col md:flex-row flex-wrap md:items-center gap-2">
                        <div className="flex w-full max-w-xs flex-1 items-center gap-2 sm:max-w-sm">
                            <Input
                                type="search"
                                placeholder="Busque pelo nome do ativo"
                                className="text-xs!"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <SearchIcon className="text-muted-foreground" />
                        </div>
                        <div className="flex items-center  gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => setFiltersOpen((open) => !open)}
                                aria-expanded={filtersOpen}
                                aria-controls="asset-filters-panel"
                            >
                                <FilterIcon className="mr-2 size-4" />
                                <span className="hidden sm:inline text-foreground">Filtros</span>
                            </Button>
                            <ColumnTableControll columns={columnsState} onChangeColumnState={(key) => handleEyeIcon(key)} />
                        </div>
                    </div>

                    <Activity mode={`${filtersOpen ? "visible" : "hidden"}`}>
                        <Separator />
                        <div className="flex flex-wrap md:justify-end gap-4 mb-4"
                        >
                            <Select onValueChange={(value) => setWalletId(value.trim() === "" ? undefined : value)}>
                                <SelectGroup>
                                    <SelectTrigger>
                                        <SelectLabel>
                                            <span className="mr-1">Carteira</span>
                                            {walletId && <SelectValue />}
                                        </SelectLabel>
                                    </SelectTrigger>
                                    <SelectContent align="start">
                                        <SelectItem value=" " className="cursor-pointer text-xs font-semibold">
                                            Qualquer
                                        </SelectItem>
                                        {wallets &&
                                            wallets.map((wallet) => (
                                                <SelectItem key={wallet.id} value={String(wallet.id)} className="cursor-pointer text-xs">
                                                    {wallet.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </SelectGroup>
                            </Select>

                            <Select onValueChange={(value: "investment" | "savings" | "checking") => setFilter(value.trim() === "" ? undefined : value)}>
                                <SelectGroup>
                                    <SelectTrigger>
                                        <SelectLabel>
                                            <span className="mr-1">Tipo de carteira</span>
                                            {filter && <SelectValue />}
                                        </SelectLabel>
                                    </SelectTrigger>
                                    <SelectContent align="start" >
                                        <SelectItem value=" " className="cursor-pointer text-xs font-semibold">
                                            Qualquer
                                        </SelectItem>
                                        <SelectItem value="investment" className="cursor-pointer text-xs">
                                            Investimentos
                                        </SelectItem>
                                        <SelectItem value="savings" className="cursor-pointer text-xs">
                                            Reserva
                                        </SelectItem>
                                        <SelectItem value="checking" className="cursor-pointer text-xs">
                                            Corrente
                                        </SelectItem>
                                    </SelectContent>
                                </SelectGroup>
                            </Select>

                            <Select onValueChange={(value: "quantity" | "purchasePrice") => setOrderBy(value.trim() === "" ? undefined : value)}>
                                <SelectGroup>
                                    <SelectTrigger>
                                        <SelectLabel>
                                            <span className="mr-1">Ordenar por</span>
                                            {orderBy && <SelectValue />}
                                        </SelectLabel>
                                    </SelectTrigger>
                                    <SelectContent align="start">
                                        <SelectItem value=" " className="cursor-pointer text-xs font-semibold">
                                            Padrão
                                        </SelectItem>
                                        <SelectItem value="quantity" className="cursor-pointer text-xs">
                                            Quantidade
                                        </SelectItem>
                                        <SelectItem value="purchasePrice" className="cursor-pointer text-xs">
                                            Vlr méd. unit.
                                        </SelectItem>
                                    </SelectContent>
                                </SelectGroup>
                            </Select>

                            <div className="flex items-center justify-end sm:col-span-2 lg:col-span-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="cursor-pointer text-xs text-muted-foreground hover:text-foreground"
                                    onClick={() => {
                                        setWalletId(undefined)
                                        setFilter(undefined)
                                        setOrderBy(undefined)
                                    }}
                                >
                                    Limpar filtros
                                </Button>
                            </div>
                        </div>
                    </Activity>
                </div>

                {loading && <LoadingTable />}

                {!loading && assets.length > 0 && (
                    <>
                        <DataTable
                            columns={columnsState}
                            data={assets}
                            onBuy={handleBuyAsset}
                            onSell={handleSellAsset}
                            onTransfer={handleTransferAsset}
                        />
                        <div ref={sentinelRef} className="h-10 w-full" />
                        {isFetchingMore && (
                            <div className="flex items-center justify-center py-4">
                                <Spinner size="sm" />
                            </div>
                        )}
                    </>
                )}

                {!loading && assets.length === 0 && (
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-secondary/60 bg-card/50 p-6 text-center">
                        <SearchX size={36} className="text-primary" />
                        <div>
                            <p className="text-lg font-semibold text-foreground">Nenhum ativo encontrado</p>
                            <p className="text-sm text-muted-foreground">Revise os filtros aplicados ou cadastre um novo ativo para começar a acompanhar seus investimentos.</p>
                        </div>
                    </div>
                )}

            </div>
            {buyModalData && (
                <CreateAssetModal
                    isBuy
                    walletId={buyModalData.walletId}
                    walletName={buyModalData.walletName}
                    identityId={buyModalData.identifyId}
                    renderTrigger={false}
                    open={isBuyModalOpen}
                    onOpenChange={(open) => {
                        setIsBuyModalOpen(open)
                        if (!open) {
                            setBuyModalData(null)
                        }
                    }}
                    createdNewAsset={async () => {
                        assetsRef.current = []
                        await fetchAssets({ replace: true })
                        setBuyModalData(null)
                    }}
                />
            )}
            {sellModalData && (
                <SellAssetModal
                    open={isSellModalOpen}
                    onOpenChange={(open) => {
                        setIsSellModalOpen(open)
                        if (!open) {
                            setSellModalData(null)
                        }
                    }}
                    asset={sellModalData}
                    onCompleted={async () => {
                        assetsRef.current = []
                        await fetchAssets({ replace: true })
                        setSellModalData(null)
                    }}
                />
            )}
            {transferModalData && (
                <TransferAssetModal
                    open={isTransferModalOpen}
                    onOpenChange={(open) => {
                        setIsTransferModalOpen(open)
                        if (!open) {
                            setTransferModalData(null)
                        }
                    }}
                    asset={transferModalData}
                    wallets={wallets ?? []}
                    onCompleted={async () => {
                        assetsRef.current = []
                        await fetchAssets({ replace: true })
                        setTransferModalData(null)
                    }}
                />
            )}
        </div>
    )
}

