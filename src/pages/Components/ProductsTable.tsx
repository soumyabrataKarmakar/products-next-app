import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Rating, Skeleton } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid"
import axios from "axios"
import { useEffect, useState } from "react"
import Image from "next/image";

// Type definition of the Product data
type Product = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

// Type definition of rate field inside each product data as it is an nested object
type Rate = {
  rate: number
  count: number
}

// Asynchronous data fetch from products api with axios library
async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await axios.get("https://fakestoreapi.com/products")
    return response.data as Product[]
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

// Datagrid - Coloums field setup with the header name, width, field name, sortable or not, editable or not and also render nested object value in the datagrid
const columns: GridColDef<any>[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 90,
    sortable: true
  },
  {
    field: 'title',
    headerName: 'Title',
    width: 250,
    editable: false
  },
  {
    field: 'price',
    headerName: 'Price',
    width: 100,
    editable: false,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 400,
    editable: false,
    sortable: false
  },
  {
    field: 'category',
    headerName: 'Category',
    sortable: true,
    width: 160,
  },
  {
    field: 'rating',
    headerName: 'Rating (Reviews)',
    sortable: true,
    width: 160,
    valueGetter: (value: Rate, row) => `${value.rate} (${value.count} reviews)`,
  }
];

// Component to fetch data from api and render the data list in the Datagrid
export default function ProductsTable() {
  const [products, setProducts] = useState<Array<Product>>([]) // Component internal state to hold the products data
  const [productsLoading, setProductsLoading] = useState<boolean>(false) // Component internal state to identify the that the api call is happening or not
  const [openImageDialog, setOpenImageDialog] = useState<boolean>(false) // Component internal state to handle the image dialog should open or not
  const [selectedProduct, setSelectedProduct] = useState<Product | null>() // Component internal state to store the selected product data to show in the dialog

  // Function to habdle the cell clisck and open the image modal and set the selected data to the selected product state
  const showProductImage = (params: GridCellParams): void => {
    console.log("product===================>", params)
    setOpenImageDialog(true)
    setSelectedProduct(params.row)
  }

  // Function to handle the closing the image dialog and reset the selected product state to null
  const handleCloseImageDialog = () => {
    setOpenImageDialog(false)
    setSelectedProduct(null)
  }

  // First time render run useEffect and calling and IIFE(Immediately Invoked Function) to call the fetchProducts async method to fetch the products data.
  useEffect(() => {
    (async function () {
      setProductsLoading(true) // products loading value set to true
      const productsData = await fetchProducts() // fetching data through the function
      setProducts(productsData) // Set the products data in the compoent internal state
      setProductsLoading(false) // products loading value set to false
    })()
  }, [])

  return <>
    <Box sx={{ height: 400, width: '70%' }}>
      {productsLoading
        ? (
          // Skeleton loader to show during the API Call
          <>
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <Skeleton variant="rectangular" width="100%" height={60} />
              </div>
            ))}
          </>
        ) : (
          // Datagrid component to show the products data
          <DataGrid
            className="products_table"
            onCellClick={showProductImage} // On cell click handler
            rows={products} // Products data
            columns={columns} // Columns data
            initialState={{ // Table config setup
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]} // Default page size option
            checkboxSelection // Checkbox selection
            disableRowSelectionOnClick
          />
        )}
    </Box>
    {/* Dialog to show the image on clicking the cell */}
    <Dialog
      className="image_dialog"
      open={openImageDialog}
      onClose={handleCloseImageDialog}
    >
      <DialogContent className="image_dialog_content">
        {/* Rendering the image if available else show Image not avaialble */}
        {selectedProduct?.image ? <Image src={selectedProduct?.image} width={400} height={500} alt={selectedProduct?.title} /> : <p>Image not available</p>}
      </DialogContent>
      <DialogActions className="image_dialog_actions">
        {/* Dialog close button */}
        <Button className="image_dialog_button" variant="contained" onClick={handleCloseImageDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  </>
}
