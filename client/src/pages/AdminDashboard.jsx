import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    fetchOrders, 
    updateOrder, 
    fetchProducts, 
    addProduct, 
    updateProduct,
    deleteProduct, 
    fetchReservations, 
    updateReservation 
} from "../store/slices/adminSlice";
import { 
    Container, 
    Typography, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    Button, 
    Select, 
    MenuItem, 
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    CircularProgress,
    Box,
    Card,
    CardContent,
    Grid,
    IconButton,
    Snackbar
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { orders = [], loading, error, products = [], reservations = [] } = useSelector(state => state.admin);

    // State for managing product dialogs
    const [productDialog, setProductDialog] = useState({ open: false, mode: 'add', data: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    
    // Categories for products
    const categories = ['Coffee Beans', 'Brewing Equipment', 'Accessories'];

    // Initial product form state
    const initialProductState = {
        name: "",
        description: "",
        price: "",
        category: "Coffee Beans",
        image: "/api/placeholder/400/300"
    };

    // State for managing new/edit product form
    const [productForm, setProductForm] = useState(initialProductState);

    useEffect(() => {
        dispatch(fetchOrders());
        dispatch(fetchProducts());
        dispatch(fetchReservations());
    }, [dispatch]);

    const handleOrderStatusChange = (orderId, status) => {
        dispatch(updateOrder({ orderId, status }));
    };

    const handleProductAction = async (mode, data = null) => {
        if (mode === 'edit' && data) {
            setProductForm(data);
        } else {
            setProductForm(initialProductState);
        }
        setProductDialog({ open: true, mode, data });
    };
    
    const handleProductSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("name", productForm.name);
            formData.append("description", productForm.description);
            formData.append("price", productForm.price);
            formData.append("category", productForm.category);
    
            // If the user uploaded a new image, append it
            if (productForm.image instanceof File) {
                formData.append("image", productForm.image);
            }
    
            if (productDialog.mode === "add") {
                await dispatch(addProduct(formData)).unwrap();
                setSnackbar({ open: true, message: "Product added successfully", severity: "success" });
            } else {
                await dispatch(updateProduct({ ...productForm, _id: productDialog.data._id })).unwrap();
                setSnackbar({ open: true, message: "Product updated successfully", severity: "success" });
            }
    
            setProductDialog({ open: false, mode: "add", data: null });
            setProductForm(initialProductState);
            dispatch(fetchProducts());
        } catch (error) {
            setSnackbar({ open: true, message: error.message || "Operation failed", severity: "error" });
        }
    };
    

    const handleDeleteProduct = async (productId) => {
        try {
            await dispatch(deleteProduct(productId)).unwrap();
            setSnackbar({ open: true, message: 'Product deleted successfully', severity: 'success' });
            dispatch(fetchProducts());
        } catch (error) {
            setSnackbar({ open: true, message: error.message || 'Delete failed', severity: 'error' });
        }
    };

    const handleReservationStatusChange = (reservationId, status) => {
        dispatch(updateReservation({ reservationId, status }));
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container>
            <Typography variant="h4" sx={{ my: 3 }}>Admin Dashboard</Typography>
            
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {/* Dashboard Summary */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Total Orders</Typography>
                            <Typography variant="h5">{orders.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Total Products</Typography>
                            <Typography variant="h5">{products.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Total Reservations</Typography>
                            <Typography variant="h5">{reservations.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Products Management */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5">Products</Typography>
                    <Button 
                        variant="contained" 
                        onClick={() => handleProductAction('add')}
                    >
                        Add New Product
                    </Button>
                </Box>
                
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map(product => (
                            <TableRow key={product._id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>
                                    <IconButton 
                                        color="primary"
                                        onClick={() => handleProductAction('edit', product)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        color="error"
                                        onClick={() => handleDeleteProduct(product._id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>

            {/* Orders Management */}
            <Typography variant="h5" sx={{ my: 3 }}>Orders</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order._id}>
                            <TableCell>{order._id}</TableCell>
                            <TableCell>{order.user?.email}</TableCell>
                            <TableCell>${order.total}</TableCell>
                            <TableCell>
                                <Select
                                    value={order.status}
                                    onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                                    size="small"
                                >
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Processing">Processing</MenuItem>
                                    <MenuItem value="Delivered">Delivered</MenuItem>
                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Button 
                                    variant="contained" 
                                    size="small"
                                    onClick={() => handleOrderStatusChange(order._id, "Delivered")}
                                >
                                    Mark as Delivered
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Reservations Management */}
            <Typography variant="h5" sx={{ my: 3 }}>Reservations</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Reservation ID</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
    {(Array.isArray(reservations) ? reservations : []).map(reservation => (
        <TableRow key={reservation._id}>
            <TableCell>{reservation._id}</TableCell>
            <TableCell>{reservation.user?.email}</TableCell>
            <TableCell>{reservation.date}</TableCell>
            <TableCell>
                <Select
                    value={reservation.status}
                    onChange={(e) => handleReservationStatusChange(reservation._id, e.target.value)}
                    size="small"
                >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
            </TableCell>
            <TableCell>
                <Button 
                    variant="contained"
                    size="small"
                    onClick={() => handleReservationStatusChange(reservation._id, "Confirmed")}
                >
                    Confirm
                </Button>
            </TableCell>
        </TableRow>
    ))}
</TableBody>

            </Table>

            {/* Product Dialog */}
            <Dialog 
                open={productDialog.open} 
                onClose={() => setProductDialog({ open: false, mode: 'add', data: null })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {productDialog.mode === 'add' ? 'Add New Product' : 'Edit Product'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Product Name"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                    <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        margin="normal"
                    />
                    <Select
                        fullWidth
                        value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        margin="normal"
                        sx={{ mt: 2 }}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setProductDialog({ open: false, mode: 'add', data: null })}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleProductSubmit} 
                        variant="contained"
                        disabled={loading}
                    >
                        {productDialog.mode === 'add' ? 'Add Product' : 'Update Product'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminDashboard;