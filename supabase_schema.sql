create table submissions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp default now(),
  address text,
  city text,
  client_name text,
  client_phone text,
  client_email text,
  short_sides integer,
  long_sides integer,
  stories integer,
  roof_pitch integer,
  pre_gst numeric,
  price_with_gst numeric,
  commission numeric,
  rep_name text,
  docusign_envelope_id text
);
