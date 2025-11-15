"use client"

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import { UserRound, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import Alerts from "@/components/sweetAlerts/alerts"
import { getUserProfile, updateUserProfile, verifyUserPassword } from "@/app/services/userService"
import { UserProfile } from "@/app/types/userType"
import { getTokenInCookie } from "@/app/utils/cookiesUtil"

interface FormState {
    name: string
    email: string
    newPassword: string
    confirmPassword: string
}

interface UpdatePayload {
    name?: string
    email?: string
    password?: string
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordNumberRegex = /\d/
const passwordSpecialCharRegex = /[!@#$%^&*()\-_=+{}\[\]:;"'`~<>,.?/\\|]/

const ProfilePageContent = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [userId, setUserId] = useState<number | null>(null)
    const [formState, setFormState] = useState<FormState>({ name: "", email: "", newPassword: "", confirmPassword: "" })
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPasswordFields, setShowPasswordFields] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [pendingPayload, setPendingPayload] = useState<UpdatePayload | null>(null)
    const [isVerifying, setIsVerifying] = useState(false)

    const loadProfile = useCallback(async (id: number) => {
        setIsLoading(true)

        const { success, data, error } = await getUserProfile(id)

        if (!success || !data) {
            Alerts.error({ title: "Erro", text: error || "Não foi possível carregar o perfil." })
            setIsLoading(false)
            return
        }

        const user = Array.isArray(data) ? data[0] : data

        setProfile(user)
        setFormState({
            name: user?.name ?? "",
            email: user?.email ?? "",
            newPassword: "",
            confirmPassword: "",
        })
        setShowPasswordFields(false)
        setIsLoading(false)
    }, [])

    useEffect(() => {
        const extractUserIdFromToken = () => {
            const token = getTokenInCookie()
            if (!token) return null

            try {
                const [, payload] = token.split(".")
                if (!payload) return null

                const decoded = JSON.parse(atob(payload))
                const rawId = decoded?.id ?? decoded?.userId ?? decoded?.sub

                if (typeof rawId === "number") return rawId
                if (typeof rawId === "string") {
                    const parsed = Number(rawId)
                    return Number.isNaN(parsed) ? null : parsed
                }

                return null
            } catch (error) {
                console.error("Erro ao decodificar token", error)
                return null
            }
        }

        const id = extractUserIdFromToken()

        if (id == null) {
            Alerts.error({ title: "Erro", text: "Não foi possível identificar o usuário logado." })
            setIsLoading(false)
            return
        }

        setUserId(id)
    }, [])

    useEffect(() => {
        if (userId == null) return
        loadProfile(userId)
    }, [userId, loadProfile])

    const hasPendingChanges = useMemo(() => {
        if (!profile) return false

        const nameChanged = formState.name.trim() !== (profile.name ?? "")
        const emailChanged = formState.email.trim() !== (profile.email ?? "")
        const passwordChanged = !!formState.newPassword

        return nameChanged || emailChanged || passwordChanged
    }, [formState, profile])

    const handleFieldChange = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
        setFormState((previous) => ({
            ...previous,
            [field]: event.target.value,
        }))
    }

    const handleCancelPasswordChange = () => {
        setShowPasswordFields(false)
        setFormState((previous) => ({
            ...previous,
            newPassword: "",
            confirmPassword: "",
        }))
    }

    const validatePassword = (password: string) => {
        if (password.length < 8) {
            Alerts.error({ title: "Senha inválida", text: "A nova senha deve ter ao menos 8 caracteres." })
            return false
        }

        if (!passwordNumberRegex.test(password)) {
            Alerts.error({ title: "Senha inválida", text: "A nova senha deve conter ao menos um número." })
            return false
        }

        if (!passwordSpecialCharRegex.test(password)) {
            Alerts.error({ title: "Senha inválida", text: "A nova senha deve conter ao menos um caractere especial." })
            return false
        }

        return true
    }

    const buildPayload = (): UpdatePayload | null => {
        if (!profile) return null

        const payload: UpdatePayload = {}

        const trimmedName = formState.name.trim()
        if (trimmedName !== profile.name) {
            if (!trimmedName) {
                Alerts.error({ title: "Validação", text: "O nome não pode ficar em branco." })
                return null
            }
            payload.name = trimmedName
        }

        const trimmedEmail = formState.email.trim()
        if (trimmedEmail !== profile.email) {
            if (!trimmedEmail) {
                Alerts.error({ title: "Validação", text: "O email não pode ficar em branco." })
                return null
            }

            if (!emailRegex.test(trimmedEmail)) {
                Alerts.error({ title: "Validação", text: "Informe um email válido." })
                return null
            }

            payload.email = trimmedEmail.toLowerCase()
        }

        if (showPasswordFields && formState.newPassword) {
            if (formState.newPassword !== formState.confirmPassword) {
                Alerts.error({ title: "Validação", text: "As senhas não coincidem." })
                return null
            }

            if (!validatePassword(formState.newPassword)) {
                return null
            }

            payload.password = formState.newPassword
        }

        if (!Object.keys(payload).length) {
            return {}
        }

        return payload
    }

    const executeUpdate = async (payload: UpdatePayload) => {
        if (userId == null) {
            Alerts.error({ title: "Erro", text: "Usuário não identificado. Entre novamente." })
            return
        }

        setIsSubmitting(true)
        const { success, error } = await updateUserProfile(userId, payload)
        setIsSubmitting(false)

        if (!success) {
            Alerts.error({ title: "Erro", text: error || "Não foi possível atualizar o perfil." })
            return
        }

        Alerts.success({ title: "Sucesso", text: "Perfil atualizado com sucesso." })
        setPendingPayload(null)
        setCurrentPassword("")
        setConfirmOpen(false)
        await loadProfile(userId)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const payload = buildPayload()

        if (!payload) {
            return
        }

        if (!Object.keys(payload).length) {
            return
        }

        if (payload.email || payload.password) {
            setPendingPayload(payload)
            setConfirmOpen(true)
            return
        }

        await executeUpdate(payload)
    }

    const handleConfirmSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!pendingPayload) {
            setConfirmOpen(false)
            return
        }

        if (userId == null) {
            Alerts.error({ title: "Erro", text: "Usuário não identificado. Entre novamente." })
            return
        }

        if (!currentPassword) {
            Alerts.error({ title: "Validação", text: "Informe a senha atual para confirmar." })
            return
        }

        setIsVerifying(true)
        const { success, error } = await verifyUserPassword(userId, currentPassword)
        setIsVerifying(false)

        if (!success) {
            Alerts.error({ title: "Erro", text: error || "Senha atual inválida." })
            return
        }

        await executeUpdate(pendingPayload)
    }

    const handleConfirmOpenChange = (open: boolean) => {
        if (!open) {
            if (isVerifying || isSubmitting) {
                return
            }

            setConfirmOpen(false)
            setCurrentPassword("")
            setPendingPayload(null)
            return
        }

        setConfirmOpen(true)
    }

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center py-16">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <>
            <div className="w-full mt-14 md:mt-0 p-3">
                <div className="max-w-[1100px] m-auto lg:mt-20">
                    <div className="border-b-2 border-secondary pb-3 mb-4">
                        <div className="flex items-center gap-2.5 text-3xl mb-2">
                            <UserRound size={24} />
                            <h2>
                                Seu <strong className="text-primary">Perfil</strong>
                            </h2>
                        </div>
                        <p className="text-muted-foreground text-[16px] max-w-[80%]">
                            Visualização e gerenciamento dos seus <span className="font-bold">Dados Pessoais</span>.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Card className="bg-card/30">
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold">Informações principais</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Atualize nome, email ou senha conforme necessário.
                                    </p>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="profile-name">Nome</Label>
                                        <Input
                                            id="profile-name"
                                            value={formState.name}
                                            onChange={handleFieldChange("name")}
                                            placeholder="Seu nome"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="profile-email">Email</Label>
                                        <Input
                                            id="profile-email"
                                            type="email"
                                            value={formState.email}
                                            onChange={handleFieldChange("email")}
                                            placeholder="seu@email.com"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                {showPasswordFields ? (
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                            <span>Não deseja mais alterar a senha?</span>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="link"
                                                onClick={handleCancelPasswordChange}
                                                disabled={isSubmitting}
                                                className="cursor-pointer"
                                            >
                                                Manter senha atual
                                            </Button>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="profile-new-password">Nova senha</Label>
                                                <Input
                                                    id="profile-new-password"
                                                    type="password"
                                                    value={formState.newPassword}
                                                    onChange={handleFieldChange("newPassword")}
                                                    placeholder="Digite a nova senha"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="profile-confirm-password">Confirmar nova senha</Label>
                                                <Input
                                                    id="profile-confirm-password"
                                                    type="password"
                                                    value={formState.confirmPassword}
                                                    onChange={handleFieldChange("confirmPassword")}
                                                    placeholder="Repita a nova senha"
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowPasswordFields(true)}
                                        disabled={isSubmitting || userId == null}
                                        className="w-fit cursor-pointer"
                                    >
                                        Mudar senha
                                    </Button>
                                )}
                            </CardContent>
                            <CardFooter className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        if (!profile) return
                                        setFormState({ name: profile.name ?? "", email: profile.email ?? "", newPassword: "", confirmPassword: "" })
                                        setShowPasswordFields(false)
                                    }}
                                    disabled={isSubmitting || !hasPendingChanges || userId == null}
                                    className="w-full cursor-pointer sm:w-auto"
                                >
                                    Descartar alterações
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !hasPendingChanges || userId == null}
                                    className="w-full cursor-pointer sm:w-auto"
                                >
                                    {isSubmitting ? "Salvando..." : "Salvar alterações"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>

            <Dialog open={confirmOpen} onOpenChange={handleConfirmOpenChange}>
                <DialogContent>
                    <form onSubmit={handleConfirmSubmit} className="space-y-4">
                        <DialogHeader>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-primary" />
                                <DialogTitle>Confirmar alterações sensíveis</DialogTitle>
                            </div>
                            <DialogDescription>
                                Para alterar email ou senha, confirme sua identidade informando a senha atual.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-2">
                            <Label htmlFor="current-password">Senha atual</Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(event) => setCurrentPassword(event.target.value)}
                                placeholder="Digite sua senha atual"
                                disabled={isVerifying || isSubmitting}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleConfirmOpenChange(false)}
                                disabled={isVerifying || isSubmitting}
                                className="w-full cursor-pointer sm:w-auto"
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isVerifying || isSubmitting} className="w-full cursor-pointer sm:w-auto">
                                {isVerifying || isSubmitting ? "Validando..." : "Confirmar alterações"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ProfilePageContent
