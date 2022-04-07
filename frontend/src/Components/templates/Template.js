export const USER_INFO_TEMPLATE = {
    faceId: String,
    sex: String,
    age: Number,
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: Number,
    street: String,
    city: String,
    state: String,
    zipcode: Number,
}

export const PRODUCT_INFO_TEMPLATE = {
    productId: String,
    productName: String,
    unitPrice: Number,
    productImage: String
}

export const PRODUCT_PURCHASE_TEMPLATE = {
    purchaseId: String,
    productId: String,
    quantity: Number,
    purchaseDate: Date,
}

export const PURCHASE_TEMPLATE = Array[PRODUCT_PURCHASE_TEMPLATE]