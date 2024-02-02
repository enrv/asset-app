import { useEffect, useState } from "react"

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
    useEffect(() => {
        document.title += " | Register"
    }, [])

    const [ registerHasFailed, setRegisterHasFailed ] = useState(false)
    const [ ableToLogin, setAbleToLogin ] = useState(false)

    const formSchema = z.object({
        firstName: z.string().min(2, {message: "Name too short"}),
        lastName: z.string().min(2, {message: "Last name too short"}),
        email: z.string().email({message: "Please enter valid email"}),
        password: z.string().min(4, {message: "Password too short"}),
        passwordConfirm: z.string().min(4, {message: "Password too short"}),
        zipCode: z.string().refine(v => /^\d{8}$/.test(v), {message: "Please enter valid zip code"}),
        kindofuser: z.enum(["client", "manager"])
    }).refine(data => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
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
            <h2 className="scroll-m-20 pb-10 text-3xl font-semibold tracking-tight first:mt-0">Register</h2>
            {registerHasFailed &&
                <Alert>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.091 1.99162C10.7076 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    <AlertTitle>Failure!</AlertTitle>
                    <AlertDescription>
                    User not registered. Please try again
                    </AlertDescription>
                </Alert>
            }
            {ableToLogin &&
                <Alert>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.091 1.99162C10.7076 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                    User registered. Please login
                    </AlertDescription>
                </Alert>
            }

            <Tabs defaultValue="client" className="w-[400px] pb-10 pt-10" onValueChange={(t) => form.setValue("kindofuser", t)}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="client">Client</TabsTrigger>
                <TabsTrigger value="manager">Manager</TabsTrigger>
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
                        <Input placeholder="First Name" {...field} />
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
                        <Input placeholder="Last Name" {...field} />
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
                        <Input placeholder="Zip Code" {...field} />
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
                        <Input placeholder="Email" {...field} />
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
                        <Input type="password" placeholder="Password" {...field} />
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
                        <Input type="password" placeholder="Confirm Password" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit">Register</Button>
            </form>
            </Form>
        </div>
    )
}

export default Register