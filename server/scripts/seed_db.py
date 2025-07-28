from server import create_app
from server.models import db
from server.models.merchant import Merchant
from server.models.business import Business
from server.models.store import Store
from server.models.user import User
from server.models.category import Category
from server.models.product import Product
from server.models.supplier import Supplier
from server.models.batch import Batch
from server.models.stock_entries import Stock_Entry
from server.models.stock_exits import StockExit
from server.models.sale import Sale
from datetime import datetime
import bcrypt

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    
    merchant_password = "duka123"
    print(f"Password for stephen@myduka.co.ke is: {merchant_password}")
    
    # Hash before saving
    hashed_password = bcrypt.hashpw(merchant_password.encode(), bcrypt.gensalt()).decode()
    
    merchant = Merchant(
        id=1,
        first_name="Stephen",
        last_name="Njenga",
        email="stephen@myduka.co.ke",
        password_hash=hashed_password,
        created_at=datetime(2025, 7, 1)
    )
    
    db.session.add(merchant)
    db.session.flush()

    business = Business(
        id=1,
        merchant_id=1,
        name="SmartDuka Ventures",
        industry="Retail",
        country="Kenya",
        county="Nairobi",
        location="Westlands",
        created_at=datetime(2025, 7, 2)
    )
    db.session.add(business)
    db.session.flush()

    stores = [
        Store(id=1, business_id=1, name="Westlands Shop", country="Kenya", county="Nairobi", location="Westlands"),
        Store(id=2, business_id=1, name="Kisumu Shop", country="Kenya", county="Kisumu", location="CBD"),
        Store(id=3, business_id=1, name="Eldoret Shop", country="Kenya", county="Uasin Gishu", location="Market Street")
    ]
    db.session.add_all(stores)
    db.session.flush()

    plain_password = "duka123"
    
    users = []
    user_data = [
        (1, 1, 'Tracy', 'Njeri', 'admin', 'tracy.njeri@duka.co.ke'),
        (2, 1, 'Brian', 'Otieno', 'clerk', 'brian.otieno@duka.co.ke'),
        (3, 1, 'Linda', 'Chebet', 'clerk', 'linda.chebet@duka.co.ke'),
        (4, 1, 'Kevin', 'Mwangi', 'clerk', 'kevin.mwangi@duka.co.ke'),
        (5, 2, 'Faith', 'Wambui', 'admin', 'faith.wambui@duka.co.ke'),
        (6, 2, 'Samuel', 'Omollo', 'clerk', 'samuel.omollo@duka.co.ke'),
        (7, 2, 'Cynthia', 'Achieng', 'clerk', 'cynthia.achieng@duka.co.ke'),
        (8, 2, 'Dennis', 'Muriithi', 'clerk', 'dennis.muriithi@duka.co.ke'),
        (9, 3, 'Caroline', 'Mutua', 'admin', 'caroline.mutua@duka.co.ke'),
        (10, 3, 'John', 'Kariuki', 'clerk', 'john.kariuki@duka.co.ke'),
        (11, 3, 'Esther', 'Nduta', 'clerk', 'esther.nduta@duka.co.ke'),
        (12, 3, 'George', 'Otieno', 'clerk', 'george.otieno@duka.co.ke'),
    ]
    
    for uid, store_id, fname, lname, role, email in user_data:
        print(f"Password for {email} is: {plain_password}")
        hashed = bcrypt.hashpw(plain_password.encode(), bcrypt.gensalt()).decode()
    
        users.append(User(
            id=uid,
            store_id=store_id,
            first_name=fname,
            last_name=lname,
            email=email,
            role=role,
            password_hash=hashed,
            is_active=True
        ))
    
    db.session.add_all(users)
    db.session.flush()

    categories = [
        Category(id=1, business_id=1, name="Beverages", description="Soft drinks and water"),
        Category(id=2, business_id=1, name="Snacks", description="Fast moving snacks"),
        Category(id=3, business_id=1, name="Stationery", description="Books and pens")
    ]
    db.session.add_all(categories)
    db.session.flush()

    products = [
        Product(id=1, business_id=1, category_id=1, name="Coca Cola", description="500ml bottle", selling_price=70, quantity=100),
        Product(id=2, business_id=1, category_id=1, name="Pepsi", description="500ml bottle", selling_price=65, quantity=100),
        Product(id=3, business_id=1, category_id=1, name="Fanta", description="500ml bottle", selling_price=68, quantity=100),
        Product(id=4, business_id=1, category_id=1, name="Sprite", description="500ml bottle", selling_price=69, quantity=100),
        Product(id=5, business_id=1, category_id=1, name="Water 500ml", description="Mineral water", selling_price=30, quantity=100),
        Product(id=6, business_id=1, category_id=2, name="Chevda", description="Spicy snack", selling_price=50, quantity=100),
        Product(id=7, business_id=1, category_id=2, name="Biscuits", description="Pack of 6", selling_price=40, quantity=100),
        Product(id=8, business_id=1, category_id=2, name="Crisps", description="Potato crisps", selling_price=35, quantity=100),
        Product(id=9, business_id=1, category_id=2, name="Groundnuts", description="Roasted", selling_price=38, quantity=100),
        Product(id=10, business_id=1, category_id=2, name="Mandazi", description="Sweet fried bread", selling_price=20, quantity=100),
        Product(id=11, business_id=1, category_id=3, name="Exercise Book", description="A4, 200pgs", selling_price=50, quantity=100),
        Product(id=12, business_id=1, category_id=3, name="Biro Pen", description="Blue ink", selling_price=20, quantity=100),
        Product(id=13, business_id=1, category_id=3, name="Glue Stick", description="Large", selling_price=45, quantity=100),
        Product(id=14, business_id=1, category_id=3, name="Marker Pen", description="Black", selling_price=55, quantity=100),
        Product(id=15, business_id=1, category_id=3, name="Pencil", description="HB", selling_price=15, quantity=100)
    ]
    db.session.add_all(products)
    db.session.flush()

    suppliers = [
        Supplier(id=1, business_id=1, name="Nairobi Distributors", contact_name="Musa", email="info@nai-dist.co.ke", phone_number="0722123456", country="Kenya"),
        Supplier(id=2, business_id=1, name="Lake Suppliers", contact_name="Akinyi", email="contact@lakesuppliers.co.ke", phone_number="0711345678", country="Kenya")
    ]
    db.session.add_all(suppliers)
    db.session.flush()


    # === Batches ===
    db.session.add_all([
    Batch(id=1, store_id=1, direction='in', party='Bray and Sons', created_by=3, created_at=datetime.fromisoformat('2025-07-01T04:02:50')),
    Batch(id=2, store_id=3, direction='in', party='Silva and Sons', created_by=2, created_at=datetime.fromisoformat('2025-06-21T09:26:58')),
    Batch(id=3, store_id=2, direction='in', party='Serrano, Simon and Garcia', created_by=10, created_at=datetime.fromisoformat('2025-06-26T09:18:08')),
    Batch(id=4, store_id=1, direction='in', party='Miller-Scott', created_by=3, created_at=datetime.fromisoformat('2025-06-20T03:44:36')),
    Batch(id=5, store_id=1, direction='in', party='Carter-Andrade', created_by=3, created_at=datetime.fromisoformat('2025-06-15T18:45:17')),
    Batch(id=6, store_id=3, direction='out', party='Lauren Hernandez', created_by=2, created_at=datetime.fromisoformat('2025-07-11T19:00:35')),
    Batch(id=7, store_id=2, direction='out', party='Craig Graham PhD', created_by=10, created_at=datetime.fromisoformat('2025-07-24T08:03:20')),
    Batch(id=8, store_id=2, direction='out', party='April Mahoney', created_by=11, created_at=datetime.fromisoformat('2025-06-23T02:26:55')),
    Batch(id=9, store_id=2, direction='out', party='Michael Taylor', created_by=7, created_at=datetime.fromisoformat('2025-06-26T20:50:48')),
    Batch(id=10, store_id=3, direction='out', party='Jennifer Harper', created_by=6, created_at=datetime.fromisoformat('2025-06-13T12:25:40'))
    ])
    db.session.flush()

    # === Stock Entries ===
    db.session.add_all([
        Stock_Entry(id=1, product_id=14, clerk_id=4, batch_id=1, store_id=1, supplier_id=1, quantity_received=21, buying_price=46.34, payment_status='paid', payment_method='MPesa', created_at=datetime.fromisoformat('2025-06-25T17:23:46')),
        Stock_Entry(id=2, product_id=8, clerk_id=3, batch_id=2, store_id=3, supplier_id=1, quantity_received=23, buying_price=104.79, payment_status='unpaid', payment_method='MPesa', created_at=datetime.fromisoformat('2025-06-06T08:00:22')),
        Stock_Entry(id=3, product_id=9, clerk_id=2, batch_id=3, store_id=2, supplier_id=1, quantity_received=20, buying_price=197.52, payment_status='unpaid', payment_method='MPesa', created_at=datetime.fromisoformat('2025-06-02T00:33:10')),
        Stock_Entry(id=4, product_id=15, clerk_id=10, batch_id=4, store_id=1, supplier_id=2, quantity_received=19, buying_price=176.73, payment_status='unpaid', payment_method='Cash', created_at=datetime.fromisoformat('2025-07-07T12:55:23')),
        Stock_Entry(id=5, product_id=12, clerk_id=7, batch_id=5, store_id=1, supplier_id=1, quantity_received=22, buying_price=187.39, payment_status='unpaid', payment_method='MPesa', created_at=datetime.fromisoformat('2025-06-15T01:50:23')),
        Stock_Entry(id=6, product_id=4, clerk_id=8, batch_id=1, store_id=1, supplier_id=1, quantity_received=18, buying_price=150.12, payment_status='unpaid', payment_method='MPesa', created_at=datetime.fromisoformat('2025-06-13T17:22:36')),
        Stock_Entry(id=7, product_id=3, clerk_id=2, batch_id=2, store_id=3, supplier_id=1, quantity_received=18, buying_price=162.98, payment_status='paid', payment_method='Cash', created_at=datetime.fromisoformat('2025-07-07T10:27:02')),
        Stock_Entry(id=8, product_id=6, clerk_id=3, batch_id=3, store_id=2, supplier_id=1, quantity_received=9, buying_price=24.19, payment_status='paid', payment_method='MPesa', created_at=datetime.fromisoformat('2025-06-23T21:31:16')),
        Stock_Entry(id=9, product_id=3, clerk_id=8, batch_id=4, store_id=1, supplier_id=1, quantity_received=22, buying_price=72.94, payment_status='paid', payment_method='Cash', created_at=datetime.fromisoformat('2025-07-24T03:35:48')),
        Stock_Entry(id=10, product_id=11, clerk_id=8, batch_id=5, store_id=1, supplier_id=1, quantity_received=22, buying_price=43.57, payment_status='unpaid', payment_method='Cash', created_at=datetime.fromisoformat('2025-07-05T05:34:13'))
    ])

    db.session.flush()

    # === Sales ===
    db.session.add_all([
    Sale(id=1, store_id=2, recorded_by=8, payment_method='Cash', total_amount=253, customer_name='Carmen Fowler', customer_contact='001-361-094-0496x52041', notes='Auto-generated sale', created_at=datetime.fromisoformat('2025-07-18T11:06:05')),
    Sale(id=2, store_id=1, recorded_by=6, payment_method='Cash', total_amount=547, customer_name='Katherine Davidson', customer_contact='891-425-8343x3934', notes='Auto-generated sale', created_at=datetime.fromisoformat('2025-07-22T02:33:44')),
    Sale(id=3, store_id=2, recorded_by=10, payment_method='Cash', total_amount=350, customer_name='Jermaine Velasquez', customer_contact='832-503-5924', notes='Auto-generated sale', created_at=datetime.fromisoformat('2025-07-14T05:20:42'))
    ])
    db.session.flush()

    # === Stock Exits ===
    db.session.add_all([
    StockExit(id=1, store_id=2, product_id=6, recorded_by=8, batch_id=6, quantity=1, selling_price=69.42, reason='sold', sale_id=1, created_at=datetime.fromisoformat('2025-06-25T11:44:52')),
    StockExit(id=2, store_id=2, product_id=10, recorded_by=2, batch_id=7, quantity=1, selling_price=298.66, reason='damaged', sale_id=None, created_at=datetime.fromisoformat('2025-07-15T15:14:44')),
    StockExit(id=3, store_id=1, product_id=15, recorded_by=8, batch_id=8, quantity=5, selling_price=254.22, reason='sold', sale_id=3, created_at=datetime.fromisoformat('2025-07-22T21:22:37')),
    StockExit(id=4, store_id=2, product_id=7, recorded_by=6, batch_id=9, quantity=3, selling_price=201.47, reason='expired', sale_id=None, created_at=datetime.fromisoformat('2025-07-23T19:24:08')),
    StockExit(id=5, store_id=3, product_id=1, recorded_by=4, batch_id=10, quantity=2, selling_price=148.76, reason='sold', sale_id=2, created_at=datetime.fromisoformat('2025-07-23T16:13:15')),
    StockExit(id=6, store_id=2, product_id=8, recorded_by=11, batch_id=6, quantity=4, selling_price=169.58, reason='damaged', sale_id=None, created_at=datetime.fromisoformat('2025-06-25T07:48:11')),
    StockExit(id=7, store_id=2, product_id=7, recorded_by=12, batch_id=7, quantity=3, selling_price=140.34, reason='sold', sale_id=1, created_at=datetime.fromisoformat('2025-07-06T20:33:06')),
    StockExit(id=8, store_id=2, product_id=11, recorded_by=8, batch_id=8, quantity=3, selling_price=298.83, reason='expired', sale_id=None, created_at=datetime.fromisoformat('2025-07-18T13:59:48')),
    StockExit(id=9, store_id=1, product_id=2, recorded_by=12, batch_id=9, quantity=3, selling_price=276.89, reason='sold', sale_id=3, created_at=datetime.fromisoformat('2025-07-06T06:10:26')),
    StockExit(id=10, store_id=3, product_id=12, recorded_by=4, batch_id=10, quantity=5, selling_price=70.43, reason='damaged', sale_id=None, created_at=datetime.fromisoformat('2025-07-17T04:40:51'))
    ])
    db.session.commit()
    print("All seed data created successfully.")