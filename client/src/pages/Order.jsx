import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Modal,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  IconButton,
  Paper,
  Stack
} from '@mui/material';
import { motion } from "framer-motion";
import { useDispatch } from 'react-redux';

import { 
  Coffee,
  CoffeeIcon, 
  IceCream, 
  Cake,
  UtensilsCrossed,
  Car,
  Truck,
  ShoppingBag
} from 'lucide-react';

const MotionCard = motion.create(Card);
const MotionContainer = motion.create(Container);

const deliveryApps = [
  { 
    name: "Uber Eats", 
    url: "https://www.ubereats.com",
    icon: Car,
    color: "#000000",
    bgcolor: "#f1f1f1"
  },
  { 
    name: "Zomato", 
    url: "https://www.zomato.com",
    icon: Truck,
    color: "#ff3008",
    bgcolor: "#fee7e7"
  },
  { 
    name: "Swiggy", 
    url: "https://www.swiggy.com",
    icon: ShoppingBag,
    color: "#FF8000",
    bgcolor: "#fff4e6"
  }
];

const categoryIcons = {
  'Hot Drinks': Coffee,
  'Cold Drinks': IceCream,
  'Pastries': Cake,
  'Sandwiches': UtensilsCrossed
};

const Order = () => {
  const [category, setCategory] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [customizations, setCustomizations] = useState({});
  const dispatch = useDispatch();

  const categories = ['Hot Drinks', 'Cold Drinks', 'Pastries', 'Sandwiches'];

  const menuItems = {
    'Hot Drinks': [
      { 
        id: 'hd1', 
        name: 'Espresso', 
        description: 'Rich and bold single shot espresso', 
        price: 3.49, 
        image: '/assets/onlineOrder/espresso.webp',
        options: [
          { id: 'extra_shot', name: 'Extra Shot', price: 0.99 },
          { id: 'hot_extra', name: 'Extra Hot', price: 0 }
        ]
      },
      {
        id: 'hd2',
        name: 'Cappuccino',
        description: 'Espresso topped with foamy milk and chocolate powder',
        price: 4.49,
        image: '/assets/onlineOrder/cappuccino.jpg',
        options: [
          { id: 'extra_shot', name: 'Extra Shot', price: 0.99 },
          { id: 'soy_milk', name: 'Soy Milk', price: 0.50 },
          { id: 'extra_foam', name: 'Extra Foam', price: 0 }
        ]
      },
      {
        id: 'hd3',
        name: 'Café Latte',
        description: 'Espresso with steamed milk and light foam',
        price: 4.29,
        image: '/assets/onlineOrder/latte.jpg',
        options: [
          { id: 'extra_shot', name: 'Extra Shot', price: 0.99 },
          { id: 'almond_milk', name: 'Almond Milk', price: 0.50 },
          { id: 'vanilla_syrup', name: 'Vanilla Syrup', price: 0.75 }
        ]
      },
      {
        id: 'hd4',
        name: 'Hot Chocolate',
        description: 'Rich chocolate with steamed milk and whipped cream',
        price: 4.99,
        image: '/assets/onlineOrder/hotChocolate.jpg',
        options: [
          { id: 'extra_chocolate', name: 'Extra Chocolate', price: 0.75 },
          { id: 'marshmallows', name: 'Marshmallows', price: 0.50 },
          { id: 'no_whip', name: 'No Whipped Cream', price: 0 }
        ]
      },
      {
        id: 'hd5',
        name: 'Chai Tea Latte',
        description: 'Spiced black tea with steamed milk',
        price: 4.79,
        image: '/assets/onlineOrder/chai.jpg',
        options: [
          { id: 'extra_spicy', name: 'Extra Spicy', price: 0.50 },
          { id: 'oat_milk', name: 'Oat Milk', price: 0.50 },
          { id: 'honey', name: 'Honey', price: 0.25 }
        ]
      }
    ],
    'Cold Drinks': [
      {
        id: 'cd1',
        name: 'Iced Americano',
        description: 'Chilled espresso with cold water and ice',
        price: 3.99,
        image: '/assets/onlineOrder/icedamericano.jpg',
        options: [
          { id: 'extra_shot', name: 'Extra Shot', price: 0.99 },
          { id: 'light_ice', name: 'Light Ice', price: 0 }
        ]
      },
      {
        id: 'cd2',
        name: 'Frappuccino',
        description: 'Blended coffee with ice and whipped cream',
        price: 5.49,
        image: '/assets/onlineOrder/frappuccino.jpg',
        options: [
          { id: 'extra_coffee', name: 'Extra Coffee', price: 0.99 },
          { id: 'caramel_drizzle', name: 'Caramel Drizzle', price: 0.75 },
          { id: 'chocolate_chips', name: 'Chocolate Chips', price: 0.75 }
        ]
      },
      {
        id: 'cd3',
        name: 'Cold Brew',
        description: 'Smooth, slow-steeped cold coffee',
        price: 4.79,
        image: '/assets/onlineOrder/coldbrew.jpg',
        options: [
          { id: 'vanilla_cream', name: 'Vanilla Sweet Cream', price: 0.75 },
          { id: 'extra_brew', name: 'Extra Cold Brew', price: 0.99 }
        ]
      },
      {
        id: 'cd4',
        name: 'Iced Matcha Latte',
        description: 'Japanese green tea with cold milk and ice',
        price: 5.29,
        image: '/assets/onlineOrder/matchalatte.jpg',
        options: [
          { id: 'extra_matcha', name: 'Extra Matcha', price: 0.99 },
          { id: 'coconut_milk', name: 'Coconut Milk', price: 0.50 }
        ]
      },
      {
        id: 'cd5',
        name: 'Fruit Smoothie',
        description: 'Blended fresh fruits with yogurt',
        price: 5.99,
        image: '/assets/onlineOrder/smoothie.jpg',
        options: [
          { id: 'protein_boost', name: 'Protein Boost', price: 1.50 },
          { id: 'extra_berries', name: 'Extra Berries', price: 0.99 },
          { id: 'almond_milk', name: 'Almond Milk Base', price: 0.50 }
        ]
      }
    ],
    'Pastries': [
      {
        id: 'p1',
        name: 'Butter Croissant',
        description: 'Classic buttery, flaky French pastry',
        price: 3.29,
        image: '/assets/onlineOrder/croissant.jpg',
        options: [
          { id: 'warmed', name: 'Warmed', price: 0 },
          { id: 'chocolate_drizzle', name: 'Chocolate Drizzle', price: 0.75 }
        ]
      },
      {
        id: 'p2',
        name: 'Chocolate Muffin',
        description: 'Rich chocolate muffin with chocolate chips',
        price: 3.99,
        image: '/assets/onlineOrder/chocolatemuffin.jpg',
        options: [
          { id: 'warmed', name: 'Warmed', price: 0 },
          { id: 'extra_chips', name: 'Extra Chocolate Chips', price: 0.75 }
        ]
      },
      {
        id: 'p3',
        name: 'Cinnamon Roll',
        description: 'Fresh-baked roll with cream cheese frosting',
        price: 4.49,
        image: '/assets/onlineOrder/cinnamonroll.jpg',
        options: [
          { id: 'extra_frosting', name: 'Extra Frosting', price: 0.75 },
          { id: 'warmed', name: 'Warmed', price: 0 },
          { id: 'extra_cinnamon', name: 'Extra Cinnamon', price: 0.50 }
        ]
      },
      {
        id: 'p4',
        name: 'Blueberry Scone',
        description: 'Buttery scone filled with fresh blueberries',
        price: 3.79,
        image: '/assets/onlineOrder/scone.jpg',
        options: [
          { id: 'warmed', name: 'Warmed', price: 0 },
          { id: 'butter', name: 'With Butter', price: 0.25 }
        ]
      },
      {
        id: 'p5',
        name: 'Almond Danish',
        description: 'Flaky pastry with almond filling and sliced almonds',
        price: 4.29,
        image: '/assets/onlineOrder/danish.jpg',
        options: [
          { id: 'warmed', name: 'Warmed', price: 0 },
          { id: 'extra_almonds', name: 'Extra Almonds', price: 0.75 }
        ]
      }
    ],
    'Sandwiches': [
      {
        id: 's1',
        name: 'Chicken Avocado',
        description: 'Grilled chicken with fresh avocado and greens',
        price: 8.99,
        image: '/assets/onlineOrder/chickenavocado.jpg',
        options: [
          { id: 'extra_avocado', name: 'Extra Avocado', price: 1.50 },
          { id: 'toasted', name: 'Toasted', price: 0 },
          { id: 'gluten_free', name: 'Gluten-Free Bread', price: 1.00 }
        ]
      },
      {
        id: 's2',
        name: 'Caprese Panini',
        description: 'Mozzarella, tomato, and basil on pressed ciabatta',
        price: 7.99,
        image: '/assets/onlineOrder/caprese.jpg',
        options: [
          { id: 'extra_mozzarella', name: 'Extra Mozzarella', price: 1.50 },
          { id: 'balsamic_glaze', name: 'Balsamic Glaze', price: 0.75 }
        ]
      },
      {
        id: 's3',
        name: 'Turkey Club',
        description: 'Turkey, bacon, lettuce, and tomato on toasted bread',
        price: 9.49,
        image: '/assets/onlineOrder/turkeyclub.jpg',
        options: [
          { id: 'extra_bacon', name: 'Extra Bacon', price: 1.99 },
          { id: 'avocado', name: 'Add Avocado', price: 1.50 },
          { id: 'gluten_free', name: 'Gluten-Free Bread', price: 1.00 }
        ]
      },
      {
        id: 's4',
        name: 'Veggie Deluxe',
        description: 'Grilled vegetables with hummus and feta',
        price: 7.49,
        image: '/assets/onlineOrder/veggiedeluxe.jpg',
        options: [
          { id: 'extra_hummus', name: 'Extra Hummus', price: 0.99 },
          { id: 'extra_feta', name: 'Extra Feta', price: 1.00 },
          { id: 'gluten_free', name: 'Gluten-Free Bread', price: 1.00 }
        ]
      },
      {
        id: 's5',
        name: 'Tuna Melt',
        description: 'House-made tuna salad with melted cheddar',
        price: 8.49,
        image: '/assets/onlineOrder/tunamelt.jpg',
        options: [
          { id: 'extra_cheese', name: 'Extra Cheese', price: 1.00 },
          { id: 'toasted', name: 'Extra Toasted', price: 0 },
          { id: 'gluten_free', name: 'Gluten-Free Bread', price: 1.00 }
        ]
      }
    ]
  };

  const handleCustomizationChange = (itemId, optionId) => {
    setCustomizations(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [optionId]: !prev[itemId]?.[optionId]
      }
    }));
  };

  const calculateItemTotal = (item) => {
    let total = item.price;
    if (customizations[item.id]) {
      item.options?.forEach(option => {
        if (customizations[item.id][option.id]) {
          total += option.price;
        }
      });
    }
    return total;
  };

  const handleAddToOrder = (item) => {
    setSelectedItem({
      ...item,
      customizations: customizations[item.id],
      finalPrice: calculateItemTotal(item)
    });
    setOpen(true);
  };

  const handleAppSelection = (appUrl) => {
    window.open(appUrl, '_blank');
    setOpen(false);
    setCustomizations({});
  };

  return (
    <MotionContainer 
      maxWidth="lg" 
      sx={{ py: 8 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h3" sx={{ mb: 4, fontWeight: 700 }}>
        Online Order
      </Typography>

      <Paper elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs 
          value={category} 
          onChange={(e, newValue) => setCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            '& .MuiTab-root': {
              minHeight: 72,
              px: 4
            }
          }}
        >
          {categories.map((cat, index) => {
            const Icon = categoryIcons[cat];
            return (
              <Tab 
                key={cat} 
                label={cat}
                value={index}
                icon={<Icon size={24} />}
                sx={{ 
                  '&.Mui-selected': {
                    color: 'primary.main',
                    fontWeight: 600
                  }
                }}
              />
            );
          })}
        </Tabs>
      </Paper>

      <Grid container spacing={4}>
        {menuItems[categories[category]]?.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <MotionCard 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.5 }}
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardMedia 
                component="img" 
                height="200" 
                image={item.image} 
                alt={item.name} 
                sx={{ objectFit: 'cover' }} 
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {item.description}
                </Typography>
                {item.options && (
                  <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
                    <FormGroup>
                      {item.options.map(option => (
                        <FormControlLabel
                          key={option.id}
                          control={
                            <Checkbox 
                              checked={!!customizations[item.id]?.[option.id]}
                              onChange={() => handleCustomizationChange(item.id, option.id)}
                            />
                          }
                          label={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                              <Typography variant="body2">{option.name}</Typography>
                              {option.price > 0 && (
                                <Typography variant="body2" color="text.secondary">
                                  +${option.price.toFixed(2)}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                )}
                <Typography variant="h6" color="primary" fontWeight={600}>
                  ${calculateItemTotal(item).toFixed(2)}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large"
                  onClick={() => handleAddToOrder(item)}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Order Online
                </Button>
              </CardActions>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      <Modal 
        open={open} 
        onClose={() => setOpen(false)} 
        aria-labelledby="select-delivery-app"
      >
        <Paper sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          p: 4,
          borderRadius: 2
        }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Select Delivery Service
          </Typography>
          
          <Stack spacing={2}>
            {deliveryApps.map(app => (
              <Button
                key={app.name}
                variant="contained"
                fullWidth
                startIcon={<app.icon size={24} />}
                onClick={() => handleAppSelection(app.url)}
                sx={{
                  bgcolor: app.bgcolor,
                  color: app.color,
                  '&:hover': {
                    bgcolor: app.bgcolor,
                    filter: 'brightness(0.95)'
                  },
                  p: 2,
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Order with {app.name}
              </Button>
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => setOpen(false)}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
          </Stack>
        </Paper>
      </Modal>
    </MotionContainer>
  );
};

export default Order;