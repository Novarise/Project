// FILEPATH: /Users/yekuande/Documents/Web-Projects/NovaRise/front/__tests__/Cart.test.tsx

import { render, screen } from '@testing-library/react'
import CartPage from '@/app/(routes)/cart/page'
import useCart from '@/hook/use-cart'
import '@testing-library/jest-dom'

jest.mock('@/hook/use-cart', () => ({
  __esModule: true,
  default: () => ({
    items: [
        {
            "_id": "65f3aac2393824b8b079ac8a",
            "storeId": "65344709f37c16aa365c3acd",
            "categoryId": {
                "_id": "65344a2df37c16aa365c3b29",
                "billboardId": "65344cc7f37c16aa365c3bd9",
                "storeId": "65344709f37c16aa365c3acd",
                "name": "Dark Coffee",
                "products": [],
                "createdAt": "2023-10-21T22:01:17.963Z",
                "updatedAt": "2023-10-21T22:23:38.863Z",
                "__v": 0
            },
            "name": "Kappa-2",
            "detail": [
                {
                    "price": 30,
                    "in_stock": 28,
                    "dynamicProperties": {
                        "_id": "65f3d9bfa4e7f9bf1aedb290",
                        "Size": "5oz Small"
                    },
                    "_id": "65f3aac2393824b8b079ac8b"
                }
            ],
            "isFeatured": false,
            "isArchived": false,
            "images": [
                "https://novarise-billboards-upload.s3.amazonaws.com/Woodsman-black-side.jpeg",
                "https://novarise-billboards-upload.s3.amazonaws.com/Woodsman-black.webp"
            ],
            "createdAt": "2024-03-15T01:56:18.808Z",
            "updatedAt": "2024-03-19T08:36:54.569Z",
            "__v": 0
        }
    ]
  })
}))



describe('CartPage', () => {
    beforeEach(() => {
        render(<CartPage />)
    })

    it('should render Shopping Cart heading', () => {
        const heading = screen.getByText('Shopping Cart')
        expect(heading).toBeInTheDocument()
    })

    it('should render cart item when cart is not empty', () => {
        const cartItem = screen.getByText(/5oz Small/)
        expect(cartItem).toBeInTheDocument()
    })

    // Add more tests as needed for your specific application
})