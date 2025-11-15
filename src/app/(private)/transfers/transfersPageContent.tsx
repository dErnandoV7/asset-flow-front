"use client"

import { FilterIcon, Logs, SearchX } from 'lucide-react'
import { getTranfersAll } from '@/app/services/transferService'
import { Activity, useEffect, useState } from 'react'
import { Transfer, ColumnsTransfers, ColumnType } from "./colunas"
import Alerts from '@/components/sweetAlerts/alerts'
import LoadingTable from '@/components/loadingTable'
import { DataTable } from '@/components/table/table'
import ColumnTableControll from '@/components/table/ColumnTableControll'
import { TypeWallet, Wallet } from '@/app/types/walletType'
import { Button } from '@/components/ui/button'
import { Select, SelectGroup, SelectTrigger, SelectLabel, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { getWalletAll } from '@/app/services/walletService'
import { typeTransferType } from '@/app/types/transferType'
import PaginationComponent from '@/components/table/PaginationComponent'

export const typeTranfersMask = (type: typeTransferType) => {
    if (type === "buy") return "COMPRA"
    else if (type === "sell") return "VENDA"
    else return "TRANSFERÊNCIA"
}

const TransfersPageContent = () => {
    const TAKE = 10

    const [transfers, setTransfers] = useState<Transfer[] | null>(null)
    const [wallets, setWallets] = useState<Wallet[] | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const [columnsState, setColumnsState] = useState<ColumnType[]>(() => ColumnsTransfers.map((column) => ({ ...column })))
    const [filtersOpen, setFiltersOpen] = useState(false)

    const [transferType, setTranferType] = useState<typeTransferType | undefined>(undefined)
    const [walletId, setWalletId] = useState<string | undefined>(undefined)
    const [walletType, setWalletType] = useState<TypeWallet | undefined>(undefined)

    const [totalPages, setTotalPages] = useState<number | undefined>(undefined)
    const [totalItems, setTotalItems] = useState<number | undefined>(undefined)
    const [currentPage, setCurrentPage] = useState<number | undefined>(1)

    const fetchTranfers = async () => {
        setLoading(true)

        const { success, data, error, total } = await getTranfersAll(walletId, transferType, walletType, currentPage)
        
        setLoading(false)

        if (!success) {
            Alerts.error({ title: "Erro", text: error })

            return
        }

        if (!Array.isArray(data) || (!total && total !== 0)) return

        const transfersMap = data.map((transfer: any): Transfer => {
            const dateFormated = new Date(transfer.date).toLocaleDateString("pt-BR", {
                timeZone: "America/Sao_Paulo"
            })

            const priceFormated: number = transfer.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            })

            return {
                ...transfer,
                date: dateFormated,
                price: priceFormated,
                type: typeTranfersMask(transfer.type)
            }
        })

        const tItems = total

        setTotalPages(Math.round(tItems / TAKE))
        setTotalItems(tItems)
        setTransfers(transfersMap)
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

    const handleEyeIcon = (key: string) => {
        setColumnsState((prevColumns) => prevColumns.map((column) =>
            column.accessorKey === key ? { ...column, show: !column.show } : column
        ))
    }

    const resetCurrentPage = () => setCurrentPage(1)

    useEffect(() => {
        fetchTranfers()
    }, [walletId, walletType, transferType, currentPage])

    useEffect(() => {
        getWallets()
    }, [])

    return (
        <div className="w-full mt-14 md:mt-0 p-3">
            <div className="max-w-[1100px] m-auto lg:mt-20">
                <div className=" pb-3 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-3xl mb-2">
                            <Logs size={24} />
                            <h2>Suas <strong className="text-primary">Tranferências</strong></h2>
                        </div>
                    </div>

                    <p className="text-muted-foreground text-[16px] max-w-[80%] mb-4">Visualização e gerenciamento de todas os seus <span className="font-bold">Ativos</span>.</p>

                </div>
                <div className="flex justify-between flex-col md:flex-row flex-wrap md:items-center gap-2">
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

                    <Activity mode={`${filtersOpen ? "visible" : "hidden"}`}>
                        <Separator />
                        <div className="flex flex-wrap md:justify-end gap-4 mb-4"
                        >
                            <Select onValueChange={(value) => {
                                resetCurrentPage()
                                setWalletId(value.trim() === "" ? undefined : value)
                            }}>
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

                            <Select onValueChange={(value: TypeWallet) => {
                                resetCurrentPage()
                                setWalletType(value.trim() === "" ? undefined : value)
                            }}>
                                <SelectGroup>
                                    <SelectTrigger>
                                        <SelectLabel>
                                            <span className="mr-1">Tipo de carteira</span>
                                            {walletType && <SelectValue />}
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

                            <Select onValueChange={(value: typeTransferType) => {
                                resetCurrentPage()
                                setTranferType(value.trim() === "" ? undefined : value)
                            }}>
                                <SelectGroup>
                                    <SelectTrigger>
                                        <SelectLabel>
                                            <span className="mr-1">Tipo de Transferência</span>
                                            {transferType && <SelectValue />}
                                        </SelectLabel>
                                    </SelectTrigger>
                                    <SelectContent align="start" >
                                        <SelectItem value=" " className="cursor-pointer text-xs font-semibold">
                                            Qualquer
                                        </SelectItem>
                                        <SelectItem value="buy" className="cursor-pointer text-xs">
                                            Compra
                                        </SelectItem>
                                        <SelectItem value="sell" className="cursor-pointer text-xs">
                                            Venda
                                        </SelectItem>
                                        <SelectItem value="transfer" className="cursor-pointer text-xs">
                                            Transferência
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
                                        setTranferType(undefined)
                                        setWalletType(undefined)
                                    }}
                                >
                                    Limpar filtros
                                </Button>
                            </div>
                        </div>
                    </Activity>
                </div>

                {loading && <LoadingTable />}

                {!loading && transfers && transfers.length > 0 && (
                    <>
                        <DataTable
                            columns={columnsState}
                            data={transfers}
                        />
                        <PaginationComponent currentPage={currentPage} onPageCurrent={(page) => setCurrentPage(page)} totalPages={totalPages} totalItems={totalItems} />
                    </>
                )}

                {!loading && transfers && transfers.length === 0 && (
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-secondary/60 bg-card/50 p-6 text-center">
                        <SearchX size={36} className="text-primary" />
                        <div>
                            <p className="text-lg font-semibold text-foreground">Nenhuma Transferência encontrada</p>
                            <p className="text-sm text-muted-foreground">Revise os filtros aplicados para acompanhar suas transferências.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>

    )
}

export default TransfersPageContent