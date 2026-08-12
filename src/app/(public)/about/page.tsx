import { Shield, Users, MapPin, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Peak Drive Denver",
  description: "Learn about Peak Drive Denver and our mission to make car rental accessible to everyone.",
};

export default function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-neutral-800 to-black text-white py-20">
        <div className="container-page text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About Peak Drive Denver
          </h1>
          <p className="text-lg text-neutral-100 max-w-2xl mx-auto">
            We're building the future of car rental — combining the flexibility of
            peer-to-peer sharing with the reliability of a professional fleet.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            Peak Drive Denver was founded with a simple idea: everyone deserves
            access to a great car when they need one. Whether you're traveling for
            business, going on a family road trip, or just need wheels for the
            weekend, we connect you with the right vehicle at the right price.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Our hybrid marketplace brings together individual car owners who want
            to earn extra income and our own curated fleet of quality vehicles.
            This gives renters more choices, competitive prices, and availability
            across the country.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We believe in transparency, safety, and community. Every host is
            verified, every vehicle is reviewed, and every trip is supported by
            our dedicated team.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: "Safety First", desc: "Every vehicle is reviewed and every user is verified." },
              { icon: Users, title: "Community Driven", desc: "Reviews, ratings, and mutual accountability." },
              { icon: MapPin, title: "Accessible Everywhere", desc: "Vehicles available across the United States." },
              { icon: Heart, title: "Customer Obsessed", desc: "24/7 support and a hassle-free experience." },
            ].map((v) => (
              <div key={v.title} className="text-center">
                <v.icon className="w-10 h-10 text-neutral-800 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            By the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { value: "50+", label: "Cities" },
              { value: "1,000+", label: "Vehicles" },
              { value: "10,000+", label: "Trips Completed" },
              { value: "4.8", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-neutral-800">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
