create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'student' check (role in ('student', 'admin')),
  phone text not null,
  profile_type text check (profile_type in ('Student', 'Teacher')),
  id_number text unique,
  department text,
  year_semester text,
  designation text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  category text not null,
  price numeric(10,2) not null check (price >= 0),
  image text not null default 'default.jpg',
  available boolean not null default true,
  meal_type text,
  cuisine_style text,
  diet_type text not null default 'Veg' check (diet_type in ('Veg', 'Non-Veg', 'Egg')),
  beverage_type text not null default 'None',
  is_combo_offer boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid references public.menu_items(id) on delete set null,
  item_name text not null unique,
  quantity numeric(12,2) not null default 0,
  unit text not null,
  threshold numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  total_price numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  unique (cart_id, menu_item_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete restrict,
  total_amount numeric(10,2) not null check (total_amount >= 0),
  token_number integer not null unique,
  status text not null default 'Pending' check (status in ('Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled')),
  payment_status text not null default 'Pending' check (payment_status in ('Pending', 'Paid', 'Failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  quantity integer not null check (quantity > 0),
  price numeric(10,2) not null check (price >= 0)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  amount numeric(10,2) not null check (amount >= 0),
  payment_method text not null,
  payment_status text not null default 'Pending',
  transaction_id text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  staff_id text unique,
  name text not null,
  role text not null check (role in ('Cook', 'Helper', 'Cashier', 'Server', 'Cleaner')),
  phone text,
  email text,
  shift text not null default 'Morning (6AM - 2PM)' check (shift in ('Morning (6AM - 2PM)', 'Afternoon (2PM - 10PM)', 'Night (10PM - 6AM)')),
  joining_date date not null default current_date,
  is_active boolean not null default true,
  attendance_status text not null default 'Absent' check (attendance_status in ('Present', 'Absent', 'Late')),
  orders_handled integer not null default 0,
  last_active text not null default 'Never',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_user_created on public.orders(user_id, created_at desc);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_cart_items_cart on public.cart_items(cart_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare table_name text;
begin
  foreach table_name in array array['users','menu_items','inventory','carts','orders','staff']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', table_name);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name);
  end loop;
end $$;

create or replace function public.place_order_from_cart(p_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cart carts%rowtype;
  v_order_id uuid;
  v_token integer;
begin
  select * into v_cart from carts where user_id = p_user_id for update;
  if v_cart.id is null or not exists (select 1 from cart_items where cart_id = v_cart.id) then
    raise exception 'Cart is empty';
  end if;

  loop
    v_token := floor(random() * 9000 + 1000)::integer;
    exit when not exists (select 1 from orders where token_number = v_token);
  end loop;

  insert into orders(user_id, total_amount, token_number)
  values (p_user_id, v_cart.total_price, v_token)
  returning id into v_order_id;

  insert into order_items(order_id, menu_item_id, quantity, price)
  select v_order_id, ci.menu_item_id, ci.quantity, mi.price
  from cart_items ci join menu_items mi on mi.id = ci.menu_item_id
  where ci.cart_id = v_cart.id;

  update inventory i
  set quantity = greatest(0, i.quantity - ci.quantity)
  from cart_items ci
  where ci.cart_id = v_cart.id and i.menu_item_id = ci.menu_item_id;

  delete from carts where id = v_cart.id;
  return v_order_id;
end;
$$;

create or replace function public.set_order_status(p_order_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_status text;
begin
  if p_status not in ('Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled') then
    raise exception 'Invalid order status';
  end if;
  select status into v_old_status from orders where id = p_order_id for update;
  if v_old_status is null then raise exception 'Order not found'; end if;

  if p_status = 'Cancelled' and v_old_status <> 'Cancelled' then
    update inventory i
    set quantity = i.quantity + oi.quantity
    from order_items oi
    where oi.order_id = p_order_id and i.menu_item_id = oi.menu_item_id;
  end if;
  update orders set status = p_status where id = p_order_id;
end;
$$;

create or replace function public.get_dashboard_stats()
returns jsonb
language sql
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'todayRevenue', coalesce((select sum(total_amount) from orders where created_at >= current_date and status <> 'Cancelled'), 0),
    'totalOrders', (select count(*) from orders),
    'activeUsers', (select count(*) from users where is_active),
    'pendingOrders', (select count(*) from orders where status = 'Pending'),
    'ordersInQueue', (select count(*) from orders where status in ('Preparing', 'Ready')),
    'totalItemsSold', coalesce((select sum(quantity) from order_items), 0),
    'mostSoldItems', coalesce((
      select jsonb_agg(x) from (
        select mi.id as "_id", mi.name, sum(oi.quantity) as count
        from order_items oi join menu_items mi on mi.id = oi.menu_item_id
        group by mi.id, mi.name order by count desc limit 5
      ) x
    ), '[]'::jsonb)
  );
$$;

revoke execute on function public.place_order_from_cart(uuid) from public, anon, authenticated;
revoke execute on function public.set_order_status(uuid, text) from public, anon, authenticated;
revoke execute on function public.get_dashboard_stats() from public, anon, authenticated;
grant execute on function public.place_order_from_cart(uuid) to service_role;
grant execute on function public.set_order_status(uuid, text) to service_role;
grant execute on function public.get_dashboard_stats() to service_role;

alter table public.users enable row level security;
alter table public.menu_items enable row level security;
alter table public.inventory enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.feedback enable row level security;
alter table public.staff enable row level security;

drop policy if exists "Public menu read" on public.menu_items;
create policy "Public menu read" on public.menu_items for select using (true);
