# Layout Specification — Hero Section

## Overview
- **Section Name**: Hero Section (named "Header" in Figma)
- **Figma Node ID**: [46:26124](https://www.figma.com/design/mdH9zM5t3Yz7Wft5R0RNH1/Rent-Car---Landing-page--Community-?node-id=46-26124)
- **Parent Node**: [12:16330](https://www.figma.com/design/mdH9zM5t3Yz7Wft5R0RNH1/Rent-Car---Landing-page--Community-?node-id=12-16330)
- **Dimensions**: 1440px x 800px (Desktop)

---

## Breakpoint Behavior & Responsiveness

### Mobile Breakpoint (< 768px)
- **Overall**: Vertical layout stack. Margin/padding horizontal reduced to `16px` (`px-4`).
- **Header Navigation**:
  - Logo (`RENTCARS`) and sign-in actions remain visible.
  - Navigation links (`Become a renter`, `Rental deals`, etc.) are collapsed into a mobile navigation menu (drawer or hamburger menu toggled via button).
  - "Sign up" button is styled as a compact primary action.
- **Hero Content Stack**:
  - Vertically stacked: Text content on top, car image below.
  - Text: Title size scales down to `32px` (`text-3xl`), description text to `16px` (`text-base`).
  - App store badges (`image 2` and `image 3`): Placed side by side or stacked depending on width.
  - Car Image: Fully responsive `next/image` scaled down to fit within the viewport width (`w-full h-auto`).
- **Search Widget**:
  - Stacks all fields vertically (`flex-col`).
  - Dividers are hidden (`border-0`) and replaced by thin horizontal spacing/dividers.
  - The "Search" button stretches to full width.
  - Padding adjusted to `24px 16px` for compact screens.

### Tablet Breakpoint (768px - 1023px)
- **Overall**: Margins and padding set to `48px` (`px-12`).
- **Header Navigation**: Navigation links may be hidden or displayed in a compact format.
- **Hero Content Stack**:
  - Horizontal layout but with reduced widths.
  - Car image width reduced to fit without clipping or overflow.
- **Search Widget**:
  - Grid layout (2x2 grid) to fit search fields and the button beautifully without overcrowding.

### Desktop Breakpoint (>= 1024px)
- **Overall**: Width constrained to max `1440px`, horizontally centered (`mx-auto`). Horizontal padding of `160px` (`px-[160px]`).
- **Header Navigation**: Full horizontal layout, items aligned center, justify space-between.
- **Hero Content Stack**: Two-column layout. Left column containing logo, header text, description, badges. Right column contains the large car image overlapping the layout boundary.
- **Search Widget**: Floating horizontal bar, centered, at `y: 680px`. Column inputs separated by `1px` vertical borders.

---

## Child Element Hierarchy

### 1. Navigation Header
- **Container**: Node `46:26128` (Row, width: 1120px, height: hug, absolute positions: x: 160px, y: 40px)
  - **Logo block**: Node `46:26129` (Row, gap: 8px)
    - SVG Icon `46:26130` (`logo-car.svg`, 24x26)
    - Brand Text `46:26136` ("RENTCARS", Poppins SemiBold 16px, `#1572D3`)
  - **Links group**: Node `46:26137` (Row, gap: 40px)
    - Navigation items `46:26138`, `46:26139`, `46:26140`, `46:26141` ("Become a renter", "Rental deals", "How it work", "Why choose us", Poppins Medium 16px, `#484848`)
  - **Auth actions**: Node `46:26142` (Row, gap: 24px)
    - Link text `46:26143` ("Sign in", Poppins Medium 16px, `#484848`)
    - Button container `46:26144` (Row, padding: 16px 32px, bg: `#1572D3`, rounded: 8px)
      - Text `46:26145` ("Sign up", Poppins Medium 16px, `#FFFFFF`)

### 2. Main Hero Content
- **Left Text Container**: Node `46:26153` (Group, absolute position: x: 160px, y: 240px, w: 390px, h: 238px)
  - **Title text**: Node `46:26155` ("Find, book and rent a car Easily", Poppins SemiBold 48px, line-height 48px). Part "Find, book and rent a car" is `#242424` (dark gray), " Easily" is `#1572D3` (blue).
  - **Description text**: Node `46:26156` ("Get a car wherever...", Poppins Regular 18px, `#272727`).
  - **Badges row**: Node `46:26157` (Row, gap: 11.5px)
    - App Store Badge `46:26158` (`ios-badge.png`, 123.75x36.62, rounded: 7.17px)
    - Play Store Badge `46:26159` (`android-badge.png`, 123.75x36.62, rounded: 7.17px)
  - **Highlight underline decoration**: Node `46:26160` (SVG Icon `hero-highlight.svg`, absolute x: 246.34, y: 74.05, w: 134.25, h: 47.74, bg: `#1572D3`)
- **Right Car Graphic**:
  - **Car Image**: Node `46:26152` (`hero-car.png`, absolute position: x: 649px, y: 182px, w: 1048px, h: 537px)
  - **Background Blob**: Node `46:26146` (`bg-blob.svg`, absolute position: x: 866px, y: -33px, w: 803px, h: 866px, opacity: 0.13)

### 3. Floating Search Widget
- **Container**: Node `46:26161` (Row, bg: `#FFFFFF`, shadow: `0px 6px 12px 0px rgba(19, 94, 172, 0.12)`, border-radius: 12px, absolute position: x: 160px, y: 680px, w: 1120px, padding: 12px 12px 12px 32px, gap: 50px)
  - **Location Field**: Node `46:26162` (Row, gap: 16px, items center)
    - Location Icon `46:26163` (`icon-location.svg`, 32x32)
    - Stack: Node `46:26164` (Column, gap: 12px)
      - Title: `46:26165` ("Location", Poppins Medium 16px, `#3E3E3E`)
      - Value: `46:26166` ("Search your location", Poppins Regular 14px, `#B6B6B6`)
  - **Pickup Date Field**: Node `46:26167` (Row, gap: 16px, padding-left: 24px, border-left: 1px solid `#ACACAC`)
    - Calendar Icon `46:26168` (`icon-calendar.svg`, 32x32)
    - Stack: Node `46:26169` (Column, gap: 12px)
      - Title: `46:26170` ("Pickup date", Poppins Medium 16px, `#3E3E3E`)
      - Value: `46:26171` ("Tue 15 Feb, 09:00", Poppins Regular 14px, `#B6B6B6`)
  - **Return Date Field**: Node `46:26172` (Row, gap: 16px, padding-left: 24px, border-left: 1px solid `#ACACAC`, height: 37)
    - Calendar Icon `46:26211` (`icon-calendar.svg`, 32x32)
    - Stack: Node `46:26174` (Column, gap: 12px)
      - Title: `46:26175` ("Return date", Poppins Medium 16px, `#3E3E3E`)
      - Value: `46:26176` ("Thu 16 Feb, 11:00", Poppins Regular 14px, `#B6B6B6`)
  - **Search Button**: Node `46:26177` (Row, padding: 8px, bg: `#1572D3`, rounded: 8px, w: 159, h: 48, justify center, items center)
    - Text: `46:26178` ("Search", Poppins Medium 16px, `#FFFFFF`)

---

# Layout Specification — Why choose us Section

## Overview
- **Section Name**: Why choose us Section
- **Figma Node ID**: [46:5323](https://www.figma.com/design/mdH9zM5t3Yz7Wft5R0RNH1/Rent-Car---Landing-page--Community-?node-id=46-5323)
- **Dimensions**: 1440px x 800px (Desktop)

---

## Breakpoint Behavior & Responsiveness

### Mobile Breakpoint (< 768px)
- **Overall**: Vertical stacking. Padding horizontal reduced to `16px` (`px-4`), padding vertical `48px` (`py-12`).
- **Layout Flow**:
  - Left column graphic (Audi car image and vector blob background) are hidden, or the car is styled centered below the text headers.
  - Text header container (`46:5329`) is centered: the badge and heading are centered. Heading font size down to `28px` (`text-2xl`).
  - Feature items stack vertically, each feature item icon and text stack vertically as well (`flex-col` centered).
- **Icons & Badges**: Feature badges centered.

### Tablet Breakpoint (768px - 1023px)
- **Overall**: Stacks columns vertically, padding horizontal `48px` (`px-12`).
- **Feature items**: Rendered in a 2x2 grid.

### Desktop Breakpoint (>= 1024px)
- **Overall**: Two-column layout. Width constrained to max `1440px`.
- **Left Column**: Contains the large overlapping background graphic vector blob (`46:5327`) and the car image (`46:5357` at absolute coordinates x: -181px, y: 230px).
- **Right Column**: Contains the text header block and features grid stack (`46:5328` at x: 733px, y: 92px).

---

## Child Element Hierarchy

### 1. Header Block
- **Container**: Node `46:5329` (Column, w: 576px, gap: 32px)
  - **Category Badge**: Node `46:5330` (Row, padding: 16px 32px, bg: `rgba(21, 114, 211, 0.1)`, rounded: 8px)
    - Badge Text: `46:5331` ("WHY CHOOSE US", Poppins Medium 14px, `#1572D3`)
  - **Heading Text**: Node `46:5332` ("We offer the best experience with our rental deals", Poppins Medium 38px, line-height: 1.3em, `#333333`)

### 2. Feature Stack List
- **Container**: Node `46:5333` (Column, gap: 40px)
  - **Feature 1**: Node `46:5334` (Row, gap: 24px, items center)
    - Icon Container: Node `I46:5335;12:16443` (Column, 64x64, bg: `#ECF5FF`, rounded: 16px, justify center, items center)
      - SVG Icon: Node `46:19595` (`icon-wallet.svg`, vuesax/bold/wallet, 24x24)
    - Text Stack: Node `46:5336` (Column, gap: 24px)
      - Title: `46:5337` ("Best price guaranteed", Poppins Medium 20px, `#000000`)
      - Desc: `46:5338` ("Find a lower price? We’ll refund you 100%...", Poppins Regular 16px, `#6D6D6D`)
  - **Feature 2**: Node `46:5339` (Row, gap: 24px, items center)
    - Icon Container: Node `46:5340` (Column, 64x64, bg: `#ECF5FF`, rounded: 16px, justify center, items center)
      - SVG Icon: Node `46:21070` (`icon-user-tick.svg`, vuesax/bold/user-tick, 24x24)
    - Text Stack: Node `46:5342` (Column, gap: 24px)
      - Title: `46:5343` ("Experience driver", Poppins Medium 20px, `#000000`)
      - Desc: `46:5344` ("Don’t have driver? Don’t worry...", Poppins Regular 16px, `#6D6D6D`)
  - **Feature 3**: Node `46:5345` (Row, gap: 24px, items center)
    - Icon Container: Node `46:5346` (Column, 64x64, bg: `#ECF5FF`, rounded: 16px, justify center, items center)
      - SVG Icon: Node `46:23152` (`icon-support.svg`, vuesax/bold/24-support, 24x24)
    - Text Stack: Node `46:5348` (Column, gap: 24px)
      - Title: `46:5349` ("24 hour car delivery", Poppins Medium 20px, `#000000`)
      - Desc: `46:5350` ("Book your car anytime and we will deliver...", Poppins Regular 16px, `#6D6D6D`)
  - **Feature 4**: Node `46:5351` (Row, gap: 24px, items center)
    - Icon Container: Node `46:5352` (Column, 64x64, bg: `#ECF5FF`, rounded: 16px, justify center, items center)
      - SVG Icon: Node `46:23259` (`icon-messages.svg`, vuesax/bold/messages-2, 24x24)
    - Text Stack: Node `46:5354` (Column, gap: 24px)
      - Title: `46:5355` ("24/7 technical support", Poppins Medium 20px, `#000000`)
      - Desc: `46:5356` ("Have a question? Contact Rentcars support...", Poppins Regular 16px, `#6D6D6D`)

### 3. Graphics & Backgrounds
- **Car Graphic**: Node `46:5357` (`why-choose-us-car.png`, absolute position: x: -181px, y: 230px, w: 813px, h: 359px)
- **Background Shape**: Node `46:5327` (`why-choose-us-bg.svg`, absolute position: x: -346px, y: 98px, w: 1123px, h: 859px)

---

# Layout Specification — Popular rental deals Section

## Overview
- **Section Name**: Popular rental deals Section
- **Figma Node ID**: [40:3306](https://www.figma.com/design/mdH9zM5t3Yz7Wft5R0RNH1/Rent-Car---Landing-page--Community-?node-id=40-3306)
- **Dimensions**: 1440px x 840px (Desktop)

---

## Breakpoint Behavior & Responsiveness

### Mobile Breakpoint (< 768px)
- **Overall**: Vertical stacking. Padding horizontal reduced to `16px` (`px-4`), padding vertical `48px` (`py-12`).
- **Cards list**: Scrollable horizontal container (`flex-row overflow-x-auto snap-x`) or vertical list (`flex-col gap-6`). Snap scrolling matches modern layouts for mobile deals.
- **Card Sizing**: Card width scales to `280px` or full width. Text padding and image sizes scale proportionally.

### Tablet Breakpoint (768px - 1023px)
- **Overall**: Stacks cards row, padding horizontal `48px` (`px-12`).
- **Cards list**: Grid layout (2x2 grid) with `gap-6` to avoid overflow.

### Desktop Breakpoint (>= 1024px)
- **Overall**: Width constrained to max `1440px`, centered. Padding horizontal `160px` (`px-[160px]`).
- **Cards Row**: Horizontal list (`flex-row gap-8` i.e. `32px` gap), containing 4 identical cards.
- **Show all vehicles button**: Placed centered below the cards row (`mt-16`).

---

## Child Element Hierarchy

### 1. Header Block
- **Container**: Node `40:3307` (Column, x: 160px, y: 84px, gap: 64px, items center)
  - **Category Badge**: Node `40:3309` (Row, padding: 16px 32px, bg: `rgba(21, 114, 211, 0.1)`, rounded: 8px)
    - Badge Text: `40:3310` ("POPULAR RENTAL DEALS", Poppins Medium 14px, `#1572D3`)
  - **Heading Text**: Node `40:3311` ("Most popular cars rental deals", Poppins Medium 38px, line-height 1.3em, `#333333`)

### 2. Cars Grid Row
- **Container**: Node `40:3312` (Row, gap: 32px)
  - **Car Cards**: Nodes `40:3313` (Jaguar), `40:3356` (Audi), `40:3399` (BMW), `40:3442` (Lamborghini). All cards follow component layout `EL-9b124b25`.
  - **Show All CTA**: Node `40:3485` (Row, padding: 8px, rounded: 8px, border: `1px solid #E0E0E0`, w: 216px, h: 48px, justify center, items center)
    - Text: `40:3486` ("Show all vehicles", Poppins Medium 14px, `#4E4E4E`)
    - Arrow Icon: `40:3487` (vuesax/linear/arrow-right, 20x20)

---

# Layout Specification — What people say Section

## Overview
- **Section Name**: What people say Section
- **Figma Node ID**: [42:3546](https://www.figma.com/design/mdH9zM5t3Yz7Wft5R0RNH1/Rent-Car---Landing-page--Community-?node-id=42-3546)
- **Dimensions**: 1440px x 864px (Desktop)

---

## Breakpoint Behavior & Responsiveness

### Mobile Breakpoint (< 768px)
- **Overall**: Vertical stacking. Padding horizontal reduced to `16px` (`px-4`), padding vertical `48px` (`py-12`).
- **Background quotes**: Hidden to prevent layout distortion on small viewports.
- **Cards list**: Scrollable horizontal snap-container (`overflow-x-auto`) or vertical stack.
- **Card layout**: Layout shifts from row to column (`flex-col`). Testimonial image takes full width at top, text content block sits below.

### Tablet Breakpoint (768px - 1023px)
- **Overall**: Padding horizontal `48px` (`px-12`).
- **Cards list**: Vertical stack of cards, or horizontal scrollable layout.
- **Card layout**: Card shifts from row to column layout, keeping sizes balanced.

### Desktop Breakpoint (>= 1024px)
- **Overall**: Width constrained to max `1440px`, centered. Padding horizontal `160px`.
- **Background Quotes**: Positioned absolutely: Left quote `#42:3547` at x: 137px, y: 90px; Right quote `#42:3548` at x: 1055px, y: -70px.
- **Cards Row**: Horizontal list of overlapping cards with custom bounds (`flex-row gap-10` i.e. `40px` gap).

---

## Child Element Hierarchy

### 1. Header Block
- **Container**: Node `42:3549` (Column, absolute centered on Desktop at x: 160px, y: 127px, gap: 80px, items center)
  - **Title Block**: Node `42:3550` (Column, gap: 24px, items center)
    - Category Badge: `42:3551` (Row, padding: 16px 32px, bg: `rgba(21, 114, 211, 0.1)`, rounded: 8px)
      - Text: `42:3552` ("TESTIMONIALS", Poppins Medium 14px, `#1572D3`)
    - Heading Text: `42:3553` ("What peole say about us?", Poppins Medium 38px, line-height 1.3em, `#333333`)

### 2. Testimonials Row
- **Container**: Node `42:3554` (Row, gap: 40px)
  - **Testimonial Cards**: Nodes `42:3555` (Jenny Wilson), `42:3571` (Charlie Johnson 1), `42:3587` (Charlie Johnson 2). All follow card layout component `EL-d91585b8`.
  - **Card Inner Structure**:
    - **Visual Image**: Node `EL-b6f43c58` (Image-SVG, width 397px, height 438px, cover object fit, left border-radius `24px` to match card)
    - **Content Wrapper**: Node `EL-eeecfc45` (Column, padding: 40px, gap: 48px)
      - Rating Frame: Node `EL-1153670a` (Column, gap: 24px)
        - Stars count: `EL-d4540147` (Poppins Medium 24px, `#383838`, e.g. "5.0 stars")
        - Star icons row: `EL-a7acbf88` (Row, gap: 4px, containing 5 gold star SVGs of 24x24px)
      - Review details: Node `EL-f997920b` (Column, gap: 80px)
        - Quote Text: `42:3567` (Poppins Regular 18px, `#282828`, e.g., "“I have been using...”")
        - Author Info: `EL-8cc88fec` (Column, gap: 16px)
          - Name: `42:3569` (Poppins Medium 24px, `#252525`, e.g. "Jenny Wilson")
          - Location: `42:3570` (Poppins Regular 14px, `#838383`, e.g. "From New York, US")

---

# Layout Specification — Download app Section

## Overview
- **Section Name**: Download app Section
- **Figma Node ID**: [46:5252](https://www.figma.com/design/mdH9zM5t3Yz7Wft5R0RNH1/Rent-Car---Landing-page--Community-?node-id=46-5252)
- **Dimensions**: 1440px x 500px (Desktop)

---

## Breakpoint Behavior & Responsiveness

### Mobile Breakpoint (< 768px)
- **Overall**: Vertical stacking. Padding horizontal reduced to `16px` (`px-4`), padding vertical `48px` (`py-12`).
- **Background Shape**: The decorative blue background shape vector (`46:5256`) is hidden or simplified.
- **Layout Flow**: Text stack elements centered. Badges row wraps or stacks.
- **Graphic Mockups**: The phone mockups (`46:5265`) scale down to fit width, placed below the text stack.

### Tablet Breakpoint (768px - 1023px)
- **Overall**: Stacks info column and phone mockups vertically. Padding horizontal `48px` (`px-12`).
- **Graphic Mockups**: Centered below the text stack, scaled down to `360px` width.

### Desktop Breakpoint (>= 1024px)
- **Overall**: Two-column layout. Width constrained to max `1440px`, centered. Horizontal padding `160px` (`px-[160px]`).
- **Left Column**: Contains the text info stack (`46:5259` at absolute x: 160px, y: 100px).
- **Right Column**: Contains the absolute positioned iPhone mockup (`46:5265` at absolute x: 839px, y: 72px, extending vertically past the section boundaries).
- **Background Graphic**: Vector blob `#46:5256` positioned at x: -244px, y: -93px.

---

## Child Element Hierarchy

### 1. Info Stack Block
- **Container**: Node `46:5259` (Column, gap: 40px, location: x: 160px, y: 100px)
  - **Badge & Title Stack**: Node `48:1355` (Column, gap: 24px)
    - Category Badge: `48:1356` (Row, padding: 16px 32px, bg: `rgba(21, 114, 211, 0.1)`, rounded: 8px)
      - Text: `48:1357` ("DOWNLOAD", Poppins Medium 14px, `#1572D3`)
    - Title Text: `46:5260` ("Download Rentcars App for FREE", Poppins SemiBold 48px, line-height 1.2em, color `#282828`, with "FREE" colored `#1572D3`)
  - **Description Text**: `46:5261` ("For faster, easier booking and exclusive deals.", Poppins Regular 16px, line-height 1.5em, color `#3E3E3E`)
  - **Badges Row**: Node `46:5262` (Row, gap: 16.26px)
    - App Store Badge: `46:5263` (`ios-badge.png`, size: 174.87px x 51.74px, rounded: 10.14px)
    - Play Store Badge: `46:5264` (`android-badge.png`, size: 174.87px x 51.74px, rounded: 10.14px)

### 2. Mockups Graphic
  - Shadow image: `46:5266` (`shadow-phone.png`, w: 520.22px, h: 1054.36px, opacity 0.7)
  - Phone body image: `46:5267` (`main-phone.png`, w: 520.22px, h: 1054.36px)
  - Phone screen content image: `46:5268` (`screen-content.png`, absolute x: 24.75px, y: 20.11px, w: 468.66px, h: 1011.31px)

---

# Layout Specification — Footer Section

## Overview
- **Section Name**: Footer Section
- **Figma Node ID**: [46:5148](https://www.figma.com/design/mdH9zM5t3Yz7Wft5R0RNH1/Rent-Car---Landing-page--Community-?node-id=46-5148)
- **Dimensions**: 1440px x 375px (Desktop)

---

## Breakpoint Behavior & Responsiveness

### Mobile Breakpoint (< 768px)
- **Overall**: Vertical stacking. Padding horizontal reduced to `16px` (`px-4`), padding vertical `48px` (`py-12`). Background `#051C34`.
- **Layout Flow**:
  - Main columns wrap: brand contacts stack first, then each of the navigation link lists stack vertically.
  - Social media links centered at bottom.
  - Copyright text and divider line stretch to full width, text centered.

### Tablet Breakpoint (768px - 1023px)
- **Overall**: Padding horizontal `48px` (`px-12`).
- **Layout Flow**: 2-column or 3-column wrap layout.

### Desktop Breakpoint (>= 1024px)
- **Overall**: Width constrained to max `1440px`, centered. Background `#051C34`.
- **Left Column**: Contains the logo block and contact details (`46:5181` at absolute x: 160px, y: 41px).
- **Navigation Columns**: 4 columns aligned horizontally:
  - Product (`46:5150` at x: 544px, y: 48px)
  - Resources (`46:5158` at x: 736px, y: 48px)
  - About (`46:5167` at x: 928px, y: 48px)
  - Follow Us (`46:5175` at x: 1120px, y: 48px)
- **Copyright Bar**: Aligned at bottom, divider line at `y: 295px` (width: 1120px), copyright text at `y: 327px`.

---

## Child Element Hierarchy

### 1. Brand & Contact Stack
- **Container**: Node `46:5181` (Column, gap: 32px, location: x: 160px, y: 41px)
  - **Logo block**: Node `46:5182` (Row, gap: 8px)
    - Icon: `46:5183` (`logo-car.svg`, 24x26)
    - Text: `46:5189` ("RENTCARS", Poppins SemiBold 16px, `#FFFFFF`)
  - **Contacts List**: Node `46:5190` (Column, gap: 24px)
    - Location: `46:5191` (Row, gap: 8px, icon location `46:5192`, text: "25566 Hc 1, Glenallen...")
    - Call: `46:5194` (Row, gap: 8px, icon call `46:5195`, text: "+603 4784 273 12")
    - SMS: `46:5197` (Row, gap: 8px, icon sms `46:5198`, text: "rentcars@gmail.com")
  - Contacts Typography: Poppins Regular 14px, color `#D6D6D6` (`text-footer-link`)

### 2. Navigation Columns
- **Product Column**: Node `46:5150` (Column, gap: 32px, location: x: 544px, y: 48px)
  - Header: `46:5151` ("Our Product", Poppins Medium 16px, `#FFFFFF`)
  - Links list: `46:5152` (Column, gap: 16px, text links: "Career", "Car", "Packages", "Features", "Priceline", Poppins Regular 14px, `#D6D6D6`)
- **Resources Column**: Node `46:5158` (Column, gap: 32px, location: x: 736px, y: 48px)
  - Header: `46:5159` ("Resources", Poppins Medium 16px, `#FFFFFF`)
  - Links list: `46:5160` (Column, gap: 16px, text links: "Download", "Help Centre", "Guides"...)
- **About Column**: Node `46:5167` (Column, gap: 32px, location: x: 928px, y: 48px)
  - Header: `46:5168` ("About Rentcars", Poppins Medium 16px, `#FFFFFF`)
  - Links list: `46:5169` (Column, gap: 16px, text links: "Why choose us", "Our Story"...)
- **Follow Us Column**: Node `46:5175` (Column, gap: 32px, location: x: 1120px, y: 48px)
  - Header: `46:5176` ("Follow Us", Poppins Medium 16px, `#FFFFFF`)
  - Social Row: `46:5177` (Row, gap: 16px, social icons: facebook `46:5178`, youtube `46:5179`, instagram `46:5180`)

### 3. Copyright Bar
- **Divider Line**: Node `46:5201` (Line width 1120px, stroke color `#575757`, 1px thick)
- **Copyright Text**: Node `46:5200` ("Copyright 2023 ・ Rentcars, All Rights Reserved", Poppins Regular 12px, `#D6D6D6`)





