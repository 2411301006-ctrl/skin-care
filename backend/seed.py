import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from passlib.context import CryptContext

MONGODB_URI = "mongodb://localhost:27017"
DB_NAME = "glow_beauty"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def seed():
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(MONGODB_URI)
    db = client[DB_NAME]

    print("Clearing old collections...")
    await db.categories.delete_many({})
    await db.brands.delete_many({})
    await db.products.delete_many({})
    await db.promo_codes.delete_many({})
    await db.users.delete_many({})
    await db.reviews.delete_many({})

    # 1. Categories
    categories_data = [
        {"name": "Skincare", "slug": "skincare"},
        {"name": "Makeup", "slug": "makeup"},
        {"name": "Fragrance", "slug": "fragrance"},
        {"name": "Wellness", "slug": "wellness"},
        {"name": "New Arrivals", "slug": "new-arrivals"}
    ]
    cat_docs = await db.categories.insert_many(categories_data)
    cat_map = {c["slug"]: str(id_) for c, id_ in zip(categories_data, cat_docs.inserted_ids)}
    print(f"Seeded {len(categories_data)} categories.")

    # 2. Brands
    brands_data = [
        {"name": "L'Essence", "slug": "lessence"},
        {"name": "Nuit Noir", "slug": "nuit-noir"},
        {"name": "Aurelia", "slug": "aurelia"},
        {"name": "Lumière", "slug": "lumiere"}
    ]
    brand_docs = await db.brands.insert_many(brands_data)
    brand_map = {b["slug"]: str(id_) for b, id_ in zip(brands_data, brand_docs.inserted_ids)}
    print(f"Seeded {len(brands_data)} brands.")

    now = datetime.utcnow()

    # Image URLs from actual static HTML
    img_serum = "https://lh3.googleusercontent.com/aida-public/AB6AXuATg95IXmzms-WImvLg90etY47bZmJzbc6BfGol8U3WCuBE9TsU588bzQ8KT2HMhz7NMfqiSor96PEcX-8xaZbNwosxNRAnDHLI3MKPsN6iPYO7bEE6D1aCwIchCW44YXaTLJc6FQxrkii95UCX8LlAqNp-fNOJJxjNaJkQBFlfhsNEewF7BIzcdwUYZV3kOx13H0D1yQ9WlhpHM19-MSqLOGPBssm6arAS_PB1a8_aXsOuAXQL-15jpg"
    img_foundation = "https://lh3.googleusercontent.com/aida-public/AB6AXuBcpDYnAYU2nHC7PVX1ybEMVHeGXnyHbWy4bwBELXxet2dwkCpQtldyWjD8XUdxVRn_c2jqSt5qXBy4d7C1-mqo4B5lLN6KS9nxPPb5Hvg-CSVkcA7TU34ARPQm28WkVTBo3X2pdLAjYsc_g1QpQxhb6bhTwPNNbSH_vUsMBfKjYibVk-jSMhS2CZ4OatLZpHcXs3dNYEHlKqmPJ8w8mmrRfZwpyZ3JBHmBWXRK8StJTS8SWCoj_vmZcQ"
    img_lipstick = "https://lh3.googleusercontent.com/aida-public/AB6AXuBiDp_4pY52VCk5SXVxXEn7hWt5ecJPUO2Xtdjt3_-qI8IXFHkAA1uhTzSh5cz5jyD7H9l0tOyvKbAoAw-PRWH4Y6EzazQYzytj244fkGx7TM040nswBjkeKV3-0seDzrP1kdGnGmCJtenPs8Ypp5fgGMMhH7Gyr_Awh9-IhSCnxlddU0lcBgQ9opl4_X9TBpYuijaAp1AW3QtF_k9qxMO_oiArVucr6xt8o0BQhcBlOJM-FPB5PgeQ0Q"
    img_crimson_lipstick = "https://lh3.googleusercontent.com/aida-public/AB6AXuCX20hoMWQq4JscLqMFHEqhRK__Pb9ieYpSFTslSjaup5mS-wm3I304Mk5gTYaY5WMy2oHXqqPl54l_4U62m78AgUnIeuuIPnFJWmuYVS7msw1eZl17aEW46mNt2mB5CnYXPN6HGMTsHCEyMBLCq-R8s2tpZa_zRSdTE-dSpjApyUobKek9fjGorcETpsgVV3jckXLOZZdOBWh-29w1-MT6pW-LuV1OKCqN-1xFyfzNApZXh_FpyuS7Jg"
    img_oil = "https://lh3.googleusercontent.com/aida-public/AB6AXuDdXmAUM2GABtO06NwFKhFdrjCxUABXBcdC8JF4satKdCJrax-bKoDNr-c__eUrWT3k41jgxpbhMSbSqoMZ4aZC1zNsFbBf4yI-9px-fo-ynPhL1sm45dw-ipRTW5cSl_1MMYvsYAWPb6qvoZdVF01QgeT9J1f79edQem-zJ-LP7nelZEfJrWBRCxkHJaqFRoNusaIx6Job-vF5E6j_up0EwRzxYoRlUmnHbxdcxMD6EzhcqO0Q6Ad9fw"
    img_cream = "https://lh3.googleusercontent.com/aida-public/AB6AXuBOwnNw2OEmQTeaM_FMHU8Mzm2o_UkwQs5MKyEAsydCWazLi9b4fYqfV6kTrZC6Qz_IB6CQZfRRhUeklMp4LbiveHs-v2AJ-yC3w9PrjHHzYVLqkImQs6xw_vMoillf3Re90WnpMLv9sFujVuMS-JWmiau7r4OkYgzU9YXtFvM3SE8_oNMaa3Mqo0qfTfcPrCqyuh2m1vJcEc3jBGabtcaJlbs9yQCmBUSe8KNFLMDed85dlSidn1RRfQ"

    # 3. Products
    products_data = [
        {
            "name": "Luminous Silk Foundation",
            "slug": "luminous-silk-foundation",
            "brand_id": brand_map["lumiere"],
            "category_id": cat_map["makeup"],
            "description": "Formulated with Micro-fil™ technology, this foundation sculpts and brightens the complexion, blurs imperfections, and provides a radiant, second-skin finish. It is a makeup artist favorite for its weightless feel and seamless blendability.",
            "ingredients": "Aqua / Water, Cyclopentasiloxane, Glycerin, Isododecane, Alcohol Denat., Polyglyceryl-4 Isostearate, Cetyl PEG/PPG-10/1 Dimethicone, Hexyl Laurate, Aluminum Starch Octenylsuccinate, Disteardimonium Hectorite, Phenoxyethanol, Acetylated Glycol Stearate, Magnesium Sulfate, PEG-10 Dimethicone.",
            "how_to_use": "Use the blender brush for a seamless, radiant finish. Apply from the center of the face outwards. Layer to build coverage from light to medium.",
            "price": 64.00,
            "compare_at_price": 75.00,
            "images": [img_foundation, img_cream],
            "is_new": True,
            "is_bestseller": True,
            "rating_avg": 4.8,
            "rating_count": 124,
            "variants": [
                {"variant_id": "v1", "label": "3.5 - Fair with warm peach undertone", "swatch_hex": "#f3e5db", "stock_qty": 50},
                {"variant_id": "v2", "label": "4.0 - Light with neutral undertone", "swatch_hex": "#ebd6c5", "stock_qty": 40},
                {"variant_id": "v3", "label": "4.25 - Light with neutral peachy undertone", "swatch_hex": "#e3c6b2", "stock_qty": 65},
                {"variant_id": "v4", "label": "5.0 - Medium with cool undertone", "swatch_hex": "#d6b298", "stock_qty": 30},
                {"variant_id": "v5", "label": "6.5 - Medium Tan with golden undertone", "swatch_hex": "#c99b7e", "stock_qty": 25},
                {"variant_id": "v6", "label": "7.5 - Tan with olive undertone", "swatch_hex": "#b88565", "stock_qty": 20},
                {"variant_id": "v7", "label": "8.5 - Deep with neutral golden undertone", "swatch_hex": "#a36f4d", "stock_qty": 15},
                {"variant_id": "v8", "label": "9.0 - Rich Deep with cool red undertone", "swatch_hex": "#8c5a3b", "stock_qty": 10}
            ],
            "created_at": now,
            "updated_at": now
        },
        {
            "name": "Radiance Renewal Serum",
            "slug": "radiance-renewal-serum",
            "brand_id": brand_map["aurelia"],
            "category_id": cat_map["skincare"],
            "description": "An award-winning, potent botanical serum that restores moisture, firms skin texture, and enhances natural luminosity. Packed with bio-fermented hyaluronic acid and organic rosehip nectar.",
            "ingredients": "Rosa Damascena Flower Water, Sodium Hyaluronate, Niacinamide, Glycerin, Camellia Sinensis Leaf Extract, Ferulic Acid, Tocopherol, Phenoxyethanol, Ethylhexylglycerin.",
            "how_to_use": "Dispense 3-4 drops onto palms and gently press into freshly cleansed face and neck morning and evening before moisturizer.",
            "price": 85.00,
            "compare_at_price": 98.00,
            "images": [img_serum, img_oil],
            "is_new": False,
            "is_bestseller": True,
            "rating_avg": 4.9,
            "rating_count": 210,
            "variants": [
                {"variant_id": "v_30ml", "label": "30ml / 1 fl oz", "swatch_hex": None, "stock_qty": 100},
                {"variant_id": "v_50ml", "label": "50ml / 1.7 fl oz", "swatch_hex": None, "stock_qty": 60}
            ],
            "created_at": now,
            "updated_at": now
        },
        {
            "name": "Velvet Matte Lip Color",
            "slug": "velvet-matte-lip-color",
            "brand_id": brand_map["lessence"],
            "category_id": cat_map["makeup"],
            "description": "A luxurious velvet-finish lipstick that saturates lips in intense, weightless color with 10-hour hydrating comfort.",
            "ingredients": "Dimethicone, Synthetic Wax, Octyldodecanol, Cera Microcristallina, Caprylic/Capric Triglyceride, Mica, CI 77891 (Titanium Dioxide), CI 15850 (Red 7 Lake).",
            "how_to_use": "Apply directly from the bullet starting at the center of your lips and gliding outward for precise coverage.",
            "price": 38.00,
            "compare_at_price": None,
            "images": [img_lipstick, img_crimson_lipstick],
            "is_new": True,
            "is_bestseller": True,
            "rating_avg": 4.7,
            "rating_count": 96,
            "variants": [
                {"variant_id": "v_rose", "label": "Dusty Rose", "swatch_hex": "#d48c94", "stock_qty": 80},
                {"variant_id": "v_berry", "label": "Deep Berry", "swatch_hex": "#6b2339", "stock_qty": 50},
                {"variant_id": "v_nude", "label": "Velvet Nude", "swatch_hex": "#c49380", "stock_qty": 70}
            ],
            "created_at": now,
            "updated_at": now
        },
        {
            "name": "Rouge Velours Matte Lipstick",
            "slug": "rouge-velours-matte-lipstick",
            "brand_id": brand_map["lessence"],
            "category_id": cat_map["makeup"],
            "description": "A statement high-pigment crimson lipstick with a silky matte finish that lasts all day without feathering.",
            "ingredients": "Isododecane, Trimethylsiloxysilicate, Cyclopentasiloxane, Silica, Dimethicone, Synthetic Beeswax, Tocopheryl Acetate, CI 15850.",
            "how_to_use": "Outline lips with precision applicator tip before filling in.",
            "price": 38.00,
            "compare_at_price": None,
            "images": [img_crimson_lipstick, img_lipstick],
            "is_new": True,
            "is_bestseller": False,
            "rating_avg": 4.6,
            "rating_count": 48,
            "variants": [
                {"variant_id": "v_crimson", "label": "Crimson Rouge", "swatch_hex": "#a81327", "stock_qty": 60}
            ],
            "created_at": now,
            "updated_at": now
        },
        {
            "name": "Nuit Noir Midnight Recovery Oil",
            "slug": "nuit-noir-midnight-recovery-oil",
            "brand_id": brand_map["nuit-noir"],
            "category_id": cat_map["skincare"],
            "description": "A dark botanical night elixir that repairs skin elasticity overnight using cold-pressed squalane, evening primrose, and lavender essential extracts.",
            "ingredients": "Caprylic/Capric Triglyceride, Squalane, Rosa Canina Fruit Oil, Oenothera Biennis (Evening Primrose) Oil, Lavandula Angustifolia Oil, Linalool, Geraniol.",
            "how_to_use": "Warm 3 drops between fingers and massage onto clean face before bed.",
            "price": 92.00,
            "compare_at_price": 110.00,
            "images": [img_oil, img_serum],
            "is_new": True,
            "is_bestseller": False,
            "rating_avg": 5.0,
            "rating_count": 45,
            "variants": [
                {"variant_id": "v_30ml_oil", "label": "30ml Bottle", "swatch_hex": None, "stock_qty": 40}
            ],
            "created_at": now,
            "updated_at": now
        },
        {
            "name": "Lumière Rose Gold Highlighter",
            "slug": "lumiere-rose-gold-highlighter",
            "brand_id": brand_map["lumiere"],
            "category_id": cat_map["makeup"],
            "description": "A silky baked powder highlighter that gives high-point facial features an ethereal, luminous rose gold sheen.",
            "ingredients": "Mica, Talc, Synthetic Fluorphlogopite, Dimethicone, Magnesium Stearate, Ethylhexyl Palmitate, Phenoxyethanol.",
            "how_to_use": "Sweep gently over cheekbones, brow bone, and cupid's bow using a fan brush.",
            "price": 48.00,
            "compare_at_price": None,
            "images": [img_cream, img_foundation],
            "is_new": False,
            "is_bestseller": True,
            "rating_avg": 4.8,
            "rating_count": 88,
            "variants": [
                {"variant_id": "v_rosegold", "label": "Rose Gold Glow", "swatch_hex": "#e0a899", "stock_qty": 75},
                {"variant_id": "v_champagne", "label": "Champagne Shimmer", "swatch_hex": "#f5e2c8", "stock_qty": 65}
            ],
            "created_at": now,
            "updated_at": now
        },
        {
            "name": "Aurelia Botanical Youth Elixir",
            "slug": "aurelia-botanical-youth-elixir",
            "brand_id": brand_map["aurelia"],
            "category_id": cat_map["wellness"],
            "description": "Concentrated herbal tincture infused with adaptogenic mushrooms, schisandra berry, and marine collagen peptides to promote inner radiance and skin resilience.",
            "ingredients": "Hydrolyzed Marine Collagen, Cordyceps Extract, Schisandra Chinensis Berry Nectar, Organic Glycerin, Purified Water.",
            "how_to_use": "Add one dropper full into water, tea, or smoothie daily.",
            "price": 110.00,
            "compare_at_price": 125.00,
            "images": [img_serum, img_cream],
            "is_new": False,
            "is_bestseller": False,
            "rating_avg": 4.9,
            "rating_count": 72,
            "variants": [
                {"variant_id": "v_50ml_tincture", "label": "50ml Tincture", "swatch_hex": None, "stock_qty": 35}
            ],
            "created_at": now,
            "updated_at": now
        },
        {
            "name": "L'Essence Pure Amber Eau de Parfum",
            "slug": "lessence-pure-amber-eau-de-parfum",
            "brand_id": brand_map["lessence"],
            "category_id": cat_map["fragrance"],
            "description": "An intoxicating, sensual fragrance combining warm amber resin, Madagascar vanilla, smoked cedar, and damask rose.",
            "ingredients": "Alcohol Denat., Parfum (Fragrance), Aqua (Water), Benzyl Salicylate, Limonene, Linalool, Coumarin, Citronellol.",
            "how_to_use": "Spray onto pulse points including wrists, neck, and behind ears.",
            "price": 145.00,
            "compare_at_price": 160.00,
            "images": [img_oil, img_lipstick],
            "is_new": True,
            "is_bestseller": True,
            "rating_avg": 4.9,
            "rating_count": 54,
            "variants": [
                {"variant_id": "v_50ml_edp", "label": "50ml Spray", "swatch_hex": None, "stock_qty": 45},
                {"variant_id": "v_100ml_edp", "label": "100ml Spray", "swatch_hex": None, "stock_qty": 30}
            ],
            "created_at": now,
            "updated_at": now
        }
    ]
    await db.products.insert_many(products_data)
    print(f"Seeded {len(products_data)} products.")

    # 4. Promo codes
    promos_data = [
        {"code": "GLOW10", "discount_type": "percent", "discount_value": 10.0, "active": True, "expires_at": None},
        {"code": "WELCOME20", "discount_type": "percent", "discount_value": 20.0, "active": True, "expires_at": None},
        {"code": "LUXURY15", "discount_type": "fixed", "discount_value": 15.0, "active": True, "expires_at": None}
    ]
    await db.promo_codes.insert_many(promos_data)
    print(f"Seeded {len(promos_data)} promo codes.")

    # 5. Demo User
    demo_user = {
        "first_name": "Eleanor",
        "last_name": "Vance",
        "email": "demo@glowbeauty.com",
        "password_hash": pwd_context.hash("password123"),
        "role": "user",
        "subscribed_to_emails": True,
        "addresses": [
            {
                "_id": "addr_1",
                "label": "Home",
                "first_name": "Eleanor",
                "last_name": "Vance",
                "street_address": "742 Fifth Avenue, Apt 12B",
                "city": "New York",
                "state": "NY",
                "zip_code": "10019",
                "is_default": True
            }
        ],
        "wishlist_product_ids": [],
        "created_at": now,
        "updated_at": now
    }
    await db.users.insert_one(demo_user)
    print("Seeded demo user: demo@glowbeauty.com / password123")

    print("Seeding completed successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
