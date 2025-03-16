import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchReservations, 
  addReservation, 
  editReservation, 
  deleteReservation 
} from '../store/slices/reservationSlice';
import dayjs from 'dayjs'; // Import dayjs for date handling

// Material UI imports
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  IconButton, 
  Box, 
  Alert,
  Snackbar,
  Card,
  CardContent,
  CircularProgress,
  Slide,
  Grow,
  Fade,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  RestaurantMenu as RestaurantIcon, 
  Event as EventIcon, 
  AccessTime as TimeIcon, 
  Person as PersonIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.18)',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 12,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.15)',
  },
}));

const CardHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

// Helper for formatting time
const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Generate time options
const generateTimeOptions = () => {
  const times = [];
  for (let h = 9; h <= 21; h++) {
    for (let m = 0; m < 60; m += 30) {
      times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    }
  }
  return times;
};



const Reservations = () => {
  const dispatch = useDispatch();
  const { reservations, loading, error } = useSelector((state) => state.reservation);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: dayjs().format('YYYY-MM-DD'),
    time: generateTimeOptions()[0], 
    partySize: 2,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  useEffect(() => {
    const loadReservations = async () => {
      try {
        await dispatch(fetchReservations()).unwrap();
      } catch (err) {
        setSnackbar({
          open: true,
          message: `Failed to fetch reservations: ${err.message}`,
          severity: "error",
        });
      }
    };
    loadReservations();
  }, [dispatch]);
  
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: dayjs().format('YYYY-MM-DD'),
      time: generateTimeOptions()[0],
      partySize: 2,
    });
  };
  
  const handleOpenDialog = (reservation = null) => {
    if (reservation) {
      setCurrentReservation(reservation);
      setFormData({
        name: reservation.name,
        email: reservation.email || '',
        phone: reservation.phone || '',
        date: reservation.date ? dayjs(reservation.date).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'), // Fallback to today's date,
        time: reservation.time ? dayjs(reservation.time).format('HH:mm') :  generateTimeOptions()[0], // Fallback to the first time option,
        partySize: reservation.partySize || 2,
      });
    } else {
      setCurrentReservation(null);
      resetForm();
    }
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async () => {
    try {
      const submissionData = {
        ...formData,
        date: dayjs(formData.date).toISOString(), // Convert date to ISO string
        time: dayjs(`${formData.date}T${formData.time}`).toISOString(), // Combine date and time
      };
      console.log('Form Data:', formData);
      console.log("Prepared data for API:", submissionData); // Debug API payload
  
      if (currentReservation) {
        console.log("Editing reservation with ID:", currentReservation._id); // Debug reservation ID
        const response = await dispatch(
          editReservation({
            id: currentReservation._id,
            updatedData: submissionData,
          })
        ).unwrap();
        console.log("Edit response:", response); // Debug API response
        setSnackbar({
          open: true,
          message: "Reservation updated successfully!",
          severity: "success",
        });
      } else {
        console.log("Adding new reservation...");
        const response = await dispatch(addReservation(submissionData)).unwrap();
        console.log("Add response:", response); // Debug API response
        setSnackbar({
          open: true,
          message: "Reservation added successfully!",
          severity: "success",
        });
      }
      handleCloseDialog();
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setSnackbar({
        open: true,
        message: `Error: ${err.message || "Something went wrong"}`,
        severity: "error",
      });
    }
  };
  
  const handleDeleteReservation = async (id) => {
    try {
      await dispatch(deleteReservation(id)).unwrap();
      setSnackbar({
        open: true,
        message: 'Reservation deleted successfully!',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: `Error: ${err.message || 'Something went wrong'}`,
        severity: 'error',
      });
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          align="center" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            mb: 4,
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Reserve Your Table
        </Typography>
      </motion.div>
      
      <Grow in timeout={800}>
        <StyledPaper elevation={3} sx={{ mb: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <RestaurantIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" component="h2" gutterBottom>
              Make a New Reservation
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Book a table at our cafe for your special occasion or a casual meetup!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ 
                borderRadius: 8,
                px: 4,
                py: 1.5,
                boxShadow: '0 4px 14px 0 rgba(0,0,0,0.12)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Make Reservation
            </Button>
          </Box>
        </StyledPaper>
      </Grow>
      
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          mb: 4, 
          fontWeight: 'medium',
          position: 'relative',
          '&:after': {
            content: '""',
            position: 'absolute',
            bottom: -10,
            left: 0,
            width: 60,
            height: 4,
            backgroundColor: 'primary.main',
            borderRadius: 2
          }
        }}
      >
        Your Reservations
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      ) : reservations.length === 0 ? (
        <Fade in timeout={1000}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: 'center',
              backgroundColor: 'rgba(0,0,0,0.02)',
              borderRadius: 2
            }}
          >
            <Typography variant="h6" color="text.secondary">
              You don't have any reservations yet.
            </Typography>
          </Paper>
        </Fade>
      ) : (
        <Grid container spacing={3}>
          {reservations.map((reservation, index) => (
            <Grid item xs={12} md={6} key={reservation._id || index}>
              <Slide direction="up" in timeout={index * 200}>
                <StyledCard elevation={2}>
                  <CardHeader>
                    <Typography variant="h6">
                      {reservation.name}
                    </Typography>
                    <Box>
                      <IconButton 
                        size="small" 
                        color="inherit" 
                        onClick={() => handleOpenDialog(reservation)}
                        aria-label="Edit reservation"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="inherit" 
                        onClick={() => handleDeleteReservation(reservation._id)}
                        aria-label="Delete reservation"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardHeader>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2">
                            {reservation.date ? dayjs(reservation.date).format('DD/MM/YYYY') : 'No date'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <TimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2">
                            {reservation.time ? dayjs(reservation.time).format('h:mm A') : 'No time'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2">
                            {reservation.partySize} {reservation.partySize === 1 ? 'Person' : 'People'}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {reservation.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {reservation.phone}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </StyledCard>
              </Slide>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Reservation Form Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <DialogTitle>
          {currentReservation ? 'Edit Reservation' : 'New Reservation'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                variant="outlined"
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                variant="outlined"
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                variant="outlined"
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                variant="outlined"
                required
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="time-select-label">Time</InputLabel>
                <Select
                  labelId="time-select-label"
                  id="time-select"
                  name="time"
                  value={formData.time || generateTimeOptions()[0]} // Fallback to the first time option
                  onChange={handleInputChange}
                  label="Time"
                  required
                >
                  {generateTimeOptions().map((time) => (
                    <MenuItem key={time} value={time}>
                      {formatTime(time)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="party-size-label">Party Size</InputLabel>
                <Select
                  labelId="party-size-label"
                  id="party-size"
                  name="partySize"
                  value={formData.partySize || 2} 
                  onChange={handleInputChange}
                  label="Party Size"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num} {num === 1 ? 'Person' : 'People'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseDialog} 
            color="inherit" 
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            color="primary" 
            variant="contained"
            disabled={!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time}
          >
            
            {currentReservation ? 'Update' : 'Reserve'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};


export default Reservations;