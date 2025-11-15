import { Suspense } from "react"
import ProfilePageContent from "./profilePageContent"
import { RouteLoading } from "@/components/routeLoading"

const Page = () => {
    return (
        <Suspense fallback={<RouteLoading message="Perfil está carregando" />}>
            <ProfilePageContent />
        </Suspense>
    )
}

export default Page
