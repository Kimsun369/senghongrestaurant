import { dataManager } from "@/lib/data-manager"
import { Coffee } from "lucide-react"

export function Footer() {
  const contactInfo = dataManager.getContactInfo()

  return (
    <footer className="bg-coffee-900 dark:bg-black text-cream-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
              <div className="relative">
                <Coffee className="h-8 w-8 text-coffee-600 dark:text-gold-400 group-hover:animate-coffee-breath transition-colors" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold-400 rounded-full animate-pulse opacity-60"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-serif font-bold text-coffee-900 dark:text-cream-100">
                  Slow drip
                </span>
                <span className="text-xs font-script text-coffee-600 dark:text-gold-400 -mt-1">
                  cafe & eatery
                </span>
              </div>
           
            <p className="text-cream-200 mb-4">
              Experience the perfect blend of exceptional coffee, delicious food, and warm hospitality.
            </p>
            <div className="flex space-x-4">
              {contactInfo?.telegram && (
                <a
                  href={contactInfo.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-400 hover:text-gold-300 transition-colors"
                >
                  Telegram
                </a>
              )}
              {contactInfo?.facebook && (
                <a
                  href={contactInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-400 hover:text-gold-300 transition-colors"
                >
                  Facebook
                </a>
              )}
              {contactInfo?.phone && (
                <a href={`tel:${contactInfo.phone}`} className="text-gold-400 hover:text-gold-300 transition-colors">
                  Call Us
                </a>
              )}
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gold-400">Opening Hours</h3>
            <div className="space-y-2 text-cream-200">
              <div className="flex justify-between">
                <span>Monday - Thursday</span>
                <span>{contactInfo.hours.monday}</span>
              </div>
              <div className="flex justify-between">
                <span>Friday - Saturday</span>
                <span>{contactInfo.hours.friday}</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>{contactInfo.hours.sunday}</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gold-400">Contact Info</h3>
            <div className="space-y-2 text-cream-200">
              <p>{contactInfo.address}</p>
              <p>{contactInfo.phone}</p>
              {contactInfo?.mapUrl && (
                <a
                  href={contactInfo.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-400 hover:text-gold-300 transition-colors inline-block"
                >
                  View on Map
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-coffee-700 mt-8 pt-8 text-center text-cream-300">
          <p>&copy; 2024 Café Delight. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
