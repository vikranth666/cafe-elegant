import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import { motion } from "framer-motion";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const MotionPaper = motion.create(Paper);

const Location = () => {
  const hours = [
    { day: 'Monday - Friday', hours: '7:00 AM - 9:00 PM' },
    { day: 'Saturday', hours: '8:00 AM - 10:00 PM' },
    { day: 'Sunday', hours: '8:00 AM - 8:00 PM' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={6}>
        {/* Hours & Contact Information */}
        <Grid item xs={12} md={6}>
          <MotionPaper
            elevation={3}
            sx={{ p: 4 }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" gutterBottom>Hours & Location</Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon sx={{ mr: 1 }} /> Hours
              </Typography>
              {hours.map((schedule) => (
                <Box key={schedule.day} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {schedule.day}
                  </Typography>
                  <Typography color="text.secondary">
                    {schedule.hours}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOnIcon sx={{ mr: 1 }} /> Address
              </Typography>
              <Typography>123 Coffee Street</Typography>
              <Typography>Secunderabad, 500080</Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneIcon sx={{ mr: 1 }} /> Contact
              </Typography>
              <Typography>Phone: (91) 9121742735</Typography>
              <Typography>Email: info@cafeelegante.com</Typography>
            </Box>
          </MotionPaper>
        </Grid>

        {/* Map */}
        <Grid item xs={12} md={6}>
          <MotionPaper
            elevation={3}
            sx={{ p: 2, height: '400px', overflow: 'hidden' }}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            >
              {/* Embedded Google Maps iframe */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d941.8517983399108!2d78.50359891704268!3d17.422246010544477!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99496e71175f%3A0x5dac4e00c985017e!2sSecret%20Kitchen%20Ristorante%20%26%20Bakery!5e0!3m2!1sen!2sin!4v1740030467024!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map Location"
              ></iframe>

              {/* Fallback message */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  bgcolor: 'rgba(255,255,255,0.8)',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className="map-error"
              >
                <Typography variant="body1" color="text.secondary">
                  Unable to load map. Check your browser settings.
                </Typography>
              </Box>
            </Box>
          </MotionPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Location;
