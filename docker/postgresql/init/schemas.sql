CREATE ROLE "aio_user" with PASSWORD "aio_user" LOGIN;
CREATE SCHEMA IF NOT EXISTS "user";
GRANT USAGE ON SCHEMA "user" TO "aio_user";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA "user" TO "aio_user";
ALTER DEFAULT PRIVILEGES IN SCHEMA "user" GRANT ALL PRIVILEGES ON TABLES TO "aio_user";