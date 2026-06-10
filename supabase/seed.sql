begin;

insert into public.users (id, name, email, password_hash, role, phone, profile_type, id_number, department, year_semester, designation)
values
  ('00000000-0000-4000-8000-000000000001', 'Admin User', 'admin@canteenly.com', crypt('admin123', gen_salt('bf')), 'admin', '9999999999', null, null, null, null, null),
  ('00000000-0000-4000-8000-000000000002', 'Student User', 'user@canteenly.com', crypt('user123', gen_salt('bf')), 'student', '9876543210', 'Student', '1MS21CS045', 'Computer Science', '3rd Year', null),
  ('00000000-0000-4000-8000-000000000003', 'Dr. Smitha Rao', 'smitha.rao@college.com', crypt('teacher123', gen_salt('bf')), 'student', '9876543211', 'Teacher', 'EMP-102', 'Electronics', null, 'Professor')
on conflict (email) do update set
  name = excluded.name, password_hash = excluded.password_hash, role = excluded.role, phone = excluded.phone;

insert into public.menu_items (id, name, description, category, price, image, meal_type, cuisine_style, diet_type, beverage_type, is_combo_offer)
values
  ('10000000-0000-4000-8000-000000000001', 'Masala Dosa', 'Crispy dosa filled with spiced potatoes.', 'Breakfast', 60, 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=800&auto=format&fit=crop', 'Breakfast', 'South Indian', 'Veg', 'None', false),
  ('10000000-0000-4000-8000-000000000002', 'Veg Thali', 'Rice, dal, vegetables, roti and salad.', 'Lunch', 110, 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=800&auto=format&fit=crop', 'Lunch', 'North Indian', 'Veg', 'None', true),
  ('10000000-0000-4000-8000-000000000003', 'Chicken Biryani', 'Aromatic basmati rice with spiced chicken.', 'Lunch', 150, 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=800&auto=format&fit=crop', 'Lunch', 'North Indian', 'Non-Veg', 'None', false),
  ('10000000-0000-4000-8000-000000000004', 'Samosa', 'Crispy pastry with a savory potato filling.', 'Snacks', 20, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop', 'Snacks', 'North Indian', 'Veg', 'None', false),
  ('10000000-0000-4000-8000-000000000005', 'Filter Coffee', 'Freshly brewed South Indian filter coffee.', 'Beverages', 25, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop', 'Breakfast', 'South Indian', 'Veg', 'Coffee', false),
  ('10000000-0000-4000-8000-000000000006', 'Egg Fried Rice', 'Wok-tossed rice with egg and vegetables.', 'Dinner', 95, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800&auto=format&fit=crop', 'Dinner', 'Chinese', 'Egg', 'None', false)
on conflict (id) do update set name = excluded.name, price = excluded.price, available = true;

insert into public.inventory (menu_item_id, item_name, quantity, unit, threshold)
select id, name, case name when 'Samosa' then 100 else 50 end, 'pcs', 10
from public.menu_items
on conflict (item_name) do update set menu_item_id = excluded.menu_item_id, quantity = excluded.quantity;

insert into public.staff (staff_id, name, role, phone, email, shift, attendance_status, orders_handled, last_active)
values
  ('STF-001', 'John Doe', 'Cook', '9876500001', 'john@canteenly.com', 'Morning (6AM - 2PM)', 'Present', 86, 'Now'),
  ('STF-002', 'Jane Smith', 'Cashier', '9876500002', 'jane@canteenly.com', 'Morning (6AM - 2PM)', 'Present', 112, 'Now'),
  ('STF-003', 'Mike Johnson', 'Server', '9876500003', 'mike@canteenly.com', 'Afternoon (2PM - 10PM)', 'Late', 70, '10 mins ago')
on conflict (staff_id) do update set name = excluded.name, role = excluded.role, shift = excluded.shift;

commit;
