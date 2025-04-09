"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Logo } from "@/components/logo"
import { ArrowLeft, Paperclip, Send, User } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "agent"
  timestamp: Date
  isTyping?: boolean
}

export default function SupportPage() {
  const router = useRouter()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to DreLuxe support. How can I help you today?",
      sender: "agent",
      timestamp: new Date(Date.now() - 60000),
    },
  ])
  const [isAgentTyping, setIsAgentTyping] = useState(false)

  // Spotify-inspired color palette
  const colors = {
    background: "bg-[#121212]",
    card: "bg-[#181818]",
    cardHover: "hover:bg-[#282828]",
    textPrimary: "text-[#ffffff]",
    textSecondary: "text-[#b3b3b3]",
    accent: "bg-[#1DB954]",
    accentHover: "hover:bg-[#1ed760]",
    icon: "text-[#1DB954]",
    divider: "border-[#282828]",
    button: "bg-[#1DB954] text-white hover:bg-[#1ed760]",
    buttonOutline: "border-[#535353] text-white hover:bg-[#282828] hover:border-[#1DB954]",
    userMessage: "bg-[#1DB954] text-white",
    agentMessage: "bg-[#282828] text-[#ffffff]",
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle send message
  const handleSendMessage = () => {
    if (!message.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setMessage("")

    // Simulate agent typing
    setIsAgentTyping(true)

    // Simulate agent response after delay
    setTimeout(() => {
      setIsAgentTyping(false)

      const responses = [
        "I understand your concern. Let me check that for you.",
        "Thank you for providing that information. I'll look into it right away.",
        "I'm sorry to hear that. Let me see how I can help resolve this issue.",
        "That's a good question. Here's what you need to know...",
        "I've checked your order details. Your delivery is scheduled for tomorrow between 2-4 PM.",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, agentMessage])
    }, 2000)
  }

  // Handle file upload
  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      toast({
        title: "File Uploaded",
        description: `${e.target.files[0].name} has been attached`,
      })
    }
  }

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={`flex min-h-screen flex-col ${colors.background}`}>
      <Toaster />

      {/* Header */}
      <header className={`sticky top-0 z-10 ${colors.card} p-4 shadow-sm border-b ${colors.divider}`}>
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full ${colors.buttonOutline}`}
              onClick={() => router.push("/customer/dashboard")}
            >
              <ArrowLeft size={20} className={colors.textPrimary} />
            </Button>
            <div>
              <h1 className={`text-lg font-semibold ${colors.textPrimary}`}>Customer Support</h1>
              <p className={`text-xs ${colors.textSecondary}`}>Typically replies within 5 minutes</p>
            </div>
          </div>

          <Logo width={100} height={50} variant="dark" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-md">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-[calc(100vh-180px)] flex-col"
          >
            {/* Chat Messages */}
            <Card className={`mb-4 flex-1 overflow-hidden border ${colors.divider}`}>
              <CardContent className={`flex h-full flex-col overflow-y-auto p-4 ${colors.card}`}>
                <div className="flex-1 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.sender === "agent" && (
                        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#1DB954]/20">
                          <User size={16} className="text-[#1DB954]" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.sender === "user" ? colors.userMessage : colors.agentMessage
                        }`}
                      >
                        <p>{msg.text}</p>
                        <p
                          className={`mt-1 text-right text-xs ${
                            msg.sender === "user" ? "text-white/70" : colors.textSecondary
                          }`}
                        >
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Agent typing indicator */}
                  {isAgentTyping && (
                    <div className="flex justify-start">
                      <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#1DB954]/20">
                        <User size={16} className="text-[#1DB954]" />
                      </div>
                      <div className={`max-w-[80%] rounded-lg ${colors.agentMessage} p-3`}>
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-[#b3b3b3]"></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-[#b3b3b3]"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-[#b3b3b3]"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
            </Card>

            {/* Message Input */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleFileUpload} className={colors.buttonOutline}>
                <Paperclip size={20} className={colors.textPrimary} />
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
              />
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className={`flex-1 ${colors.card} border-[#282828] ${colors.textPrimary}`}
              />
              <Button className={colors.button} size="icon" onClick={handleSendMessage} disabled={!message.trim()}>
                <Send size={20} />
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
