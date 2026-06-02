CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"clerk_user_id" varchar(256) NOT NULL,
	"username" varchar(64) NOT NULL,
	"email" varchar(256) NOT NULL,
	"first_name" varchar(64) NOT NULL,
	"last_name" varchar(64),
	"created_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_user_id_unique" UNIQUE("clerk_user_id"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
