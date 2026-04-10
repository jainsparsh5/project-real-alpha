# Design System Strategy: The Kinetic Vault

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Kinetic Vault."** It is a visual manifesto of discipline, technical precision, and high-torque performance. Unlike standard lifestyle apps that lean into soft gradients and approachable roundness, this system adopts a "Digital Dojo" aesthetic—a space that feels both fortified and high-energy.

We break the "template" look by rejecting the standard 12-column rigid grid in favor of **Intentional Asymmetry**. Large-scale typography (Space Grotesk) acts as a structural element, often overlapping container boundaries to create a sense of forward motion. This is an editorial experience for the modern high-performer: it is sharp, cold-to-the-touch, and unapologetically premium.

---

## 2. Colors & Tonal Architecture
The palette is rooted in deep obsidian tones (`#0e0e0f`), punctuated by a surgical application of Electric Blue (`#8ff5ff`).

### The "No-Line" Rule
Standard UI relies on borders to define space; this design system forbids them. Boundaries must be defined strictly through **Background Color Shifts**. To separate a section, transition from `surface` to `surface_container_low`. This creates a seamless, sophisticated transition that feels like a machined part rather than a sketched box.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. We use the Material surface tiers to imply depth:
*   **Base Layer:** `surface` (#0e0e0f) – The foundation.
*   **Sectioning:** `surface_container_low` (#131314) – Subtle differentiation for large blocks.
*   **Active Components:** `surface_container_high` (#201f21) – For cards and interactive modules.

### The Glass & Gradient Rule
To prevent the dark mode from feeling "flat," use **Glassmorphism** for floating elements (e.g., navigation bars, modal overlays).
*   **Formula:** `surface_variant` at 40% opacity + `backdrop-blur(20px)`.
*   **Signature Textures:** Use a linear gradient from `primary` (#8ff5ff) to `primary_container` (#00eefc) at a 135-degree angle for primary CTAs. This adds a "lithium-ion" glow that flat color cannot replicate.

---

## 3. Typography: Technical Editorial
We pair the geometric, technical character of **Space Grotesk** with the clean, modernist legibility of **Manrope**.

*   **Display & Headlines (Space Grotesk):** These are your "Impact" layers. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to create an authoritative, headline-driven layout.
*   **Body (Manrope):** Use `body-lg` (1rem) for all narrative content. Manrope’s balanced proportions ensure high readability against dark backgrounds.
*   **The Technical Label:** `label-md` (Space Grotesk) should always be uppercase with +0.1em tracking. This evokes the feel of a high-end watch face or cockpit instrument.

---

## 4. Elevation & Depth
In this system, depth is a product of **Tonal Layering**, not structural shadows.

*   **The Layering Principle:** To "lift" a card, do not reach for a shadow. Place a `surface_container_highest` (#262627) object on a `surface` background. The delta in luminance creates a natural, sophisticated lift.
*   **Ambient Shadows:** If a floating state is required (e.g., a triggered dropdown), use an ultra-diffused shadow: `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)`. The shadow must feel like ambient occlusion, not a "drop" shadow.
*   **The Ghost Border:** For high-density data where separation is critical, use the "Ghost Border"—the `outline_variant` token at 15% opacity. It should be felt, not seen.
*   **Interaction Glow:** Instead of traditional elevation, use a subtle outer glow using the `primary` color (10% opacity) when an element is focused or active.

---

## 5. Components

### Buttons: The Kinetic Trigger
*   **Primary:** Gradient fill (`primary` to `primary_container`), `none` border, and `on_primary` text. Border-radius: `DEFAULT` (0.25rem) for a sharp, technical finish.
*   **Secondary:** `surface_container_highest` fill with a `primary` "Ghost Border" (20% opacity).
*   **Tertiary:** Text-only in `primary`, but with a `primary_dim` underline that appears only on hover.

### Cards & Lists: The Negative Space Rule
*   **Forbidden:** Divider lines between list items or card sections.
*   **Execution:** Use vertical white space (from the Spacing Scale) or a subtle shift from `surface_container_low` to `surface_container_high` to delineate items. Every list item should feel like an individual "cell" in a battery.

### Input Fields: Minimalist Precision
*   Default state: No border, only a `surface_container_highest` background.
*   Focus state: A 1px "Ghost Border" using the `primary` token and a subtle 2px backdrop blur.
*   Labels: Always use `label-sm` in `primary` placed above the field, never inside as placeholder text.

### Performance Tracker (Custom Component)
A signature component for this system. Use a `surface_container_lowest` background with a `primary` progress bar. Add a `primary_fixed` glow effect to the leading edge of the progress bar to simulate "energy flow."

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace Asymmetry:** Align text to the left but place supporting data/metrics on the far right to create a wide, expansive feel.
*   **Use High Contrast:** Ensure `on_background` (#ffffff) is used for all critical information to maintain "Alpha" readability.
*   **Think Layered:** Every screen should feel like 3-4 layers of glass stacked on top of an obsidian base.

### Don’t:
*   **Don't use Rounded Corners:** Avoid `full` or `xl` rounding for functional components. Stick to `DEFAULT` (0.25rem) or `sm` (0.125rem). Soft corners kill the "Disciplined" vibe.
*   **Don't use Solid Lines:** Never use a 100% opaque 1px border to separate content. It breaks the "Kinetic Vault" immersion.
*   **Don't use Grey Shadows:** Shadows, if used, should be tinted with the background color to maintain tonal purity.