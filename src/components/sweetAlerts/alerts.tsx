import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import type { ReactSweetAlertOptions } from "sweetalert2-react-content";
import type { ReactElement } from "react";

type AlertContent = string | ReactElement;

const MySwal = withReactContent(Swal);

interface AlertOptions {
    title?: string;
    text?: AlertContent;
    timer?: number;
}

const textList = (msgs: string[]): ReactElement => {
    return (
        <div className="flex flex-col text-foreground">
            {msgs && msgs.map((txt, index) => (
                <p key={index}>{txt}</p>
            ))}
        </div>
    )
}

const getAlertTheme = () => {
    if (typeof window === "undefined") {
        return { background: undefined, color: undefined }
    }

    const styles = getComputedStyle(document.documentElement)
    const background = styles.getPropertyValue("--background").trim()
    const color = styles.getPropertyValue("--foreground").trim()

    return {
        background: background || undefined,
        color: color || undefined,
    }
}

const Alerts = {
    success: ({ title = "Sucesso!", text = "", timer = 2000 }: AlertOptions = {}) => {
        const { background, color } = getAlertTheme()
        const options: ReactSweetAlertOptions = {
            title,
            icon: "success",
            background,
            color,
            confirmButtonColor: "#10b981",
            timer,
            timerProgressBar: true,
            showConfirmButton: false,
        };

        if (typeof text === "string" && text) {
            options.text = text;
        } else if (text) {
            options.html = text;
        }

        MySwal.fire(options);
    },

    // Alert de erro
    error: ({ title = "Erro!", text = "", timer = 3000 }: AlertOptions = {}) => {
        const textAsString = typeof text === "string" ? text : String(text ?? "");

        const shouldBeList = textAsString.includes(";");

        const alertText: AlertContent = shouldBeList
            ? textList(textAsString.split(";").map(t => t.trim()).filter(t => t !== ''))
            : textAsString;

        const isString = typeof alertText === 'string';

        const { background, color } = getAlertTheme()

        const options: ReactSweetAlertOptions = {
            title,
            icon: "error",
            background,
            color,
            confirmButtonColor: "#ef4444",
            timer,
            timerProgressBar: true,
            showConfirmButton: false,
        };

        if (isString && alertText) {
            options.text = alertText;
        } else if (!isString) {
            options.html = alertText;
        }

        MySwal.fire(options);
    },
};

export default Alerts;