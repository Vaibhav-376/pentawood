export const getAllProductsQuery = `
query GetAllProducts {
  products(first: 20) {
    edges {
      node {
        id
        title
        handle
        description

        featuredImage {
          url
          altText
        }

        images(first: 10) {
          edges {
            node {
              id
              url
              altText
            }
          }
        }

        options {
          id
          name
          values
        }

        variants(first: 20) {
          edges {
            node {
              id
              title
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}
`;

export const getCollectionProductsQuery = `
query GetCollectionProducts($handle: String!) {
  collection(handle: $handle) {
    id
    title
    description
    products(first: 20) {
      edges {
        node {
          id
          title
          handle
          description

          featuredImage {
            url
            altText
          }

          images(first: 10) {
            edges {
              node {
                id
                url
                altText
              }
            }
          }

          options {
            id
            name
            values
          }

          variants(first: 20) {
            edges {
              node {
                id
                title
                selectedOptions {
                  name
                  value
                }
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export const getCollectionsQuery = `
query GetCollections {
  collections(first: 20) {
    edges {
      node {
        id
        title
        handle
        description
        image {
          url
          altText
        }
      }
    }
  }
}
`;

export const getProductQuery = `
query GetProduct($handle: String!) {
  product(handle: $handle) {
    id
    title
    handle
    description
    descriptionHtml
    tags
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    options {
      id
      name
      values
    }
    images(first: 10) {
      edges {
        node {
          id
          url
          altText
        }
      }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            url
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
`;

export const customerCreateMutation = `
mutation customerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
      id
      email
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}
`;

export const customerAccessTokenCreateMutation = `
mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}
`;

export const getCustomerQuery = `
query getCustomer($customerAccessToken: String!) {
  customer(customerAccessToken: $customerAccessToken) {
    id
    firstName
    lastName
    email
    phone
    orders(first: 10) {
      edges {
        node {
          orderNumber
          totalPrice {
            amount
            currencyCode
          }
          processedAt
        }
      }
    }
  }
}
`;

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    subtotalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            image {
              url
            }
            product {
              title
              handle
            }
          }
        }
      }
    }
  }
`;

export const createCartMutation = `
mutation cartCreate($input: CartInput) {
  cartCreate(input: $input) {
    cart {
      ${CART_FIELDS}
    }
    userErrors {
      field
      message
    }
  }
}
`;

export const addToCartMutation = `
mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      ${CART_FIELDS}
    }
    userErrors {
      field
      message
    }
  }
}
`;

export const removeFromCartMutation = `
mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      ${CART_FIELDS}
    }
    userErrors {
      field
      message
    }
  }
}
`;

export const getCartQuery = `
query getCart($cartId: ID!) {
  cart(id: $cartId) {
    ${CART_FIELDS}
  }
}
`;

export const getMenuQuery = `
query getMenu($handle: String!) {
  menu(handle: $handle) {
    id
    title
    items {
      id
      title
      url
      items {
        id
        title
        url
      }
    }
  }
}
`;

export const searchProductsQuery = `
query SearchProducts($query: String!) {
  products(first: 24, query: $query) {
    edges {
      node {
        id
        title
        handle
        description
        featuredImage {
          url
          altText
        }
        images(first: 10) {
          edges {
            node {
              id
              url
              altText
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 1) {
          edges {
            node {
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}
`;

export const getProductRecommendationsQuery = `
query GetProductRecommendations($productId: ID!) {
  productRecommendations(productId: $productId) {
    id
    title
    handle
    featuredImage {
      url
      altText
    }
    images(first: 10) {
      edges {
        node {
          id
          url
          altText
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 1) {
      edges {
        node {
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
`;

export const getPageQuery = `
query getPage($handle: String!) {
  page(handle: $handle) {
    id
    title
    body
    bodySummary
  }
}
`;