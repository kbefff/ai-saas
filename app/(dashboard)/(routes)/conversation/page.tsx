"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from 'axios'
import { MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"

import { BotAvatar } from '@/components/bot-avatar'
import { Empty } from "@/components/ui/empty"
import { Heading } from '@/components/heading'
import { Loader } from "@/components/loader"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { UserAvatar } from '@/components/user-avatar'

import { formSchema } from "@/app/(dashboard)/(routes)/conversation/constants"

import { cn } from '@/lib/utils'



const ConversationPage = () => {
    const router = useRouter()
    const [messages, setMessages] = useState<{ content: string, role: string }[]>([]);


    const form = useForm<z.infer<typeof formSchema>>({ // control form validation
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    })

    //control loading state for form
    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage = {
                content: values.prompt,
                role: "user"
            };
            const newMessages = [...messages, userMessage];

            const response = await axios.post("/api/conversation", { messages: newMessages });
            setMessages(current => [...current, userMessage, response.data]);


            form.reset();
        } catch (error: any) {
            console.log(error);
        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <Heading
                title="Conversation"
                description="Our most advanced conversation model."
                icon={MessageSquare}
                iconColor="text-violet-500"
                bgColor="bg-violet-500/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="
                                rounded-lg
                                border
                                w-full
                                p-4
                                px-3
                                md:px-6
                                focus-within:shadow-sm
                                grid
                                grid-cols-12
                                gap-2">
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="How do I calculate the radius of a circle?"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {messages.length === 0 && !isLoading && (
                        <Empty label="No conversation started." />
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message, index) => (
                            <div key={index}
                                className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg", message.role == "user" ? "bg-white boarder boarder-black/10" : 'bg-muted')}> {/* Use index as key if message objects don't have unique identifiers */}
                                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                <p className="text-sm">
                                    {message.content}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ConversationPage