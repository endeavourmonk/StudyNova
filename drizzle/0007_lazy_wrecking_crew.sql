CREATE TABLE "roadmaps" (
	"roadmap_id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"topic" varchar(256) NOT NULL,
	"steps_json" jsonb NOT NULL,
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "roadmaps" ADD CONSTRAINT "roadmaps_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "roadmaps_user_id_idx" ON "roadmaps" USING btree ("user_id");