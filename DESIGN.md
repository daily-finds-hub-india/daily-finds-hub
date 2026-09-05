---
name: Daily Finds Hub
description: Curated Amazon India Product Discovery Platform
colors:
  primary: "#f59e0b"
  primary-hover: "#d97706"
  primary-soft: "#fef3c7"
  primary-dark: "#fbbf24"
  canvas-light: "#f8fafc"
  canvas-dark: "#090d16"
  surface-light: "#ffffff"
  surface-dark: "#111827"
  surface-muted-light: "#f1f5f9"
  surface-muted-dark: "#161f33"
  text-primary-light: "#0f172a"
  text-primary-dark: "#f8fafc"
  text-secondary-light: "#475569"
  text-secondary-dark: "#94a3b8"
  border-light: "rgba(15, 23, 42, 0.08)"
  border-dark: "rgba(255, 255, 255, 0.08)"
typography:
  display:
    fontFamily: "var(--font-archivo), sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  body:
    fontFamily: "var(--font-ibm-plex), sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#0f172a"
    rounded: "{rounded.md}"
    padding: "10px 20px"
---

# Design System: Daily Finds Hub

## Overview

**Creative North Star: "The Curated Signal Board"**

Daily Finds Hub is a modern, high-contrast product discovery system built specifically to bridge fast-moving social media interest (Instagram Reels, YouTube Shorts) into informed Amazon affiliate actions. It rejects the visual clutter, deceptive countdowns, and marketplace chaos of conventional ecommerce in favor of editorial clarity, tactile confidence, and immediate utility.

The system is calibrated to serve both sleek technology gadgets and warm home/kitchen essentials without leaning into cold sterility or rustic provincialism. In light mode, crisp porcelain surfaces pair with deep ink typography and warm Solar Amber signals. In dark mode, luxury obsidian grounds allow product photography and glowing amber actions to guide the user's thumb effortlessly on OLED mobile screens.

**Key Characteristics:**
- High-contrast Solar Amber conversion points with zero ambiguous action states
- Generous, rounded-2xl tactile cards optimized for thumb touch targets on mobile
- Instant social search bridge right at the entrance of discovery
- Seamless dual-mode ergonomics (Light & Dark) sharing the same geometrical rhythm
- Unified design tokens shared across public discovery and administrative management

## Colors

The palette is anchored by neutral slate grounds and energized by warm Solar Amber signals, maintaining perfect WCAG contrast across daylight mobile usage and evening dark mode.

### Primary
- **Solar Amber** (#f59e0b light / #fbbf24 dark): The dedicated conversion and high-attention signal color. Used exclusively on Amazon outbound buttons, trending badges, and focused active states.
- **Amber Deep** (#d97706): Hover state for interactive primary actions.

### Neutral
- **Porcelain Light Canvas** (#f8fafc): Clean, warm-neutral page ground for light mode that prevents eye strain.
- **Obsidian Dark Canvas** (#090d16): Deep, velvety dark background designed for battery efficiency and high visual contrast.
- **Surface Elevated** (#ffffff light / #111827 dark): Card and container backgrounds providing tonal elevation over the canvas.
- **Deep Slate Ink** (#0f172a): High-legibility primary text for light mode and button label text on amber buttons.
- **Off-White Crisp** (#f8fafc): Primary text in dark mode.
- **Muted Slate** (#475569 light / #94a3b8 dark): Secondary descriptive text and contextual metadata.

### Named Rules
**The Single Conversion Voice Rule.** Amber is reserved solely for signal and outbound action. It is never used as background wall wash or decorative filler; when amber appears, it signals an action worth taking.

## Typography

**Display Font:** Archivo (var(--font-archivo), sans-serif)  
**Body Font:** IBM Plex Sans (var(--font-ibm-plex), sans-serif)  

**Character:** Archivo brings confident, punchy editorial gravity to headlines, while IBM Plex Sans delivers unmatched mechanical legibility for dense descriptions, pricing, and technical specs.

### Hierarchy
- **Display** (800 weight, clamp(2.5rem, 5vw, 4rem), 1.1 line-height): Hero headlines and major discovery statements.
- **Headline** (800 weight, 1.75rem - 2.25rem, 1.2 line-height): Section titles and category spotlights.
- **Title** (700 weight, 1rem - 1.25rem, 1.3 line-height): Product card titles and modal headers.
- **Body** (400/500 weight, 0.875rem - 1rem, 1.6 line-height): Product descriptions, editorial summaries. Max line length: 65ch.
- **Label** (700 weight, 0.6875rem - 0.75rem, uppercase tracking 0.1em): Eyebrows, category chips, and status pills.

### Named Rules
**The Solid Clarity Rule.** Text remains solid ink or solid light. Decorative gradient text clipping is strictly forbidden to preserve effortless legibility and avoid AI-generated aesthetic clichés.

## Layout

The spatial model uses an 8pt baseline rhythm with mobile-first fluidity:
- **Mobile (<640px):** Single-column product discovery, horizontal swipeable category chips, thumb-friendly sticky search, minimum 44px touch targets.
- **Tablet (640px - 1024px):** 2 to 3-column fluid grid, balanced padding, persistent header controls.
- **Desktop (>1024px):** 3 to 4-column product grids, 12-column hero layout, split preview panels with comfortable 1280px max-width container constraints.

## Elevation & Depth

Surfaces rely on subtle tonal contrast and ambient multi-layered shadows rather than heavy harsh drop shadows.

### Shadow Vocabulary
- **Subtle Ambient** (0 1px 3px 0 rgba(15, 23, 42, 0.04)): Resting card state in light mode.
- **Raised Depth** (0 20px 30px -10px rgba(15, 23, 42, 0.08)): Active hover lift, hero spotlight frame, and search autocomplete dropdown.
- **Dark Ambient** (0 4px 14px -2px rgba(0, 0, 0, 0.45)): Subtle separation for cards against the obsidian background in dark mode.

### Named Rules
**The Lift-On-Hover Rule.** Cards rest flat with a hairline border at rest (rgba(15, 23, 42, 0.08)). On hover, they elevate with a 1.5px vertical lift and deepened shadow to invite interaction.

## Shapes

- **Base Radius:** rounded-2xl (1rem / 16px) for cards, hero containers, and search bars.
- **Interactive Radius:** rounded-xl (0.75rem / 12px) for buttons, inputs, and dialogs.
- **Pill Geometry:** rounded-full (9999px) for category filters, status indicators, and live badges.
- **Borders:** Consistent 1px hairline rules providing crisp definition in both color schemes.

## Components

### Buttons
- **Shape:** Rounded-xl (0.75rem).
- **Primary (Amazon Outbound):** Background Solar Amber (#f59e0b), text Deep Slate Ink (#0f172a), font-weight 700. Hover: Amber Deep (#d97706) with micro-scale 1.02.
- **Secondary / Ghost:** Border 1px with transparent background, hover subtle surface tint.

### Product Card
- **Corner Style:** rounded-2xl with overflow hidden.
- **Background:** Elevated surface (#ffffff light / #111827 dark).
- **Structure:** 4:5 aspect ratio image with subtle hover zoom, trending pill badge overlay, bold 2-line title, rupee price display, and dedicated Amazon action button.

### Category Chips
- **Style:** rounded-full pills with horizontal scroll on mobile. Active: Solar Amber fill with bold ink text; Inactive: Surface fill with border.

### Search Bar
- **Style:** 2-column or full-width rounded-2xl container with internal magnifying icon and integrated "Find Now" submit button.

## Do's and Don'ts

### Do:
- **Do** always provide direct, transparent Amazon outbound links with target="_blank" and rel="noopener noreferrer sponsored".
- **Do** format Indian Rupee prices cleanly using ₹ with proper Indian number grouping (toLocaleString('en-IN')).
- **Do** maintain identical card geometry and button standards between public discovery and admin management pages.
- **Do** ensure every interactive element meets the 44x44px minimum mobile tap target size.

### Don't:
- **Don't** use decorative gradient text fills or neon glowing borders.
- **Don't** hide or obscure affiliate transparency disclosures.
- **Don't** mimic Amazon's visual UI patterns (yellow star bars, crowded grids, aggressive buy boxes); Daily Finds Hub is a curated discovery layer, not an Amazon clone.
- **Don't** use unstyled, boxy black-and-white wireframe components without border-radius or transition states.
