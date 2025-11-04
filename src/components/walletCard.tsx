import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Wallet, Logs } from "lucide-react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import CreateAssetModal from "@/components/modal/createAssetModal"

interface WalletCard {
    name: string,
    type: string,
    countAssets: number,
    createdAt: string,
    walletId: number
}

const WalletCard = ({ countAssets, createdAt, name, type, walletId }: WalletCard) => {

    return (
        <>
            <Card>
                <CardHeader className="flex justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Wallet />
                        <span className="text-xl">{name}</span>
                    </CardTitle>
                    <aside>
                        <Badge>
                            {type}
                        </Badge>
                    </aside>
                </CardHeader>

                <CardContent className="flex justify-between items-center">
                    <Badge variant={"outline"} className="p-2 py-1">
                        Qnt. Ativos: {countAssets}
                    </Badge>
                    <p className="text-xs">
                        Criado em: <span className="font-semibold">{createdAt}</span>
                    </p>
                </CardContent>

                <CardFooter className="flex gap-2">
                    <Button variant={"secondary"} className="flex justify-center items-center p-2 py-1 text-xs cursor-pointer">
                        <Logs />
                        <span>Ver ativos</span>
                    </Button>

                    <CreateAssetModal walletId={walletId} walletName={name} />
                </CardFooter>
            </Card>
        </>
    )
}

export default WalletCard