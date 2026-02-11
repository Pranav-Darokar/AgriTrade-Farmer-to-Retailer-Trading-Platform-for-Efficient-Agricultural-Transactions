#!/bin/bash

# Base URL
BASE_URL="http://localhost:8080/api"

echo "========================================"
echo "      Testing Farmer-Retailer API"
echo "========================================"

# Generate random suffix to avoid username collisions if run multiple times
RANDom_SUFFIX=$((RANDOM % 10000))
FARMER_USER="farmer_$RANDom_SUFFIX"
RETAILER_USER="retailer_$RANDom_SUFFIX"
PASSWORD="password123"

echo "1. Registering Farmer: $FARMER_USER"
curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$FARMER_USER\",
    \"password\": \"$PASSWORD\",
    \"fullName\": \"John Farmer\",
    \"role\": [\"farmer\"],
    \"contactInfo\": \"1234567890\"
  }"
echo -e "\n"

echo "2. Logging in as Farmer"
FARMER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$FARMER_USER\",
    \"password\": \"$PASSWORD\"
  }")

# Extract Token (simple grep/cut to avoid jq dependency)
FARMER_TOKEN=$(echo $FARMER_RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
echo "Farmer Token received: ${FARMER_TOKEN:0:10}..."

echo "3. Adding a Product"
PRODUCT_RESPONSE=$(curl -s -X POST "$BASE_URL/farmer/products" \
  -H "Authorization: Bearer $FARMER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fresh Apples",
    "description": "Crisp red apples",
    "price": 2.50,
    "quantity": 100
  }')
echo "Product Response: $PRODUCT_RESPONSE"
PRODUCT_ID=$(echo $PRODUCT_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
echo "Created Product ID: $PRODUCT_ID"

echo "4. Registering Retailer: $RETAILER_USER"
curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$RETAILER_USER\",
    \"password\": \"$PASSWORD\",
    \"fullName\": \"Alice Retailer\",
    \"role\": [\"retailer\"],
    \"contactInfo\": \"0987654321\"
  }"
echo -e "\n"

echo "5. Logging in as Retailer"
RETAILER_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$RETAILER_USER\",
    \"password\": \"$PASSWORD\"
  }")

RETAILER_TOKEN=$(echo $RETAILER_RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
echo "Retailer Token received: ${RETAILER_TOKEN:0:10}..."

if [ -z "$PRODUCT_ID" ]; then
    echo "Product ID not found, skipping order placement."
else
    echo "6. Placing an Order for Product ID: $PRODUCT_ID"
    curl -s -X POST "$BASE_URL/retailer/orders" \
      -H "Authorization: Bearer $RETAILER_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"items\": [
          {
            \"productId\": $PRODUCT_ID,
            \"quantity\": 10
          }
        ]
      }"
    echo -e "\nOrder Placed.\n"
fi

echo "7. Viewing Retailer Orders"
curl -s -X GET "$BASE_URL/retailer/orders" \
  -H "Authorization: Bearer $RETAILER_TOKEN"
echo -e "\n"

echo "========================================"
echo "              Test Complete"
echo "========================================"
