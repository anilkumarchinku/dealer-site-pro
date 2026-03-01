/**
 * i18n translations — English (en) and Hindi (hi)
 * Used for vernacular UI on dealer sites.
 */

export type Locale = 'en' | 'hi';

export const translations = {
    en: {
        // Nav
        home:        'Home',
        inventory:   'Inventory',
        contact:     'Contact',
        enquireNow:  'Enquire Now',
        callNow:     'Call Now',
        callUs:      'Call Us',

        // Hero
        browseInventory: 'Browse Inventory',
        getInTouch:      'Get in Touch',
        viewAll:         'View All',
        viewCollection:  'View Full Collection',
        viewAllCars:     'View All Cars',

        // Car Card
        enquire:      'Enquire',
        bookTestDrive:'Book Test Drive',
        exShowroom:   'Ex-showroom price',

        // Enquiry Form
        sendMessage:  'Send Us a Message',
        yourName:     'Name *',
        phoneNumber:  'Phone *',
        emailAddress: 'Email (optional)',
        messageLabel: 'Message (optional)',
        submitEnquiry:'Submit Enquiry',
        thankYou:     "Thank You!",
        weWillContact:"We'll be in touch with you shortly.",
        orWhatsApp:   "Prefer WhatsApp? Get instant reply",
        chatNow:      "Chat Now",

        // Test Drive
        bookATestDrive:    'Book a Test Drive',
        preferredDate:     'Preferred Date *',
        preferredTimeSlot: 'Preferred Time Slot *',
        confirmTestDrive:  'Confirm Test Drive',
        driveBooked:       'Drive Booked!',
        teamWillCall:      'Our team will call to confirm within 1 hour',

        // Reviews
        whatBuyersSay:  'What Buyers Say',
        writeAReview:   'Write a Review',
        shareExperience:'Share Your Experience',
        carPurchased:   'Car Purchased (optional)',
        yourReview:     'Your Review (optional)',
        submitReview:   'Submit Review',
        customerReviews:'Customer Reviews',
        noReviewsYet:   'No reviews yet. Be the first to review!',

        // Footer
        quickLinks: 'Quick Links',
        allRightsReserved: 'All rights reserved',

        // Misc
        filter:   'Filter',
        sortBy:   'Sort By',
        price:    'Price',
        fuel:     'Fuel',
        seating:  'Seating',
        mileage:  'Mileage',
        newCars:  'New Cars',
        usedCars: 'Used Cars',
        allCars:  'All Cars',
    },
    hi: {
        // Nav
        home:        'होम',
        inventory:   'गाड़ियाँ',
        contact:     'संपर्क',
        enquireNow:  'पूछताछ करें',
        callNow:     'अभी कॉल करें',
        callUs:      'हमें कॉल करें',

        // Hero
        browseInventory: 'गाड़ियाँ देखें',
        getInTouch:      'संपर्क करें',
        viewAll:         'सभी देखें',
        viewCollection:  'पूरा संग्रह देखें',
        viewAllCars:     'सभी गाड़ियाँ देखें',

        // Car Card
        enquire:      'पूछें',
        bookTestDrive:'टेस्ट ड्राइव बुक करें',
        exShowroom:   'एक्स-शोरूम कीमत',

        // Enquiry Form
        sendMessage:  'हमें संदेश भेजें',
        yourName:     'नाम *',
        phoneNumber:  'फ़ोन *',
        emailAddress: 'ईमेल (वैकल्पिक)',
        messageLabel: 'संदेश (वैकल्पिक)',
        submitEnquiry:'पूछताछ भेजें',
        thankYou:     'धन्यवाद!',
        weWillContact:'हम जल्द ही आपसे संपर्क करेंगे।',
        orWhatsApp:   'व्हाट्सएप पर पूछें? तुरंत जवाब पाएं',
        chatNow:      'चैट करें',

        // Test Drive
        bookATestDrive:    'टेस्ट ड्राइव बुक करें',
        preferredDate:     'पसंदीदा तिथि *',
        preferredTimeSlot: 'पसंदीदा समय *',
        confirmTestDrive:  'टेस्ट ड्राइव कन्फर्म करें',
        driveBooked:       'बुकिंग हो गई!',
        teamWillCall:      'हमारी टीम 1 घंटे में कॉल करेगी',

        // Reviews
        whatBuyersSay:  'ग्राहक क्या कहते हैं',
        writeAReview:   'समीक्षा लिखें',
        shareExperience:'अपना अनुभव साझा करें',
        carPurchased:   'खरीदी गई गाड़ी (वैकल्पिक)',
        yourReview:     'आपकी समीक्षा (वैकल्पिक)',
        submitReview:   'समीक्षा भेजें',
        customerReviews:'ग्राहक समीक्षाएँ',
        noReviewsYet:   'अभी कोई समीक्षा नहीं। पहले समीक्षा लिखें!',

        // Footer
        quickLinks: 'त्वरित लिंक',
        allRightsReserved: 'सर्वाधिकार सुरक्षित',

        // Misc
        filter:   'फ़िल्टर',
        sortBy:   'क्रमबद्ध करें',
        price:    'कीमत',
        fuel:     'ईंधन',
        seating:  'सीटें',
        mileage:  'माइलेज',
        newCars:  'नई गाड़ियाँ',
        usedCars: 'पुरानी गाड़ियाँ',
        allCars:  'सभी गाड़ियाँ',
    },
} as const;

export type TranslationKey = keyof typeof translations['en'];

/** Returns the translation string for a given key and locale */
export function t(key: TranslationKey, locale: Locale = 'en'): string {
    return translations[locale][key] ?? translations['en'][key];
}
