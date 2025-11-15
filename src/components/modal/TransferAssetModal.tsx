"use client"

import { useEffect, useMemo, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import Alerts from "../sweetAlerts/alerts"
import { transferAsset } from "@/app/services/assetService"
import { Asset } from "@/app/(private)/asset/colunas"
import { Wallet } from "@/app/types/walletType"
import { CircleDollarSign, Wallet as WalletIcon } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { Badge } from "../ui/badge"

interface TransferAssetModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    asset: Asset
    wallets: Wallet[]
    onCompleted?: () => Promise<void> | void
}

export function TransferAssetModal({ open, onOpenChange, asset, wallets, onCompleted }: TransferAssetModalProps) {
    const [quantity, setQuantity] = useState<string>("")
    const [targetWalletId, setTargetWalletId] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const availableWallets = useMemo(() => wallets.filter((wallet) => wallet.id !== asset.walletId), [wallets, asset.walletId])

    useEffect(() => {
        if (open) {
            setQuantity("")
            setTargetWalletId(availableWallets[0] ? String(availableWallets[0].id) : "")
        }
    }, [open, availableWallets])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!targetWalletId) {
            Alerts.error({ title: "Erro", text: "Selecione a carteira de destino." })
            return
        }

        const parsedQuantity = Number(quantity)

        if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
            Alerts.error({ title: "Erro", text: "Informe uma quantidade válida para transferir." })
            return
        }

        if (parsedQuantity > asset.quantity) {
            Alerts.error({ title: "Erro", text: "Quantidade informada maior que a disponível." })
            return
        }

        setIsSubmitting(true)

        const { success, error } = await transferAsset({
            identifyId: asset.identifyId,
            quantity: parsedQuantity,
            sourceAssetId: asset.id,
            sourceWalletId: asset.walletId,
            targetWalletId: Number(targetWalletId),
        })

        setIsSubmitting(false)

        if (!success) {
            Alerts.error({ title: "Erro", text: error || "Não foi possível transferir o ativo." })
            return
        }

        Alerts.success({ title: "Sucesso", text: "Transferência registrada com sucesso." })
        onOpenChange(false)
        await onCompleted?.()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <Badge variant="outline" className="mb-4 flex w-fit items-center gap-2 px-2 py-1 text-sm text-foreground">
                    <WalletIcon className="h-4 w-4" />
                    <span>{asset.walletName}</span>
                </Badge>

                <DialogHeader>
                    <DialogTitle>Transferir ativo</DialogTitle>
                    <DialogDescription>
                        Selecione a carteira de destino e informe a quantidade para transferir este ativo.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-2 text-sm">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-muted-foreground">Ativo</span>
                        <div className="flex w-[200px] items-center gap-2 rounded-md border border-input bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                            <CircleDollarSign className="h-4 w-4" />
                            <span className="capitalize text-foreground">{asset.type}</span>
                        </div>
                    </div>
                    <p className="text-muted-foreground">
                        Quantidade disponível: <span className="font-medium text-foreground">{asset.quantity}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="transfer-quantity">Quantidade</Label>
                        <Input
                            id="transfer-quantity"
                            type="number"
                            min="0"
                            step="1"
                            value={quantity}
                            onChange={(event) => setQuantity(event.target.value)}
                            placeholder="Ex.: 3"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="transfer-target">Carteira de destino</Label>
                        <Select value={targetWalletId} onValueChange={setTargetWalletId} disabled={availableWallets.length === 0}>
                            <SelectTrigger id="transfer-target">
                                <SelectValue placeholder="Selecione a carteira" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Carteiras</SelectLabel>
                                    {availableWallets.length === 0 && (
                                        <SelectItem value="" disabled>Nenhuma carteira disponível</SelectItem>
                                    )}
                                    {availableWallets.map((wallet) => (
                                        <SelectItem key={wallet.id} value={String(wallet.id)}>
                                            {wallet.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="sm:justify-end">
                        <Button type="button" variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="cursor-pointer" disabled={isSubmitting || availableWallets.length === 0}>
                            {isSubmitting ? "Transferindo..." : "Transferir"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
