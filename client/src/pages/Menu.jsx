import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { motion } from "framer-motion";

const MotionCard = motion.create(Card);

const Menu = () => {
  const [category, setCategory] = useState(0);
  const menuCategories = ['Coffee & Tea', 'Pastries', 'Breakfast', 'Lunch', 'Desserts'];
  
  const menuItems = {
    'Coffee & Tea': [
      {
        name: 'Espresso',
        description: 'Strong, concentrated shot of coffee',
        price: 3.49,
        tags: ['Classic', 'Hot'],
        image:'./assets/coffees/expresso.jpg'
      },
      {
        name: 'Americano',
        description: 'Espresso + hot water',
        price: 3.99,
        tags: ['Popular', 'Hot'],
        image:'./assets/coffees/Americano.jpg'
      },
      {
        name: 'Cappuccino',
        description: 'Espresso + steamed milk + foam',
        price: 4.49,
        tags: ['Bestseller', 'Hot'],
        image:'./assets/coffees/Cappuccino.jpg'
      },
      {
        name: 'Latte',
        description: 'Espresso + lots of steamed milk',
        price: 4.49,
        tags: ['Popular', 'Hot/Iced'],
        image:'./assets/coffees/Latte.jpg'
      },
      {
        name: 'Mocha',
        description: 'Latte + chocolate syrup',
        price: 4.99,
        tags: ['Sweet', 'Hot/Iced'],
        image:'./assets/coffees/Mocha.jpg'
      },
      {
        name: 'Macchiato',
        description: 'Espresso with a small amount of milk',
        price: 3.99,
        tags: ['Classic', 'Hot'],
        image:'./assets/coffees/Macchiato.jpg'
      },
      {
        name: 'Flat White',
        description: 'Similar to a latte but with a stronger coffee taste',
        price: 4.49,
        tags: ['Specialty', 'Hot'],
        image:'./assets/coffees/FlatWhite.jpg'
      },
      {
        name: 'Cold Brew',
        description: 'Coffee steeped in cold water for 12+ hours',
        price: 4.99,
        tags: ['Refreshing', 'Cold'],
        image:'./assets/coffees/ColdBrew.jpg'
      },
      {
        name: 'Affogato',
        description: 'Espresso poured over ice cream',
        price: 5.99,
        tags: ['Dessert', 'Special'],
        image:'./assets/coffees/Affogato.jpg'
      },
      {
        name: 'Turkish Coffee',
        description: 'Finely ground coffee brewed in a special pot',
        price: 4.99,
        tags: ['Specialty', 'Hot'],
        image:'./assets/coffees/TurkishCoffee.jpg'
      }
    ],
    'Pastries': [
      {
        name: 'Croissant',
        description: 'Classic buttery, flaky French pastry',
        price: 3.99,
        tags: ['Bestseller', 'Fresh Daily'],
        image:'./assets/pastries/Croissant.jpg'
      },
      {
        name: 'Danish Pastry',
        description: 'Sweet, fruit-filled pastry',
        price: 4.49,
        tags: ['Fresh Daily'],
        image:'./assets/pastries/DanishPastry.jpg'
      },
      {
        name: 'Pain au Chocolat',
        description: 'Chocolate-filled croissant',
        price: 4.49,
        tags: ['Popular', 'Fresh Daily'],
        image:'./assets/pastries/PainauChocolat.jpg'
      },
      {
        name: 'Cinnamon Roll',
        description: 'Swirled dough with cinnamon sugar',
        price: 4.99,
        tags: ['Sweet', 'Fresh Daily'],
        image:'./assets/pastries/CinnamonRoll.jpg'
      },
      {
        name: 'Macaron',
        description: 'Delicate French almond-based cookies',
        price: 2.99,
        tags: ['Gluten-Free'],
        image:'./assets/pastries/Macaron.jpg'
      },
      {
        name: 'Éclair',
        description: 'Choux pastry filled with cream and chocolate',
        price: 4.99,
        tags: ['Classic', 'Fresh Daily'],
        image:'./assets/pastries/Éclair.jpg'
      },
      {
        name: 'Scone',
        description: 'Dense, crumbly pastry, often with fruit',
        price: 3.99,
        tags: ['Traditional', 'Fresh Daily'],
        image:'./assets/pastries/Scone.jpg'
      },
      {
        name: 'Muffin',
        description: 'Soft, cake-like pastry with fruit or nuts',
        price: 3.99,
        tags: ['Fresh Daily'],
        image:'./assets/pastries/Muffin.jpg'
      },
      {
        name: 'Churros',
        description: 'Fried dough sticks, coated in cinnamon sugar',
        price: 4.99,
        tags: ['Sweet', 'Fresh Daily'],
        image:'./assets/pastries/Churros.jpg'
      },
      {
        name: 'Baklava',
        description: 'Layers of phyllo dough, nuts, and honey',
        price: 4.99,
        tags: ['Special', 'Traditional'],
        image:'./assets/pastries/Baklava.jpg'
      }
    ],
    'Breakfast': [
      {
        name: 'Avocado Toast',
        description: 'Toasted bread with mashed avocado and toppings',
        price: 9.99,
        tags: ['Vegetarian', 'Popular'],
        image:'./assets/breakfast/AvocadoToast.jpg'
      },
      {
        name: 'Pancakes',
        description: 'Fluffy, sweet stacks with syrup',
        price: 10.99,
        tags: ['Classic', 'Sweet'],
        image:'./assets/breakfast/Pancakes.jpg'
      },
      {
        name: 'Eggs Benedict',
        description: 'Poached eggs on an English muffin with hollandaise sauce',
        price: 12.99,
        tags: ['Signature', 'Classic'],
        image:'./assets/breakfast/EggsBenedict.jpg'
      },
      {
        name: 'Omelet',
        description: 'Fluffy eggs with cheese, veggies, or meat',
        price: 11.99,
        tags: ['Customizable'],
        image:'./assets/breakfast/Omelet.jpg'
      },
      {
        name: 'Granola & Yogurt',
        description: 'Greek yogurt with honey and granola',
        price: 8.99,
        tags: ['Healthy', 'Light'],
        image:'./assets/breakfast/Granola&Yogurt.jpg'
      },
      {
        name: 'Bagel & Cream Cheese',
        description: 'Classic breakfast favorite',
        price: 5.99,
        tags: ['Classic', 'Quick'],
        image:'./assets/breakfast/Bagel&CreamCheese.jpg'
      },
      {
        name: 'French Toast',
        description: 'Bread soaked in egg and fried, served with syrup',
        price: 10.99,
        tags: ['Sweet', 'Classic'],
        image:'./assets/breakfast/FrenchToast.jpg'
      },
      {
        name: 'Breakfast Burrito',
        description: 'Tortilla filled with eggs, cheese, and veggies',
        price: 11.99,
        tags: ['Hearty', 'Popular'],
        image:'./assets/breakfast/BreakfastBurrito.jpg'
      },
      {
        name: 'Smoothie Bowl',
        description: 'Blended fruit with granola and toppings',
        price: 9.99,
        tags: ['Healthy', 'Vegan'],
        image:'./assets/breakfast/SmoothieBowl.jpg'
      },
      {
        name: 'Full English Breakfast',
        description: 'Eggs, bacon, sausage, beans, and toast',
        price: 14.99,
        tags: ['Hearty', 'Traditional'],
        image:'./assets/breakfast/FullEnglishBreakfast.jpg'
      }
    ],
    'Lunch': [
      {
        name: 'Caprese Sandwich',
        description: 'Fresh mozzarella, tomato, and basil',
        price: 10.99,
        tags: ['Vegetarian', 'Fresh'],
        image:'/assets/lunch/CapreseSandwich.jpg'
      },
      {
        name: 'Club Sandwich',
        description: 'Turkey, bacon, lettuce, tomato, and mayo',
        price: 12.99,
        tags: ['Classic', 'Popular'],
        image:'/assets/lunch/ClubSandwich.jpg'
      },
      {
        name: 'BLT',
        description: 'Bacon, lettuce, and tomato on toasted bread',
        price: 10.99,
        tags: ['Classic'],
        image:'/assets/lunch/BLT.jpg'
      },
      {
        name: 'Grilled Cheese',
        description: 'Toasted bread with melted cheese',
        price: 8.99,
        tags: ['Vegetarian', 'Comfort'],
        image:'/assets/lunch/GrilledCheese.jpg'
      },
      {
        name: 'Caesar Salad',
        description: 'Romaine lettuce, croutons, parmesan, and dressing',
        price: 11.99,
        tags: ['Fresh', 'Light'],
        image:'/assets/lunch/CaesarSalad.jpg'
      },
      {
        name: 'Quiche',
        description: 'Savory egg tart with cheese, veggies, or meat',
        price: 11.99,
        tags: ['Fresh Daily'],
        image:'/assets/lunch/Quiche.jpg'
      },
      {
        name: 'Panini',
        description: 'Grilled sandwich with various fillings',
        price: 11.99,
        tags: ['Hot', 'Popular'],
        image:'/assets/lunch/Panini.jpg'
      },
      {
        name: 'Soup & Sandwich Combo',
        description: 'A small soup with a half sandwich',
        price: 12.99,
        tags: ['Combo', 'Value'],
        image:'/assets/lunch/Soup&SandwichCombo.jpg'
      },
      {
        name: 'Pasta Salad',
        description: 'Cold pasta with fresh veggies and dressing',
        price: 9.99,
        tags: ['Cold', 'Fresh'],
        image:'/assets/lunch/PastaSalad.jpg'
      },
      {
        name: 'Wraps',
        description: 'Choice of chicken, veggie, or falafel',
        price: 10.99,
        tags: ['Customizable'],
        image:'./assets/lunch/Wraps.jpg'
      }
    ],
    'Desserts': [
      {
        name: 'Cheesecake',
        description: 'Rich, creamy dessert with a graham cracker crust',
        price: 6.99,
        tags: ['Classic', 'Popular'],
        image:'./assets/Desserts/Cheesecake.jpg'
      },
      {
        name: 'Tiramisu',
        description: 'Italian coffee-flavored layered dessert',
        price: 7.99,
        tags: ['Italian', 'Specialty'],
        image:'./assets/Desserts/Tiramisu.jpg'
      },
      {
        name: 'Brownie',
        description: 'Chocolatey, fudgy square treat',
        price: 4.99,
        tags: ['Classic', 'Hot'],
        image:'./assets/Desserts/Brownie.jpg'
      },
      {
        name: 'Panna Cotta',
        description: 'Italian vanilla-flavored creamy dessert',
        price: 6.99,
        tags: ['Italian', 'Light'],
        image:'./assets/Desserts/PannaCotta.jpg'
      },
      {
        name: 'Lemon Tart',
        description: 'Tangy, sweet, and buttery tart',
        price: 5.99,
        tags: ['Fresh', 'Light'],
        image:'./assets/Desserts/LemonTart.jpg'
      },
      {
        name: 'Crème Brûlée',
        description: 'Rich custard with a caramelized sugar top',
        price: 7.99,
        tags: ['French', 'Classic'],
        image:'./assets/Desserts/CrèmeBrûlée.jpg'
      },
      {
        name: 'Apple Pie',
        description: 'Classic warm dessert with cinnamon apples',
        price: 5.99,
        tags: ['Classic', 'Warm'],
        image:'./assets/Desserts/ApplePie.jpg'
      },
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a gooey center',
        price: 7.99,
        tags: ['Hot', 'Popular'],
        image:'./assets/Desserts/ChocolateLavaCake.jpg'
      },
      {
        name: 'Fruit Tart',
        description: 'Pastry crust filled with custard and fresh fruit',
        price: 6.99,
        tags: ['Fresh', 'Light'],
        image:'./assets/Desserts/FruitTart.jpg'
      },
      {
        name: 'Ice Cream Sundae',
        description: 'Ice cream topped with syrup, nuts, and whipped cream',
        price: 7.99,
        tags: ['Classic', 'Cold'],
        image:'./assets/Desserts/IceCreamSundae.jpg'
      }
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" sx={{ mb: 4 }}>Our Menu</Typography>
      
      <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs
          value={category}
          onChange={(e, newValue) => setCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {menuCategories.map((cat, index) => (
            <Tab key={cat} label={cat} value={index} />
          ))}
        </Tabs>
      </Paper>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={4}>
          {menuItems[menuCategories[category]]?.map((item, index) => (
            <Grid item xs={12} md={6} key={index}>
             <MotionCard
                variants={itemVariants}
                sx={{ height: '100%' }}
              >
                <CardContent>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2 
                  }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="h6" color="primary">
                        ${item.price.toFixed(2)}
                      </Typography>
                    </Box>

                    <Typography color="text.secondary">
                      {item.description}
                    </Typography>

                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      flexWrap: 'wrap' 
                    }}>
                      {item.tags.map((tag) => (
                        <Typography
                          key={tag}
                          variant="caption"
                          sx={{
                            bgcolor: 'primary.light',
                            color: 'white',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1
                          }}
                        >
                          {tag}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Menu;