"use client";

import { Accordion } from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    id: "requirements",
    title: "What do I need to rent a car?",
    content:
      "You need a valid driver's license, be at least 21 years old (25 for luxury and sports vehicles), and have a major credit or debit card. International renters need a valid license and passport.",
  },
  {
    id: "insurance",
    title: "Is insurance included?",
    content:
      "Basic liability coverage is included with every booking. You can upgrade to Standard, Premium, or Premium Plus protection plans during checkout for additional coverage and lower deductibles.",
  },
  {
    id: "cancellation",
    title: "What is the cancellation policy?",
    content:
      "Free cancellation up to 24 hours before your trip. Cancellations within 24 hours may be subject to a fee. Each host may have specific cancellation terms listed on their vehicle page.",
  },
  {
    id: "host-earnings",
    title: "How much can I earn as a host?",
    content:
      "Earnings vary based on your vehicle, location, and availability. On average, hosts earn $500-$1,200 per month. You set your own daily rate and availability schedule.",
  },
  {
    id: "delivery",
    title: "Can I get the car delivered?",
    content:
      "Many hosts offer delivery to your location for an additional fee. Look for the 'Delivery Available' badge on vehicle listings. Delivery range and fees vary by host.",
  },
  {
    id: "breakdown",
    title: "What happens if the car breaks down?",
    content:
      "All trips include 24/7 roadside assistance. In case of a breakdown, contact our support team and we will arrange a tow, replacement vehicle, or other assistance depending on your coverage plan.",
  },
];

export function HomeFaq() {
  return <Accordion items={FAQ_ITEMS} />;
}
