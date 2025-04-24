import { eq, and, sql } from "drizzle-orm";
import { db } from "./db";
import {
  users, insertUserSchema, User, InsertUser,
  transportProviders, insertTransportProviderSchema, TransportProvider, InsertTransportProvider,
  routes, insertRouteSchema, Route, InsertRoute,
  schedules, insertScheduleSchema, Schedule, InsertSchedule,
  bookings, insertBookingSchema, Booking, InsertBooking,
  popularRoutes, insertPopularRouteSchema, PopularRoute, InsertPopularRoute,
  offers, insertOfferSchema, Offer, InsertOffer,
  RouteWithDetails
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Transport providers
  getTransportProviders(): Promise<TransportProvider[]>;
  getTransportProvidersByType(type: string): Promise<TransportProvider[]>;
  getTransportProvider(id: number): Promise<TransportProvider | undefined>;
  createTransportProvider(provider: InsertTransportProvider): Promise<TransportProvider>;

  // Routes
  getRoutes(): Promise<Route[]>;
  getRoutesByType(type: string): Promise<Route[]>;
  getRoutesByProvider(providerId: number): Promise<Route[]>;
  getRoutesBySourceAndDestination(source: string, destination: string, type?: string): Promise<Route[]>;
  getRoute(id: number): Promise<Route | undefined>;
  createRoute(route: InsertRoute): Promise<Route>;

  // Schedules
  getSchedules(): Promise<Schedule[]>;
  getSchedulesByRoute(routeId: number): Promise<Schedule[]>;
  getSchedule(id: number): Promise<Schedule | undefined>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateScheduleAvailability(id: number, availableSeats: number): Promise<Schedule | undefined>;

  // Bookings
  getBookings(): Promise<Booking[]>;
  getBookingsByUser(userId: number): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;

  // Popular routes
  getPopularRoutes(): Promise<PopularRoute[]>;
  createPopularRoute(popularRoute: InsertPopularRoute): Promise<PopularRoute>;
  
  // Offers
  getOffers(): Promise<Offer[]>;
  getOffer(id: number): Promise<Offer | undefined>;
  createOffer(offer: InsertOffer): Promise<Offer>;

  // Composite queries
  getRouteWithDetails(routeId: number, scheduleId: number): Promise<RouteWithDetails | undefined>;
  searchRoutes(source: string, destination: string, type: string, date?: string): Promise<RouteWithDetails[]>;
  getPopularRoutesWithDetails(): Promise<RouteWithDetails[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Transport providers
  async getTransportProviders(): Promise<TransportProvider[]> {
    return await db.select().from(transportProviders);
  }

  async getTransportProvidersByType(type: string): Promise<TransportProvider[]> {
    return await db.select().from(transportProviders).where(eq(transportProviders.type, type));
  }

  async getTransportProvider(id: number): Promise<TransportProvider | undefined> {
    const [provider] = await db.select().from(transportProviders).where(eq(transportProviders.id, id));
    return provider;
  }

  async createTransportProvider(provider: InsertTransportProvider): Promise<TransportProvider> {
    const [transportProvider] = await db.insert(transportProviders).values(provider).returning();
    return transportProvider;
  }

  // Routes
  async getRoutes(): Promise<Route[]> {
    return await db.select().from(routes);
  }

  async getRoutesByType(type: string): Promise<Route[]> {
    const providers = await this.getTransportProvidersByType(type);
    const providerIds = providers.map(provider => provider.id);
    
    if (providerIds.length === 0) {
      return [];
    }
    
    return await db.select().from(routes).where(
      sql`${routes.providerId} IN (${sql.join(providerIds, sql`, `)})`
    );
  }

  async getRoutesByProvider(providerId: number): Promise<Route[]> {
    return await db.select().from(routes).where(eq(routes.providerId, providerId));
  }

  async getRoutesBySourceAndDestination(source: string, destination: string, type?: string): Promise<Route[]> {
    let query = db.select().from(routes)
      .where(and(
        eq(routes.source, source),
        eq(routes.destination, destination)
      ));
    
    if (type) {
      const providers = await this.getTransportProvidersByType(type);
      const providerIds = providers.map(provider => provider.id);
      
      if (providerIds.length > 0) {
        query = query.where(
          sql`${routes.providerId} IN (${sql.join(providerIds, sql`, `)})`
        );
      }
    }
    
    return await query;
  }

  async getRoute(id: number): Promise<Route | undefined> {
    const [route] = await db.select().from(routes).where(eq(routes.id, id));
    return route;
  }

  async createRoute(route: InsertRoute): Promise<Route> {
    const [newRoute] = await db.insert(routes).values(route).returning();
    return newRoute;
  }

  // Schedules
  async getSchedules(): Promise<Schedule[]> {
    return await db.select().from(schedules);
  }

  async getSchedulesByRoute(routeId: number): Promise<Schedule[]> {
    return await db.select().from(schedules).where(eq(schedules.routeId, routeId));
  }

  async getSchedule(id: number): Promise<Schedule | undefined> {
    const [schedule] = await db.select().from(schedules).where(eq(schedules.id, id));
    return schedule;
  }

  async createSchedule(schedule: InsertSchedule): Promise<Schedule> {
    const [newSchedule] = await db.insert(schedules).values(schedule).returning();
    return newSchedule;
  }

  async updateScheduleAvailability(id: number, availableSeats: number): Promise<Schedule | undefined> {
    const [updatedSchedule] = await db
      .update(schedules)
      .set({ availableSeats })
      .where(eq(schedules.id, id))
      .returning();
    
    return updatedSchedule;
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async getBookingsByUser(userId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings).values(booking).returning();
    return newBooking;
  }

  // Popular routes
  async getPopularRoutes(): Promise<PopularRoute[]> {
    return await db.select().from(popularRoutes);
  }

  async createPopularRoute(popularRoute: InsertPopularRoute): Promise<PopularRoute> {
    const [newPopularRoute] = await db.insert(popularRoutes).values(popularRoute).returning();
    return newPopularRoute;
  }

  // Offers
  async getOffers(): Promise<Offer[]> {
    return await db.select().from(offers);
  }

  async getOffer(id: number): Promise<Offer | undefined> {
    const [offer] = await db.select().from(offers).where(eq(offers.id, id));
    return offer;
  }

  async createOffer(offer: InsertOffer): Promise<Offer> {
    const [newOffer] = await db.insert(offers).values(offer).returning();
    return newOffer;
  }

  // Complex queries
  async getRouteWithDetails(routeId: number, scheduleId: number): Promise<RouteWithDetails | undefined> {
    const route = await this.getRoute(routeId);
    const schedule = await this.getSchedule(scheduleId);
    
    if (!route || !schedule) {
      return undefined;
    }
    
    const provider = await this.getTransportProvider(route.providerId);
    
    if (!provider) {
      return undefined;
    }
    
    const routeWithDetails: RouteWithDetails = {
      id: route.id,
      providerId: provider.id,
      providerName: provider.name,
      providerLogo: provider.logoUrl || undefined,
      providerType: provider.type,
      source: route.source,
      destination: route.destination,
      duration: route.duration,
      distance: route.distance || undefined,
      fareAmount: schedule.fareAmount,
      departureTime: schedule.departureTime.toISOString(),
      arrivalTime: schedule.arrivalTime.toISOString(),
      availableSeats: schedule.availableSeats,
      status: schedule.status,
      scheduleId: schedule.id,
      vehicleId: schedule.vehicleId || undefined,
    };
    
    return routeWithDetails;
  }

  async searchRoutes(source: string, destination: string, type: string, date?: string): Promise<RouteWithDetails[]> {
    const routes = await this.getRoutesBySourceAndDestination(source, destination, type);
    const routesWithDetails: RouteWithDetails[] = [];
    
    for (const route of routes) {
      const scheduleList = await this.getSchedulesByRoute(route.id);
      const provider = await this.getTransportProvider(route.providerId);
      
      if (!provider) {
        continue;
      }
      
      for (const schedule of scheduleList) {
        // Filter by date if provided
        if (date) {
          const scheduleDate = new Date(schedule.departureTime).toISOString().split('T')[0];
          if (scheduleDate !== date) {
            continue;
          }
        }
        
        if (schedule.availableSeats > 0 && schedule.status === 'active') {
          const routeWithDetails: RouteWithDetails = {
            id: route.id,
            providerId: provider.id,
            providerName: provider.name,
            providerLogo: provider.logoUrl || undefined,
            providerType: provider.type,
            source: route.source,
            destination: route.destination,
            duration: route.duration,
            distance: route.distance || undefined,
            fareAmount: schedule.fareAmount,
            departureTime: schedule.departureTime.toISOString(),
            arrivalTime: schedule.arrivalTime.toISOString(),
            availableSeats: schedule.availableSeats,
            status: schedule.status,
            scheduleId: schedule.id,
            vehicleId: schedule.vehicleId || undefined,
          };
          
          routesWithDetails.push(routeWithDetails);
        }
      }
    }
    
    // Sort by departure time
    routesWithDetails.sort((a, b) => {
      return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
    });
    
    return routesWithDetails;
  }

  async getPopularRoutesWithDetails(): Promise<RouteWithDetails[]> {
    const popularRoutesList = await this.getPopularRoutes();
    const routesWithDetails: RouteWithDetails[] = [];
    
    for (const popularRoute of popularRoutesList) {
      const route = await this.getRoute(popularRoute.routeId);
      const schedule = await this.getSchedule(popularRoute.scheduleId);
      
      if (!route || !schedule) {
        continue;
      }
      
      const provider = await this.getTransportProvider(route.providerId);
      
      if (!provider) {
        continue;
      }
      
      const routeWithDetails: RouteWithDetails = {
        id: route.id,
        providerId: provider.id,
        providerName: provider.name,
        providerLogo: provider.logoUrl || undefined,
        providerType: provider.type,
        source: route.source,
        destination: route.destination,
        duration: route.duration,
        distance: route.distance || undefined,
        fareAmount: schedule.fareAmount,
        departureTime: schedule.departureTime.toISOString(),
        arrivalTime: schedule.arrivalTime.toISOString(),
        availableSeats: schedule.availableSeats,
        status: schedule.status,
        scheduleId: schedule.id,
        vehicleId: schedule.vehicleId || undefined,
      };
      
      routesWithDetails.push(routeWithDetails);
    }
    
    return routesWithDetails;
  }

  // Seed method to insert initial data
  async seedData() {
    // Check if we need to seed data
    const existingProviders = await this.getTransportProviders();
    if (existingProviders.length > 0) {
      return; // Data already exists
    }

    try {
      console.log('Seeding database with initial data...');
      
      // 1. Create transport providers
      const gsrtc = await this.createTransportProvider({
        name: "GSRTC",
        type: "bus",
        logoUrl: null,
        contactInfo: "+91 79 2254 3273",
        rating: 4.2
      });
      
      const metroProvider = await this.createTransportProvider({
        name: "Ahmedabad Metro",
        type: "metro",
        logoUrl: null,
        contactInfo: "+91 79 2327 6500",
        rating: 4.5
      });
      
      const indianRailways = await this.createTransportProvider({
        name: "Indian Railways",
        type: "train",
        logoUrl: null,
        contactInfo: "+91 139",
        rating: 4.0
      });
      
      const airIndia = await this.createTransportProvider({
        name: "Air India",
        type: "flight",
        logoUrl: null,
        contactInfo: "+91 124 625 2400",
        rating: 3.7
      });
      
      // 2. Create routes
      const busRouteAmdSurat = await this.createRoute({
        providerId: gsrtc.id,
        source: "Ahmedabad",
        destination: "Surat",
        duration: 180, // 3 hours
        distance: 270, // 270 km
        stopsCount: 2,
        routeNumber: "AS-1234"
      });
      
      const busRouteAmdVadodara = await this.createRoute({
        providerId: gsrtc.id,
        source: "Ahmedabad",
        destination: "Vadodara",
        duration: 120, // 2 hours
        distance: 120, // 120 km
        stopsCount: 1,
        routeNumber: "AV-5678"
      });
      
      const metroRouteEastWest = await this.createRoute({
        providerId: metroProvider.id,
        source: "Thaltej Gam",
        destination: "Apparel Park",
        duration: 45, // 45 minutes
        distance: 21, // 21 km
        stopsCount: 17,
        routeNumber: "Metro Line 1"
      });
      
      const trainRouteAmdMumbai = await this.createRoute({
        providerId: indianRailways.id,
        source: "Ahmedabad",
        destination: "Mumbai",
        duration: 420, // 7 hours
        distance: 550, // 550 km
        stopsCount: 8,
        routeNumber: "12934 KARNAVATI"
      });
      
      const flightRouteAmdDelhi = await this.createRoute({
        providerId: airIndia.id,
        source: "Ahmedabad",
        destination: "Delhi",
        duration: 90, // 1.5 hours
        distance: 950, // 950 km
        stopsCount: 0,
        routeNumber: "AI-101"
      });
      
      // 3. Create schedules
      // Bus schedules
      const busSchedule1 = await this.createSchedule({
        routeId: busRouteAmdSurat.id,
        departureTime: new Date(new Date().setHours(7, 0, 0, 0)),
        arrivalTime: new Date(new Date().setHours(10, 0, 0, 0)),
        fareAmount: 350,
        availableSeats: 35,
        status: "active",
        vehicleId: "GJ-01-XX-1234"
      });
      
      const busSchedule2 = await this.createSchedule({
        routeId: busRouteAmdSurat.id,
        departureTime: new Date(new Date().setHours(14, 0, 0, 0)),
        arrivalTime: new Date(new Date().setHours(17, 0, 0, 0)),
        fareAmount: 350,
        availableSeats: 42,
        status: "active",
        vehicleId: "GJ-01-XX-5678"
      });
      
      const busSchedule3 = await this.createSchedule({
        routeId: busRouteAmdVadodara.id,
        departureTime: new Date(new Date().setHours(8, 30, 0, 0)),
        arrivalTime: new Date(new Date().setHours(10, 30, 0, 0)),
        fareAmount: 190,
        availableSeats: 28,
        status: "active",
        vehicleId: "GJ-01-YY-9012"
      });
      
      // Metro schedules
      const metroSchedule1 = await this.createSchedule({
        routeId: metroRouteEastWest.id,
        departureTime: new Date(new Date().setHours(8, 0, 0, 0)),
        arrivalTime: new Date(new Date().setHours(8, 45, 0, 0)),
        fareAmount: 30,
        availableSeats: 200,
        status: "active",
        vehicleId: "METRO-EW-1"
      });
      
      const metroSchedule2 = await this.createSchedule({
        routeId: metroRouteEastWest.id,
        departureTime: new Date(new Date().setHours(9, 0, 0, 0)),
        arrivalTime: new Date(new Date().setHours(9, 45, 0, 0)),
        fareAmount: 30,
        availableSeats: 180,
        status: "active",
        vehicleId: "METRO-EW-2"
      });
      
      // Train schedules
      const trainSchedule1 = await this.createSchedule({
        routeId: trainRouteAmdMumbai.id,
        departureTime: new Date(new Date().setHours(22, 0, 0, 0)),
        arrivalTime: new Date(new Date().setHours(5, 0, 0, 0)),
        fareAmount: 550,
        availableSeats: 124,
        status: "active",
        vehicleId: "12934-KARNAVATI"
      });
      
      // Flight schedules
      const flightSchedule1 = await this.createSchedule({
        routeId: flightRouteAmdDelhi.id,
        departureTime: new Date(new Date().setHours(10, 15, 0, 0)),
        arrivalTime: new Date(new Date().setHours(11, 45, 0, 0)),
        fareAmount: 3500,
        availableSeats: 120,
        status: "active",
        vehicleId: "AI-101"
      });
      
      // 4. Create popular routes
      await this.createPopularRoute({
        routeId: busRouteAmdSurat.id,
        scheduleId: busSchedule1.id,
        count: 150
      });
      
      await this.createPopularRoute({
        routeId: busRouteAmdVadodara.id,
        scheduleId: busSchedule3.id,
        count: 120
      });
      
      await this.createPopularRoute({
        routeId: metroRouteEastWest.id,
        scheduleId: metroSchedule1.id,
        count: 450
      });
      
      await this.createPopularRoute({
        routeId: trainRouteAmdMumbai.id,
        scheduleId: trainSchedule1.id,
        count: 300
      });
      
      // 5. Create offers
      await this.createOffer({
        title: "20% off on GSRTC routes",
        description: "Use code GSRTC20 to get 20% off on all GSRTC bus routes",
        discount: 20,
        validUntil: new Date(new Date().setDate(new Date().getDate() + 30)),
        imageUrl: null,
        applicableTypes: ["bus"]
      });
      
      await this.createOffer({
        title: "Metro Monthly Pass",
        description: "Get 30% off on monthly metro passes for regular commuters",
        discount: 30,
        validUntil: new Date(new Date().setDate(new Date().getDate() + 60)),
        imageUrl: null,
        applicableTypes: ["metro"]
      });
      
      await this.createOffer({
        title: "Monsoon Special",
        description: "Flat ₹100 off on all bookings made during the monsoon season",
        discount: null,
        validUntil: new Date(new Date().setDate(new Date().getDate() + 90)),
        imageUrl: null,
        applicableTypes: ["bus", "train", "metro", "flight"]
      });
      
      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }
}

export const storage = new DatabaseStorage();

// Seed data when the server starts
storage.seedData().catch(console.error);