import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useLang } from "../hooks/useLang"

import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"
import {
    Tabs,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

function Login() {
    const { getMessages } = useLang()

    useEffect(() => {
        document.title += " | " + getMessages().login.pageBrowserTitle
    }, [])

    const [ loginHasFailed, setLoginHasFailed ] = useState(false)

    const formSchema = z.object({
        email: z.string().email({message: getMessages().login.validMailMessage}),
        password: z.string().min(4, {message: getMessages().login.shortPasswordMessage}),
        kindofuser: z.enum(["client", "manager"]),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            kindofuser: "client"
        },
    })

    const { login } = useAuth()

    const submitLogin = (e) => {
        const requestInfo = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "kindofuser": e.kindofuser,
                "email": e.email,
                "password": e.password
            })
        }
        
        fetch("/api/login", requestInfo)
            .then(response => {
                if (response.status == 200) {
                    return response.json()
                }
                throw new Error("User or password incorrect")
            })
            .then(data => {
                login({
                    "token": data.access_token,
                    "kindofuser": e.kindofuser,
                    "email": e.email,
                    "first_name": data.first_name,
                    "last_name": data.last_name
                })
            })
            .catch(error => {
                setLoginHasFailed(true)
                console.error(error)
            })
    }

    return (
        <div>
        <h2 className="scroll-m-20 pb-10 text-3xl font-semibold tracking-tight first:mt-0">Login</h2>

        {loginHasFailed &&
            <Alert>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.091 1.99162C10.7076 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                <AlertTitle>{getMessages().login.loginHasFailedTitle}</AlertTitle>
                <AlertDescription>
                {getMessages().login.loginHasFailedMessage}
                </AlertDescription>
            </Alert>
        }

        <Tabs defaultValue="client" className="w-[400px] pb-10 pt-10" onValueChange={(t) => form.setValue("kindofuser", t)}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="client">{getMessages().login.clientTrigger}</TabsTrigger>
                <TabsTrigger value="manager">{getMessages().login.managerTrigger}</TabsTrigger>
            </TabsList>
        </Tabs>

        <Form {...form}>
        <form onSubmit={form.handleSubmit(submitLogin)} className="space-y-8">
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <Input placeholder={getMessages().login.emailPlaceholder} {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <Input type="password" placeholder={getMessages().login.passwordPlaceholder} {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit">{getMessages().login.loginButton}</Button>
        </form>
        </Form>
        </div>
    )
}

export default Login