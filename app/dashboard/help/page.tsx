"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Book, MessageCircle, Video, Mail } from "lucide-react";

const HELP_TOPICS = [
    { icon: Book, title: "Getting Started", description: "Learn the basics of DealerSite Pro", href: "#" },
    { icon: Video, title: "Video Tutorials", description: "Watch step-by-step guides", href: "#" },
    { icon: MessageCircle, title: "Live Chat", description: "Chat with our support team", href: "#" },
    { icon: Mail, title: "Email Support", description: "support@dealersitepro.com", href: "mailto:support@dealersitepro.com" },
];

const FAQS = [
    { q: "How do I add a new vehicle?", a: "Go to Inventory → Add Vehicle and fill in the details." },
    { q: "How do I change my website style?", a: "Go to Settings → Website Style and select a new template." },
    { q: "How are leads prioritized?", a: "Leads are automatically scored based on engagement and intent." },
    { q: "Is there a mobile app?", a: "A mobile app is coming soon! For now, the dashboard works great on mobile browsers." },
];

export default function HelpPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold">Help Center</h1>
                <p className="text-muted-foreground">Get help and learn how to use DealerSite Pro</p>
            </div>

            {/* Help Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {HELP_TOPICS.map((topic, index) => (
                    <Card key={index} variant="glass" className="hover:bg-muted/30 transition-colors cursor-pointer">
                        <CardContent className="py-6 text-center">
                            <topic.icon className="w-10 h-10 mx-auto mb-3 text-blue-400" />
                            <h3 className="font-semibold mb-1">{topic.title}</h3>
                            <p className="text-sm text-muted-foreground">{topic.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* FAQs */}
            <Card variant="glass">
                <CardContent className="py-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5" />
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {FAQS.map((faq, index) => (
                            <div key={index} className="p-4 rounded-xl bg-muted/30">
                                <h3 className="font-semibold mb-2">{faq.q}</h3>
                                <p className="text-muted-foreground">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Contact */}
            <Card variant="glass" className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-primary/20">
                <CardContent className="py-8 text-center">
                    <h2 className="text-xl font-bold mb-2">Still need help?</h2>
                    <p className="text-muted-foreground mb-4">Our support team is here to help you succeed</p>
                    <div className="flex justify-center gap-4">
                        <Button>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Start Live Chat
                        </Button>
                        <Button variant="outline">
                            <Mail className="w-4 h-4 mr-2" />
                            Email Support
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
