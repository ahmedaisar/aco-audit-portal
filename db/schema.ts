import { pgTable, text, timestamp, integer, jsonb, pgEnum, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const priorityEnum = pgEnum('priority', ['High', 'Medium', 'Low']);

export const changeRequests = pgTable('change_requests', {
  id: text('id').primaryKey(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  requestorName: text('requestor_name').notNull(),
  department: text('department').notNull(),
  emailId: text('email_id').notNull(),
  todayDate: text('today_date').notNull(),
  priority: priorityEnum('priority').notNull(),
  url: text('url').notNull(),
  pageName: text('page_name').notNull(),
  changeDescription: text('change_description').notNull(),
  desiredGoLiveDate: text('desired_go_live_date').notNull(),
});

export const changeRequestsRelations = relations(changeRequests, ({ many }) => ({
  files: many(files),
}));

export const files = pgTable('request_files', {
  id: uuid('id').primaryKey().defaultRandom(),
  requestId: text('request_id').references(() => changeRequests.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  size: integer('size').notNull(),
  type: text('type').notNull(),
  url: text('url').notNull(), // Vercel Blob URL
});

export const filesRelations = relations(files, ({ one }) => ({
  request: one(changeRequests, {
    fields: [files.requestId],
    references: [changeRequests.id],
  }),
}));

export const analytics = pgTable('analytics', {
  pageName: text('page_name').primaryKey(),
  views: integer('views').default(0).notNull(),
});
