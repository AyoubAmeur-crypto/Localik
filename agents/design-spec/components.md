# Component Inventory — Hero Section

This document lists all identifiable, reusable components extracted from the Hero Section.

---

## 1. BrandLogo
A simple component to render the brand identity (icon + brand name text).
- **Figma Reference**: Nodes `46:26129` (container), `46:26130` (icon), `46:26136` (text)
- **Props**: None
- **Design Specifications**:
  - Icon: SVG asset `logo-car.svg` (width: `24px`, height: `26px`)
  - Text: "RENTCARS" (color: `#1572D3`, typography: `Poppins SemiBold`, size: `16px`, line-height: `24px`)
  - Layout: Flex row, items center, gap `8px`

---

## 2. NavLink
A text navigation link for header navigation.
- **Figma Reference**: Nodes `46:26138` to `46:26141`
- **Props**:
  - `label`: `string` (required)
  - `href`: `string` (required)
  - `active`: `boolean` (optional, default: `false`)
- **Design Specifications**:
  - Color: `#484848` (inactive), `#1572D3` (active/hover)
  - Typography: `Poppins Medium`, size: `16px`, line-height: `24px`
  - Interactive Behavior: Underline or color shift to primary blue on hover.

---

## 3. Button
Standard button component supporting primary actions and link-only variants.
- **Figma Reference**: Nodes `46:26144` (Sign up), `46:26177` (Search), `46:26143` (Sign in - link style)
- **Props**:
  - `label`: `string` (required)
  - `variant`: `'primary' | 'link'` (optional, default: `'primary'`)
  - `size`: `'sm' | 'md' | 'lg'` (optional, default: `'md'`)
  - `onClick`: `() => void` (optional)
  - `className`: `string` (optional)
- **Design Specifications**:
  - **Primary Variant**:
    - Background: `#1572D3` (primary blue)
    - Text: `#FFFFFF` (white), typography: `Poppins Medium`, size: `16px`, line-height: `24px`
    - Radius: `8px`
    - Standard Padding: `16px 32px`
    - Widget Padding (fixed dimensions): width: `159px`, height: `48px`
  - **Link Variant**:
    - Background: Transparent
    - Text: `#484848` (gray), hover: `#1572D3`
    - Typography: `Poppins Medium`, size: `16px`, line-height: `24px`

---

## 4. AppBadge
A graphic badge button linking to mobile application stores.
- **Figma Reference**: Nodes `46:26158` (iOS App Store), `46:26159` (Google Play Store)
- **Props**:
  - `store`: `'ios' | 'android'` (required)
  - `href`: `string` (required)
- **Design Specifications**:
  - Width: `123.75px`
  - Height: `36.62px`
  - Border Radius: `7.17px`
  - iOS Badge Asset: `ios-badge.png`
  - Android Badge Asset: `android-badge.png`
  - Hover: Scale up slightly (e.g. `hover:scale-105 transition-transform`)

---

## 5. SearchField
An individual input selection block within the Search Widget, representing parameters such as location or date.
- **Figma Reference**: Nodes `46:26162` (Location), `46:26167` (Pickup date), `46:26172` (Return date)
- **Props**:
  - `icon`: `'location' | 'calendar'` (required)
  - `title`: `string` (required - e.g., "Location")
  - `value`: `string` (required - e.g., "Search your location" or "Tue 15 Feb, 09:00")
  - `hasLeftBorder`: `boolean` (optional, default: `false`)
- **Design Specifications**:
  - Layout: Flex row, items center, gap `16px`
  - Text Stack: Column container, gap `12px`
    - Title: Color `#3E3E3E`, typography `Poppins Medium`, size `16px`, line-height `24px`
    - Value: Color `#B6B6B6` (if placeholder style/unselected) or `#3E3E3E` (if selected), typography `Poppins Regular`, size `14px`, line-height `21px`
  - Left Border (Desktop only): `1px solid #ACACAC`, height: `37px` (applied if `hasLeftBorder` is true, accompanied by `padding-left: 24px`)

---

## 6. CategoryBadge
A small highlight pill badge used to call out sections (e.g. "WHY CHOOSE US").
- **Figma Reference**: Node `46:5330`
- **Props**:
  - `label`: `string` (required)
- **Design Specifications**:
  - Background: `rgba(21, 114, 211, 0.1)` (`bg-primary-light`)
  - Text Color: `#1572D3` (`text-primary`)
  - Typography: `Poppins Medium`, size: `14px`, line-height: `21px`
  - Border Radius: `8px`
  - Padding: `16px 32px`

---

## 7. FeatureItem
A descriptive row element with a rounded icon background container on the left and a stacked title and text details on the right.
- **Figma Reference**: Nodes `46:5334` to `46:5351` (Features list items)
- **Props**:
  - `icon`: `'wallet' | 'user-tick' | 'support' | 'messages'` (required)
  - `title`: `string` (required)
  - `description`: `string` (required)
- **Design Specifications**:
  - Layout: Flex row, items center, gap `24px`
  - **Icon Container**:
    - Dimensions: `64px` x `64px`
    - Background: `#ECF5FF` (`bg-bg-accent-blue`)
    - Border Radius: `16px` (`rounded-icon-container`)
    - Icon Size: `24px` x `24px` (centered inside the container)
  - **Text Stack**:
    - Layout: Column container, gap `8px`
    - Title: Color `#000000`, typography `Poppins Medium`, size `20px`, line-height `30px`
    - Description: Color `#6D6D6D` (`text-text-medium-gray`), typography `Poppins Regular`, size `16px`, line-height `24px`

---

## 8. CarCard
A comprehensive card component displaying car details, specifications, rating, and rental pricing.
- **Figma Reference**: Template node `EL-9b124b25`
- **Props**:
  - `name`: `string` (required)
  - `rating`: `number` (required)
  - `reviews`: `number` (required)
  - `passengers`: `number` (required)
  - `transmission`: `string` (required)
  - `airConditioning`: `boolean` (required)
  - `doors`: `number` (required)
  - `price`: `number` (required)
  - `imageSrc`: `string` (required)
- **Design Specifications**:
  - **Dimensions**: `256px` x `405px`
  - **Border Radius**: `16px` (`rounded-card`)
  - **Shadow**: `0px 12px 24px 0px rgba(16, 76, 139, 0.16)` (`shadow-card`)
  - **Layout**: Column flex container, background `#FFFFFF`
    - Top Image Wrapper (`EL-4d1c5d59`): `256px` x `155px`, top-rounded corners `16px 16px 0px 0px`
    - Bottom Content Wrapper (`EL-b2a2c1ed`): padding: `0px 24px 24px`, gap: `24px` (vertical flex layout)
  - **Content Sub-Hierarchies**:
    - **Header Title & Rating**: Vertical stack, gap `12px`
      - Name: Color `#262626`, typography `Poppins Medium`, size `16px`, line-height `17px`
      - Rating Row: Flex row, gap `6px`, items center. Star icon (color: `#EFBF14` i.e. `gold-star`, size `16px` x `16px`), text style rating Poppins Medium 12px `#242424`, reviews text Poppins Regular 12px `#808080`.
    - **Specs Grid**: Width `208px`, vertical flex, gap `8px`
      - Row 1: Passengers (user icon, text e.g., "4 Passagers") and Transmission (gear icon, text e.g., "Auto")
      - Row 2: A/C (cooling icon, text "Air Conditioning") and Doors (door icon, text e.g., "4 Doors")
      - Specs Typography: Color `#959595` (`text-gray-light`), `Poppins Regular`, size `12px`, line-height `17px`
    - **Divider**: Line stroke `#E0E0E0` (`border-card`), width `208px`, thickness `1px`
    - **Footer Row**: Flex row, justify space-between, items center
      - Price Stack: Label "Price" (`Poppins Regular 14px` color `#595959`) and Value (price bold `Poppins SemiBold 16px` color `#292929`, and suffix "/day" `Poppins Regular 14px` color `#9C9C9C`)
      - CTA Button: Custom button wrapper, padding: `8px`, background: `#1572D3` (`bg-primary`), height `40px`, width `208px` (stretches to card bounds), text "Rent Now" Poppins Medium 14px, arrow icon right.

---

## 9. TestimonialCard
A horizontal layout card displaying customer testimonials, including rating stars, review quote, name, location, and the customer's photo.
- **Figma Reference**: Template node `EL-d91585b8`
- **Props**:
  - `name`: `string` (required)
  - `location`: `string` (required)
  - `rating`: `number` (required)
  - `quote`: `string` (required)
  - `imageSrc`: `string` (required)
- **Design Specifications**:
  - **Layout**: Flex row, items center, background `#FFFFFF`
  - **Border Radius**: `24px` (`rounded-testimonial-card`)
  - **Shadow**: `0px 12px 24px 0px rgba(16, 76, 139, 0.16)` (`shadow-testimonial-card`)
  - **Sub-structures**:
    - **Photo Graphic (`EL-b6f43c58`)**: `397px` x `438px`, cover scale mode, left-side border-radius `24px 0px 0px 24px`
    - **Content Container (`EL-eeecfc45`)**: padding: `40px`, gap: `48px` (vertical flex layout)
      - Rating Group (`EL-1153670a`): gap `24px`
        - Text Label: e.g. "5.0 stars", color `#383838` (`text-stars`), `Poppins Medium`, size `24px`, line-height `36px`
        - Star icons row (`EL-a7acbf88`): flex row, gap `4px`. Star icons (color: `#EFBF14` i.e. `gold-star`, size `24px` x `24px`), rounded `0.75px`
      - Quote Group (`EL-f997920b`): gap `80px`
        - Quote Text: color `#282828` (`text-quote`), `Poppins Regular`, size `18px`, line-height `27px`, fixed width `317px`
        - Author Info Stack (`EL-8cc88fec`): vertical flex, gap `16px`
          - Name: color `#252525` (`text-author`), `Poppins Medium`, size `24px`, line-height `36px`
          - Location: color `#838383` (`text-location`), `Poppins Regular`, size `14px`, line-height `21px`

---

## 10. MockupGraphics
A device mockup display representing an iPhone 14 Pro, rendered as absolute layers of shadows, chassis, and responsive screen contents.
- **Figma Reference**: Node `46:5265`
- **Props**: None
- **Design Specifications**:
  - **Dimensions**: `520.22px` x `1054.36px` (Desktop)
  - **Layer Hierarchy**:
    - Shadow Background (`46:5266`): w: `520.22px`, h: `1054.36px`, opacity: `0.7`, image: `shadow-phone.png`
    - Main Device Chassis (`46:5267`): w: `520.22px`, h: `1054.36px`, image: `main-phone.png`
    - Screen Content Viewport (`46:5268`): absolute coordinates: x: `24.75px`, y: `20.11px`, width: `468.66px`, height: `1011.31px`, image: `screen-content.png`

---

## 11. FooterLink
A text navigation link specifically styled for dark background footers.
- **Figma Reference**: Individual text list items in columns (e.g. Node `46:5153`)
- **Props**:
  - `label`: `string` (required)
  - `href`: `string` (required)
- **Design Specifications**:
  - Color: `#D6D6D6` (`text-footer-link`), hover: `#FFFFFF` or `#1572D3` (`text-primary`)
  - Typography: `Poppins Regular`, size: `14px`, line-height: `21px`

---

## 12. FooterColumn
A structured block within the footer containing a section heading and a vertical stack of nav links.
- **Figma Reference**: Container nodes `46:5150`, `46:5158`, `46:5167`, `46:5175`
- **Props**:
  - `title`: `string` (required)
  - `links`: `Array<{ label: string; href: string }>` (required)
- **Design Specifications**:
  - **Layout**: Column flex container, gap `32px`
  - **Header**: color `#FFFFFF` (white), typography `Poppins Medium`, size `16px`, line-height `24px`
  - **Links list**: Column flex, gap `16px`





