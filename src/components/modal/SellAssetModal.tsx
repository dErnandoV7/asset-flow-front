"use client"

import { ChangeEvent, FormEvent, useEffect, useState } from "react"
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
import { sellAsset } from "@/app/services/assetService"
import { Asset } from "@/app/(private)/asset/colunas"
import { Badge } from "../ui/badge"
import { CircleDollarSign, Wallet } from "lucide-react"

interface SellAssetModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    asset: Asset
    onCompleted?: () => Promise<void> | void
}

export function SellAssetModal({ open, onOpenChange, asset, onCompleted }: SellAssetModalProps) {
    const [price, setPrice] = useState<number>(0)
    const [quantity, setQuantity] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (open) {
            setPrice(0)
            setQuantity("")
        }
    }, [open, asset.id])

    // Keep price state numeric while masking the input as BRL currency
    const handlePriceInput = (event: ChangeEvent<HTMLInputElement>) => {
        const digitsOnly = event.target.value.replace(/\D/g, "")
        setPrice(digitsOnly ? Number(digitsOnly) / 100 : 0)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const parsedPrice = Number(price.toFixed(2))
        const parsedQuantity = Number(quantity)

        if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
            Alerts.error({ title: "Erro", text: "Informe um preço válido para a venda." })
            return
        }

        if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
            Alerts.error({ title: "Erro", text: "Informe uma quantidade válida para a venda." })
            return
        }

        if (parsedQuantity > asset.quantity) {
            Alerts.error({ title: "Erro", text: "Quantidade informada maior que a disponível." })
            return
        }

        setIsSubmitting(true)

        const { success, error } = await sellAsset({
            assetId: asset.id,
            price: parsedPrice,
            quantity: parsedQuantity,
        })

        setIsSubmitting(false)

        if (!success) {
            Alerts.error({ title: "Erro", text: error || "Não foi possível realizar a venda." })
            return
        }

        Alerts.success({ title: "Sucesso", text: "Venda registrada com sucesso." })
        onOpenChange(false)
        await onCompleted?.()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <Badge variant="outline" className="mb-4 flex w-fit items-center gap-2 px-2 py-1 text-sm text-foreground">
                    <Wallet className="h-4 w-4" />
                    <span>{asset.walletName}</span>
                </Badge>

                <DialogHeader>
                    <DialogTitle>Vender ativo</DialogTitle>
                    <DialogDescription>
                        Informe quantidade e preço unitário para registrar a venda deste ativo.
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
                        <Label htmlFor="sell-price">Preço por unidade</Label>
                        <Input
                            id="sell-price"
                            type="text"
                            inputMode="numeric"
                            value={price.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                            onChange={handlePriceInput}
                            placeholder="R$ 0,00"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="sell-quantity">Quantidade</Label>
                        <Input
                            id="sell-quantity"
                            type="number"
                            min="0"
                            step="1"
                            value={quantity}
                            onChange={(event) => setQuantity(event.target.value)}
                            placeholder="Ex.: 5"
                        />
                    </div>

                    <DialogFooter className="sm:justify-end">
                        <Button type="button" variant="outline" className="cursor-pointer" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
                            {isSubmitting ? "Registrando..." : "Registrar venda"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
