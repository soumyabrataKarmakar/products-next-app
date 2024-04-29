import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Rating, Skeleton } from "@mui/material"
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid"
import axios from "axios"
import { useEffect, useState } from "react"
import Image from "next/image";


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

type Rate = {
  rate: number
  count: number
}

async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await axios.get("https://fakestoreapi.com/products")
    return response.data as Product[]
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

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

export default function ProductsTable() {
  const [products, setProducts] = useState<Array<Product>>([])
  const [productsLoading, setProductsLoading] = useState<boolean>(false)
  const [openImageDialog, setOpenImageDialog] = useState<boolean>(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>()

  const showProductImage = (params: GridCellParams): void => {
    console.log("product===================>", params)
    setOpenImageDialog(true)
    setSelectedProduct(params.row)
  }

  const handleCloseImageDialog = () => {
    setOpenImageDialog(false)
    setSelectedProduct(null)
  }

  useEffect(() => {
    (async function () {
      setProductsLoading(true)
      const productsData = await fetchProducts()
      console.log("productsData==============>", productsData)
      setProducts(productsData)
      setProductsLoading(false)
    })()
  }, [])

  return <>
    <Box sx={{ height: 400, width: '70%' }}>
      {productsLoading
        ? (
          <>
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <Skeleton variant="rectangular" width="100%" height={60} />
              </div>
            ))}
          </>
        ) : (
          <DataGrid
            className="products_table"
            onCellClick={showProductImage}
            rows={products}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        )}
    </Box>
    <Dialog
      className="image_dialog"
      open={openImageDialog}
      onClose={handleCloseImageDialog}
    >
      <DialogContent className="image_dialog_content">
        {selectedProduct?.image && <Image src={selectedProduct?.image} width={400} height={500} alt={selectedProduct?.title} />}
      </DialogContent>
      <DialogActions className="image_dialog_actions">
        <Button className="image_dialog_button" variant="contained" onClick={handleCloseImageDialog}>Close</Button>
      </DialogActions>
    </Dialog>
  </>
}
