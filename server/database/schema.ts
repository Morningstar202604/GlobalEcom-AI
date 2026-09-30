/* eslint-disable */
/** auto generated, do not edit */
import { sql } from 'drizzle-orm';
import { boolean, foreignKey, index, integer, jsonb, numeric, pgTable, text, uniqueIndex, uuid, varchar, customType } from "drizzle-orm/pg-core"

export const customTimestamptz = customType<{
  data: Date;
  driverData: string;
  config: { precision?: number };
}>({
  dataType(config) {
    const precision = typeof config?.precision !== 'undefined'
      ? ` (${config.precision})`
      : '';
    return `timestamptz${precision}`;
  },
  toDriver(value: Date | string | number) {
    if (value == null) return value as any;
    if (typeof value === 'number') return new Date(value).toISOString();
    if (typeof value === 'string') return value;
    if (value instanceof Date) return value.toISOString();
    throw new Error('Invalid timestamp value');
  },
  fromDriver(value: string | Date): Date {
    if (value instanceof Date) return value;
    return new Date(value);
  },
});

export const userProfile = customType<{
  data: string;
  driverData: string;
}>({
  dataType() {
    return 'user_profile';
  },
  toDriver(value: string) {
    return sql`ROW(${value})::user_profile`;
  },
  fromDriver(value: string) {
    const [userId] = value.slice(1, -1).split(',');
    return userId.trim();
  },
});

export type FileAttachment = {
  bucket_id: string;
  file_path: string;
};

export const fileAttachment = customType<{
  data: FileAttachment;
  driverData: string;
}>({
  dataType() {
    return 'file_attachment';
  },
  toDriver(value: FileAttachment) {
    return sql`ROW(${value.bucket_id},${value.file_path})::file_attachment`;
  },
  fromDriver(value: string): FileAttachment {
    const [bucketId, filePath] = value.slice(1, -1).split(',');
    return { bucket_id: bucketId.trim(), file_path: filePath.trim() };
  },
});

export function escapeLiteral(str: string): string {
  return "'" + str.replace(/'/g, "''") + "'";
}

export const userProfileArray = customType<{
  data: string[];
  driverData: string;
}>({
  dataType() {
    return 'user_profile[]';
  },
  toDriver(value: string[]) {
    if (!value || value.length === 0) {
      return sql`'{}'::user_profile[]`;
    }
    const elements = value.map(id => `ROW(${escapeLiteral(id)})::user_profile`).join(',');
    return sql.raw(`ARRAY[${elements}]::user_profile[]`);
  },
  fromDriver(value: string): string[] {
    if (!value || value === '{}') return [];
    const inner = value.slice(1, -1);
    const matches = inner.match(/\([^)]*\)/g) || [];
    return matches.map(m => m.slice(1, -1).split(',')[0].trim());
  },
});

export const fileAttachmentArray = customType<{
  data: FileAttachment[];
  driverData: string;
}>({
  dataType() {
    return 'file_attachment[]';
  },
  toDriver(value: FileAttachment[]) {
    if (!value || value.length === 0) {
      return sql`'{}'::file_attachment[]`;
    }
    const elements = value.map(f =>
      `ROW(${escapeLiteral(f.bucket_id)},${escapeLiteral(f.file_path)})::file_attachment`
    ).join(',');
    return sql.raw(`ARRAY[${elements}]::file_attachment[]`);
  },
  fromDriver(value: string): FileAttachment[] {
    if (!value || value === '{}') return [];
    const inner = value.slice(1, -1);
    const matches = inner.match(/\([^)]*\)/g) || [];
    return matches.map(m => {
      const [bucketId, filePath] = m.slice(1, -1).split(',');
      return { bucket_id: bucketId.trim(), file_path: filePath.trim() };
    });
  },
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorUserId: uuid("actor_user_id"),
  actorRole: varchar("actor_role", { length: 20 }),
  action: varchar("action", { length: 50 }).notNull(),
  targetType: varchar("target_type", { length: 50 }),
  targetId: varchar("target_id", { length: 100 }),
  beforeValue: jsonb("before_value"),
  afterValue: jsonb("after_value"),
  ip: varchar("ip", { length: 45 }),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_audit_logs_action").on(table.action),
  index("idx_audit_logs_target").on(table.targetType, table.targetId),
  index("idx_audit_logs_actor").on(table.actorUserId),
  index("idx_audit_logs_created_at").on(table.createdAt),
]);

export const cartRecoveryCodes = pgTable("cart_recovery_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  sessionId: varchar("session_id", { length: 100 }).notNull(),
  used: boolean("used").notNull().default(false),
  expiresAt: customTimestamptz("expires_at", { precision: 3 }).notNull(),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("cart_recovery_codes_code_key").on(table.code),
  index("idx_cart_recovery_codes_code").on(table.code),
  index("idx_cart_recovery_codes_session").on(table.sessionId),
]);

export const aiUsageLog = pgTable("ai_usage_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  agent: varchar("agent", { length: 50 }).notNull(),
  model: varchar("model", { length: 100 }),
  inputTokens: integer("input_tokens").default(0),
  outputTokens: integer("output_tokens").default(0),
  durationMs: integer("duration_ms").notNull().default(0),
  success: boolean("success").notNull().default(true),
  errorMessage: text("error_message"),
  userId: uuid("user_id"),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Creator (auto-filled, do not modify)
  createdBy: userProfile("_created_by").default(sql`CASE
    WHEN (current_setting('app.user_id'::text, true) = ''::text) THEN NULL`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Updater (auto-filled, do not modify)
  updatedBy: userProfile("_updated_by").default(sql`CASE
    WHEN (current_setting('app.user_id'::text, true) = ''::text) THEN NULL`),
}, (table) => [
  index("idx_ai_usage_log_agent").on(table.agent),
  index("idx_ai_usage_log_user_id").on(table.userId),
  index("idx_ai_usage_log_created_at").on(table.createdAt),
  index("idx_ai_usage_log_success").on(table.success),
]);

export const productEmbeddings = pgTable("product_embeddings", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull(),
  embedding: text("embedding"),
  language: varchar("language", { length: 10 }).notNull().default('en'),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_product_embeddings_product").on(table.productId),
  index("idx_product_embeddings_language").on(table.language),
  index("product_embeddings_hnsw_idx").using("hnsw", table.embedding),
  foreignKey({
    columns: [table.productId],
    foreignColumns: [products.id],
    name: "product_embeddings_product_id_fkey",
  }).onDelete("cascade"),
]);

export const logistics = pgTable("logistics", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull(),
  carrier: varchar("carrier", { length: 50 }),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  status: varchar("status", { length: 20 }).notNull().default('pending'),
  rawData: jsonb("raw_data"),
  updatedAt: customTimestamptz("updated_at", { precision: 3 }),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_logistics_order_id").on(table.orderId),
  index("idx_logistics_tracking_number").on(table.trackingNumber),
]);

export const coupons = pgTable("coupons", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  type: varchar("type", { length: 20 }).notNull().default('percent'),
  value: numeric("value").notNull().default('0'),
  minOrderAmount: numeric("min_order_amount").notNull().default('0'),
  usageLimit: integer("usage_limit").notNull().default(1),
  usedCount: integer("used_count").notNull().default(0),
  expiresAt: customTimestamptz("expires_at", { precision: 3 }),
  isActive: boolean("is_active").notNull().default(true),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("coupons_code_key").on(table.code),
  index("idx_coupons_code").on(table.code),
  index("idx_coupons_is_active").on(table.isActive),
]);

export const favorites = pgTable("favorites", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  productId: uuid("product_id").notNull(),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("favorites_user_id_product_id_key").on(table.userId, table.productId),
  index("idx_favorites_user_id").on(table.userId),
  index("idx_favorites_product_id").on(table.productId),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [appUsers.id],
    name: "favorites_user_id_fkey",
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.productId],
    foreignColumns: [products.id],
    name: "favorites_product_id_fkey",
  }).onDelete("cascade"),
]);

export const productReviews = pgTable("product_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull(),
  userId: uuid("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("product_reviews_product_id_user_id_key").on(table.productId, table.userId),
  index("idx_reviews_product_id").on(table.productId),
  index("idx_reviews_user_id").on(table.userId),
  foreignKey({
    columns: [table.productId],
    foreignColumns: [products.id],
    name: "product_reviews_product_id_fkey",
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [appUsers.id],
    name: "product_reviews_user_id_fkey",
  }).onDelete("cascade"),
]);

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull(),
  provider: varchar("provider", { length: 20 }).notNull().default('demo'),
  amount: numeric("amount").notNull().default('0'),
  currency: varchar("currency", { length: 10 }).notNull().default('USD'),
  status: varchar("status", { length: 20 }).notNull().default('pending'),
  transactionId: varchar("transaction_id", { length: 255 }),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_payments_order_id").on(table.orderId),
  index("idx_payments_status").on(table.status),
  index("idx_payments_provider").on(table.provider),
  foreignKey({
    columns: [table.orderId],
    foreignColumns: [orders.id],
    name: "payments_order_id_fkey",
  }).onDelete("cascade"),
]);

export const appUsers = pgTable("app_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default('buyer'),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Creator (auto-filled, do not modify)
  createdBy: userProfile("_created_by").default(sql`CASE
    WHEN (current_setting('app.user_id'::text, true) = ''::text) THEN NULL`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Updater (auto-filled, do not modify)
  updatedBy: userProfile("_updated_by").default(sql`CASE
    WHEN (current_setting('app.user_id'::text, true) = ''::text) THEN NULL`),
}, (table) => [
  uniqueIndex("app_users_email_key").on(table.email),
  index("idx_app_users_email").on(table.email),
  index("idx_app_users_role").on(table.role),
]);

export const shopSettings = pgTable("shop_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  settingKey: varchar("setting_key", { length: 100 }).notNull().unique(),
  settingValue: text("setting_value"),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("shop_settings_setting_key_key").on(table.settingKey),
]);

export const aiReports = pgTable("ai_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportType: varchar("report_type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  status: varchar("status", { length: 20 }).default('completed'),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Creator (auto-filled, do not modify)
  createdBy: userProfile("_created_by").default(sql`CASE
    WHEN (current_setting('app.user_id'::text, true) = ''::text) THEN NULL`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_ai_reports_type").on(table.reportType),
]);

export const inquiryMessages = pgTable("inquiry_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: varchar("session_id", { length: 100 }).notNull(),
  role: varchar("role", { length: 20 }).notNull(),
  content: text("content").notNull(),
  isAi: boolean("is_ai").default(false),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_inquiry_messages_session").on(table.sessionId),
]);

export const inquirySessions = pgTable("inquiry_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: varchar("session_id", { length: 100 }).notNull().unique(),
  buyerName: varchar("buyer_name", { length: 100 }).default('访客'),
  status: varchar("status", { length: 20 }).default('active'),
  lastMessage: text("last_message"),
  lastMessageAt: customTimestamptz("last_message_at", { precision: 3 }),
  assignedTo: userProfile("assigned_to"),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("inquiry_sessions_session_id_key").on(table.sessionId),
  index("idx_inquiry_sessions_status").on(table.status),
]);

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: varchar("session_id", { length: 100 }).notNull(),
  productId: uuid("product_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  userId: uuid("user_id"),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  uniqueIndex("cart_items_session_id_product_id_key").on(table.sessionId, table.productId),
  index("idx_cart_items_session").on(table.sessionId),
  index("idx_cart_items_user_id").on(table.userId),
  uniqueIndex("idx_cart_items_user_product").on(table.userId, table.productId),
  foreignKey({
    columns: [table.productId],
    foreignColumns: [products.id],
    name: "cart_items_product_id_fkey",
  }).onDelete("cascade"),
]);

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull(),
  productId: uuid("product_id"),
  productTitle: varchar("product_title", { length: 255 }).notNull(),
  productImage: varchar("product_image", { length: 500 }),
  price: numeric("price").notNull(),
  quantity: integer("quantity").notNull().default(1),
  subtotal: numeric("subtotal").notNull(),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index("idx_order_items_order_id").on(table.orderId),
  index("idx_order_items_order_id_product").on(table.orderId, table.productId),
  foreignKey({
    columns: [table.orderId],
    foreignColumns: [orders.id],
    name: "order_items_order_id_fkey",
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.productId],
    foreignColumns: [products.id],
    name: "order_items_product_id_fkey",
  }),
]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNo: varchar("order_no", { length: 32 }).notNull().unique(),
  buyerName: varchar("buyer_name", { length: 100 }).notNull(),
  buyerEmail: varchar("buyer_email", { length: 255 }),
  buyerPhone: varchar("buyer_phone", { length: 50 }),
  shippingAddress: text("shipping_address").notNull(),
  shippingCity: varchar("shipping_city", { length: 100 }).notNull(),
  shippingZip: varchar("shipping_zip", { length: 20 }),
  shippingCountry: varchar("shipping_country", { length: 100 }).notNull(),
  totalAmount: numeric("total_amount").notNull().default('0'),
  status: varchar("status", { length: 20 }).notNull().default('pending_payment'),
  paymentMethod: varchar("payment_method", { length: 50 }).default('demo'),
  paidAt: customTimestamptz("paid_at", { precision: 3 }),
  shippedAt: customTimestamptz("shipped_at", { precision: 3 }),
  deliveredAt: customTimestamptz("delivered_at", { precision: 3 }),
  trackingNo: varchar("tracking_no", { length: 100 }),
  remark: text("remark"),
  sessionId: varchar("session_id", { length: 100 }),
  userId: uuid("user_id"),
  couponId: uuid("coupon_id"),
  discountAmount: numeric("discount_amount").notNull().default('0'),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Creator (auto-filled, do not modify)
  createdBy: userProfile("_created_by").default(sql`CASE
    WHEN (current_setting('app.user_id'::text, true) = ''::text) THEN NULL`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Updater (auto-filled, do not modify)
  updatedBy: userProfile("_updated_by").default(sql`CASE
    WHEN (current_setting('app.user_id'::text, true) = ''::text) THEN NULL`),
}, (table) => [
  uniqueIndex("orders_order_no_key").on(table.orderNo),
  index("idx_orders_status").on(table.status),
  index("idx_orders_created_at").on(table.createdAt),
  index("idx_orders_user_id").on(table.userId),
  index("idx_orders_created_at_status").on(table.createdAt, table.status),
  index("idx_orders_order_no_trgm").using("gin", table.orderNo),
  index("idx_orders_buyer_name_trgm").using("gin", table.buyerName),
  foreignKey({
    columns: [table.couponId],
    foreignColumns: [coupons.id],
    name: "orders_coupon_id_fkey",
  }),
]);

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  sku: varchar("sku", { length: 50 }).unique(),
  titleZh: varchar("title_zh", { length: 255 }).notNull(),
  titleEn: varchar("title_en", { length: 255 }).notNull(),
  descZh: text("desc_zh"),
  descEn: text("desc_en"),
  longDescZh: text("long_desc_zh"),
  longDescEn: text("long_desc_en"),
  categoryId: uuid("category_id"),
  price: numeric("price").notNull().default('0'),
  originalPrice: numeric("original_price").default('0'),
  stock: integer("stock").notNull().default(0),
  soldCount: integer("sold_count").notNull().default(0),
  status: varchar("status", { length: 20 }).notNull().default('draft'),
  coverImage: varchar("cover_image", { length: 500 }),
  images: text("images").array().default([]),
  /**
   * @type { [key: string]: string }
   */
  specs: jsonb("specs").default('{}'),
  seoKeywordsZh: varchar("seo_keywords_zh", { length: 500 }),
  seoKeywordsEn: varchar("seo_keywords_en", { length: 500 }),
  bulletPointsZh: text("bullet_points_zh").array().default([]),
  bulletPointsEn: text("bullet_points_en").array().default([]),
  weight: numeric("weight").default('0'),
  titleEs: varchar("title_es", { length: 255 }),
  titlePt: varchar("title_pt", { length: 255 }),
  descEs: text("desc_es"),
  descPt: text("desc_pt"),
  longDescEs: text("long_desc_es"),
  longDescPt: text("long_desc_pt"),
  bulletPointsEs: text("bullet_points_es").array().default([]),
  bulletPointsPt: text("bullet_points_pt").array().default([]),
  seoKeywordsEs: varchar("seo_keywords_es", { length: 500 }),
  seoKeywordsPt: varchar("seo_keywords_pt", { length: 500 }),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Creator (auto-filled, do not modify)
  createdBy: userProfile("_created_by").default(sql`CASE
    WHEN (current_setting('app.user_id'::text, true) = ''::text) THEN NULL`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Updater (auto-filled, do not modify)
  updatedBy: userProfile("_updated_by").default(sql`CASE
    WHEN (current_setting('app.user_id'::text, true) = ''::text) THEN NULL`),
}, (table) => [
  uniqueIndex("products_sku_key").on(table.sku),
  index("idx_products_category").on(table.categoryId),
  index("idx_products_status").on(table.status),
  index("idx_products_sold_count").on(table.soldCount),
  foreignKey({
    columns: [table.categoryId],
    foreignColumns: [categories.id],
    name: "products_category_id_fkey",
  }),
]);

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  nameZh: varchar("name_zh", { length: 100 }).notNull(),
  nameEn: varchar("name_en", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  icon: varchar("icon", { length: 255 }),
  sortOrder: integer("sort_order").default(0),
  // System field: Creation time (auto-filled, do not modify)
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Creator (auto-filled, do not modify)
  createdBy: userProfile("_created_by").default(sql`CASE
    WHEN (current_setting('app.user_id'::text, true) = ''::text) THEN NULL`),
  // System field: Update time (auto-filled, do not modify)
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  // System field: Updater (auto-filled, do not modify)
  updatedBy: userProfile("_updated_by").default(sql`CASE
    WHEN (current_setting('app.user_id'::text, true) = ''::text) THEN NULL`),
}, (table) => [
  uniqueIndex("categories_slug_key").on(table.slug),
]);

// table aliases
export const aiReportsTable = aiReports;
export const aiUsageLogTable = aiUsageLog;
export const appUsersTable = appUsers;
export const auditLogsTable = auditLogs;
export const cartItemsTable = cartItems;
export const cartRecoveryCodesTable = cartRecoveryCodes;
export const categoriesTable = categories;
export const couponsTable = coupons;
export const favoritesTable = favorites;
export const inquiryMessagesTable = inquiryMessages;
export const inquirySessionsTable = inquirySessions;
export const logisticsTable = logistics;
export const orderItemsTable = orderItems;
export const ordersTable = orders;
export const paymentsTable = payments;
export const productEmbeddingsTable = productEmbeddings;
export const productReviewsTable = productReviews;
export const productsTable = products;
export const shopSettingsTable = shopSettings;
