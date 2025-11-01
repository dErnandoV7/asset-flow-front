import { WalletType } from "../types/walletType"

export const setTypeMasc = (type: WalletType) => {
    if (type === "checking") return "Corrente"
    else if (type === "investment") return "Investimento"
    else if (type === "savings") return "Reserva"
}

export const getOnlyDate = (dateInString: string) => {
    const date = new Date(dateInString)
    const dateFormated = date.toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo"
    })

    return dateFormated
}