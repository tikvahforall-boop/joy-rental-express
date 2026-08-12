import "dotenv/config";
import { PrismaClient, type User } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function id(prefix: string, num: number): string {
  return `${prefix}_${String(num).padStart(3, "0")}`;
}

async function main() {
  console.log("Cleaning database...");

  await prisma.bookingAddOn.deleteMany();
  await prisma.bookingPriceBreakdown.deleteMany();
  await prisma.bookingStatusHistory.deleteMany();
  await prisma.review.deleteMany();
  await prisma.checkInOutReport.deleteMany();
  await prisma.vehicleDamageReport.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.insuranceClaim.deleteMany();
  await prisma.insurancePolicy.deleteMany();
  await prisma.insuranceQuote.deleteMany();
  await prisma.depositAuthorization.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.taxRule.deleteMany();
  await prisma.message.deleteMany();
  await prisma.messageThread.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.maintenanceRecord.deleteMany();
  await prisma.addOn.deleteMany();
  await prisma.vehiclePricingRule.deleteMany();
  await prisma.vehicleAvailability.deleteMany();
  await prisma.deliveryZone.deleteMany();
  await prisma.vehicleDocument.deleteMany();
  await prisma.vehicleFeature.deleteMany();
  await prisma.vehicleImage.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.driverLicenseVerification.deleteMany();
  await prisma.identityVerification.deleteMany();
  await prisma.hostProfile.deleteMany();
  await prisma.renterProfile.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.webhookEvent.deleteMany();
  await prisma.appConfiguration.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  console.log("Database cleaned.");

  const passwordHash = await hash("Password123!", 12);

  console.log("Creating users...");

  const admin = await prisma.user.create({
    data: {
      id: id("user", 1),
      email: "admin@joyrentalexpress.com",
      name: "Admin User",
      firstName: "Admin",
      lastName: "User",
      passwordHash,
      role: "ADMIN",
      isActive: true,
      emailVerified: new Date("2024-01-01"),
    },
  });

  const hostData = [
    {
      id: id("user", 2),
      email: "marcus.johnson@email.com",
      name: "Marcus Johnson",
      firstName: "Marcus",
      lastName: "Johnson",
      phone: "+13105551234",
      bio: "Car enthusiast with a fleet of well-maintained vehicles in the Los Angeles area. All my cars are professionally detailed before every trip.",
      businessType: "individual",
      responseRate: 98,
      responseTime: 15,
    },
    {
      id: id("user", 3),
      email: "sarah.chen@email.com",
      name: "Sarah Chen",
      firstName: "Sarah",
      lastName: "Chen",
      phone: "+12125559876",
      bio: "New York City-based host offering convenient pickup locations in Manhattan and Brooklyn. Quick responses and flexible scheduling.",
      businessType: "individual",
      responseRate: 95,
      responseTime: 30,
    },
    {
      id: id("user", 4),
      email: "contact@sunshinerentals.com",
      name: "Sunshine Auto Rentals",
      firstName: "David",
      lastName: "Martinez",
      phone: "+13055557890",
      bio: "Family-owned rental business serving Miami and South Florida since 2019. We offer airport pickup and delivery throughout Miami-Dade County.",
      businessType: "business",
      businessName: "Sunshine Auto Rentals LLC",
      responseRate: 99,
      responseTime: 10,
    },
    {
      id: id("user", 5),
      email: "james.wilson@email.com",
      name: "James Wilson",
      firstName: "James",
      lastName: "Wilson",
      phone: "+13125554567",
      bio: "Chicago host with a diverse collection of vehicles from economy to luxury. Superhost with over 200 five-star trips.",
      businessType: "individual",
      responseRate: 97,
      responseTime: 20,
    },
    {
      id: id("user", 6),
      email: "info@lonestarfleet.com",
      name: "Lone Star Fleet",
      firstName: "Rachel",
      lastName: "Thompson",
      phone: "+15125553210",
      bio: "Austin's premier peer-to-peer car rental company. We specialize in trucks, SUVs, and electric vehicles perfect for exploring Texas.",
      businessType: "business",
      businessName: "Lone Star Fleet Inc.",
      responseRate: 96,
      responseTime: 25,
    },
  ];

  const hosts: User[] = [];
  for (const h of hostData) {
    const user = await prisma.user.create({
      data: {
        id: h.id,
        email: h.email,
        name: h.name,
        firstName: h.firstName,
        lastName: h.lastName,
        phone: h.phone,
        passwordHash,
        role: "HOST",
        isActive: true,
        emailVerified: new Date("2024-01-15"),
        hostProfile: {
          create: {
            id: id("host", hosts.length + 1),
            bio: h.bio,
            businessType: h.businessType,
            businessName: (h as { businessName?: string }).businessName,
            responseRate: h.responseRate,
            responseTime: h.responseTime,
            superHost: h.responseRate >= 97,
            stripeOnboarded: true,
          },
        },
      },
    });
    hosts.push(user);
  }

  console.log(`Created ${hosts.length} hosts.`);

  const renterNames = [
    { first: "Emily", last: "Rodriguez" },
    { first: "Michael", last: "Brown" },
    { first: "Jessica", last: "Taylor" },
    { first: "Daniel", last: "Kim" },
    { first: "Ashley", last: "Davis" },
    { first: "Christopher", last: "Garcia" },
    { first: "Amanda", last: "Martinez" },
    { first: "Ryan", last: "Lee" },
    { first: "Stephanie", last: "Anderson" },
    { first: "Kevin", last: "Thomas" },
    { first: "Nicole", last: "Jackson" },
    { first: "Brandon", last: "White" },
    { first: "Lauren", last: "Harris" },
    { first: "Justin", last: "Clark" },
    { first: "Megan", last: "Lewis" },
    { first: "Tyler", last: "Robinson" },
    { first: "Samantha", last: "Walker" },
    { first: "Andrew", last: "Hall" },
    { first: "Rachel", last: "Young" },
    { first: "Joshua", last: "Allen" },
  ];

  const renters = [];
  for (let i = 0; i < renterNames.length; i++) {
    const r = renterNames[i];
    const user = await prisma.user.create({
      data: {
        id: id("user", 7 + i),
        email: `${r.first.toLowerCase()}.${r.last.toLowerCase()}@email.com`,
        name: `${r.first} ${r.last}`,
        firstName: r.first,
        lastName: r.last,
        passwordHash,
        role: "RENTER",
        isActive: true,
        emailVerified: new Date("2024-02-01"),
        renterProfile: {
          create: {
            id: id("renter", i + 1),
            tripsCompleted: Math.floor(Math.random() * 10),
          },
        },
      },
    });
    renters.push(user);
  }

  console.log(`Created ${renters.length} renters.`);

  console.log("Creating vehicles...");

  const vehicleData = [
    {
      hostIndex: 0,
      make: "Toyota",
      model: "Camry",
      year: 2023,
      category: "economy",
      color: "Silver",
      dailyPrice: 45,
      seats: 5,
      doors: 4,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      drivetrain: "FWD" as const,
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      description: "Reliable and fuel-efficient sedan, perfect for city driving and road trips. Recently serviced with new tires.",
      dailyMileageLimit: 200,
      extraMileCharge: 0.25,
      bookingMode: "INSTANT" as const,
      status: "ACTIVE" as const,
      features: ["Bluetooth", "Backup Camera", "USB Charger", "Cruise Control"],
      weeklyDiscount: 10,
      cleaningFee: 25,
      deliveryEnabled: false,
      isCompanyOwned: false,
    },
    {
      hostIndex: 0,
      make: "Honda",
      model: "CR-V",
      year: 2024,
      category: "suv",
      color: "White",
      dailyPrice: 65,
      seats: 5,
      doors: 4,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      drivetrain: "AWD" as const,
      city: "Los Angeles",
      state: "CA",
      zipCode: "90015",
      description: "Spacious compact SUV with all-wheel drive. Great for families and weekend adventures.",
      dailyMileageLimit: 200,
      extraMileCharge: 0.30,
      bookingMode: "REQUEST" as const,
      status: "ACTIVE" as const,
      features: ["Apple CarPlay", "Android Auto", "Backup Camera", "Keyless Entry", "Roof Rack"],
      weeklyDiscount: 15,
      monthlyDiscount: 25,
      cleaningFee: 35,
      deliveryEnabled: true,
      deliveryRadius: 15,
      deliveryFee: 30,
      isCompanyOwned: false,
    },
    {
      hostIndex: 1,
      make: "Tesla",
      model: "Model 3",
      year: 2024,
      category: "electric",
      color: "Midnight Blue",
      dailyPrice: 89,
      seats: 5,
      doors: 4,
      fuelType: "ELECTRIC" as const,
      transmission: "AUTOMATIC" as const,
      drivetrain: "RWD" as const,
      city: "New York",
      state: "NY",
      zipCode: "10001",
      description: "Experience electric driving in Manhattan. Full charge before every trip. Home charger included with delivery.",
      dailyMileageLimit: 250,
      extraMileCharge: 0.20,
      bookingMode: "INSTANT" as const,
      status: "ACTIVE" as const,
      features: ["GPS", "Apple CarPlay", "Backup Camera", "Heated Seats", "Keyless Entry", "USB Charger"],
      weeklyDiscount: 12,
      monthlyDiscount: 22,
      cleaningFee: 30,
      electricRange: 272,
      deliveryEnabled: true,
      deliveryRadius: 10,
      deliveryFee: 40,
      isCompanyOwned: false,
    },
    {
      hostIndex: 1,
      make: "BMW",
      model: "3 Series",
      year: 2023,
      category: "luxury",
      color: "Black",
      dailyPrice: 120,
      seats: 5,
      doors: 4,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      drivetrain: "RWD" as const,
      city: "New York",
      state: "NY",
      zipCode: "10012",
      description: "Elegant luxury sedan with premium interior. Perfect for business travel or a special occasion in the city.",
      dailyMileageLimit: 150,
      extraMileCharge: 0.45,
      bookingMode: "REQUEST" as const,
      status: "ACTIVE" as const,
      features: ["GPS", "Apple CarPlay", "Android Auto", "Heated Seats", "Sunroof", "Keyless Entry"],
      weeklyDiscount: 10,
      cleaningFee: 50,
      deliveryEnabled: false,
      isCompanyOwned: false,
    },
    {
      hostIndex: 2,
      make: "Ford",
      model: "Mustang",
      year: 2023,
      category: "sports",
      color: "Race Red",
      dailyPrice: 150,
      seats: 4,
      doors: 2,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      drivetrain: "RWD" as const,
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      description: "Turn heads in Miami with this iconic American muscle car. EcoBoost engine with plenty of power for the open road.",
      dailyMileageLimit: 150,
      extraMileCharge: 0.50,
      bookingMode: "REQUEST" as const,
      status: "ACTIVE" as const,
      features: ["Bluetooth", "Backup Camera", "USB Charger", "Cruise Control", "Apple CarPlay"],
      cleaningFee: 40,
      deliveryEnabled: true,
      deliveryRadius: 20,
      deliveryFee: 35,
      isCompanyOwned: false,
    },
    {
      hostIndex: 2,
      make: "Toyota",
      model: "Sienna",
      year: 2024,
      category: "van",
      color: "Celestial Silver",
      dailyPrice: 85,
      seats: 8,
      doors: 4,
      fuelType: "HYBRID" as const,
      transmission: "AUTOMATIC" as const,
      drivetrain: "AWD" as const,
      city: "Miami",
      state: "FL",
      zipCode: "33139",
      description: "Hybrid minivan with seating for 8. Ideal for family vacations with tons of cargo space and great fuel economy.",
      dailyMileageLimit: 250,
      extraMileCharge: 0.25,
      bookingMode: "INSTANT" as const,
      status: "ACTIVE" as const,
      features: ["Apple CarPlay", "Android Auto", "Backup Camera", "Bluetooth", "USB Charger", "Child Seat"],
      weeklyDiscount: 15,
      monthlyDiscount: 30,
      cleaningFee: 45,
      deliveryEnabled: true,
      deliveryRadius: 25,
      deliveryFee: 25,
      isCompanyOwned: true,
    },
    {
      hostIndex: 3,
      make: "Chevrolet",
      model: "Equinox",
      year: 2023,
      category: "suv",
      color: "Summit White",
      dailyPrice: 55,
      seats: 5,
      doors: 4,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      drivetrain: "FWD" as const,
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      description: "Affordable and comfortable SUV for exploring the Windy City and beyond. Clean, reliable, and well-maintained.",
      dailyMileageLimit: 200,
      extraMileCharge: 0.25,
      bookingMode: "INSTANT" as const,
      status: "ACTIVE" as const,
      features: ["Bluetooth", "Backup Camera", "Android Auto", "Cruise Control"],
      weeklyDiscount: 12,
      cleaningFee: 25,
      deliveryEnabled: false,
      isCompanyOwned: false,
    },
    {
      hostIndex: 3,
      make: "Mercedes-Benz",
      model: "E-Class",
      year: 2024,
      category: "luxury",
      color: "Obsidian Black",
      dailyPrice: 175,
      seats: 5,
      doors: 4,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      drivetrain: "AWD" as const,
      city: "Chicago",
      state: "IL",
      zipCode: "60611",
      description: "Premium luxury sedan with heated and ventilated seats, panoramic roof, and advanced driver assist. White-glove service included.",
      dailyMileageLimit: 150,
      extraMileCharge: 0.55,
      bookingMode: "REQUEST" as const,
      status: "ACTIVE" as const,
      features: ["GPS", "Apple CarPlay", "Heated Seats", "Sunroof", "Keyless Entry", "Bluetooth"],
      weeklyDiscount: 10,
      cleaningFee: 60,
      deliveryEnabled: true,
      deliveryRadius: 15,
      deliveryFee: 50,
      isCompanyOwned: false,
    },
    {
      hostIndex: 4,
      make: "Ford",
      model: "F-150",
      year: 2023,
      category: "truck",
      color: "Oxford White",
      dailyPrice: 95,
      seats: 5,
      doors: 4,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      drivetrain: "FOUR_WD" as const,
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      description: "Full-size pickup with a 5.5-foot bed. Ready for hauling, towing, or exploring Texas back roads. 4WD for any terrain.",
      dailyMileageLimit: 200,
      extraMileCharge: 0.35,
      bookingMode: "INSTANT" as const,
      status: "ACTIVE" as const,
      features: ["Bluetooth", "Backup Camera", "USB Charger", "Cruise Control", "Toll Pass"],
      weeklyDiscount: 15,
      monthlyDiscount: 25,
      cleaningFee: 40,
      deliveryEnabled: false,
      isCompanyOwned: false,
    },
    {
      hostIndex: 4,
      make: "Tesla",
      model: "Model Y",
      year: 2024,
      category: "electric",
      color: "Pearl White",
      dailyPrice: 99,
      seats: 5,
      doors: 4,
      fuelType: "ELECTRIC" as const,
      transmission: "AUTOMATIC" as const,
      drivetrain: "AWD" as const,
      city: "Austin",
      state: "TX",
      zipCode: "78704",
      description: "All-electric crossover SUV with autopilot. Delivered with a full charge. Supercharger network access included.",
      dailyMileageLimit: 250,
      extraMileCharge: 0.20,
      bookingMode: "INSTANT" as const,
      status: "ACTIVE" as const,
      features: ["GPS", "Apple CarPlay", "Heated Seats", "Keyless Entry", "USB Charger", "Backup Camera"],
      weeklyDiscount: 12,
      monthlyDiscount: 20,
      cleaningFee: 30,
      electricRange: 310,
      deliveryEnabled: true,
      deliveryRadius: 20,
      deliveryFee: 35,
      isCompanyOwned: true,
    },
    {
      hostIndex: 0,
      make: "Hyundai",
      model: "Elantra",
      year: 2024,
      category: "economy",
      color: "Phantom Black",
      dailyPrice: 38,
      seats: 5,
      doors: 4,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      drivetrain: "FWD" as const,
      city: "Denver",
      state: "CO",
      zipCode: "80202",
      description: "Budget-friendly compact sedan with excellent fuel economy. Clean interior, smooth ride, and easy to park.",
      dailyMileageLimit: 200,
      extraMileCharge: 0.20,
      bookingMode: "INSTANT" as const,
      status: "ACTIVE" as const,
      features: ["Bluetooth", "Backup Camera", "Android Auto", "USB Charger"],
      weeklyDiscount: 15,
      monthlyDiscount: 30,
      cleaningFee: 20,
      deliveryEnabled: false,
      isCompanyOwned: true,
    },
    {
      hostIndex: 3,
      make: "Jeep",
      model: "Grand Cherokee",
      year: 2023,
      category: "suv",
      color: "Granite Crystal",
      dailyPrice: 110,
      seats: 5,
      doors: 4,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      drivetrain: "FOUR_WD" as const,
      city: "Seattle",
      state: "WA",
      zipCode: "98101",
      description: "Capable and luxurious SUV ready for Pacific Northwest adventures. 4x4 with all-terrain tires and tow package.",
      dailyMileageLimit: 200,
      extraMileCharge: 0.35,
      bookingMode: "REQUEST" as const,
      status: "ACTIVE" as const,
      features: ["GPS", "Apple CarPlay", "Heated Seats", "Sunroof", "Roof Rack", "Ski Rack"],
      weeklyDiscount: 10,
      cleaningFee: 40,
      deliveryEnabled: false,
      isCompanyOwned: false,
    },
    {
      hostIndex: 2,
      make: "Honda",
      model: "Odyssey",
      year: 2023,
      category: "family",
      color: "Lunar Silver",
      dailyPrice: 75,
      seats: 8,
      doors: 4,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      drivetrain: "FWD" as const,
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      description: "Family-friendly minivan with entertainment system and spacious cargo area. Second and third row fold flat.",
      dailyMileageLimit: 250,
      extraMileCharge: 0.25,
      bookingMode: "INSTANT" as const,
      status: "PENDING_APPROVAL" as const,
      features: ["Apple CarPlay", "Android Auto", "Backup Camera", "Bluetooth", "Child Seat"],
      weeklyDiscount: 15,
      monthlyDiscount: 25,
      cleaningFee: 40,
      deliveryEnabled: false,
      isCompanyOwned: false,
    },
    {
      hostIndex: 4,
      make: "Chevrolet",
      model: "Corvette",
      year: 2024,
      category: "sports",
      color: "Torch Red",
      dailyPrice: 250,
      seats: 2,
      doors: 2,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      drivetrain: "RWD" as const,
      city: "Atlanta",
      state: "GA",
      zipCode: "30301",
      description: "Mid-engine American supercar. 495 horsepower V8 with magnetic ride control. A truly unforgettable driving experience.",
      dailyMileageLimit: 100,
      extraMileCharge: 0.75,
      bookingMode: "REQUEST" as const,
      status: "PENDING_APPROVAL" as const,
      features: ["GPS", "Apple CarPlay", "Heated Seats", "Keyless Entry", "Backup Camera"],
      cleaningFee: 75,
      deliveryEnabled: false,
      isCompanyOwned: false,
    },
    {
      hostIndex: 1,
      make: "Subaru",
      model: "Outback",
      year: 2023,
      category: "suv",
      color: "Autumn Green",
      dailyPrice: 70,
      seats: 5,
      doors: 4,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      drivetrain: "AWD" as const,
      city: "Boston",
      state: "MA",
      zipCode: "02101",
      description: "Rugged all-wheel-drive wagon perfect for New England weather. Roof rails, heated seats, and X-Mode for snow and mud.",
      dailyMileageLimit: 200,
      extraMileCharge: 0.30,
      bookingMode: "INSTANT" as const,
      status: "MAINTENANCE" as const,
      features: ["Apple CarPlay", "Android Auto", "Heated Seats", "Roof Rack", "Bluetooth", "Backup Camera"],
      weeklyDiscount: 12,
      monthlyDiscount: 22,
      cleaningFee: 30,
      deliveryEnabled: false,
      isCompanyOwned: false,
    },
    {
      hostIndex: 0,
      make: "Kia",
      model: "Carnival",
      year: 2024,
      category: "van",
      color: "Astra Blue",
      dailyPrice: 80,
      seats: 8,
      doors: 4,
      fuelType: "GASOLINE" as const,
      transmission: "AUTOMATIC" as const,
      drivetrain: "FWD" as const,
      city: "Los Angeles",
      state: "CA",
      zipCode: "90045",
      description: "Modern minivan with SUV styling. Dual sunroofs, captain's chairs in the second row, and a massive cargo area.",
      dailyMileageLimit: 250,
      extraMileCharge: 0.25,
      bookingMode: "INSTANT" as const,
      status: "ACTIVE" as const,
      features: ["Apple CarPlay", "Android Auto", "Backup Camera", "Bluetooth", "USB Charger", "Sunroof"],
      weeklyDiscount: 15,
      monthlyDiscount: 30,
      cleaningFee: 40,
      deliveryEnabled: true,
      deliveryRadius: 15,
      deliveryFee: 30,
      isCompanyOwned: false,
    },
  ];

  const vehicleImages: string[][] = [
    // 0: Toyota Camry (Silver, economy)
    [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80&auto=format&fit=crop",
    ],
    // 1: Honda CR-V (White, SUV)
    [
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80&auto=format&fit=crop",
    ],
    // 2: Tesla Model 3 (Blue, electric)
    [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=800&q=80&auto=format&fit=crop",
    ],
    // 3: BMW 3 Series (Black, luxury)
    [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&q=80&auto=format&fit=crop",
    ],
    // 4: Ford Mustang (Red, sports)
    [
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547744152-14d985cb937f?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80&auto=format&fit=crop",
    ],
    // 5: Toyota Sienna (Silver, van)
    [
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1449965408869-ebd13bc0c614?w=800&q=80&auto=format&fit=crop",
    ],
    // 6: Chevrolet Equinox (White, SUV)
    [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568844293986-8d0400f4e027?w=800&q=80&auto=format&fit=crop",
    ],
    // 7: Mercedes-Benz E-Class (Black, luxury)
    [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80&auto=format&fit=crop",
    ],
    // 8: Ford F-150 (White, truck)
    [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80&auto=format&fit=crop",
    ],
    // 9: Tesla Model Y (White, electric)
    [
      "https://images.unsplash.com/photo-1619317190227-6703cd3ce009?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80&auto=format&fit=crop",
    ],
    // 10: Hyundai Elantra (Black, economy)
    [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80&auto=format&fit=crop",
    ],
    // 11: Jeep Grand Cherokee (Gray, SUV)
    [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1568844293986-8d0400f4e027?w=800&q=80&auto=format&fit=crop",
    ],
    // 12: Honda Odyssey (Silver, family)
    [
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1449965408869-ebd13bc0c614?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80&auto=format&fit=crop",
    ],
    // 13: Chevrolet Corvette (Red, sports)
    [
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547744152-14d985cb937f?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80&auto=format&fit=crop",
    ],
    // 14: Subaru Outback (Green, SUV)
    [
      "https://images.unsplash.com/photo-1568844293986-8d0400f4e027?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80&auto=format&fit=crop",
    ],
    // 15: Kia Carnival (Blue, van)
    [
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1449965408869-ebd13bc0c614?w=800&q=80&auto=format&fit=crop",
    ],
  ];

  const vehicles = [];
  for (let i = 0; i < vehicleData.length; i++) {
    const v = vehicleData[i];
    const hostUser = hosts[v.hostIndex];
    const slug = `${v.make}-${v.model}-${v.year}-${v.city}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+$/, "");

    const vehicle = await prisma.vehicle.create({
      data: {
        id: id("vehicle", i + 1),
        hostId: hostUser.id,
        slug,
        status: v.status,
        make: v.make,
        model: v.model,
        year: v.year,
        color: v.color,
        category: v.category,
        description: v.description,
        seats: v.seats,
        doors: v.doors,
        fuelType: v.fuelType,
        transmission: v.transmission,
        drivetrain: v.drivetrain,
        city: v.city,
        state: v.state,
        zipCode: v.zipCode,
        dailyPrice: v.dailyPrice,
        weeklyDiscount: v.weeklyDiscount ?? null,
        monthlyDiscount: v.monthlyDiscount ?? null,
        cleaningFee: v.cleaningFee ?? null,
        deliveryFee: v.deliveryFee ?? null,
        dailyMileageLimit: v.dailyMileageLimit ?? null,
        extraMileCharge: v.extraMileCharge ?? null,
        bookingMode: v.bookingMode,
        deliveryEnabled: v.deliveryEnabled ?? false,
        deliveryRadius: v.deliveryRadius ?? null,
        electricRange: v.electricRange ?? null,
        isCompanyOwned: v.isCompanyOwned ?? false,
        instantBookEligible: v.bookingMode === "INSTANT",
        fuelPolicy: "full-to-full",
        approvedAt: v.status === "ACTIVE" ? new Date("2024-03-01") : null,
        approvedBy: v.status === "ACTIVE" ? admin.id : null,
        images: {
          create: [
            { id: id(`vimg${i + 1}`, 1), url: vehicleImages[i][0], caption: "Front view", position: 0, isPrimary: true },
            { id: id(`vimg${i + 1}`, 2), url: vehicleImages[i][1], caption: "Interior", position: 1 },
            { id: id(`vimg${i + 1}`, 3), url: vehicleImages[i][2], caption: "Side view", position: 2 },
          ],
        },
        features: {
          create: v.features.map((name, fi) => ({
            id: id(`vfeat${i + 1}`, fi + 1),
            name,
          })),
        },
      },
    });
    vehicles.push(vehicle);
  }

  console.log(`Created ${vehicles.length} vehicles.`);

  console.log("Creating bookings...");

  const bookingEntries = [
    {
      id: id("booking", 1),
      bookingRef: "JRE-20240501-001",
      vehicleIndex: 0,
      renterIndex: 0,
      hostIndex: 0,
      status: "COMPLETED" as const,
      pickupDate: new Date("2024-05-01"),
      returnDate: new Date("2024-05-04"),
      actualPickupDate: new Date("2024-05-01T10:00:00"),
      actualReturnDate: new Date("2024-05-04T09:30:00"),
      dailyRate: 45,
      numDays: 3,
    },
    {
      id: id("booking", 2),
      bookingRef: "JRE-20240515-002",
      vehicleIndex: 2,
      renterIndex: 1,
      hostIndex: 1,
      status: "COMPLETED" as const,
      pickupDate: new Date("2024-05-15"),
      returnDate: new Date("2024-05-18"),
      actualPickupDate: new Date("2024-05-15T14:00:00"),
      actualReturnDate: new Date("2024-05-18T12:00:00"),
      dailyRate: 89,
      numDays: 3,
    },
    {
      id: id("booking", 3),
      bookingRef: "JRE-20240601-003",
      vehicleIndex: 4,
      renterIndex: 2,
      hostIndex: 2,
      status: "COMPLETED" as const,
      pickupDate: new Date("2024-06-01"),
      returnDate: new Date("2024-06-03"),
      actualPickupDate: new Date("2024-06-01T09:00:00"),
      actualReturnDate: new Date("2024-06-03T11:00:00"),
      dailyRate: 150,
      numDays: 2,
    },
    {
      id: id("booking", 4),
      bookingRef: "JRE-20240620-004",
      vehicleIndex: 6,
      renterIndex: 3,
      hostIndex: 3,
      status: "COMPLETED" as const,
      pickupDate: new Date("2024-06-20"),
      returnDate: new Date("2024-06-27"),
      actualPickupDate: new Date("2024-06-20T11:00:00"),
      actualReturnDate: new Date("2024-06-27T10:00:00"),
      dailyRate: 55,
      numDays: 7,
    },
    {
      id: id("booking", 5),
      bookingRef: "JRE-20240710-005",
      vehicleIndex: 8,
      renterIndex: 4,
      hostIndex: 4,
      status: "COMPLETED" as const,
      pickupDate: new Date("2024-07-10"),
      returnDate: new Date("2024-07-14"),
      actualPickupDate: new Date("2024-07-10T08:00:00"),
      actualReturnDate: new Date("2024-07-14T09:00:00"),
      dailyRate: 95,
      numDays: 4,
    },
    {
      id: id("booking", 6),
      bookingRef: "JRE-20260901-006",
      vehicleIndex: 1,
      renterIndex: 5,
      hostIndex: 0,
      status: "CONFIRMED" as const,
      pickupDate: new Date("2026-09-01"),
      returnDate: new Date("2026-09-05"),
      dailyRate: 65,
      numDays: 4,
    },
    {
      id: id("booking", 7),
      bookingRef: "JRE-20260915-007",
      vehicleIndex: 3,
      renterIndex: 6,
      hostIndex: 1,
      status: "CONFIRMED" as const,
      pickupDate: new Date("2026-09-15"),
      returnDate: new Date("2026-09-18"),
      dailyRate: 120,
      numDays: 3,
    },
    {
      id: id("booking", 8),
      bookingRef: "JRE-20261001-008",
      vehicleIndex: 7,
      renterIndex: 7,
      hostIndex: 3,
      status: "CONFIRMED" as const,
      pickupDate: new Date("2026-10-01"),
      returnDate: new Date("2026-10-03"),
      dailyRate: 175,
      numDays: 2,
    },
    {
      id: id("booking", 9),
      bookingRef: "JRE-20260820-009",
      vehicleIndex: 9,
      renterIndex: 8,
      hostIndex: 4,
      status: "PENDING_APPROVAL" as const,
      pickupDate: new Date("2026-08-20"),
      returnDate: new Date("2026-08-25"),
      dailyRate: 99,
      numDays: 5,
    },
    {
      id: id("booking", 10),
      bookingRef: "JRE-20260825-010",
      vehicleIndex: 5,
      renterIndex: 9,
      hostIndex: 2,
      status: "PENDING_APPROVAL" as const,
      pickupDate: new Date("2026-08-25"),
      returnDate: new Date("2026-08-28"),
      dailyRate: 85,
      numDays: 3,
    },
    {
      id: id("booking", 11),
      bookingRef: "JRE-20240801-011",
      vehicleIndex: 0,
      renterIndex: 10,
      hostIndex: 0,
      status: "CANCELLED_BY_RENTER" as const,
      pickupDate: new Date("2024-08-01"),
      returnDate: new Date("2024-08-03"),
      dailyRate: 45,
      numDays: 2,
      cancelledAt: new Date("2024-07-30"),
      cancellationReason: "Change of travel plans",
    },
    {
      id: id("booking", 12),
      bookingRef: "JRE-20260808-012",
      vehicleIndex: 10,
      renterIndex: 11,
      hostIndex: 0,
      status: "IN_PROGRESS" as const,
      pickupDate: new Date("2026-08-07"),
      returnDate: new Date("2026-08-12"),
      actualPickupDate: new Date("2026-08-07T10:00:00"),
      dailyRate: 38,
      numDays: 5,
    },
  ];

  const platformFeeRate = 10;
  const hostFeeRate = 12;
  const taxRate = 8.5;

  const bookings = [];
  for (const b of bookingEntries) {
    const subtotal = b.dailyRate * b.numDays;
    const cleaningFee = vehicleData[b.vehicleIndex].cleaningFee ?? 0;
    const deliveryFee = 0;
    const serviceFee = Math.round(subtotal * (platformFeeRate / 100) * 100) / 100;
    const taxAmount = Math.round(subtotal * (taxRate / 100) * 100) / 100;
    const totalPrice = Math.round((subtotal + cleaningFee + deliveryFee + serviceFee + taxAmount) * 100) / 100;
    const hostEarnings = Math.round(subtotal * (1 - hostFeeRate / 100) * 100) / 100;
    const platformFee = Math.round(subtotal * (hostFeeRate / 100) * 100) / 100;

    const booking = await prisma.booking.create({
      data: {
        id: b.id,
        bookingRef: b.bookingRef,
        vehicleId: vehicles[b.vehicleIndex].id,
        renterId: renters[b.renterIndex].id,
        hostId: hosts[b.hostIndex].id,
        status: b.status,
        pickupDate: b.pickupDate,
        returnDate: b.returnDate,
        actualPickupDate: b.actualPickupDate ?? null,
        actualReturnDate: b.actualReturnDate ?? null,
        pickupType: "pickup",
        dailyRate: b.dailyRate,
        numDays: b.numDays,
        subtotal,
        cleaningFee,
        deliveryFee,
        serviceFee,
        taxAmount,
        totalPrice,
        hostEarnings,
        platformFee,
        platformFeeRate: hostFeeRate,
        cancelledAt: b.cancelledAt ?? null,
        cancelledBy: b.cancelledAt ? renters[b.renterIndex].id : null,
        cancellationReason: b.cancellationReason ?? null,
      },
    });
    bookings.push(booking);

    await prisma.bookingStatusHistory.create({
      data: {
        id: id(`bsh${bookings.length}`, 1),
        bookingId: booking.id,
        status: b.status,
        note: `Booking ${b.status.toLowerCase().replace(/_/g, " ")}`,
        changedBy: "system",
      },
    });

    await prisma.bookingPriceBreakdown.createMany({
      data: [
        {
          id: id(`bpb${bookings.length}`, 1),
          bookingId: booking.id,
          label: `${b.numDays} day${b.numDays > 1 ? "s" : ""} x $${b.dailyRate}/day`,
          type: "base",
          amount: b.dailyRate,
          quantity: b.numDays,
          total: subtotal,
        },
        ...(cleaningFee > 0
          ? [
              {
                id: id(`bpb${bookings.length}`, 2),
                bookingId: booking.id,
                label: "Cleaning fee",
                type: "fee",
                amount: cleaningFee,
                quantity: 1,
                total: cleaningFee,
              },
            ]
          : []),
        {
          id: id(`bpb${bookings.length}`, 3),
          bookingId: booking.id,
          label: "Service fee",
          type: "fee",
          amount: serviceFee,
          quantity: 1,
          total: serviceFee,
        },
        {
          id: id(`bpb${bookings.length}`, 4),
          bookingId: booking.id,
          label: "Taxes",
          type: "tax",
          amount: taxAmount,
          quantity: 1,
          total: taxAmount,
        },
      ],
    });
  }

  console.log(`Created ${bookings.length} bookings.`);

  console.log("Creating reviews...");

  const reviewData = [
    {
      bookingIndex: 0,
      vehicleIndex: 0,
      authorIndex: 0,
      subjectHostIndex: 0,
      type: "renter_to_host",
      overallRating: 5,
      cleanliness: 5,
      communication: 5,
      accuracy: 5,
      pickupExperience: 4,
      comment: "Marcus was an excellent host. The Camry was spotless and exactly as described. Pickup was smooth and he even gave me tips for local restaurants. Would definitely rent from him again!",
    },
    {
      bookingIndex: 0,
      vehicleIndex: 0,
      authorHostIndex: 0,
      subjectRenterIndex: 0,
      type: "host_to_renter",
      overallRating: 5,
      comment: "Emily was a fantastic renter. She returned the car on time and in perfect condition. Highly recommend her to other hosts.",
    },
    {
      bookingIndex: 1,
      vehicleIndex: 2,
      authorIndex: 1,
      subjectHostIndex: 1,
      type: "renter_to_host",
      overallRating: 4,
      cleanliness: 5,
      communication: 4,
      accuracy: 4,
      pickupExperience: 3,
      comment: "Great Tesla experience! The car was clean and fun to drive. Took a bit longer than expected at pickup due to app instructions, but overall a very positive trip.",
    },
    {
      bookingIndex: 2,
      vehicleIndex: 4,
      authorIndex: 2,
      subjectHostIndex: 2,
      type: "renter_to_host",
      overallRating: 5,
      cleanliness: 5,
      communication: 5,
      accuracy: 5,
      pickupExperience: 5,
      comment: "The Mustang was absolutely incredible for our Miami weekend. Sunshine Auto Rentals delivered the car to our hotel and it was in showroom condition. Best rental experience ever.",
    },
    {
      bookingIndex: 2,
      vehicleIndex: 4,
      authorHostIndex: 2,
      subjectRenterIndex: 2,
      type: "host_to_renter",
      overallRating: 5,
      comment: "Jessica took excellent care of the Mustang. Returned it clean and with a full tank. Welcome back anytime!",
    },
    {
      bookingIndex: 3,
      vehicleIndex: 6,
      authorIndex: 3,
      subjectHostIndex: 3,
      type: "renter_to_host",
      overallRating: 4,
      cleanliness: 4,
      communication: 5,
      accuracy: 4,
      pickupExperience: 4,
      comment: "Solid week-long rental in Chicago. The Equinox was comfortable and James was very responsive to messages. Small scratch on the bumper was pre-existing and documented. Good value for the price.",
    },
    {
      bookingIndex: 4,
      vehicleIndex: 8,
      authorIndex: 4,
      subjectHostIndex: 4,
      type: "renter_to_host",
      overallRating: 5,
      cleanliness: 5,
      communication: 5,
      accuracy: 5,
      pickupExperience: 5,
      comment: "The F-150 was perfect for our Austin trip. We used it to haul camping gear to the hill country and it handled everything like a champ. Lone Star Fleet is top notch.",
    },
    {
      bookingIndex: 4,
      vehicleIndex: 8,
      authorHostIndex: 4,
      subjectRenterIndex: 4,
      type: "host_to_renter",
      overallRating: 4,
      comment: "Ashley returned the truck in good shape. A few extra miles over the limit but she was upfront about it. Would rent to her again.",
    },
    {
      bookingIndex: 3,
      vehicleIndex: 6,
      authorHostIndex: 3,
      subjectRenterIndex: 3,
      type: "host_to_renter",
      overallRating: 5,
      comment: "Daniel was a great renter. Very communicative throughout the week-long rental. The car came back clean and on time. Five stars all around.",
    },
    {
      bookingIndex: 1,
      vehicleIndex: 2,
      authorHostIndex: 1,
      subjectRenterIndex: 1,
      type: "host_to_renter",
      overallRating: 3,
      comment: "Michael returned the car a few hours late without notice. The vehicle was clean otherwise. Please be mindful of return times in the future.",
    },
  ];

  for (let i = 0; i < reviewData.length; i++) {
    const r = reviewData[i];
    const isRenterToHost = r.type === "renter_to_host";

    const authorId = isRenterToHost
      ? renters[r.authorIndex!].id
      : hosts[(r as { authorHostIndex?: number }).authorHostIndex!].id;
    const subjectId = isRenterToHost
      ? hosts[(r as { subjectHostIndex?: number }).subjectHostIndex!].id
      : renters[(r as { subjectRenterIndex?: number }).subjectRenterIndex!].id;

    await prisma.review.create({
      data: {
        id: id("review", i + 1),
        bookingId: bookings[r.bookingIndex].id,
        vehicleId: vehicles[r.vehicleIndex].id,
        authorId,
        subjectId,
        type: r.type,
        overallRating: r.overallRating,
        cleanliness: r.cleanliness ?? null,
        communication: r.communication ?? null,
        accuracy: r.accuracy ?? null,
        pickupExperience: r.pickupExperience ?? null,
        comment: r.comment,
        isPublished: true,
      },
    });
  }

  console.log(`Created ${reviewData.length} reviews.`);

  console.log("Creating app configuration...");

  const configEntries = [
    { key: "host_fee_rate", value: 12, category: "fees" },
    { key: "renter_fee_rate", value: 10, category: "fees" },
    { key: "platform_fee_options", value: [8, 10, 12, 15], category: "fees" },
    { key: "insurance_enabled", value: true, category: "insurance" },
    { key: "sandbox_mode", value: true, category: "insurance" },
    { key: "default_tax_rate", value: 8.5, category: "fees" },
  ];

  for (let i = 0; i < configEntries.length; i++) {
    const c = configEntries[i];
    await prisma.appConfiguration.create({
      data: {
        id: id("config", i + 1),
        key: c.key,
        value: c.value as never,
        category: c.category,
        updatedBy: admin.id,
      },
    });
  }

  console.log(`Created ${configEntries.length} app configuration entries.`);
  console.log("Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
