import AssetPageContent from "./assetPageContent"
import { Suspense } from "react"
import { RouteLoading } from "@/components/routeLoading"

const page = () => {
    return (
        <Suspense fallback={<RouteLoading message="Pagina de Ativos esta carregando" />}>
            <AssetPageContent />
        </Suspense>
    )
}

export default page