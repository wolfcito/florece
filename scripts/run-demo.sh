#!/bin/bash
#
# Florece Demo Script
#
# Automated demo script that guides through the complete user journey.
# Target time: < 3 minutes
#
# Usage:
#   ./scripts/run-demo.sh
#   ./scripts/run-demo.sh --auto (skips confirmations)
#

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Demo config
DEMO_EMAIL="demo@florece.app"
DEMO_PASSWORD="demo123456"
BASE_URL="http://localhost:3000"
AUTO_MODE=false

# Parse arguments
if [[ "$1" == "--auto" ]]; then
  AUTO_MODE=true
fi

# Helper functions
print_step() {
  echo -e "\n${BLUE}▶ $1${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

wait_for_enter() {
  if [[ "$AUTO_MODE" == "false" ]]; then
    echo -e "${YELLOW}Press ENTER to continue...${NC}"
    read
  else
    sleep 1
  fi
}

verify_server() {
  if ! curl -s "$BASE_URL" > /dev/null; then
    print_error "Server not running at $BASE_URL"
    echo "Please start the server with: pnpm dev"
    exit 1
  fi
  print_success "Server is running"
}

open_browser() {
  local url=$1
  echo "Opening: $url"
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open "$url"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "$url"
  fi
  sleep 2
}

# Main demo flow
main() {
  echo "=========================================="
  echo "   🌱 Florece - Demo Script"
  echo "=========================================="
  echo ""
  echo "This script will guide you through a complete demo."
  echo "Target time: < 3 minutes"
  echo ""

  # Step 0: Verify prerequisites
  print_step "Step 0: Verifying prerequisites"
  verify_server
  wait_for_enter

  # Step 1: Seed demo data
  print_step "Step 1: Seeding demo data"
  echo "Creating demo user (Sofía) and sample data..."

  if pnpm seed-demo --reset > /dev/null 2>&1; then
    print_success "Demo data seeded"
    echo "  User: $DEMO_EMAIL"
    echo "  Password: $DEMO_PASSWORD"
  else
    print_warning "Seed command failed (might need to run manually)"
  fi
  wait_for_enter

  # Step 2: Landing page
  print_step "Step 2: Landing Page"
  echo "Opening landing page..."
  echo "👉 Notice the value proposition and CTA"
  open_browser "$BASE_URL"
  wait_for_enter

  # Step 3: Login
  print_step "Step 3: Login"
  echo "Opening login page..."
  echo "👉 Use demo credentials:"
  echo "   Email: $DEMO_EMAIL"
  echo "   Password: $DEMO_PASSWORD"
  echo "👉 Or click 'Usar credenciales demo' button"
  open_browser "$BASE_URL/login"
  wait_for_enter

  # Step 4: Diagnostic Flow
  print_step "Step 4: Diagnostic Flow"
  echo "You should now be at the diagnostic page"
  echo "👉 This is where users describe their business idea via voice"
  echo "👉 For demo, you can skip this and go directly to the plan"
  wait_for_enter

  # Step 5: View Plan
  print_step "Step 5: View 7-Day Plan"
  echo "Opening Sofía's plan..."
  echo "👉 Notice:"
  echo "   - Progress bar (3/5 actions completed)"
  echo "   - 7-day structure"
  echo "   - Action items with priorities"
  open_browser "$BASE_URL/plan/plan_sofia_week1"
  wait_for_enter

  # Step 6: Action Detail
  print_step "Step 6: Action Detail"
  echo "Opening a pending action..."
  echo "👉 Notice:"
  echo "   - Action description and tips"
  echo "   - Evidence upload option"
  echo "   - Completion workflow"
  open_browser "$BASE_URL/actions/action_4"
  wait_for_enter

  # Step 7: Evidence Upload (conceptual)
  print_step "Step 7: Evidence Upload"
  echo "In the action detail page:"
  echo "👉 User would click 'Subir evidencia'"
  echo "👉 Upload a photo, audio, or document"
  echo "👉 AI verifies the evidence using Gemini Vision/Audio"
  echo "👉 Action is marked as completed if verified"
  wait_for_enter

  # Step 8: Receipt View
  print_step "Step 8: Progress Receipt"
  echo "Opening progress receipt..."
  echo "👉 Notice:"
  echo "   - Completion percentage"
  echo "   - Achievements unlocked"
  echo "   - Next steps"
  echo "   - Share options"
  open_browser "$BASE_URL/receipts/receipt_sofia_week1"
  wait_for_enter

  # Step 9: Logout
  print_step "Step 9: Logout"
  echo "In the navigation bar (bottom), click 'Salir' to logout"
  wait_for_enter

  # Demo complete!
  echo ""
  echo "=========================================="
  echo "   ✅ Demo Complete!"
  echo "=========================================="
  echo ""
  echo "Key Features Demonstrated:"
  echo "  ✓ Landing page with value prop"
  echo "  ✓ Authentication (login/signup)"
  echo "  ✓ 7-day structured plan"
  echo "  ✓ Action tracking with evidence"
  echo "  ✓ Progress visualization"
  echo "  ✓ AI-powered evidence verification"
  echo ""
  echo "Total time: Check your stopwatch!"
  echo "Target: < 3 minutes"
  echo ""
  echo "To run demo again:"
  echo "  ./scripts/run-demo.sh"
  echo ""
  echo "To run in auto mode (no pauses):"
  echo "  ./scripts/run-demo.sh --auto"
  echo ""
  echo "Happy demoing! 🚀"
}

# Run the demo
main
