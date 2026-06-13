-- Seed the catalog with the launch set of categories and frozen products.
--
-- Idempotent: re-running skips rows that already exist (matched on slug/name),
-- so it is safe to apply on every migration run. Amounts are seed values in the
-- store currency and can be edited freely from the admin panel.

INSERT INTO categories (name, slug, sort_order) VALUES
  ('Family Packs', 'family-packs', 1),
  ('Mains', 'mains', 2),
  ('Sides', 'sides', 3),
  ('Breakfast', 'breakfast', 4),
  ('Desserts', 'desserts', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products
  (name, slug, description, category_id, price, status, tags, image_url, image_alt, rating, popularity, created_at)
VALUES
  ('Vegetable Quinoa Freezer Bowl', 'harvest-quinoa',
   'Roasted root vegetables, kale, and maple-tahini dressing packed as a quick heat-and-serve meal.',
   (SELECT id FROM categories WHERE slug = 'mains'), 14.50, 'ACTIVE', ARRAY['Vegan', 'GF'],
   '/images/menu/harvest-bowl-img.png', 'Harvest quinoa bowl with avocado, chickpeas, greens, and roasted vegetables.',
   4.9, 98, '2026-01-12'),

  ('Lemon Salmon Meal Pack', 'wild-salmon',
   'Portioned salmon, rice, edamame, and citrus glaze frozen for an easy protein-rich dinner.',
   (SELECT id FROM categories WHERE slug = 'mains'), 18.00, 'ACTIVE', ARRAY['Organic', 'GF'],
   '/images/menu/wild-salmon-img.png', 'Wild salmon poke bowl with edamame and pickled vegetables.',
   4.7, 93, '2026-02-08'),

  ('Tomato Mozzarella Bake', 'heirloom-caprese',
   'A comforting freezer bake with tomatoes, mozzarella, herbs, and a balsamic-style finish.',
   (SELECT id FROM categories WHERE slug = 'sides'), 12.00, 'ACTIVE', ARRAY['GF', 'Organic'],
   '/images/menu/heirloom-img.png', 'Heirloom tomato caprese with fresh mozzarella and basil.',
   4.8, 86, '2025-11-18'),

  ('Herb Roasted Vegetable Pack', 'herb-sides',
   'Garden vegetables roasted with thyme and rosemary oil, frozen as a ready side.',
   (SELECT id FROM categories WHERE slug = 'sides'), 9.00, 'ACTIVE', ARRAY['Vegan', 'GF', 'Nut-Free'],
   '/images/menu/herb-roasted-sides-img.png', 'Roasted asparagus and carrots on a ceramic plate.',
   4.6, 81, '2025-10-14'),

  ('Mint Lemonade Concentrate', 'mint-sparkler',
   'Frozen hibiscus, mint, and citrus concentrate. Thaw, mix with water, and serve chilled.',
   (SELECT id FROM categories WHERE slug = 'sides'), 6.50, 'ACTIVE', ARRAY['Organic', 'Nut-Free'],
   '/images/menu/mint-sparkler-img.png', 'Ruby hibiscus mint sparkler in a tall glass.',
   4.9, 91, '2026-03-02'),

  ('Green Vegetable Breakfast Hash', 'green-goddess',
   'Greens, peas, and potatoes with a creamy herb sauce for a quick freezer breakfast.',
   (SELECT id FROM categories WHERE slug = 'breakfast'), 13.00, 'ACTIVE', ARRAY['Vegan', 'GF'],
   '/images/menu/green-salad-img.png', 'Green goddess salad plated on a sage ceramic dish.',
   4.5, 78, '2025-12-09'),

  ('Mediterranean Family Grain Tray', 'mediterranean-grain',
   'Farro, chickpeas, vegetables, olives, herbs, and lemon sauce in a family-size freezer tray.',
   (SELECT id FROM categories WHERE slug = 'family-packs'), 15.50, 'ACTIVE', ARRAY['Vegan', 'Nut-Free'],
   '/images/menu/harvest-bowl-img.png', 'Mediterranean grain bowl with chickpeas, cucumber, and fresh herbs.',
   4.8, 96, '2026-04-20'),

  ('Teriyaki Chicken Freezer Bowl', 'teriyaki-chicken',
   'Glazed chicken, jasmine rice, edamame, and sesame vegetables portioned for fast reheating.',
   (SELECT id FROM categories WHERE slug = 'mains'), 17.00, 'ACTIVE', ARRAY['GF'],
   '/images/menu/wild-salmon-img.png', 'Teriyaki chicken bowl with rice and vegetables.',
   4.7, 89, '2026-01-28'),

  ('Rustic Slow-Roasted Beef Tray', 'slow-roasted-beef',
   'Tender slow-roasted beef with carrots, herbs, and pan jus, frozen in a family tray.',
   (SELECT id FROM categories WHERE slug = 'family-packs'), 24.00, 'ACTIVE', ARRAY['GF', 'Nut-Free'],
   '/images/home-page/beaf-steak-img.png', 'Slow-roasted beef served with carrots and mashed potatoes.',
   4.9, 99, '2025-09-22'),

  ('Lemon Herb Chicken Tray', 'lemon-herb-chicken',
   'Roasted chicken with lemon, garden herbs, and vegetables, cooked in batches and frozen fresh.',
   (SELECT id FROM categories WHERE slug = 'family-packs'), 21.00, 'ACTIVE', ARRAY['GF', 'Organic', 'Nut-Free'],
   '/images/home-page/beaf-steak-img.png', 'Lemon herb roasted chicken with vegetables.',
   4.8, 94, '2026-05-11'),

  ('Wild Mushroom Risotto Pack', 'mushroom-risotto',
   'Creamy arborio rice, mushrooms, parmesan, and herbs packed for a cozy freezer dinner.',
   (SELECT id FROM categories WHERE slug = 'mains'), 19.00, 'ACTIVE', ARRAY['GF', 'Organic', 'Nut-Free'],
   '/images/menu/harvest-bowl-img.png', 'Creamy wild mushroom risotto finished with herbs.',
   4.7, 88, '2026-03-26'),

  ('Roasted Vegetable Lasagna Tray', 'vegetable-lasagna',
   'Layers of roasted vegetables, tomato sauce, and dairy-free bechamel in a freezer-ready tray.',
   (SELECT id FROM categories WHERE slug = 'family-packs'), 18.50, 'ACTIVE', ARRAY['Vegan', 'Nut-Free'],
   '/images/menu/heirloom-img.png', 'Roasted vegetable lasagna with tomato sauce and fresh herbs.',
   4.6, 82, '2026-02-19'),

  ('Freezer Sourdough Slices', 'artisan-sourdough',
   'Naturally leavened bread, sliced and packed so you can toast only what you need.',
   (SELECT id FROM categories WHERE slug = 'sides'), 8.00, 'ACTIVE', ARRAY['Vegan', 'Nut-Free'],
   '/images/home-page/bread-img.png', 'Artisan sourdough bread on a rustic surface.',
   4.8, 90, '2025-08-15'),

  ('Smoky Sweet Potato Wedges', 'sweet-potato-wedges',
   'Oven-roasted sweet potatoes with smoked paprika and herb dip, frozen for quick sides.',
   (SELECT id FROM categories WHERE slug = 'sides'), 9.50, 'ACTIVE', ARRAY['Vegan', 'GF', 'Nut-Free'],
   '/images/menu/herb-roasted-sides-img.png', 'Smoky roasted sweet potato wedges with herb dip.',
   4.6, 84, '2026-04-04'),

  ('Citrus Ginger Freezer Cubes', 'citrus-ginger-cooler',
   'Frozen orange, lemon, and ginger cubes for quick coolers, teas, and mocktails.',
   (SELECT id FROM categories WHERE slug = 'sides'), 7.00, 'ACTIVE', ARRAY['Vegan', 'GF', 'Organic'],
   '/images/menu/mint-sparkler-img.png', 'Bright citrus ginger cooler served over ice.',
   4.7, 80, '2026-05-20'),

  ('Berry Breakfast Oat Cups', 'berry-kombucha',
   'Berry and oat cups frozen in single portions for quick breakfasts or snacks.',
   (SELECT id FROM categories WHERE slug = 'breakfast'), 7.50, 'ACTIVE', ARRAY['Vegan', 'GF', 'Organic'],
   '/images/menu/mint-sparkler-img.png', 'Wild berry kombucha with fresh berries and mint.',
   4.5, 75, '2026-03-14'),

  ('Frozen Dark Chocolate Torte', 'dark-chocolate-torte',
   'Rich flourless chocolate torte portioned for the freezer and ready after a short thaw.',
   (SELECT id FROM categories WHERE slug = 'desserts'), 10.00, 'ACTIVE', ARRAY['GF'],
   '/images/home-page/choco-strawberry-cake.png', 'Dark chocolate torte with fresh berries.',
   4.9, 97, '2026-02-14'),

  ('Berry Oat Freezer Crumble', 'berry-oat-crumble',
   'Berries beneath a crisp cinnamon oat topping, ready to bake from frozen.',
   (SELECT id FROM categories WHERE slug = 'desserts'), 9.00, 'ACTIVE', ARRAY['Vegan', 'Nut-Free'],
   '/images/home-page/choco-strawberry-cake.png', 'Warm berry oat crumble served in a small dish.',
   4.6, 79, '2026-05-30')
ON CONFLICT (slug) DO NOTHING;
