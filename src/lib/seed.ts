import { prisma } from "./prisma";

export async function seedDatabase() {
  // Check if cities already exist
  const existingCitiesCount = await prisma.city.count();
  if (existingCitiesCount > 0) {
    return { message: "Database already seeded" };
  }

  // 1. Create Punjab Cities & Service Areas
  const lahore = await prisma.city.create({
    data: {
      name: "Lahore",
      province: "Punjab",
      isActive: true,
      serviceAreas: {
        create: [
          { name: "DHA Phase 5", isActive: true },
          { name: "Gulberg III", isActive: true },
          { name: "Johar Town", isActive: true },
          { name: "Model Town", isActive: true },
          { name: "Askari 11", isActive: true },
        ],
      },
    },
    include: { serviceAreas: true },
  });

  const rawalpindi = await prisma.city.create({
    data: {
      name: "Rawalpindi",
      province: "Punjab",
      isActive: true,
      serviceAreas: {
        create: [
          { name: "Bahria Town Phase 4", isActive: true },
          { name: "Saddar", isActive: true },
          { name: "Adiala Road", isActive: true },
          { name: "Chaklala Scheme 3", isActive: true },
        ],
      },
    },
    include: { serviceAreas: true },
  });

  const multan = await prisma.city.create({
    data: {
      name: "Multan",
      province: "Punjab",
      isActive: true,
      serviceAreas: {
        create: [
          { name: "Bosan Road", isActive: true },
          { name: "Cantt", isActive: true },
          { name: "Gulgasht Colony", isActive: true },
        ],
      },
    },
    include: { serviceAreas: true },
  });

  const faisalabad = await prisma.city.create({
    data: {
      name: "Faisalabad",
      province: "Punjab",
      isActive: true,
      serviceAreas: {
        create: [
          { name: "Canal Express", isActive: true },
          { name: "Peoples Colony 1", isActive: true },
          { name: "Civil Lines", isActive: true },
        ],
      },
    },
    include: { serviceAreas: true },
  });

  // 2. Create Gwala Users & Profiles
  // Gwala 1: Verified (Lahore - DHA Phase 5)
  const gwalaUser1 = await prisma.user.create({
    data: {
      name: "Chaudhry Muhammad Rafiq",
      email: "rafiq.doodh@example.com",
      phone: "03004123456",
      role: "gwala",
      preferredLanguage: "ur",
      gwalaProfile: {
        create: {
          displayName: "Al-Madina Pure Buffalo Milk",
          phone: "03004123456",
          cnicHash: "sha256_cnic_3520212345671",
          maskedCnic: "35202-*****67-1",
          city: "Lahore",
          primaryArea: "DHA Phase 5",
          routeDetails: "Morning 6:00 AM - 8:30 AM delivery route across Sector CCA, Sector J, and Sector K.",
          price: 240, // PKR per litre
          status: "verified",
          qualityStatus: "normal",
          featured: true,
          ratingAverage: 4.8,
          ratingCount: 24,
          notes: "Strictly organic grass-fed buffalo milk. Verified lactometer density 1.030+.",
        },
      },
    },
    include: { gwalaProfile: true },
  });

  // Link Gwala 1 Service Areas
  const dhaArea = lahore.serviceAreas.find((a) => a.name === "DHA Phase 5");
  if (dhaArea && gwalaUser1.gwalaProfile) {
    await prisma.gwalaServiceArea.create({
      data: {
        gwalaId: gwalaUser1.gwalaProfile.userId,
        serviceAreaId: dhaArea.id,
        city: "Lahore",
        area: "DHA Phase 5",
        slots: 15,
        isActive: true,
      },
    });
  }

  // Gwala 2: Verified (Lahore - Gulberg III)
  const gwalaUser2 = await prisma.user.create({
    data: {
      name: "Malik Tariq Hussain",
      email: "tariq.gwaladoodh@example.com",
      phone: "03018765432",
      role: "gwala",
      preferredLanguage: "en",
      gwalaProfile: {
        create: {
          displayName: "Bismillah Organic Dairy",
          phone: "03018765432",
          cnicHash: "sha256_cnic_3520198765432",
          maskedCnic: "35201-*****43-2",
          city: "Lahore",
          primaryArea: "Gulberg III",
          routeDetails: "Delivery round 1 (6:30 AM) Main Boulevard Gulberg and MM Alam Road residential quarters.",
          price: 250,
          status: "verified",
          qualityStatus: "normal",
          featured: true,
          ratingAverage: 4.9,
          ratingCount: 38,
          notes: "Fresh morning milking. Chilled transport cans.",
        },
      },
    },
    include: { gwalaProfile: true },
  });

  const gulbergArea = lahore.serviceAreas.find((a) => a.name === "Gulberg III");
  if (gulbergArea && gwalaUser2.gwalaProfile) {
    await prisma.gwalaServiceArea.create({
      data: {
        gwalaId: gwalaUser2.gwalaProfile.userId,
        serviceAreaId: gulbergArea.id,
        city: "Lahore",
        area: "Gulberg III",
        slots: 20,
        isActive: true,
      },
    });
  }

  // Gwala 3: Verified (Rawalpindi - Bahria Town Phase 4)
  const gwalaUser3 = await prisma.user.create({
    data: {
      name: "Subedar (R) Muhammad Aslam",
      email: "aslam.pindi@example.com",
      phone: "03335554433",
      role: "gwala",
      preferredLanguage: "ur",
      gwalaProfile: {
        create: {
          displayName: "Pindi Fresh Pure Cow & Buffalo Milk",
          phone: "03335554433",
          cnicHash: "sha256_cnic_3740511223344",
          maskedCnic: "37405-*****34-4",
          city: "Rawalpindi",
          primaryArea: "Bahria Town Phase 4",
          routeDetails: "Morning deliveries in Bahria Town Phase 4 Sectors A, B, and C.",
          price: 230,
          status: "verified",
          qualityStatus: "normal",
          featured: false,
          ratingAverage: 4.7,
          ratingCount: 19,
          notes: "Direct from farm in Chaklala.",
        },
      },
    },
    include: { gwalaProfile: true },
  });

  const bahriaArea = rawalpindi.serviceAreas.find((a) => a.name === "Bahria Town Phase 4");
  if (bahriaArea && gwalaUser3.gwalaProfile) {
    await prisma.gwalaServiceArea.create({
      data: {
        gwalaId: gwalaUser3.gwalaProfile.userId,
        serviceAreaId: bahriaArea.id,
        city: "Rawalpindi",
        area: "Bahria Town Phase 4",
        slots: 10,
        isActive: true,
      },
    });
  }

  // Gwala 4: Pending Enrollment (For Admin Review testing)
  await prisma.user.create({
    data: {
      name: "Sajjad Ahmad",
      email: "sajjad.pending@example.com",
      phone: "03219988776",
      role: "gwala",
      preferredLanguage: "ur",
      gwalaProfile: {
        create: {
          displayName: "Sajjad Gujjar Dairy",
          phone: "03219988776",
          cnicHash: "sha256_cnic_3520299887766",
          maskedCnic: "35202-*****77-6",
          city: "Lahore",
          primaryArea: "Johar Town",
          routeDetails: "Block R1 and R2 Johar Town morning route.",
          price: 220,
          status: "pending",
          qualityStatus: "normal",
          featured: false,
          ratingAverage: 0,
          ratingCount: 0,
          notes: "Document review pending by admin.",
        },
      },
    },
  });

  // 3. Create Admin User
  await prisma.user.create({
    data: {
      name: "Khalis Doodh Administrator",
      email: "admin@khalisdoodh.pk",
      phone: "03000000000",
      role: "admin",
      preferredLanguage: "en",
    },
  });

  // 4. Create Sample Customer User
  const customerUser = await prisma.user.create({
    data: {
      name: "Hassan Ali",
      email: "hassan.customer@example.com",
      phone: "03221234567",
      role: "customer",
      preferredLanguage: "en",
      referralCode: "HASSAN786",
    },
  });

  // Create a sample active subscription for Hassan
  if (gwalaUser1.gwalaProfile) {
    const sub = await prisma.subscription.create({
      data: {
        customerId: customerUser.id,
        gwalaId: gwalaUser1.gwalaProfile.userId,
        city: "Lahore",
        area: "DHA Phase 5",
        addressLine: "House 142, Street 8, Sector J, DHA Phase 5",
        landmark: "Near Jalal Sons",
        mapLatitude: 31.4697,
        mapLongitude: 74.4153,
        plan: "monthly",
        litresPerDay: 2,
        deliveryDays: JSON.stringify(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]),
        startDate: new Date(),
        pricing: 240,
        paymentMethod: "cod",
        paymentStatus: "pending",
        lifecycleStatus: "active",
      },
    });

    // Create today's delivery record
    await prisma.deliveryRecord.create({
      data: {
        subscriptionId: sub.id,
        date: new Date(),
        status: "out_for_delivery",
        outForDelivery: new Date(),
        notes: "Morning delivery batch #1",
      },
    });

    // Create payment record
    await prisma.paymentRecord.create({
      data: {
        subscriptionId: sub.id,
        amount: 240 * 2 * 30, // 14,400 PKR for 30 days
        method: "cod",
        status: "pending",
        receiptCode: "REC-20260824-001",
      },
    });
  }

  // 5. Create Revenue Config if empty
  const revCount = await prisma.revenueConfig.count();
  if (revCount === 0) {
    await prisma.revenueConfig.create({
      data: {
        commissionRate: 5.0,
        customerServiceFee: 50.0,
        gwalaPlanPrice: 1500.0,
        deliveryConvenienceFee: 30.0,
      },
    });
  }

  // 6. Create Initial Operational Risk Cases
  const riskCount = await prisma.riskCase.count();
  if (riskCount === 0) {
    await prisma.riskCase.create({
      data: {
        riskType: "quality",
        severity: "medium",
        status: "open",
        evidenceSummary: "Customer inquiry regarding lactometer density verification in DHA Phase 5 route.",
        internalNotes: "Auditor scheduled lactometer field test for Aug 26.",
        owner: "admin_ops",
      },
    });

    await prisma.riskCase.create({
      data: {
        riskType: "cnic",
        severity: "high",
        status: "under_review",
        evidenceSummary: "Sajjad Ahmad (Johar Town route) CNIC upload verification pending admin identity audit.",
        internalNotes: "Admin reviewing front/back document clear resolution.",
        owner: "admin_verification",
      },
    });
  }

  // 7. Initial Audit Log
  const auditCount = await prisma.auditLog.count();
  if (auditCount === 0) {
    await prisma.auditLog.create({
      data: {
        actorId: "admin-system",
        action: "INITIALIZE_PLATFORM",
        entityType: "system",
        entityId: "punjab-marketplace",
        details: "Initialized Punjab Marketplace seeding with 4 cities and 4 registered gwalas.",
      },
    });
  }

  return { message: "Database successfully seeded with Punjab cities, gwalas, risk register, and revenue config." };
}

