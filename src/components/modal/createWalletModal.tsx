import { PlusIcon } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createWalletSchema } from "@/app/schemas/walletSchema"
import Alerts from "../sweetAlerts/alerts"
import { createWallet } from "@/app/services/walletService"
import { useState } from "react"
import { CreateWallet } from "@/app/types/walletType"

interface CreateWalletModal {
    createdNewWallet?: () => void
}

const CreateWalletModal = ({ createdNewWallet }: CreateWalletModal) => {
    const [showDialog, setShowDialog] = useState<boolean>(false)

    const handleCreateButton = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        const validate = createWalletSchema.safeParse(data)

        if (!validate.success) {
            const error = validate.error
            const messages = JSON.parse(error as any).map((er: any) => er.message).join(";")

            Alerts.error({ title: "Erro", text: messages, timer: 1000 })
            return
        }

        const { success, error } = await createWallet(data as CreateWallet)

        if (!success) {
            Alerts.error({ title: "Erro", text: error })

            return
        }

        setShowDialog(false)
        Alerts.success({ title: "Sucesso", text: "Carteira criada com sucesso", timer: 1000 })

        if (createdNewWallet) createdNewWallet()
    }

    return (
        <>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>

                <DialogTrigger className="bg-green-500 flex justify-center gap-2 items-center text-md justify-self-end p-2 py-1.5 rounded-md cursor-pointer" onClick={() => setShowDialog(!showDialog)}>
                    <PlusIcon className="font-bold" />
                    <span className="font-bold">Carteira</span>
                </DialogTrigger>

                <DialogContent>
                    <form onSubmit={handleCreateButton}>
                        <DialogHeader className="mb-6">
                            <DialogTitle>Criar Carteira</DialogTitle>
                            <DialogDescription>
                                Mais carteiras, mais espaço para ativos.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 mb-6">
                            <div className="grid gap-3">
                                <Label htmlFor="name">Nome</Label>
                                <Input id="name" name="name" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="type">Tipo</Label>
                                <Select name="type">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="investment">Investimento</SelectItem>
                                        <SelectItem value="checking">Corrente</SelectItem>
                                        <SelectItem value="savings">Reserva</SelectItem>
                                    </SelectContent>
                                </Select>

                            </div>
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" className="cursor-pointer">Cancelar</Button>
                            </DialogClose>
                            <Button type="submit" className="cursor-pointer">Criar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>

            </Dialog >

        </>
    )
}

export default CreateWalletModal