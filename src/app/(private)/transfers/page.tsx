import TransfersPageContent from "./transfersPageContent"
import { Suspense } from "react"
import { RouteLoading } from "@/components/routeLoading"

const page = () => {
    return (
        <Suspense fallback={<RouteLoading message="Pagina de Transferências esta carregando" />}>
            <TransfersPageContent />
        </Suspense>
    )
}

export default page