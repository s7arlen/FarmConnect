import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Contact — FarmConnect",
};

export default function ContactPage() {
  return (
    <div className="pt-24">
      <section className="section bg-brand-cream">
        <div className="container-page max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-brand-text mb-4">Get in Touch</h1>
            <p className="text-brand-muted max-w-xl mx-auto">
              Have a question or want to partner with FarmConnect? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl border border-brand-border p-8">
              <h2 className="text-xl font-bold text-brand-text mb-6">Send a Message</h2>
              <form className="space-y-4">
                <Input label="Your name" placeholder="Full name" />
                <Input label="Email" type="email" placeholder="you@example.com" />
                <Textarea label="Message" placeholder="How can we help you?" rows={5} />
                <Button className="w-full">Send Message</Button>
              </form>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-brand-text mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {[
                    { icon: Mail, text: "support@farmconnect.in" },
                    { icon: Phone, text: "+91 80000 00000" },
                    { icon: MapPin, text: "Mangalore, Karnataka, India" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3 text-brand-muted">
                      <div className="w-9 h-9 rounded-lg bg-brand-light flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-brand-green" />
                      </div>
                      <span className="text-sm">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
