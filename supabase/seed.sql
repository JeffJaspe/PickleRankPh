insert into regions (id, name, code) values
  ('r01','Ilocos Region (Region I)','01'),('r02','Cagayan Valley (Region II)','02'),('r03','Central Luzon (Region III)','03'),
  ('r04a','CALABARZON (Region IV-A)','04A'),('r05','Bicol Region (Region V)','05'),('r06','Western Visayas (Region VI)','06'),
  ('r07','Central Visayas (Region VII)','07'),('r08','Eastern Visayas (Region VIII)','08'),('r09','Zamboanga Peninsula (Region IX)','09'),
  ('r10','Northern Mindanao (Region X)','10'),('r11','Davao Region (Region XI)','11'),('r12','SOCCSKSARGEN (Region XII)','12'),
  ('r13','NCR (Metro Manila)','13'),('r14','CAR','14'),('r15','BARMM','15'),('r16','Caraga (Region XIII)','16');
insert into provinces (id, region_id, name) values
  ('p01','r13','Metro Manila'),('p02','r04a','Cavite'),('p03','r04a','Laguna'),
  ('p04','r03','Pampanga'),('p05','r07','Cebu'),('p06','r11','Davao del Sur');
insert into cities (id, province_id, name) values
  ('c01','p01','Quezon City'),('c02','p01','Makati'),('c03','p01','Manila'),
  ('c04','p02','Bacoor'),('c05','p03','Santa Rosa'),('c06','p04','Angeles City'),
  ('c07','p05','Cebu City'),('c08','p06','Davao City');
insert into players (full_name, nickname, city_id, province_id, region_id, rating_points) values
  ('Juan dela Cruz','The Paddle King','c01','p01','r13',4850),
  ('Maria Santos','Smash Queen','c07','p05','r07',4620),
  ('Carlos Reyes','Cebu Cannonball','c07','p05','r07',4310),
  ('Ana Villanueva','La Flecha','c02','p01','r13',4100),
  ('Mark Ramos','Pampanga Flash','c06','p04','r03',3980),
  ('Jenny Ocampo','Soft Hands','c05','p03','r04a',3870),
  ('Rico Bautista','The Wall','c04','p02','r04a',3750),
  ('Diana Flores','Davao Dink Queen','c08','p06','r11',3600);
insert into tournaments (name, location, city_id, province_id, region_id, scope, start_date, end_date, status) values
  ('2025 PH National Pickleball Open','QC Sports Complex','c01','p01','r13','national','2025-06-15','2025-06-18','upcoming'),
  ('Visayas Regional Championship','Cebu Sports Center','c07','p05','r07','regional','2025-05-10','2025-05-12','completed');
