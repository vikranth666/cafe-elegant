import { Box, Typography, Container, Button, Grid, Paper } from '@mui/material';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';

// Custom theme colors with mint as the primary color
const theme = {
  primary: '#4ECDC4',     // Fresh mint as primary color
  secondary: '#2A9D8F',   // Darker mint for contrast
  accent: '#F8F9FA',      // Light gray-white
  light: '#FFFFFF',       // White
  dark: '#2F3E46',        // Dark green-gray
  highlight: '#FFA807'    // Sunny yellow as accent
};

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);
const MotionButton = motion.create(Button);
const MotionPaper = motion.create(Paper);

// Coffee cup animation for loading
const coffeeCup = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      delay: 0.2
    }
  }
};

// Staggered text animation
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Home = () => {
  return (
    <Box sx={{ backgroundColor: theme.light }}>
      {/* Hero Section with Parallax Effect */}
      <MotionBox
        sx={{
          height: '100vh',
          background: `linear-gradient(rgba(47, 62, 70, 0.3), rgba(47, 62, 70, 0.3)), url("./assets/home/coffeeShop.jpg")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Floating coffee beans background elements */}
        <MotionBox
          sx={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            top: '15%',
            left: '10%',
            opacity: 0.7,
            backgroundImage: 'url("./assets/home/coffeeBeans.jpg")',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut"
          }}
        />
        <MotionBox
          sx={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            bottom: '20%',
            right: '15%',
            opacity: 0.7,
            backgroundImage: 'url("./assets/home/coffeeCup.jpg")',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
            delay: 1
          }}
        />

        <Container maxWidth="md" sx={{ textAlign: 'center', zIndex: 2 }}>
          <MotionBox
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <MotionTypography
              variant="h1"
              sx={{ 
                mb: 4, 
                fontWeight: 700,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                fontFamily: '"Playfair Display", serif'
              }}
              variants={coffeeCup}
            >
              Welcome to Café Elegante
            </MotionTypography>
            <MotionTypography
              variant="h5"
              sx={{ 
                mb: 6,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                fontFamily: '"Poppins", sans-serif',
                letterSpacing: '1px'
              }}
              variants={coffeeCup}
            >
              Experience the perfect blend of tradition and innovation
            </MotionTypography>

            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <MotionButton
                component={Link}
                to="/reservations"
                variant="contained"
                size="large"
                sx={{ 
                  mr: 2, 
                  bgcolor: theme.primary,
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: '30px',
                  boxShadow: '0 4px 10px rgba(78, 205, 196, 0.4)',
                  '&:hover': {
                    bgcolor: theme.secondary
                  }
                }}
                whilehover={{ 
                  scale: 1.05,
                  boxShadow: '0 6px 15px rgba(78, 205, 196, 0.5)'
                }}
                whiletap={{ scale: 0.95 }}
              >
                Reserve a Table
              </MotionButton>
              <MotionButton
                component={Link}
                to="/order"
                variant="outlined"
                size="large"
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  borderWidth: '2px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: '30px',
                  '&:hover': {
                    borderColor: theme.primary,
                    bgcolor: 'rgba(78, 205, 196, 0.2)'
                  }
                }}
                whilehover={{ 
                  scale: 1.05,
                  backgroundColor: 'rgba(78, 205, 196, 0.2)',
                  borderColor: theme.primary
                }}
                whiletap={{ scale: 0.95 }}
              >
                Order Online
              </MotionButton>
            </MotionBox>
          </MotionBox>
        </Container>

        {/* Scroll down indicator */}
        <MotionBox
          sx={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            textAlign: 'center'
          }}
          animate={{ 
            y: [0, 10, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut"
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>Scroll Down</Typography>
          <Box sx={{ 
            width: '30px',
            height: '30px',
            margin: '0 auto',
            backgroundImage: 'url("./assets/home/arrowdown.png")',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }} />
        </MotionBox>
      </MotionBox>

      {/* Special Offers Banner */}
      <Box sx={{ 
        bgcolor: theme.highlight, 
        color: theme.dark,
        py: 1.5,
        textAlign: 'center'
      }}>
        <MotionTypography
          variant="subtitle1"
          sx={{ fontWeight: 600 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          ✨ Special Offer: 20% off any pastry with coffee purchase - Today Only! ✨
        </MotionTypography>
      </Box>

      {/* Featured Sections with Cards */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <MotionTypography
          variant="h2"
          sx={{ 
            mb: 6, 
            textAlign: 'center',
            color: theme.dark,
            fontFamily: '"Playfair Display", serif'
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          Discover Our World
        </MotionTypography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <MotionPaper
              elevation={3}
              sx={{ 
                borderRadius: '16px',
                overflow: 'hidden',
                height: '450px',
                display: 'flex',
                flexDirection: 'column',
                border: `1px solid ${theme.accent}`
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whilehover={{ 
                y: -10,
                boxShadow: '0 12px 30px rgba(78, 205, 196, 0.15)'
              }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  height: '220px',
                  backgroundImage: 'url("./assets/home/menu.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" sx={{ mb: 2, color: theme.dark, fontWeight: 600 }}>
                  Our Menu
                </Typography>
                <Typography sx={{ mb: 3, color: theme.dark, flexGrow: 1 }}>
                  Discover our carefully curated selection of artisanal coffees and delectable pastries, made fresh daily with love and expertise.
                </Typography>
                <Button 
                  component={Link} 
                  to="/menu" 
                  variant="contained" 
                  sx={{ 
                    bgcolor: theme.primary,
                    alignSelf: 'flex-start',
                    borderRadius: '30px',
                    px: 3,
                    '&:hover': {
                      bgcolor: theme.secondary
                    }
                  }}
                >
                  View Menu
                </Button>
              </Box>
            </MotionPaper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <MotionPaper
              elevation={3}
              sx={{ 
                borderRadius: '16px',
                overflow: 'hidden',
                height: '450px',
                display: 'flex',
                flexDirection: 'column',
                border: `1px solid ${theme.accent}`
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whilehover={{ 
                y: -10,
                boxShadow: '0 12px 30px rgba(78, 205, 196, 0.15)'
              }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  height: '220px',
                  backgroundImage: 'url("./assets/home/store.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" sx={{ mb: 2, color: theme.dark, fontWeight: 600 }}>
                  Store
                </Typography>
                <Typography sx={{ mb: 3, color: theme.dark, flexGrow: 1 }}>
                  Take home our signature coffee beans, brewing equipment, and cafe merchandise to enjoy the Elegante experience wherever you are.
                </Typography>
                <Button 
                  component={Link} 
                  to="/store" 
                  variant="contained" 
                  sx={{ 
                    bgcolor: theme.primary,
                    alignSelf: 'flex-start',
                    borderRadius: '30px',
                    px: 3,
                    '&:hover': {
                      bgcolor: theme.secondary
                    }
                  }}
                >
                  Shop Now
                </Button>
              </Box>
            </MotionPaper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <MotionPaper
              elevation={3}
              sx={{ 
                borderRadius: '16px',
                overflow: 'hidden',
                height: '450px',
                display: 'flex',
                flexDirection: 'column',
                border: `1px solid ${theme.accent}`
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whilehover={{ 
                y: -10,
                boxShadow: '0 12px 30px rgba(78, 205, 196, 0.15)'
              }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  height: '220px',
                  backgroundImage: 'url("./assets/home/location.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" sx={{ mb: 2, color: theme.dark, fontWeight: 600 }}>
                  Visit Us
                </Typography>
                <Typography sx={{ mb: 3, color: theme.dark, flexGrow: 1 }}>
                Find us in the heart of the city. Our cozy atmosphere and friendly staff are ready to welcome you daily from 7 AM to 9 PM with warmth and care.
                </Typography>
                <Button 
                  component={Link} 
                  to="/location" 
                  variant="contained" 
                  sx={{ 
                    bgcolor: theme.primary,
                    alignSelf: 'flex-start',
                    borderRadius: '30px',
                    px: 3,
                    '&:hover': {
                      bgcolor: theme.secondary
                    }
                  }}
                >
                  Get Directions
                </Button>
              </Box>
            </MotionPaper>
          </Grid>
        </Grid>
      </Container>

      {/* About Section with Image */}
      <Box sx={{ bgcolor: theme.primary, py: 10, color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    height: '400px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      backgroundImage: 'url("./assets/home/about.jpg")',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'transform 0.5s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </Box>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Typography variant="h2" sx={{ mb: 4, fontFamily: '"Playfair Display", serif' }}>
                  Our Story
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.6 }}>
                  Café Elegante began with a simple vision: to create a space where quality coffee meets exceptional service in an elegant atmosphere.
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
                  Since opening our doors in 2015, we've been dedicated to sourcing the finest beans from sustainable farms around the world, and crafting every cup with expertise and care.
                </Typography>
                <Button 
                  component={Link} 
                  to="/about" 
                  variant="outlined" 
                  sx={{ 
                    color: 'white',
                    borderColor: 'white',
                    borderWidth: '2px',
                    borderRadius: '30px',
                    px: 4,
                    py: 1,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                  whilehover={{ scale: 1.05 }}
                  whiletap={{ scale: 0.95 }}
                >
                  Learn More
                </Button>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonial Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <MotionTypography
          variant="h2"
          sx={{ 
            mb: 6, 
            textAlign: 'center',
            color: theme.dark,
            fontFamily: '"Playfair Display", serif'
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          What Our Customers Say
        </MotionTypography>

        <Grid container spacing={4}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} md={4} key={item}>
              <MotionPaper
                elevation={2}
                sx={{ 
                  borderRadius: '16px',
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  pt: 6,
                  borderTop: `4px solid ${theme.primary}`
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
                whilehover={{ y: -10 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-25px',
                    left: '30px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundImage: `url("./assets/home/customer${item}.jpg")`,
                    backgroundSize: 'cover',
                    border: `3px solid ${theme.primary}`,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  }}
                />
                <Box sx={{ mb: 3, color: theme.primary, fontSize: '24px' }}>★★★★★</Box>
                <Typography variant="body1" sx={{ mb: 3, flexGrow: 1, fontStyle: 'italic' }}>
                  {item === 1 && '"The atmosphere is cozy, the staff is friendly, and the pastries are to die for. I come here every morning before work!"'}
                  {item === 2 && '"Best coffee I\'ve had in the city! Their signature mint latte is absolutely refreshing and unique."'}
                  {item === 3 && '"A hidden gem with amazing coffee and a peaceful ambiance. Perfect for both work meetings and casual catch-ups."'}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: theme.dark, fontWeight: 600 }}>
                  {item === 1 && '— Allu Arjun'}
                  {item === 2 && '— B Vikranth'}
                  {item === 3 && '— kl Rahul'}
                </Typography>
              </MotionPaper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Instagram Feed Section */}
      <Box sx={{ bgcolor: theme.accent, py: 10 }}>
        <Container maxWidth="lg">
          <MotionTypography
            variant="h2"
            sx={{ 
              mb: 2, 
              textAlign: 'center',
              color: theme.dark,
              fontFamily: '"Playfair Display", serif'
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            Follow Our Journey
          </MotionTypography>
          
          <MotionTypography
            variant="h6"
            sx={{ 
              mb: 6, 
              textAlign: 'center',
              color: theme.dark,
              opacity: 0.8
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            @cafeelegante
          </MotionTypography>

          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={6} md={2} key={item}>
                <MotionBox
                  sx={{ 
                    paddingTop: '100%', 
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: item * 0.1 }}
                  whilehover={{ 
                    scale: 1.05,
                    boxShadow: '0 8px 16px rgba(78, 205, 196, 0.2)',
                  }}
                  viewport={{ once: true }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url("./assets/home/insta-${item}.jpg")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      '&:hover': {
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(78, 205, 196, 0.3)',
                        }
                      }
                    }}
                  />
                </MotionBox>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box sx={{ bgcolor: theme.primary, py: 10, color: 'white' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <MotionBox
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Typography variant="h3" sx={{ mb: 3, fontFamily: '"Playfair Display", serif' }}>
              Stay Connected
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
              Subscribe to our newsletter for exclusive offers, events, and brewing tips.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              <input
                placeholder="Your email address"
                style={{
                  padding: '12px 20px',
                  borderRadius: '30px 0 0 30px',
                  border: 'none',
                  width: '300px',
                  outline: 'none'
                }}
              />
              <Button
                variant="contained"
                sx={{ 
                  bgcolor: theme.dark,
                  borderRadius: '0 30px 30px 0',
                  px: 3,
                  '&:hover': {
                    bgcolor: '#1e2329'
                  }
                }}
              >
                Subscribe
              </Button>
            </Box>
          </MotionBox>
        </Container>
      </Box>

      {/* Footer Quick Links */}
      <Box sx={{ bgcolor: theme.dark, py: 5, color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Café Elegante
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
                A place where every cup tells a story and every visit becomes a cherished memory.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {['facebook', 'instagram', 'twitter'].map(social => (
                  <Box
                    key={social}
                    component="a"
                    href={`#${social}`}
                    sx={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': { bgcolor: theme.primary }
                    }}
                  >
                    <Box 
                      sx={{
                        width: '20px',
                        height: '20px',
                        backgroundImage: `url("./assets/home/${social}-icon.png")`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat'
                      }} 
                    />
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="h6" sx={{ mb: 3 }}>Quick Links</Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {['Home', 'About', 'Menu', 'Reservations', 'Contact'].map(link => (
                  <Box component="li" key={link} sx={{ mb: 1 }}>
                    <Box 
                      component={Link} 
                      to={`/${link.toLowerCase()}`}
                      sx={{ 
                        color: 'white', 
                        textDecoration: 'none',
                        opacity: 0.8,
                        '&:hover': { 
                          opacity: 1,
                          color: theme.primary
                        }
                      }}
                    >
                      {link}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="h6" sx={{ mb: 3 }}>Shop</Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {['Coffee', 'Equipment', 'Gifts', 'Subscriptions'].map(link => (
                  <Box component="li" key={link} sx={{ mb: 1 }}>
                    <Box 
                      component={Link} 
                      to={`/shop/${link.toLowerCase()}`}
                      sx={{ 
                        color: 'white', 
                        textDecoration: 'none',
                        opacity: 0.8,
                        '&:hover': { 
                          opacity: 1,
                          color: theme.primary
                        }
                      }}
                    >
                      {link}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 3 }}>Hours & Location</Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                123 Coffee Street, Secunderabad
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
                Monday - Friday: 7AM - 8PM<br />
                Saturday - Sunday: 8AM - 9PM
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Phone: (+91)9121742735<br />
                Email: hello@cafeelegante.com
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Copyright */}
      <Box sx={{ bgcolor: '#232a31', py: 2, color: 'white', textAlign: 'center' }}>
        <Typography variant="body2" sx={{ opacity: 0.6 }}>
          © {new Date().getFullYear()} Café Elegante. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;