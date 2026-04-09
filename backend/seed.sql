CREATE TABLE IF NOT EXISTS users(
    id uuid default gen_random_uuid() primary key,
    full_name varchar(100),
    occupation varchar(50),
    badge_pro boolean default false,
    user_image varchar,
    email varchar(50) unique not null,
    password_hash varchar,
    created_at timestamp with time zone default current_timestamp
);

CREATE TABLE IF NOT EXISTS links(
    id serial primary key,
    user_id uuid not null,
    original_url varchar,
    slug varchar(50) unique,
    created_at timestamp with time zone default current_timestamp,
    is_deleted boolean not null default false,
    constraint fk_users foreign key (user_id) references users(id),
    constraint uq_links_user_original unique (user_id, original_url)
);
