import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real, foreignKey, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User model for authentication and personalization
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
});

export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  phone: true,
});

// Transport Types
export const transportTypes = {
  FLIGHT: "flight",
  TRAIN: "train", 
  BUS: "bus",
  METRO: "metro"
} as const;

// Transportation options available
export const transportProviders = pgTable("transport_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),  // flight, train, bus, metro
  logoUrl: text("logo_url"),
  contactInfo: text("contact_info"),
  rating: real("rating"),
});

export const transportProvidersRelations = relations(transportProviders, ({ many }) => ({
  routes: many(routes),
}));

export const insertTransportProviderSchema = createInsertSchema(transportProviders).pick({
  name: true,
  type: true,
  logoUrl: true,
  contactInfo: true,
  rating: true,
});

// Available routes
export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull().references(() => transportProviders.id),
  source: text("source").notNull(),
  destination: text("destination").notNull(),
  duration: integer("duration").notNull(), // in minutes
  distance: integer("distance"), // in km
  stopsCount: integer("stops_count").default(0),
  routeNumber: text("route_number"),
});

export const routesRelations = relations(routes, ({ one, many }) => ({
  provider: one(transportProviders, {
    fields: [routes.providerId],
    references: [transportProviders.id],
  }),
  schedules: many(schedules),
  popularRoutes: many(popularRoutes),
}));

export const insertRouteSchema = createInsertSchema(routes).pick({
  providerId: true,
  source: true,
  destination: true,
  duration: true,
  distance: true,
  stopsCount: true,
  routeNumber: true,
});

// Schedule for routes
export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  routeId: integer("route_id").notNull().references(() => routes.id),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  fareAmount: integer("fare_amount").notNull(), // in INR
  availableSeats: integer("available_seats").notNull(),
  status: text("status").default("active"),
  vehicleId: text("vehicle_id"),
});

export const schedulesRelations = relations(schedules, ({ one, many }) => ({
  route: one(routes, {
    fields: [schedules.routeId],
    references: [routes.id],
  }),
  bookings: many(bookings),
  popularRoutes: many(popularRoutes),
}));

export const insertScheduleSchema = createInsertSchema(schedules).pick({
  routeId: true,
  departureTime: true,
  arrivalTime: true,
  fareAmount: true,
  availableSeats: true,
  status: true,
  vehicleId: true,
});

// Bookings made by users
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  scheduleId: integer("schedule_id").notNull().references(() => schedules.id),
  bookingDate: timestamp("booking_date").defaultNow(),
  passengerName: text("passenger_name").notNull(),
  passengerPhone: text("passenger_phone").notNull(),
  passengerEmail: text("passenger_email"),
  seatNumber: text("seat_number").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").default("confirmed"),
  paymentMethod: text("payment_method"),
});

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  schedule: one(schedules, {
    fields: [bookings.scheduleId],
    references: [schedules.id],
  }),
}));

export const insertBookingSchema = createInsertSchema(bookings).pick({
  userId: true,
  scheduleId: true,
  passengerName: true,
  passengerPhone: true,
  passengerEmail: true,
  seatNumber: true,
  totalAmount: true,
  paymentMethod: true,
});

// Popular and featured routes for homepage
export const popularRoutes = pgTable("popular_routes", {
  id: serial("id").primaryKey(),
  routeId: integer("route_id").notNull().references(() => routes.id),
  scheduleId: integer("schedule_id").notNull().references(() => schedules.id),
  count: integer("count").default(0),
});

export const popularRoutesRelations = relations(popularRoutes, ({ one }) => ({
  route: one(routes, {
    fields: [popularRoutes.routeId],
    references: [routes.id],
  }),
  schedule: one(schedules, {
    fields: [popularRoutes.scheduleId],
    references: [schedules.id],
  }),
}));

export const insertPopularRouteSchema = createInsertSchema(popularRoutes).pick({
  routeId: true,
  scheduleId: true,
  count: true,
});

// Special offers and promotions
export const offers = pgTable("offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  discount: integer("discount"), // Percentage discount
  validUntil: timestamp("valid_until"),
  imageUrl: text("image_url"),
  applicableTypes: jsonb("applicable_types").notNull(), // Array of transport types
});

export const insertOfferSchema = createInsertSchema(offers).pick({
  title: true,
  description: true,
  discount: true,
  validUntil: true,
  imageUrl: true,
  applicableTypes: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type TransportProvider = typeof transportProviders.$inferSelect;
export type InsertTransportProvider = z.infer<typeof insertTransportProviderSchema>;

export type Route = typeof routes.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;

export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type PopularRoute = typeof popularRoutes.$inferSelect;
export type InsertPopularRoute = z.infer<typeof insertPopularRouteSchema>;

export type Offer = typeof offers.$inferSelect;
export type InsertOffer = z.infer<typeof insertOfferSchema>;

// Location type for geolocation services
export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
}

// Extended route type with provider and schedule info
export interface RouteWithDetails {
  id: number;
  providerId: number;
  providerName: string;
  providerLogo?: string;
  providerType: string;
  source: string;
  destination: string;
  duration: number;
  distance?: number;
  fareAmount: number;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  status: string;
  scheduleId: number;
  vehicleId?: string;
}
