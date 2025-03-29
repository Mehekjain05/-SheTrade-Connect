import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { chatWithBusinessAssistant } from "@/lib/openai";
import { ScrollArea } from "@/components/ui/scroll-area";

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI business assistant. How can I help your business today?"
    }
  ]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    // Add user message to conversation
    const updatedConversation = [
      ...conversation,
      { role: "user", content: message }
    ];
    setConversation(updatedConversation);
    setMessage("");
    setIsLoading(true);

    try {
      // Get AI response
      const response = await chatWithBusinessAssistant(updatedConversation, message);
      
      // Add assistant response to conversation
      setConversation([
        ...updatedConversation,
        { role: "assistant", content: response }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setConversation([
        ...updatedConversation,
        { role: "assistant", content: "I'm sorry, I'm having trouble processing your request right now. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-20 right-6 z-50">
        <Button
          className="w-12 h-12 rounded-full bg-primary shadow-lg flex items-center justify-center text-white"
          onClick={() => setOpen(true)}
        >
          <i className="ri-robot-line text-xl"></i>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <i className="ri-robot-line text-primary"></i>
              SheTrade AI Assistant
            </DialogTitle>
            <DialogDescription>
              Ask any business question and get personalized advice.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-primary text-white"
                        : "bg-neutral-lightest border border-neutral-light"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-neutral-lightest border border-neutral-light">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <DialogFooter className="flex-shrink-0">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                className="flex-1"
                placeholder="Type your question..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
              />
              <Button type="submit" disabled={!message.trim() || isLoading}>
                <i className="ri-send-plane-fill"></i>
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIAssistant;
