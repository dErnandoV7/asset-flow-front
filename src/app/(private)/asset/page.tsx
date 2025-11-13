"use client"

import { CircleDollarSign, FilterIcon, SearchIcon, SearchX } from "lucide-react"
import { getAssetsAll } from "@/app/services/assetService"
import { useEffect, useState } from "react"
import { ColumnsAssets, Asset, ColumnType } from "./colunas"
import { DataTable } from "@/components/table/table"
import { getCriptWithValue } from "@/app/services/priceCriptoService"
import Alerts from "@/components/sweetAlerts/alerts"
import ColumnTableControll from "@/components/table/ColumnTableControll"
import { Input } from "@/components/ui/input"
import LoadingAsset from "@/components/loadingAsset"
import { Select, SelectGroup, SelectLabel, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select"
import { AssetOrderByType, AssetFilterType } from "@/app/services/assetService"
import { getWalletAll } from "@/app/services/walletService"
import { Wallet } from "@/app/types/walletType"
import { Button } from "@/components/ui/button"
import { Activity } from "react"
import { Separator } from "@/components/ui/separator"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function AssetsPage() {
    const router = useRouter()
    const pathname = usePathname()
    const params = useSearchParams()

    const [assets, setAssets] = useState<Asset[] | null>(null)
    const [wallets, setWallets] = useState<Wallet[] | null>(null)
    const [columnsState, setColumnsState] = useState<ColumnType[]>(() => ColumnsAssets.map((column) => ({ ...column })))
    const [dataCripto, setDataCripto] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [filtersOpen, setFiltersOpen] = useState(false)

    const [search, setSearch] = useState("")
    const [orderBy, setOrderBy] = useState<AssetOrderByType | undefined>(undefined)
    const [filter, setFilter] = useState<AssetFilterType | undefined>(undefined)
    const [walletId, setWalletId] = useState<string | undefined>(undefined)

    const getWallets = async () => {
        const { success, data, error } = await getWalletAll()

        if (!success) {
            Alerts.error({ title: "Erro", text: error });
            return;
        }

        if (!data) return;

        setWallets(data as Wallet[])
    }

    const getAssets = async () => {

        setLoading(true)

        const { success, data, error } = await getAssetsAll({ orderBy, search, filter, walletId });

        setLoading(false)

        if (!success) {
            Alerts.error({ title: "Erro", text: error });
            return;
        }

        if (!data) return;

        const assetIds = data.map((asset) => asset.typeCanonicalName).join(",");

        let initialDataCripto: any[] = dataCripto

        if (Object.keys(dataCripto).length === 0) {
            const { success: successCripto, data: newDataCripto } = await getCriptWithValue(assetIds);

            if (successCripto && newDataCripto?.length) {
                initialDataCripto = newDataCripto
                setDataCripto(newDataCripto)
            }
        }

        const criptosInArray = initialDataCripto;

        const mappedAssets = data.map((asset) => {
            const cripto = criptosInArray.find((c) => c[0] === asset.typeCanonicalName);
            const rendimento = cripto ? calcularRendimento(asset.purchasePrice, cripto[1].brl) : 0;

            return {
                purchasePrice: Number(asset.purchasePrice.toFixed(2)).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }),
                quantity: asset.quantity,
                type: asset.typeCanonicalName,
                walletName: asset.walletName,
                rendimento,
            };
        });

        setAssets(mappedAssets);
    }

    const calcularRendimento = (valorCompra: number, valorAtualDeMercado: number) => (valorAtualDeMercado * 100 / valorCompra) - 100

    const handleEyeIcon = (key: string) => {
        setColumnsState((prevColumns) => prevColumns.map((column) =>
            column.accessorKey === key ? { ...column, show: !column.show } : column
        ))
    }

    useEffect(() => {
        const srch = params.get("search")
        const ordrBy = params.get("orderBy")
        const fltr = params.get("filter")
        const wlltId = params.get("walletId")

        const orderValid = ordrBy && (ordrBy === "quantity" || ordrBy === "purchasePrice")
        const filterValid = fltr && (fltr === "investment" || fltr === "savings" || fltr === "checking")

        if (srch?.trim()) setSearch(srch)
        if (orderValid) setOrderBy(ordrBy)
        if (filterValid) setFilter(fltr)
        if (wlltId) setWalletId(wlltId)

    }, [])


    useEffect(() => {
        getWallets()
    }, [])

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params_ = new URLSearchParams()
            const sanitizedSearch = search.trim()

            if (sanitizedSearch) params_.set("search", sanitizedSearch)
            if (orderBy) params_.set("orderBy", orderBy)
            if (filter) params_.set("filter", filter)
            if (walletId) params_.set("walletId", walletId)

            const queryString = params_.toString()

            if (queryString) {
                router.replace(`${pathname}?${queryString}`)
            } else {
                router.replace(pathname)
            }

            getAssets()
        }, 300);

        return () => clearTimeout(timeout)
    }, [search, orderBy, filter, walletId, pathname, router])

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

                {loading && <LoadingAsset />}

                {!loading && Array.isArray(assets) && assets.length > 0 && (
                    <DataTable columns={columnsState} data={assets} onBuy={(id) => console.log(id)} onSell={(id) => console.log(id)} onTransfer={(id) => console.log(id)} />
                )}

                {!loading && Array.isArray(assets) && assets.length === 0 && (
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-secondary/60 bg-card/50 p-6 text-center">
                        <SearchX size={36} className="text-primary" />
                        <div>
                            <p className="text-lg font-semibold text-foreground">Nenhum ativo encontrado</p>
                            <p className="text-sm text-muted-foreground">Revise os filtros aplicados ou cadastre um novo ativo para começar a acompanhar seus investimentos.</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

