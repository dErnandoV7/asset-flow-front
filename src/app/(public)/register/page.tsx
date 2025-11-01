"use client"

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { InputNormal } from "@/components/inputs/InputNormal"
import { Button } from "@/components/ui/button"
import { registerUser } from "@/app/services/userService"
import { useState } from "react"
import { createUserSchema } from "@/app/schemas/userSchema"
import Loading from "@/components/loading"
import Alerts from "@/components/sweetAlerts/alerts"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const route = useRouter()

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const handleLoginButton = async () => {
        const credentials = { name, email, password }
        const validate = createUserSchema.safeParse(credentials)

        if (!validate.success) {
            const error = validate.error
            const messages = JSON.parse(error as any).map((er: any) => er.message).join(";")

            Alerts.error({ title: "Erro", text: messages })

            return
        }

        setLoading(true)

        const res: any = await registerUser(email, password, name)

        setLoading(false)

        if (res.error) {
            const message = res.dataError.response.data.message
            Alerts.error({ title: "Erro", text: message })

            return
        }

        Alerts.success({ title: "Sucesso", text: "Registro realizado com sucesso", timer: 1000 })

        route.push("/")
    }

    const redirectToLogin = () => route.push("/login")

    return (
        <div className="flex justify-center items-center min-h-screen">
            {loading && <Loading />}
            <Card className="flex-1 max-w-[500px] bg-transparent border-transparent md:bg-card">
                <CardHeader className="text-center mb-4">
                    <CardTitle className="font-semibold text-4xl">
                        Asset <strong className="font-bold text-primary"> Flow</strong>
                    </CardTitle>
                    <CardDescription className="text-[16px] md:text-md  border-b-2 border-card md:border-accent  pb-3">
                        <span>
                            Registre sua conta para acessar nosso sistema</span>
                    </CardDescription>
                </CardHeader>

                <CardContent className="flex flex-col gap-6">
                    <InputNormal type="text" value={email} label="Nome" classNameLabel="bg-background md:bg-card" classNameInput="w-full" onChange={(value) => setName(value as string)} />

                    <InputNormal type="email" value={email} label="Email" classNameLabel="bg-background md:bg-card" classNameInput="w-full" onChange={(value) => setEmail(value as string)} />

                    <InputNormal type="password" value={password} label="Senha" classNameLabel="bg-background md:bg-card" classNameInput="w-full" onChange={(value) => setPassword(value as string)} />

                    <div className="bg-popover md:bg-secondary rounded-[5px] border-secondary md:border-popover border-2 p-3">
                        <p className="text-[16px] mb-2 font-semibold">Requisitos da senha:</p>
                        <ul className="text-sm md:text-base text-popover-muted-foreground">
                            <li>Deve ter no mínimo 8 caracteres.</li>
                            <li>Deve possuir pelo menos 1 número.</li>
                            <li>Deve possuir ter no mínimo 1 caracter especial.</li>
                        </ul>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-6">
                    <p className="text-center w-full text-muted-foreground">Já possui conta? <span className="text-primary cursor-pointer" onClick={redirectToLogin}>Faça login</span></p>

                    <CardAction className="w-full">
                        <Button className="text-xl w-full p-6 rounded-2xl cursor-pointer" onClick={handleLoginButton}>Criar conta</Button>
                    </CardAction>
                </CardFooter>
            </Card>
        </div>
    )
}