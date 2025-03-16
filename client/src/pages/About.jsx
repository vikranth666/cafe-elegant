import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';


const MotionBox = motion.create(Box);

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box 
        sx={{
          position: 'relative',
          height: '400px',
          width: '100%',
          mb: 6
        }}
      >
        <img 
          src="./assets/about/cafeinterior.jpg"
          alt="Café interior"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '8px'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px'
          }}
        >
          <Typography 
            variant="h2" 
            color="white" 
            align="center"
            sx={{ 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Our Story
          </Typography>
        </Box>
      </Box>

      {/* Mission Statement */}
      <MotionBox {...fadeIn} sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Crafting Moments, One Cup at a Time
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
          We believe that great coffee has the power to bring people together and create memorable experiences.
        </Typography>
      </MotionBox>

      {/* History Section */}
      <Grid container spacing={6} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <MotionBox {...fadeIn}>
            <img 
              src="./assets/about/oldcafe.jpg"
              alt="Old café photo"
              style={{
                width: '100%',
                height: '400px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          </MotionBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <MotionBox {...fadeIn} sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Our Beginning
            </Typography>
            <Typography paragraph>
              Founded in 2015, our café started as a small corner shop with a big dream: to serve the perfect cup of coffee while creating a warm, welcoming space for our community.
            </Typography>
            <Typography paragraph>
              What began as a passion project has grown into a beloved local destination, where quality coffee meets genuine hospitality. Our commitment to sourcing the finest beans and maintaining close relationships with farmers worldwide has remained unchanged.
            </Typography>
          </MotionBox>
        </Grid>
      </Grid>

      {/* Values Section */}
      <MotionBox {...fadeIn} sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Our Values
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              title: "Quality First",
              description: "We source only the highest quality beans and maintain strict standards in our brewing process."
            },
            {
              title: "Sustainability",
              description: "Our commitment to environmental responsibility influences everything from our sourcing to our packaging."
            },
            {
              title: "Community",
              description: "We're more than just a café - we're a gathering place for friends, families, and neighbors."
            }
          ].map((value, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
                <Typography variant="h5" gutterBottom>
                  {value.title}
                </Typography>
                <Typography color="text.secondary">
                  {value.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </MotionBox>

      {/* Team Section */}
      <MotionBox {...fadeIn} sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Meet Our Team
        </Typography>
        <Grid container spacing={4}>
          {[
            {
              name: "Sai Thompson",
              role: "Head Barista",
              image: "./assets/about/chef1.jpg"
            },
            {
              name: "Sreehari Johnson",
              role: "Master Roaster",
              image: "./assets/about/chef2.jpg"
            },
            {
              name: "Sunder Richardson",
              role: "Pastry Chef",
              image: "./assets/about/chef3.jpg"
            }
          ].map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ textAlign: 'center' }}>
                <img 
                  src={member.image}
                  alt={member.name}
                  style={{
                    width: '200px',
                    height: '200px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '16px'
                  }}
                />
                <Typography variant="h6">
                  {member.name}
                </Typography>
                <Typography color="text.secondary">
                  {member.role}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </MotionBox>

      {/* Visit Us Section */}
      <MotionBox {...fadeIn} sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h4" gutterBottom>
          Visit Us
        </Typography>
        <Typography variant="h6" color="text.secondary">
          123 Coffee Street, Secunderabad, zip 500080
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Monday - Friday: 7AM - 8PM
          <br />
          Saturday - Sunday: 8AM - 6PM
        </Typography>
      </MotionBox>
    </Container>
  
     
  );
};

export default About;