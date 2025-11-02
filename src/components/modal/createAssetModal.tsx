import { CircleDollarSign } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createAssetSchema } from "@/app/schemas/assetSchema"
import Alerts from "../sweetAlerts/alerts"
import { useEffect, useState } from "react"
import { createAsset } from "@/app/services/assetService"
import { useAppContext } from "@/app/context/dataContext"
import { DataList } from "../inputs/dataList"

interface CreateAssetModal {
    createdNewAsset?: () => void,
    walletId: number
}

type IdentityItemType = {
    value: number,
    label: string
}

const CreateAssetModal = ({ createdNewAsset, walletId }: CreateAssetModal) => {
    const { state } = useAppContext()

    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [identitys, setIdentitys] = useState<IdentityItemType[] | null>(null)
    const [price, setPrice] = useState<number>(0)
    const [quantity, setQuantity] = useState<number>(0)
    const [identifyId, setIdentifyId] = useState<number>(0)

    const handlePriceInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const onlyNumbers = value.replace(/\D/g, "")

        setPrice(Number(onlyNumbers) / 100)
    }

    useEffect(() => {
        const assetsIdentityInContextIsArray = Array.isArray(state.assetsIdentity)

        if (state.assetsIdentity && assetsIdentityInContextIsArray) {
            
            const identitysMap = state.assetsIdentity.map((identity): IdentityItemType => {
                return {
                    label: identity.canonicalName,
                    value: identity.id
                }
            })

            setIdentitys(identitysMap)
        }
    }, [state.assetsIdentity])


    const handleCreateAssetButton = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const credentials = { identifyId, walletId, price, quantity }
        const validate = createAssetSchema.safeParse(credentials)

        if (!validate.success) {
            const error = validate.error
            const messages = JSON.parse(error as any).map((er: any) => er.message).join(";")

            Alerts.error({ title: "Erro", text: messages, timer: 2000 })
            return
        }

        const { success, data, error } = await createAsset(validate.data)

        if (!success) {
            Alerts.error({ title: "Error", text: error })

            return
        }

        setShowDialog(false)
        Alerts.success({ title: "Sucesso", text: "Ativo criado com sucesso", timer: 2000 })

        if (createdNewAsset) createdNewAsset()
    }

    return (
        <>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>

                <Button variant={"secondary"} className="flex justify-center items-center p-2 py-1 text-xs cursor-pointer" onClick={() => setShowDialog(!showDialog)} >
                    <CircleDollarSign />
                    <span>Comprar ativos</span>
                </Button>


                <DialogContent>
                    <form onSubmit={handleCreateAssetButton}>
                        <DialogHeader className="mb-6">
                            <DialogTitle>Compre ativos</DialogTitle>
                            <DialogDescription>
                                Se o ativo já existir em sua carteira, o valor será adicionado sem problemas.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 mb-6">
                            <div className="grid gap-3">
                                <Label htmlFor="identity">Ativo</Label>
                                <DataList
                                    elements={identitys}
                                    key={"identity"}
                                    instruction="Selecione um ativo"
                                    selectItem={(value) => setIdentifyId(value.value)} placeholder="Busque por ativos..."
                                />
                            </div>
                            <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                                <div className="space-y-3">
                                    <Label htmlFor="quantity">Quantidade</Label>
                                    <Input type="number" name="quantity" value={quantity} id="quantity" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value))} />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="price">Preço (unidade)</Label>
                                    <Input type="text" value={price.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })} onChange={handlePriceInput} name="price" id="price" />
                                </div>
                            </div>

                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" className="cursor-pointer">Cancelar</Button>
                            </DialogClose>
                            <Button type="submit" className="cursor-pointer">Criar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent >

            </Dialog >

        </>
    )
}

export default CreateAssetModal