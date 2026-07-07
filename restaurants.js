// Premium mock data for restaurants and food items
export const RESTAURANTS_DATA = [
  {
    id: "rest-1",
    name: "Burger Bistro",
    cuisine: "Burgers, American, Fast Food",
    rating: 4.8,
    ratingCount: "500+",
    deliveryTime: "20-30 mins",
    avgPrice: "$15 for one",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    featured: true,
    menu: [
      {
        id: "item-101",
        name: "Classic Cheeseburger",
        price: 12.99,
        description: "Juicy beef patty with sharp cheddar cheese, fresh lettuce, tomato, red onion, and our house special burger sauce on a toasted brioche bun.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
        category: "Burgers",
        isVeg: false,
        rating: 4.9
      },
      {
        id: "item-102",
        name: "Spicy Crispy Chicken Burger",
        price: 13.49,
        description: "Crispy buttermilk fried chicken breast tossed in spicy glaze, topped with creamy coleslaw, pickles, and spicy mayo.",
        image: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=400&q=80",
        category: "Burgers",
        isVeg: false,
        rating: 4.7
      },
      {
        id: "item-103",
        name: "Truffle Parmesan Fries",
        price: 6.99,
        description: "Crispy golden french fries tossed in aromatic white truffle oil, grated parmesan cheese, and fresh parsley, served with garlic aioli.",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80",
        category: "Sides",
        isVeg: true,
        rating: 4.8
      },
      {
        id: "item-104",
        name: "Loaded Cheese Nachos",
        price: 9.99,
        description: "Tortilla chips loaded with warm melted cheese sauce, black beans, jalapeños, pico de gallo, sour cream, and fresh guacamole.",
        image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=400&q=80",
        category: "Sides",
        isVeg: true,
        rating: 4.6
      }
    ]
  },
  {
    id: "rest-2",
    name: "Pizzeria Stella",
    cuisine: "Italian, Pizza, Pasta",
    rating: 4.7,
    ratingCount: "350+",
    deliveryTime: "30-40 mins",
    avgPrice: "$20 for one",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    featured: true,
    menu: [
      {
        id: "item-201",
        name: "Margherita Classica Pizza",
        price: 14.99,
        description: "Simple yet perfect: San Marzano tomato sauce, fresh mozzarella cheese, fresh basil leaves, and a drizzle of extra virgin olive oil.",
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=400&q=80",
        category: "Pizza",
        isVeg: true,
        rating: 4.9
      },
      {
        id: "item-202",
        name: "Double Pepperoni Feast Pizza",
        price: 17.99,
        description: "For meat lovers: Loaded with double portions of premium pepperoni, mozzarella, and our signature spicy marinara sauce.",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80",
        category: "Pizza",
        isVeg: false,
        rating: 4.8
      },
      {
        id: "item-203",
        name: "Creamy Alfredo Penne",
        price: 15.49,
        description: "Penne pasta tossed in a rich and velvety garlic parmesan cream sauce, topped with shaved parmesan and freshly cracked black pepper.",
        image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=400&q=80",
        category: "Pasta",
        isVeg: true,
        rating: 4.6
      },
      {
        id: "item-204",
        name: "Garlic Butter Breadsticks",
        price: 5.99,
        description: "Freshly baked breadsticks brushed with melted garlic butter and herbs, served with warm marinara dipping sauce.",
        image: "https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=400&q=80",
        category: "Sides",
        isVeg: true,
        rating: 4.5
      }
    ]
  },
  {
    id: "rest-3",
    name: "Wok & Roll",
    cuisine: "Asian, Noodles, Sushi",
    rating: 4.6,
    ratingCount: "400+",
    deliveryTime: "25-35 mins",
    avgPrice: "$18 for one",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    featured: false,
    menu: [
      {
        id: "item-301",
        name: "Spicy Salmon Sushi Roll",
        price: 13.99,
        description: "Fresh Atlantic salmon, cucumber, and spicy mayo rolled in sushi rice and seaweed, topped with toasted sesame seeds.",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80",
        category: "Sushi",
        isVeg: false,
        rating: 4.8
      },
      {
        id: "item-302",
        name: "Chicken Pad Thai",
        price: 14.49,
        description: "Stir-fried thin rice noodles with tender chicken, eggs, tofu, bean sprouts, and scallions in a sweet-savory tamarind sauce, served with crushed peanuts and lime.",
        image: "https://images.unsplash.com/photo-1626804475315-77677bf188fb?auto=format&fit=crop&w=400&q=80",
        category: "Noodles",
        isVeg: false,
        rating: 4.7
      },
      {
        id: "item-303",
        name: "Steamed Pork Dumplings (6pcs)",
        price: 8.99,
        description: "Handmade dumplings filled with seasoned ground pork and cabbage, steamed to perfection, served with house soy-ginger dipping sauce.",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=400&q=80",
        category: "Starters",
        isVeg: false,
        rating: 4.6
      },
      {
        id: "item-304",
        name: "Crispy Vegetable Spring Rolls (4pcs)",
        price: 6.99,
        description: "Crispy fried rolls packed with shredded cabbage, carrots, glass noodles, and mushrooms, served with sweet chili sauce.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
        category: "Starters",
        isVeg: true,
        rating: 4.5
      }
    ]
  },
  {
    id: "rest-4",
    name: "Green Bite Salads",
    cuisine: "Healthy, Salads, Bowls",
    rating: 4.9,
    ratingCount: "280+",
    deliveryTime: "15-25 mins",
    avgPrice: "$12 for one",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    featured: true,
    menu: [
      {
        id: "item-401",
        name: "Mediterranean Quinoa Salad Bowl",
        price: 11.99,
        description: "Organic quinoa, cherry tomatoes, cucumbers, kalamata olives, red onions, crumbled feta cheese, and roasted chickpeas with lemon-herb vinaigrette.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80",
        category: "Salads",
        isVeg: true,
        rating: 4.9
      },
      {
        id: "item-402",
        name: "Avocado Chicken Caesar Salad",
        price: 13.99,
        description: "Crispy romaine lettuce, grilled chicken breast, sliced avocado, garlic croutons, and shaved parmesan cheese, tossed in creamy Caesar dressing.",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
        category: "Salads",
        isVeg: false,
        rating: 4.8
      },
      {
        id: "item-403",
        name: "Superfood Protein Bowl",
        price: 14.49,
        description: "Brown rice, grilled chicken, steamed sweet potato, edamame, sliced avocado, purple cabbage, shredded carrots, served with tahini-ginger dressing.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
        category: "Bowls",
        isVeg: false,
        rating: 4.7
      },
      {
        id: "item-404",
        name: "Fresh Berry Smoothie",
        price: 6.49,
        description: "A refreshing blend of blueberries, strawberries, raspberries, banana, Greek yogurt, and honey, blended with unsweetened almond milk.",
        image: "https://images.unsplash.com/photo-1553530979-7ee52a2670c4?auto=format&fit=crop&w=400&q=80",
        category: "Drinks",
        isVeg: true,
        rating: 4.6
      }
    ]
  },
  {
    id: "rest-5",
    name: "Sweet Delights Bakery",
    cuisine: "Desserts, Bakery, Cakes",
    rating: 4.8,
    ratingCount: "600+",
    deliveryTime: "15-30 mins",
    avgPrice: "$10 for one",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    featured: false,
    menu: [
      {
        id: "item-501",
        name: "Molten Lava Brownie Cup",
        price: 7.99,
        description: "Rich, warm chocolate brownie with a gooey liquid chocolate center, served with a scoop of premium vanilla bean ice cream.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80",
        category: "Warm Desserts",
        isVeg: true,
        rating: 4.9
      },
      {
        id: "item-502",
        name: "Red Velvet Cream Cheese Cupcake",
        price: 3.99,
        description: "Classic velvety red velvet sponge cupcake topped with a generous swirl of rich and tangy cream cheese frosting.",
        image: "https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?auto=format&fit=crop&w=400&q=80",
        category: "Cakes",
        isVeg: true,
        rating: 4.7
      },
      {
        id: "item-503",
        name: "Belgian Chocolate Strawberry Waffle",
        price: 9.49,
        description: "Freshly baked waffle topped with sliced fresh strawberries, drizzled with warm Belgian milk chocolate, and whipped cream.",
        image: "https://images.unsplash.com/photo-1562376502-6f769499c886?auto=format&fit=crop&w=400&q=80",
        category: "Waffles",
        isVeg: true,
        rating: 4.8
      },
      {
        id: "item-504",
        name: "Classic Italian Tiramisu",
        price: 8.49,
        description: "Coffee-dipped ladyfingers layered with a whipped mixture of egg yolks, sugar, and mascarpone cheese, dusted with cocoa powder.",
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80",
        category: "Cold Desserts",
        isVeg: true,
        rating: 4.9
      }
    ]
  },
  {
    id: "rest-6",
    name: "Taco Express",
    cuisine: "Mexican, Tacos, Fast Food",
    rating: 4.5,
    ratingCount: "220+",
    deliveryTime: "20-30 mins",
    avgPrice: "$12 for one",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
    featured: false,
    menu: [
      {
        id: "item-601",
        name: "Street Chicken Tacos (3pcs)",
        price: 10.99,
        description: "Three warm corn tortillas stuffed with juicy grilled chicken, diced white onions, fresh cilantro, and served with salsa verde and lime.",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80",
        category: "Tacos",
        isVeg: false,
        rating: 4.7
      },
      {
        id: "item-602",
        name: "Loaded Beef Burrito Grande",
        price: 12.49,
        description: "Huge flour tortilla packed with seasoned ground beef, cilantro-lime rice, black beans, shredded cheese, sour cream, and salsa.",
        image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&w=400&q=80",
        category: "Burritos",
        isVeg: false,
        rating: 4.6
      },
      {
        id: "item-603",
        name: "Veggie Fiesta Quesadilla",
        price: 9.99,
        description: "Large grilled flour tortilla filled with melted Colby Jack cheese, sautéed bell peppers, onions, sweet corn, served with guacamole.",
        image: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&w=400&q=80",
        category: "Quesadillas",
        isVeg: true,
        rating: 4.5
      },
      {
        id: "item-604",
        name: "Cinnamon Sugar Churros (4pcs)",
        price: 5.49,
        description: "Crispy fried pastry dough sticks coated in sweet cinnamon sugar, served with warm milk chocolate dip.",
        image: "https://images.unsplash.com/photo-1588693895311-667ec0732442?auto=format&fit=crop&w=400&q=80",
        category: "Sides",
        isVeg: true,
        rating: 4.8
      }
    ]
  }
];
