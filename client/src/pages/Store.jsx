import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Typography, 
  Button,
  Drawer,
  IconButton,
  Badge,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import { motion } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { addItem, removeItem, updateQuantity } from '../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';


const MotionCard = motion.create(Card);

const Store = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [category, setCategory] = useState(0);
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const navigate = useNavigate();

  const categories = ['Coffee Beans', 'Brewing Equipment', 'Accessories'];

  const products = {
    'Coffee Beans': [
      {
        id: 1,
        name: 'Signature House Blend',
        description: 'Our signature medium roast blend with notes of chocolate and caramel',
        price: 14.99,
        image:'./assets/store/SHB.jpeg'
      },
      {
        id: 2,
        name: 'Ethiopian Yirgacheffe',
        description: 'Light roast single-origin with floral and citrus notes',
        price: 16.99,
        image:'/assets/store/EY.jpeg'
      },
      {
        id: 3,
        name: 'Colombian Supremo',
        description: 'Medium-dark roast with balanced sweetness and nutty undertones',
        price: 15.99,
        image:'/assets/store/CS.jpeg'
      },
      {
        id: 4,
        name: 'Dark Roast Espresso',
        description: 'Bold and rich espresso blend perfect for milk-based drinks',
        price: 15.99,
        image:'/assets/store/DR.webp'
      },
      {
        id: 5,
        name: 'Costa Rican Tarrazu',
        description: 'Medium roast with bright acidity and honey sweetness',
        price: 17.99,
        image:'/assets/store/CRT.webp'
      },
      {
        id: 6,
        name: 'Decaf Blend',
        description: 'Swiss Water Process decaf with full flavor and no caffeine',
        price: 16.99,
        image:'/assets/store/DB.webp'
      }
    ],
    'Brewing Equipment': [
      {
        id: 7,
        name: 'Pour-Over Coffee Maker',
        description: 'Classic glass pour-over dripper with wooden collar',
        price: 29.99,
        image:'/assets/store/POCM.webp'
      },
      {
        id: 8,
        name: 'French Press',
        description: 'Double-wall stainless steel French press, 32oz capacity',
        price: 39.99,
        image:'/assets/store/FP.webp'
      },
      {
        id: 9,
        name: 'Precision Coffee Scale',
        description: 'Digital scale with timer for precise brewing, 0.1g accuracy',
        price: 24.99,
        image:'/assets/store/PCS.webp'
      },
      {
        id: 10,
        name: 'Gooseneck Kettle',
        description: 'Electric gooseneck kettle with temperature control',
        price: 79.99,
        image:'/assets/store/GK.webp'
      },
      {
        id: 11,
        name: 'Burr Coffee Grinder',
        description: 'Conical burr grinder with 40 grind settings',
        price: 99.99,
        image:'/assets/store/BCG.webp'
      },
      {
        id: 12,
        name: 'AeroPress Coffee Maker',
        description: 'Portable coffee maker for rich, smooth coffee',
        price: 34.99,
        image:'/assets/store/ACM.webp'
      }
    ],
    'Accessories': [
      {
        id: 13,
        name: 'Coffee Filter Papers',
        description: 'Pack of 100 biodegradable filter papers',
        price: 8.99,
        image:'/assets/store/paper.webp'
      },
      {
        id: 14,
        name: 'Coffee Storage Container',
        description: 'Airtight container with CO2 release valve',
        price: 19.99,
        image:'/assets/store/container.webp'
      },
      {
        id: 15,
        name: 'Cleaning Tablets',
        description: 'Coffee machine cleaning tablets, pack of 10',
        price: 12.99,
        image:'/assets/store/tablets.webp'
      },
      {
        id: 16,
        name: 'Coffee Server',
        description: 'Glass coffee server with measurement marks, 600ml',
        price: 24.99,
        image:'/assets/store/server.webp'
      },
      {
        id: 17,
        name: 'Coffee Scoop',
        description: 'Stainless steel measuring scoop with clip',
        price: 9.99,
        image:'/assets/store/scoop.webp'
      },
      {
        id: 18,
        name: 'Milk Pitcher',
        description: 'Stainless steel milk frothing pitcher, 12oz',
        price: 14.99,
        image:'/assets/store/pitcher.webp'
      }
    ]
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      dispatch({ type: 'cart/setCart', payload: JSON.parse(savedCart) });
    }
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3">Coffee Store</Typography>
        <IconButton color="primary" onClick={() => setCartOpen(true)}>
          <Badge badgeContent={cartItems.length} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Box>

      <Paper elevation={3} sx={{ mb: 4 }}>
        <Tabs
          value={category}
          onChange={(e, newValue) => setCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          {categories.map((cat, index) => (
            <Tab key={cat} label={cat} value={index} />
          ))}
        </Tabs>
      </Paper>

      <Grid container spacing={4}>
        {products[categories[category]]?.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              sx={{ borderRadius: 2, overflow: 'hidden' }}
            >
              <CardMedia
                component="img"
                height="250"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>{product.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{product.description}</Typography>
                <Typography variant="h6" color="primary">${product.price.toFixed(2)}</Typography>
              </CardContent>
              <CardActions>
                <Button fullWidth variant="contained" onClick={() => dispatch(addItem(product))}>
                  Add to Cart
                </Button>
              </CardActions>
            </MotionCard>
          </Grid>
        ))}
      </Grid>

      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </Container>
  );
};

const Cart = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { items, total } = useSelector(state => state.cart);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) return;
    localStorage.setItem("cart", JSON.stringify(items));
    navigate('/checkout');
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Shopping Cart</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        {items.length === 0 ? (
          <Typography sx={{ textAlign: 'center', mt: 5 }}>🛒 Your cart is empty</Typography>
        ) : (
          <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 400 }}>
            {items.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 1, borderRadius: 2, bgcolor: '#f9f9f9' }}>
                <img src={item.image} alt={item.name} width={50} height={50} style={{ borderRadius: 8 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <Typography sx={{ color: 'gray' }}>Qty: {item.quantity} | ${(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
                <IconButton onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>
                  <AddIcon />
                </IconButton>
                <IconButton onClick={() => item.quantity > 1 ? dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 })) : dispatch(removeItem(item.id))}>
                  <RemoveIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {items.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>Total: ${total.toFixed(2)}</Typography>
            <Button variant="contained" fullWidth onClick={handleCheckout}>Proceed to Checkout</Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Store;
