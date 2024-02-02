import { createContext, useContext, useMemo } from "react"
import { useLocalStorage } from "./useLocalStorage"
import * as ptBR from "../lang/pt_br.json"
import * as enUS from "../lang/en_us.json"

const LangContext = createContext()

const LangProvider = ({ children }) => {
    const [lang, setLang] = useLocalStorage("lang", "pt-br")

    const getMessages = () => {
        return (lang === "pt-br") ? ptBR : enUS
    }

    const changeLang = (newLang) => {
        setLang(newLang)
    }

    const value = useMemo(() => ({lang, changeLang, getMessages}), [lang])

    return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

const useLang = () => {
    const context = useContext(LangContext)

    if (!context) {
        throw new Error("useLang must be used within an LangProvider")
    }

    return context
}

export { LangProvider, useLang }