"use client"

import { useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Mail } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address."
  })
})

export default function MailList() {
  const [isSubscribing, setIsSubscribing] = useState(false)

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubscribing(true)
    try {
      // Simulate newsletter signup
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success("Successfully Subscribed! ", {
        description: `We'll send the best deals to ${data.email}`,
      })

      form.reset()
    } catch (error) {
      toast.error("Subscription Failed",{
        description: "Please try again later.",
      })
    } finally {
      setIsSubscribing(false)
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center justify-center space-x-2">
            <Mail className="w-8 h-8" />
            <span>Save Time, Save Money!</span>
          </h1>
          <p className="text-lg text-white/80">
            Sign up and we'll send the best deals to you
          </p>
        </div>

        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email</FormLabel>
                  <FormControl>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Your Email"
                        {...field}
                        className="flex-grow bg-white/20 border-white/30 text-white placeholder:text-primary-white focus:ring-2 focus:ring-white/50"
                      />
                      <Button 
                        type="submit" 
                        disabled={isSubscribing}
                        className="bg-white text-blue-600 hover:bg-blue-50"
                      >
                        {isSubscribing ? "Subscribing..." : "Subscribe"}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-yellow-200" />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </div>
  )
}