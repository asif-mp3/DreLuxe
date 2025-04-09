// This is a mock implementation for demonstration purposes
// In a real app, you would use a proper database like PostgreSQL, MongoDB, etc.

// Type definitions
interface User {
  id: string
  email: string
  name: string
  phone?: string
  passwordHash: string
  isNewUser: boolean
  createdAt: string
  updatedAt: string
}

interface Address {
  userId: string
  street: string
  city: string
  state: string
  zipCode: string
  landmark?: string
  isDefault: boolean
}

interface Preferences {
  userId: string
  fabricCare: string
  avoidMixing: string[]
  foldStyle: string
  hangerType: string
  specialRequests?: string
}

interface Payment {
  userId: string
  method: string
  details: any
  isDefault: boolean
}

interface Order {
  id: string
  userId: string
  status: string
  items: any[]
  totalAmount: number
  pickupTime: string
  deliveryTime: string
  createdAt: string
  updatedAt: string
}

// Mock database
const db = {
  users: new Map<string, User>(),
  addresses: new Map<string, Address[]>(),
  preferences: new Map<string, Preferences>(),
  payments: new Map<string, Payment[]>(),
  orders: new Map<string, Order[]>(),
}

// Initialize with a demo user
const demoUserId = "user123"
db.users.set(demoUserId, {
  id: demoUserId,
  email: "user@example.com",
  name: "John Doe",
  passwordHash: "$2a$10$demohashedpassword", // In a real app, this would be properly hashed
  isNewUser: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

db.addresses.set(demoUserId, [
  {
    userId: demoUserId,
    street: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400001",
    landmark: "Near the blue building",
    isDefault: true,
  },
])

db.preferences.set(demoUserId, {
  userId: demoUserId,
  fabricCare: "standard",
  avoidMixing: ["blood", "pet"],
  foldStyle: "standard",
  hangerType: "wooden",
  specialRequests: "No fabric softener",
})

db.payments.set(demoUserId, [
  {
    userId: demoUserId,
    method: "upi",
    details: { upiId: "john@okicici" },
    isDefault: true,
  },
])

db.orders.set(demoUserId, [
  {
    id: "ORD-12345",
    userId: demoUserId,
    status: "washing",
    items: [
      { name: "Shirts", quantity: 3, price: 60, total: 180 },
      { name: "Pants", quantity: 2, price: 80, total: 160 },
    ],
    totalAmount: 340,
    pickupTime: "2023-05-20T10:30:00Z",
    deliveryTime: "2023-05-22T18:00:00Z",
    createdAt: "2023-05-20T08:00:00Z",
    updatedAt: "2023-05-20T08:00:00Z",
  },
])

// User operations
export const userDB = {
  findByEmail: (email: string): User | undefined => {
    for (const user of db.users.values()) {
      if (user.email === email) {
        return { ...user }
      }
    }
    return undefined
  },

  findById: (id: string): User | undefined => {
    const user = db.users.get(id)
    return user ? { ...user } : undefined
  },

  create: (userData: Omit<User, "id" | "createdAt" | "updatedAt">): User => {
    const id = `user_${Date.now()}`
    const now = new Date().toISOString()

    const newUser: User = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now,
    }

    db.users.set(id, newUser)
    return { ...newUser }
  },

  update: (id: string, userData: Partial<User>): User | undefined => {
    const user = db.users.get(id)
    if (!user) return undefined

    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date().toISOString(),
    }

    db.users.set(id, updatedUser)
    return { ...updatedUser }
  },
}

// Address operations
export const addressDB = {
  findByUserId: (userId: string): Address[] => {
    const addresses = db.addresses.get(userId) || []
    return [...addresses]
  },

  create: (addressData: Omit<Address, "isDefault"> & { isDefault?: boolean }): Address => {
    const userId = addressData.userId
    const addresses = db.addresses.get(userId) || []

    // If this is the first address, make it default
    const isDefault = addressData.isDefault !== undefined ? addressData.isDefault : addresses.length === 0

    const newAddress: Address = {
      ...addressData,
      isDefault,
    }

    // If this address is default, make all others non-default
    if (isDefault) {
      addresses.forEach((addr) => (addr.isDefault = false))
    }

    addresses.push(newAddress)
    db.addresses.set(userId, addresses)

    return { ...newAddress }
  },

  update: (userId: string, addressData: Partial<Address>): Address | undefined => {
    const addresses = db.addresses.get(userId) || []
    const index = addresses.findIndex((addr) => addr.street === addressData.street && addr.city === addressData.city)

    if (index === -1) return undefined

    const updatedAddress: Address = {
      ...addresses[index],
      ...addressData,
    }

    // If this address is being set as default, make all others non-default
    if (updatedAddress.isDefault) {
      addresses.forEach((addr) => (addr.isDefault = false))
    }

    addresses[index] = updatedAddress
    db.addresses.set(userId, addresses)

    return { ...updatedAddress }
  },
}

// Preferences operations
export const preferencesDB = {
  findByUserId: (userId: string): Preferences | undefined => {
    const preferences = db.preferences.get(userId)
    return preferences ? { ...preferences } : undefined
  },

  create: (preferencesData: Preferences): Preferences => {
    db.preferences.set(preferencesData.userId, preferencesData)
    return { ...preferencesData }
  },

  update: (userId: string, preferencesData: Partial<Preferences>): Preferences | undefined => {
    const preferences = db.preferences.get(userId)
    if (!preferences) return undefined

    const updatedPreferences: Preferences = {
      ...preferences,
      ...preferencesData,
    }

    db.preferences.set(userId, updatedPreferences)
    return { ...updatedPreferences }
  },
}

// Payment operations
export const paymentDB = {
  findByUserId: (userId: string): Payment[] => {
    const payments = db.payments.get(userId) || []
    return [...payments]
  },

  create: (paymentData: Omit<Payment, "isDefault"> & { isDefault?: boolean }): Payment => {
    const userId = paymentData.userId
    const payments = db.payments.get(userId) || []

    // If this is the first payment method, make it default
    const isDefault = paymentData.isDefault !== undefined ? paymentData.isDefault : payments.length === 0

    const newPayment: Payment = {
      ...paymentData,
      isDefault,
    }

    // If this payment is default, make all others non-default
    if (isDefault) {
      payments.forEach((payment) => (payment.isDefault = false))
    }

    payments.push(newPayment)
    db.payments.set(userId, payments)

    return { ...newPayment }
  },

  update: (userId: string, paymentData: Partial<Payment>): Payment | undefined => {
    const payments = db.payments.get(userId) || []
    const index = payments.findIndex((payment) => payment.method === paymentData.method)

    if (index === -1) return undefined

    const updatedPayment: Payment = {
      ...payments[index],
      ...paymentData,
    }

    // If this payment is being set as default, make all others non-default
    if (updatedPayment.isDefault) {
      payments.forEach((payment) => (payment.isDefault = false))
    }

    payments[index] = updatedPayment
    db.payments.set(userId, payments)

    return { ...updatedPayment }
  },
}

// Order operations
export const orderDB = {
  findByUserId: (userId: string): Order[] => {
    const orders = db.orders.get(userId) || []
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  findById: (id: string): Order | undefined => {
    for (const orders of db.orders.values()) {
      const order = orders.find((o) => o.id === id)
      if (order) return { ...order }
    }
    return undefined
  },

  create: (orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Order => {
    const id = `ORD-${Date.now().toString().slice(-5)}`
    const now = new Date().toISOString()

    const newOrder: Order = {
      ...orderData,
      id,
      createdAt: now,
      updatedAt: now,
    }

    const userOrders = db.orders.get(orderData.userId) || []
    userOrders.push(newOrder)
    db.orders.set(orderData.userId, userOrders)

    return { ...newOrder }
  },

  update: (id: string, orderData: Partial<Order>): Order | undefined => {
    for (const [userId, orders] of db.orders.entries()) {
      const index = orders.findIndex((o) => o.id === id)
      if (index !== -1) {
        const updatedOrder: Order = {
          ...orders[index],
          ...orderData,
          updatedAt: new Date().toISOString(),
        }

        orders[index] = updatedOrder
        db.orders.set(userId, orders)

        return { ...updatedOrder }
      }
    }
    return undefined
  },
}
