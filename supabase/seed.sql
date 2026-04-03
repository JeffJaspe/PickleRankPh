-- Geographic codes are PSGC codes from https://psgc.cloud/api
-- Region codes: 10-digit PSGC codes (e.g. NCR = '1300000000')
-- Province codes: 10-digit PSGC codes (e.g. Cebu = '0722800000')
-- City codes: 10-digit PSGC codes (e.g. Quezon City = '1380600000')

insert into players (full_name, nickname, city_code, province_code, region_code, rating_points) values
  ('Juan dela Cruz','The Paddle King','1380600000','','1300000000',4850),
  ('Maria Santos','Smash Queen','0722801000','0722800000','0700000000',4620),
  ('Carlos Reyes','Cebu Cannonball','0722801000','0722800000','0700000000',4310),
  ('Ana Villanueva','La Flecha','1380400000','','1300000000',4100),
  ('Mark Ramos','Pampanga Flash','0354105000','0354100000','0300000000',3980),
  ('Jenny Ocampo','Soft Hands','0431202000','0431200000','0400000000',3870),
  ('Rico Bautista','The Wall','0421401000','0421400000','0400000000',3750),
  ('Diana Flores','Davao Dink Queen','1124300000','1124700000','1100000000',3600);

insert into tournaments (name, location, city_code, province_code, region_code, scope, start_date, end_date, status) values
  ('2025 PH National Pickleball Open','QC Sports Complex','1380600000','','1300000000','national','2025-06-15','2025-06-18','upcoming'),
  ('Visayas Regional Championship','Cebu Sports Center','0722801000','0722800000','0700000000','regional','2025-05-10','2025-05-12','completed');
