
import { RouteLoading } from "@/components/routeLoading"
import WalletPageContent from "./walletPageContent"
import { Suspense } from "react"

const page = () => {
    return (
        <Suspense fallback={<RouteLoading message="Pagina de Carterias esta carregando"  />}>
            <WalletPageContent />
        </Suspense>
    )
}

export default page