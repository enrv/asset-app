import { useAuth } from "../hooks/useAuth"
import { useLang } from "../hooks/useLang"

function Sidebar() {
    const { user } = useAuth()
    const { getMessages } = useLang()

    let dashboardUrl = ""
    if (user) {
        dashboardUrl = user.kindofuser == "client" ? "/client" : "/manager"
    }

    return (
            <div class="relative w-full rounded-lg border px-4 py-3 overflow-y-auto">
                <ul class="space-y-2 text-sm font-medium">
                    <li>
                    <a href="/" class="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" width="24" height="24" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-home">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        <span class="ml-3 flex-1 whitespace-nowrap">{getMessages().sidebar.home}</span>
                    </a>
                    </li>
                    {user && (
                    <li>
                    <a href={dashboardUrl} class="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" width="24" height="24" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span class="ml-3 flex-1 whitespace-nowrap">{getMessages().sidebar.dashboard}</span>
                    </a>
                    </li>
                    )}
                    <li>
                    <a href="/companies" class="flex items-center rounded-lg px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" width="24" height="24" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package">
                        <path d="M16.5 9.4 7.55 4.24" />
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                        <polyline points="3.29 7 12 12 20.71 7" />
                        <line x1="12" x2="12" y1="22" y2="12" />
                        </svg>
                        <span class="ml-3 flex-1 whitespace-nowrap">{getMessages().sidebar.companies}</span>
                    </a>
                    </li>
                </ul>
            </div>
    )
}

export default Sidebar