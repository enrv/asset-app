import { useEffect, useState } from "react"
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

function Register() {
    const { getMessages } = useLang()

    useEffect(() => {
        document.title += " | " + getMessages().register.pageBrowserTitle
    }, [])

    const [ registerHasFailed, setRegisterHasFailed ] = useState(false)
    const [ ableToLogin, setAbleToLogin ] = useState(false)

    const formSchema = z.object({
        firstName: z.string().min(2, {message: getMessages().register.shortFirstNameMessage}),
        lastName: z.string().min(2, {message: getMessages().register.shortLastNameMessage}),
        email: z.string().email({message: getMessages().register.validMailMessage}),
        password: z.string().min(4, {message: getMessages().register.shortPasswordMessage}),
        passwordConfirm: z.string().min(4, {message: getMessages().register.shortPasswordMessage}),
        zipCode: z.string().refine(v => /^\d{8}$/.test(v), {message: getMessages().register.zipCodeInvalid}),
        kindofuser: z.enum(["client", "manager"])
    }).refine(data => data.password === data.passwordConfirm, {
        message: getMessages().register.passwordsDontMatchMessage,
        path: ["passwordConfirm"],
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            passwordConfirm: "",
            zipCode: "",
            kindofuser: "client"
        },
    })

    const submitRegister = (e) => {
        const requestInfo = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "kindofuser": e.kindofuser,
                "first_name": e.firstName,
                "last_name": e.lastName,
                "email": e.email,
                "zip": e.zipCode,
                "password": e.password
            })
        }
        
        fetch("/api/register", requestInfo)
            .then(response => {
                if (response.status == 200) {
                    return response.json()
                }
                throw new Error("User not registered")
            })
            .then(() => {
                setAbleToLogin(true)
                setRegisterHasFailed(false)
            })
            .catch(error => {
                setAbleToLogin(false)
                setRegisterHasFailed(true)
                console.error(error)
            })
    }

    return (
        <div>
            <h2 className="scroll-m-20 pb-10 text-3xl font-semibold tracking-tight first:mt-0">{getMessages().register.pageTitle}</h2>
            {registerHasFailed &&
                <Alert>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    <AlertTitle>{getMessages().register.registerHasFailedTitle}</AlertTitle>
                    <AlertDescription>
                    {getMessages().register.registerHasFailedMessage}
                    </AlertDescription>
                </Alert>
            }
            {ableToLogin &&
                <Alert>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    <AlertTitle>{getMessages().register.registerHasSucceededTitle}</AlertTitle>
                    <AlertDescription>
                    {getMessages().register.registerHasSucceededMessage}
                    </AlertDescription>
                </Alert>
            }

            <Tabs defaultValue="client" className="w-[400px] pb-10 pt-10" onValueChange={(t) => form.setValue("kindofuser", t)}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="client">{getMessages().register.clientTrigger}</TabsTrigger>
                <TabsTrigger value="manager">{getMessages().register.managerTrigger}</TabsTrigger>
            </TabsList>
            </Tabs>

            <Form {...form}>
            <form onSubmit={form.handleSubmit(submitRegister)} className="space-y-8">
                <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input placeholder={getMessages().register.firstNamePlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input placeholder={getMessages().register.lastNamePlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input placeholder={getMessages().register.zipCodePlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input placeholder={getMessages().register.emailPlaceholder} {...field} />
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
                        <Input type="password" placeholder={getMessages().register.passwordPlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input type="password" placeholder={getMessages().register.confirmPasswordPlaceholder} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit">{getMessages().register.registerButton}</Button>
            </form>
            </Form>
        </div>
    )
}

export default Register