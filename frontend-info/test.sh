#!/bin/bash

echo "🧪 TESTING Frontend-Info Setup..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

TESTS_PASSED=0
TESTS_FAILED=0

# Test 1: Docker running
echo "1️⃣  Checking if Docker is running..."
if docker ps &> /dev/null; then
    echo -e "${GREEN}✓ Docker is running${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ Docker is not running${NC}"
    ((TESTS_FAILED++))
fi

# Test 2: Frontend-info container
echo ""
echo "2️⃣  Checking frontend-info container..."
if docker ps | grep -q "frontend-info"; then
    echo -e "${GREEN}✓ frontend-info container is running${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ frontend-info container is not running${NC}"
    ((TESTS_FAILED++))
fi

# Test 3: User-service port
echo ""
echo "3️⃣  Checking user-service (port 8081)..."
if timeout 2 bash -c "echo > /dev/tcp/localhost/8081" 2>/dev/null; then
    echo -e "${GREEN}✓ user-service is accessible on port 8081${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ user-service is not accessible on port 8081${NC}"
    ((TESTS_FAILED++))
fi

# Test 4: Frontend-info port
echo ""
echo "4️⃣  Checking frontend-info (port 5052)..."
if timeout 2 bash -c "echo > /dev/tcp/localhost/5052" 2>/dev/null; then
    echo -e "${GREEN}✓ frontend-info is accessible on port 5052${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ frontend-info is not accessible on port 5052${NC}"
    ((TESTS_FAILED++))
fi

# Test 5: API endpoint
echo ""
echo "5️⃣  Checking API endpoint (localhost:8081/api/students)..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8081/api/students)
if [ "$RESPONSE" = "200" ]; then
    echo -e "${GREEN}✓ API endpoint is responding (HTTP 200)${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ API endpoint returned HTTP $RESPONSE${NC}"
    ((TESTS_FAILED++))
fi

# Test 6: Student count
echo ""
echo "6️⃣  Checking student data..."
STUDENTS=$(curl -s http://localhost:8081/api/students | grep -o '"' | wc -l)
if [ "$STUDENTS" -gt 0 ]; then
    echo -e "${GREEN}✓ API has student data${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ API returned no data${NC}"
    ((TESTS_FAILED++))
fi

# Summary
echo ""
echo "================================"
echo "📊 TEST SUMMARY"
echo "================================"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✨ All tests passed! Access the page at:${NC}"
    echo -e "${GREEN}http://localhost:5052${NC}"
else
    echo -e "${YELLOW}⚠️  Some tests failed. Run troubleshooting:${NC}"
    echo "    docker-compose restart"
    echo "    Then run this script again"
fi

echo ""
