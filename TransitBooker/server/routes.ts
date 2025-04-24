import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { transportTypes } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get transport providers by type
  app.get("/api/transport-providers", async (_req: Request, res: Response) => {
    try {
      const providers = await storage.getTransportProviders();
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transport providers" });
    }
  });

  app.get("/api/transport-providers/:type", async (req: Request, res: Response) => {
    try {
      const { type } = req.params;
      if (!Object.values(transportTypes).includes(type as any)) {
        return res.status(400).json({ message: "Invalid transport type" });
      }
      
      const providers = await storage.getTransportProvidersByType(type);
      res.json(providers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transport providers" });
    }
  });

  // Get popular routes with details for homepage
  app.get("/api/popular-routes", async (_req: Request, res: Response) => {
    try {
      const popularRoutes = await storage.getPopularRoutesWithDetails();
      res.json(popularRoutes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popular routes" });
    }
  });

  // Get offers for carousel
  app.get("/api/offers", async (_req: Request, res: Response) => {
    try {
      const offers = await storage.getOffers();
      res.json(offers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch offers" });
    }
  });

  // Search routes
  app.get("/api/routes/search", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        source: z.string(),
        destination: z.string(),
        type: z.string(),
        date: z.string().optional()
      });

      const { source, destination, type, date } = schema.parse(req.query);
      
      if (!Object.values(transportTypes).includes(type as any)) {
        return res.status(400).json({ message: "Invalid transport type" });
      }
      
      const routes = await storage.searchRoutes(source, destination, type, date);
      res.json(routes);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid search parameters", errors: error.format() });
      }
      res.status(500).json({ message: "Failed to search routes" });
    }
  });

  // Get route details with schedule
  app.get("/api/routes/:routeId/schedules/:scheduleId", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        routeId: z.string().transform(val => parseInt(val, 10)),
        scheduleId: z.string().transform(val => parseInt(val, 10))
      });

      const { routeId, scheduleId } = schema.parse(req.params);
      
      const routeDetails = await storage.getRouteWithDetails(routeId, scheduleId);
      
      if (!routeDetails) {
        return res.status(404).json({ message: "Route or schedule not found" });
      }
      
      res.json(routeDetails);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid parameters", errors: error.format() });
      }
      res.status(500).json({ message: "Failed to fetch route details" });
    }
  });

  // Get schedules for a route
  app.get("/api/routes/:routeId/schedules", async (req: Request, res: Response) => {
    try {
      const routeId = parseInt(req.params.routeId, 10);
      
      if (isNaN(routeId)) {
        return res.status(400).json({ message: "Invalid route ID" });
      }
      
      const schedules = await storage.getSchedulesByRoute(routeId);
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedules" });
    }
  });

  // Create a booking
  app.post("/api/bookings", async (req: Request, res: Response) => {
    try {
      const bookingSchema = z.object({
        userId: z.number().optional(),
        scheduleId: z.number(),
        passengerName: z.string().min(3, "Name must be at least 3 characters"),
        passengerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
        passengerEmail: z.string().email().optional(),
        seatNumber: z.string(),
        totalAmount: z.number().min(1),
        paymentMethod: z.string().optional()
      });

      const bookingData = bookingSchema.parse(req.body);
      
      // Check if schedule exists and has available seats
      const schedule = await storage.getSchedule(bookingData.scheduleId);
      
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      
      if (schedule.availableSeats < 1) {
        return res.status(400).json({ message: "No seats available" });
      }
      
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.format() });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get bookings for a user
  app.get("/api/bookings", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string, 10) : undefined;
      
      let bookings;
      if (userId && !isNaN(userId)) {
        bookings = await storage.getBookingsByUser(userId);
      } else {
        bookings = await storage.getBookings();
      }
      
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get single booking by ID
  app.get("/api/bookings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
