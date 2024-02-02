import { useState, useEffect } from "react"

import {
    ToggleGroup,
    ToggleGroupItem,
  } from "@/components/ui/toggle-group"

function Footer() {
    const currentYear = new Date().getFullYear()

    const getTimeString = () => new Date().toLocaleTimeString("pt-br", {timeZone: "America/Sao_Paulo"})
    const [ now, setNow ] = useState(getTimeString)
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(getTimeString())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const [ language, setLanguage ] = useState("pt-br")

    return (
        <footer className="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:justify-between dark:bg-gray-800 dark:border-gray-600">
            <p className="float-left ml-16 text-base pt-1 text-muted-foreground">{currentYear} - Minha Asset - {now} (Horário de Brasília)</p>
            <div className="float-right mr-16">
                <ToggleGroup type="single" variant="outline" value={language} onValueChange={(v) => { if (v) setLanguage(v) }}>
                <ToggleGroupItem value="pt-br" aria-label="Toggle bold">
                    pt-BR
                </ToggleGroupItem>
                <ToggleGroupItem value="en-us" aria-label="Toggle italic">
                    en-US
                </ToggleGroupItem>
                </ToggleGroup>
            </div>
        </footer>
    )
}

export default Footer