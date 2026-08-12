import type { Metadata } from "next";
import Link from "next/link";
import {
  Bike,
  Footprints,
  Mountain,
  Snowflake,
  Droplets,
  Binoculars,
  Users,
  MapPin,
  ArrowRight,
  Star,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Explore Colorado | Mile High Car Rental",
  description:
    "Discover Colorado's most loved destinations — bike trails, hiking paths, ski resorts, hot springs, scenic lookouts, and family fun.",
};

interface Destination {
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
}

interface Category {
  title: string;
  slug: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  destinations: Destination[];
}

const CATEGORIES: Category[] = [
  {
    title: "Bike Trails",
    slug: "bike-trails",
    icon: <Bike className="h-6 w-6" />,
    color: "text-emerald-600",
    gradient: "from-emerald-500 to-teal-600",
    destinations: [
      {
        name: "Vail Pass Bike Path",
        location: "Vail, CO",
        description:
          "A stunning 13-mile paved path winding through alpine meadows with panoramic mountain views. Perfect for all skill levels.",
        image:
          "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80",
        rating: 4.9,
      },
      {
        name: "Waterton Canyon Trail",
        location: "Littleton, CO",
        description:
          "A scenic 6-mile ride along the South Platte River with chances to spot bighorn sheep grazing on the hillsides.",
        image:
          "https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=800&q=80",
        rating: 4.7,
      },
      {
        name: "Mineral Belt Trail",
        location: "Leadville, CO",
        description:
          "A 11.6-mile loop at 10,200 feet elevation encircling the highest city in the US with jaw-dropping 360-degree views.",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
        rating: 4.8,
      },
    ],
  },
  {
    title: "Walking Trails",
    slug: "walking-trails",
    icon: <Footprints className="h-6 w-6" />,
    color: "text-amber-600",
    gradient: "from-amber-500 to-orange-600",
    destinations: [
      {
        name: "Garden of the Gods",
        location: "Colorado Springs, CO",
        description:
          "Walk among towering red rock formations with views of Pikes Peak. Easy paved paths through stunning geological wonders.",
        image:
          "https://images.unsplash.com/photo-1570641963303-92ce4845ed4c?w=800&q=80",
        rating: 4.9,
      },
      {
        name: "Boulder Creek Path",
        location: "Boulder, CO",
        description:
          "A beloved 5.5-mile creekside walk through the heart of Boulder — wildflowers, bridges, and mountain backdrops.",
        image:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
        rating: 4.7,
      },
      {
        name: "Red Rocks Trading Post Trail",
        location: "Morrison, CO",
        description:
          "A 1.4-mile easy loop around the famous Red Rocks Amphitheatre with sweeping views of Denver and the plains.",
        image:
          "https://images.unsplash.com/photo-1527489377706-5bf97e608852?w=800&q=80",
        rating: 4.8,
      },
    ],
  },
  {
    title: "Hiking Trails",
    slug: "hiking-trails",
    icon: <Mountain className="h-6 w-6" />,
    color: "text-sky-600",
    gradient: "from-sky-500 to-blue-600",
    destinations: [
      {
        name: "Hanging Lake",
        location: "Glenwood Springs, CO",
        description:
          "A breathtaking turquoise lake perched on a cliff edge. The 2.4-mile trail gains 1,000 feet through a lush canyon.",
        image:
          "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
        rating: 4.9,
      },
      {
        name: "Maroon Bells",
        location: "Aspen, CO",
        description:
          "Colorado's most photographed peaks with a crystal-clear alpine lake. Multiple trails from easy strolls to full-day adventures.",
        image:
          "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80",
        rating: 5.0,
      },
      {
        name: "Emerald Lake Trail",
        location: "Rocky Mountain NP",
        description:
          "A 3.6-mile trail passing Nymph, Dream, and Emerald Lakes — three alpine gems nestled beneath Hallett Peak.",
        image:
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
        rating: 4.8,
      },
    ],
  },
  {
    title: "Ski Resorts",
    slug: "ski-resorts",
    icon: <Snowflake className="h-6 w-6" />,
    color: "text-indigo-600",
    gradient: "from-indigo-500 to-purple-600",
    destinations: [
      {
        name: "Vail Mountain Resort",
        location: "Vail, CO",
        description:
          "One of the largest ski resorts in North America with 5,317 skiable acres, legendary Back Bowls, and world-class dining.",
        image:
          "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800&q=80",
        rating: 4.9,
      },
      {
        name: "Breckenridge Ski Resort",
        location: "Breckenridge, CO",
        description:
          "A charming mountain town with 2,908 acres of terrain, the highest chairlift in North America, and vibrant apres-ski.",
        image:
          "https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800&q=80",
        rating: 4.8,
      },
      {
        name: "Aspen Snowmass",
        location: "Aspen, CO",
        description:
          "Four mountains of skiing with over 5,500 acres. From champagne powder to celebrity sightings on the slopes.",
        image:
          "https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800&q=80",
        rating: 4.9,
      },
    ],
  },
  {
    title: "Hot Springs",
    slug: "hot-springs",
    icon: <Droplets className="h-6 w-6" />,
    color: "text-rose-600",
    gradient: "from-rose-500 to-pink-600",
    destinations: [
      {
        name: "Glenwood Hot Springs",
        location: "Glenwood Springs, CO",
        description:
          "The world's largest natural hot springs pool at over two blocks long. A Colorado icon since 1888 with 90-104°F waters.",
        image:
          "https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=800&q=80",
        rating: 4.7,
      },
      {
        name: "Strawberry Park Hot Springs",
        location: "Steamboat Springs, CO",
        description:
          "Rustic natural stone pools tucked in a forest setting. Fed by natural mineral springs reaching up to 104°F year-round.",
        image:
          "https://images.unsplash.com/photo-1573126617899-41f1dffb196c?w=800&q=80",
        rating: 4.8,
      },
      {
        name: "Mount Princeton Hot Springs",
        location: "Nathrop, CO",
        description:
          "Soak in creekside pools with views of 14,197-foot Mount Princeton. Mix hot springs with cold creek water to your liking.",
        image:
          "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800&q=80",
        rating: 4.8,
      },
    ],
  },
  {
    title: "Mountain Lookouts",
    slug: "mountain-lookouts",
    icon: <Binoculars className="h-6 w-6" />,
    color: "text-violet-600",
    gradient: "from-violet-500 to-purple-600",
    destinations: [
      {
        name: "Pikes Peak Summit",
        location: "Colorado Springs, CO",
        description:
          "The 14,115-foot peak that inspired 'America the Beautiful.' Drive, take the cog railway, or hike to the top.",
        image:
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        rating: 4.9,
      },
      {
        name: "Trail Ridge Road",
        location: "Rocky Mountain NP",
        description:
          "The highest continuous paved road in the US, cresting at 12,183 feet with views stretching 100+ miles across the Rockies.",
        image:
          "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
        rating: 4.9,
      },
      {
        name: "Mount Evans Scenic Byway",
        location: "Idaho Springs, CO",
        description:
          "The highest paved road in North America reaching 14,130 feet. Spot mountain goats at the summit with views to forever.",
        image:
          "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
        rating: 4.8,
      },
    ],
  },
  {
    title: "Family Activities",
    slug: "family-activities",
    icon: <Users className="h-6 w-6" />,
    color: "text-cyan-600",
    gradient: "from-cyan-500 to-blue-600",
    destinations: [
      {
        name: "Denver Zoo",
        location: "Denver, CO",
        description:
          "Home to 3,000+ animals on 80 acres in City Park. Toyota Elephant Passage and Predator Ridge are can't-miss exhibits.",
        image:
          "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=800&q=80",
        rating: 4.7,
      },
      {
        name: "Royal Gorge Bridge & Park",
        location: "Canon City, CO",
        description:
          "Walk across America's highest suspension bridge at 956 feet above the Arkansas River. Zipline, gondola, and rock climbing too.",
        image:
          "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80",
        rating: 4.8,
      },
      {
        name: "Great Sand Dunes National Park",
        location: "Mosca, CO",
        description:
          "North America's tallest dunes rising 750 feet against the Sangre de Cristo Mountains. Sandboard, hike, or splash in Medano Creek.",
        image:
          "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
        rating: 4.9,
      },
    ],
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
      <span className="text-sm font-semibold text-gray-800">{rating}</span>
    </div>
  );
}

function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${destination.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="flex items-center gap-1.5 text-white/90">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{destination.location}</span>
          </div>
          <div className="rounded-full bg-white/90 px-2 py-0.5 backdrop-blur-sm">
            <StarRating rating={destination.rating} />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-gray-900">{destination.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
          {destination.description}
        </p>
      </div>
    </div>
  );
}

function CategorySection({ category }: { category: Category }) {
  return (
    <section id={category.slug} className="scroll-mt-24">
      <div className="mb-8 flex items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} text-white shadow-lg`}
        >
          {category.icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {category.title}
          </h2>
          <p className="text-sm text-gray-500">
            {category.destinations.length} must-visit spots
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {category.destinations.map((dest) => (
          <DestinationCard key={dest.name} destination={dest} />
        ))}
      </div>
    </section>
  );
}

export default function DestinationsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-900 py-24 sm:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1600&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-gray-900" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
            <Mountain className="h-4 w-4" />
            Explore Colorado
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Colorado&apos;s Most Loved
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
              Destinations
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            From snowy peaks to steaming springs, sandy dunes to red rock
            gardens. Discover 21 unforgettable experiences across the Centennial
            State.
          </p>
        </div>
      </section>

      {/* Quick nav */}
      <div className="sticky top-16 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 ${cat.color}`}
              >
                {cat.icon}
                <span className="hidden sm:inline">{cat.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Categories */}
      <div className="mx-auto max-w-7xl space-y-20 px-4 py-16 sm:px-6 lg:px-8">
        {CATEGORIES.map((cat) => (
          <CategorySection key={cat.slug} category={cat} />
        ))}
      </div>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gray-900 py-20">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-gray-900" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to explore Colorado?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-300">
            Rent a car and hit the open road. All these destinations are just a
            scenic drive away.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-gray-900 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
            >
              Browse Cars
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/10"
            >
              Book Your Trip
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
