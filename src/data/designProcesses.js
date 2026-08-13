// Case-study content for the /design-process/:id pages, linked from a
// project's "View Design Process" link in the Projects layer. Keyed by the
// same id used in that link. A project can optionally set `problemStatement`,
// rendered in the sticky bar below the hero — the text before its first
// ": " (e.g. "Problem") is pulled out and bolded as a lead-in label.
// A section can use either `body` (a single paragraph) or `intro` +
// `bullets` (a lead line followed by a bullet list).
// A section (or subsection) can also carry an `images` array of
// { src, caption } to render a clickable thumbnail gallery with a
// lightbox — used by Low-Fidelity Wireframes and Feedback & Revisions —
// or a `diagram` string (raw mermaid syntax) plus optional
// `diagramCaption`, rendered to inline SVG — used by Final Design. A
// section can also carry a `components` array of { name, body, image? } to
// render an accordion list of shared/reused UI components — used by
// Shared Components — or a `screens` array of the same shape, rendered the
// same way, for the site's key pages — used by Final Design, above its
// diagram; `image` left unset renders a placeholder frame either way.
// A section can also carry a `subsections` array (each with its own
// heading + body/intro/bullets/image/images) to break one numbered section
// into smaller sub-topics — used by Research & Exploration below. A
// subsection can instead (or additionally) carry a `personas` array to
// render a grid of user-persona cards — used by Tailoring the AI — or a
// `requirementGroups` array of { number, title, items: [{ id, text }] } to
// render numbered accordion groups — used by MVP Functional Requirements.
// Setting `ticket: true` renders it as a kitchen order-ticket card instead
// of a plain text block — used for the framing (challenge/objective/truth)
// sections up top. Fill in the remaining placeholder sections' `body` (and
// optional `image`) with the real writeup and screenshots when ready — an
// `image` left unset renders a placeholder frame instead of breaking.
export const designProcesses = {
  lurel: {
    title: 'LUREL',
    subtitle: 'Design Process',
    accentColor: '#7A3010',
    textColor: '#fff',
    liveLink: 'https://morganweltzer.github.io/lurel.github.io/',
    intro: 'An interactive prototype for a budget-luxury, unbranded line of consumer packaged goods - built AI-first with Claude as the primary development partner.',
    problemStatement: 'Problem: Electric toothbrushes and razors are commodity hardware sold at brand markups of 3x-5x. What if we sold the same manufacturing quality, unbranded, for at cost-plus pricing with a "luxury" feel?',
    sections: [
      {
        heading: 'The Challenge',
        ticket: true,
        ticketLabel: 'FIRE',
        bullets: [
          'Users typically equate high prices to higher quality. Need to find a balance in maintaining a "luxurious" feel while emphasizing savings.',
          'How do we replace brand trust with radical transparency as the primary trust mechanism?',
          'How do we design for a category (personal care) where users are more risk-averse than with clothes/home goods?',
          'How do we communicate manufacturing quality in a way that makes sense to any user?',
        ],
      },
      {
        heading: 'The Objective',
        ticket: true,
        ticketLabel: 'ORDER UP',
        intro: 'Create a prototype of a direct-to-consumer e-commerce experience for personal care goods that:',
        bullets: [
          'Builds purchase confidence through transparent sourcing, manufacturing, pricing, etc. rather than through branding.',
          'Makes price-to-quality comparisons against name-brand competitors.',
          'Establishes a reusable design system/component library that can scale through development.',
          'Produces artifacts that are evaluated among different user personas and stories to capture feedback.',
        ],
      },
      {
        heading: 'The Truth',
        ticket: true,
        ticketLabel: "CHEF'S NOTE",
        bullets: [
          'The brand isn’t the quality - the product materials and manufacturing is.',
          'Most name-brand products are produced on the same manufacturing lines, using the same batteries, hardware, etc., as unbranded or budget competitors.',
          'Consumers’ trust in brand is used to justify high price tags - there is an emerging market for budget goods that replace brand trust with transparency and quality materials.',
        ],
      },
      {
        heading: 'Research & Exploration',
        body: 'Started by mapping the actual economics behind "premium" personal-care electronics - most run through the same handful of ISO-certified contract manufacturers regardless of the logo on the box, with brand markup, not materials, accounting for the bulk of the retail price. That reframed the design problem: instead of designing a brand to compete on trust, I needed a product experience that could earn trust without one - through verifiable specs, transparent pricing math, and low-risk guarantees, in place of the usual visual-identity cues.',
        subsections: [
          {
            heading: 'Tailoring the AI',
            intro: 'First step: creating user personas to guide the AI, based on a sample of the different audiences this site would be presented to. Five personas total:',
            personas: [
              {
                name: 'Radhika',
                age: 34,
                occupation: 'IT Risk Auditor',
                label: 'Skeptical Upgrader',
                quote: 'I want something better than my drugstore toothbrush, but if it’s not a brand I’ve heard of, I am skeptical that it’s just a cheaply made alternative that will not hold up well.',
                goal: [
                  'Upgrade current toothbrush without overspending.',
                  'Wants to see evidence of quality, not just promises and claims.',
                ],
                frustrations: [
                  'Has been burned before from buying budget-friendly alternatives that break within a few months.',
                  'Does not want to compromise on quality, but doesn’t want to pay for the upgraded name-brand product either.',
                ],
                behaviors: [
                  'Pays close attention to reviews.',
                  'Checks return policies.',
                  'Spends time to consider all options, not an impulsive shopper.',
                ],
                priorities: [
                  'Wants a long-lasting product.',
                  'Willing to spend more than the baseline budget product, but wants to avoid paying premium prices.',
                  'Willing to do product comparison and research before purchasing.',
                ],
                designImplications: [
                  'Need visible, specific proof points on the product’s "premium quality."',
                  '"Show, don’t tell" - she will not be swayed with language. Use measurable metrics and comparison to drive the value.',
                ],
              },
              {
                name: 'Tom',
                age: 45,
                occupation: 'Established professional, 10-year Oral-B/Philips subscriber',
                label: 'Brand Loyalist on the Fence',
                quote: 'I’m not shopping because my toothbrush stopped working - I’m shopping because I’m tired of paying more every year for parts I can’t buy anywhere else.',
                context: 'Tom isn’t shopping out of dissatisfaction with performance - his current product works fine. He’s shopping because the relationship has soured: rising subscription costs, proprietary replacement heads, and an app that nags more than it helps. He just received another price-increase notice on his replacement-head subscription, the specific event that opened a comparison-shopping tab, not idle browsing. Ten years of brand-specific lock-in taught him to check one thing most first-time buyers wouldn’t think to: whether a product’s replacement parts are proprietary or open.',
                goal: [
                  'Escape a subscription cost structure that keeps rising with no clear ceiling.',
                  'Confirm that switching won’t mean a downgrade in the thing that actually matters: performance.',
                  'Feel like leaving a decade-long brand relationship was a smart decision, not a risky one.',
                ],
                frustrations: [
                  'His dissatisfaction is about cost and lock-in, not quality, so a generic "better toothbrush" pitch doesn’t speak to him.',
                  'Worried any new brand just swaps one proprietary lock-in for another, solving nothing structurally.',
                  'Ten years of sunk trust in his current brand makes leaving without a safety net feel like a real risk.',
                ],
                behaviors: [
                  'Actively comparison-shopping right now, primed to switch, not in a passive research phase.',
                  'Checks parts compatibility (proprietary vs. open) and total cost of ownership, not just headline price.',
                  'Looks specifically for a low-commitment way to trial an alternative before fully switching.',
                ],
                priorities: [
                  'Performance parity or better, verified directly against his current brand rather than a generic competitor.',
                  'An end to proprietary lock-in - explicit confirmation that parts are open, not just "compatible."',
                  'A safety net for the switch: a trial period or guarantee that makes leaving ten years of loyalty rational.',
                ],
                whatWouldStopBuying: [
                  'A comparison against a vague "leading brand" instead of his specific current brand.',
                  'No clear statement on whether replacement parts are proprietary or open.',
                  'No trial period or guarantee - nothing to lower the risk of a decade-long switch.',
                ],
                whatEarnsTrust: [
                  'A direct comparison against his named current brand (Oral-B/Philips-style), not a generic placeholder.',
                  'An explicit statement that parts are open and non-proprietary, addressing the structural problem directly.',
                  'A clearly stated trial period or satisfaction guarantee, positioned near the CTA.',
                  'Transparent, no-creep subscription terms, if a subscription option exists at all.',
                ],
                designImplications: [
                  'Name the competitor - a comparison against "a leading brand" reads as evasive to Tom; naming Oral-B/Philips directly is what makes it credible.',
                  'State parts openness as a headline fact, not an inferred benefit of "compatible design."',
                  'Put the guarantee near the CTA - for Tom specifically, the safety net has to be visible at the moment of decision, not buried in policy pages.',
                  'Be explicit that subscription pricing won’t creep. This is the exact fear driving him to shop - silence on it reads as a red flag, not neutral.',
                ],
              },
              {
                name: 'Victor',
                age: 28,
                occupation: 'Software Engineer',
                label: 'The Practical Consumer',
                quote: 'I don’t care what the product looks like. I want to know the specs/price and make the decision on my own.',
                goal: [
                  'Get the best possible deal measured by spec-per-dollar.',
                  'Wants the feeling of "winning" by finding a smart and budget-friendly alternative.',
                ],
                frustrations: [
                  'Hates marketing fluff and does not prioritize "trendy" products.',
                  'Does not like ambiguous product claims that aren’t supported by data (ex: "Dentist Recommended").',
                ],
                behaviors: [
                  'Comparing products currently, considering a switch.',
                  'Looking for a low-risk decision with easy returns or replacement if needed.',
                ],
                priorities: [
                  'Product performance (more detailed hardware specs).',
                  'Alignment between price and the quality of the product’s specs/hardware.',
                ],
                designImplications: [
                  'Upfront product spec comparison against name-brand competitors.',
                  'Clear call out for warranty/replacement policies.',
                ],
              },
              {
                name: 'Dana',
                age: 29,
                occupation: 'Nonprofit Program Coordinator',
                label: 'Eco-Conscious Minimalist',
                quote: 'I don’t need it to say "eco-friendly" - I need to know what it’s actually made of, and whether I can still get parts for it in five years instead of throwing it away.',
                context: 'Dana evaluates a purchase the way she evaluates an impact report at work: who benefits, and at what cost. She’s minimalist by intention, not deprivation, and has actively avoided personal care electronics as a category - not because she doesn’t want the upgrade, but because everything she’s seen leans on vague sustainability language she’s trained herself to distrust. She still uses manual, disposable products specifically to avoid contributing to e-waste, even knowing electric versions perform better. Before she’ll even look at a product page, she goes to the About/sourcing page first; if that doesn’t hold up, she doesn’t look further.',
                goal: [
                  'Upgrade to an electric product without compromising the values that shape the rest of her purchasing.',
                  'Buy something built to last and be repaired, not replaced.',
                  'Feel like her spending reflects what she actually believes, with nothing to rationalize after the fact.',
                ],
                frustrations: [
                  'Has ruled out an entire product category because its sustainability claims never go past a badge or an icon.',
                  'Distrusts "eco-friendly" as a phrase precisely because it’s vague enough to mean nothing.',
                  'Worried that even a "better" option just repeats the same disposability pattern in nicer packaging.',
                ],
                behaviors: [
                  'Reads the About/sourcing page before the product page - it’s her first filter, not an afterthought.',
                  'Looks for named materials, factory information, and recyclability specifics rather than adjectives.',
                  'Treats subscription models with suspicion, checking whether they’re opt-in and easy to cancel.',
                  'Willing to pay somewhat more for genuinely lower lifecycle waste, unwilling to pay more for a badge.',
                ],
                priorities: [
                  'Verifiable sourcing: named materials and real manufacturing facts, not general "sustainable" language.',
                  'Product longevity and repairability - replacement-part availability matters as much as the product itself.',
                  'Packaging that matches the claim: minimal and honestly shown, not just described.',
                ],
                whatWouldStopBuying: [
                  'Sustainability claims that stop at an icon or a single adjective, with nothing underneath.',
                  'Packaging that visually contradicts the sustainability story once opened.',
                  'A subscription that’s opt-out by default, or unclear about how to cancel.',
                ],
                whatEarnsTrust: [
                  'Specific, named materials and sourcing/manufacturing details she can actually evaluate.',
                  'Visible, minimal packaging shown transparently - photos or explicit description, not just claimed.',
                  'A stated, concrete commitment that replacement parts will remain available.',
                  'Subscription terms that are explicitly opt-in, cancel-anytime, and tied to genuine replacement need.',
                ],
                designImplications: [
                  'Give sourcing its own dedicated section, not a line folded into general About-page prose - she looks for it as a distinct, checkable content block.',
                  'Show packaging, don’t just describe it. A photo or explicit unboxing detail does more for her than any amount of "eco-friendly" copy.',
                  'State parts availability plainly. "Replacement heads available" is stronger to her than "built to last."',
                  'Make subscription terms explicit and opt-in, positioned clearly rather than defaulted - this is a trust signal, not just a checkout detail.',
                ],
              },
              {
                name: 'Renée',
                age: 52,
                occupation: 'Working professional, parent of a college-age son',
                label: 'The Overwhelmed Gift Buyer',
                quote: 'I don’t have time to research motor speeds - I just need to know it’s good, it’s safe, and if it’s not, I can send it back.',
                context: 'Renée is shopping for her college-age son, not herself, which changes her entire risk calculus. She’s not worried about wasting her own money on the wrong toothbrush; she’s worried about the gift reflecting badly on her judgment if it breaks or feels cheap. She’s decisive in categories she knows well, but personal care electronics isn’t one of them, and she has neither the time nor the interest to become an expert in it for a one-off purchase. Shopping in a narrow window - a lunch break, the night before a birthday - she scans star ratings and review counts first, reads only the first line or two of any description, and looks for a simple, visible return policy as her safety net for a decision she can’t fully vet herself.',
                goal: [
                  'Make a confident decision within minutes, without becoming an expert in a category she’ll likely never shop in again.',
                  'Land on something that reads as a thoughtful, considered gift, even though the process behind it was fast.',
                  'Feel sure she picked something unlikely to disappoint, since she can’t personally evaluate the category.',
                ],
                frustrations: [
                  'Product pages that assume technical fluency she doesn’t have leave her unable to evaluate the option at all.',
                  'Too many similar-looking products with no obvious signal for which one is actually good.',
                  'The stakes feel social, not just financial - if the gift breaks, it reflects on her, not just the product.',
                ],
                behaviors: [
                  'Scans star ratings and review counts first, before anything else on the page.',
                  'Looks for "best seller" or similarly clear "safe choice" signals.',
                  'Reads only the first line or two of a description - she needs the summary, not the deep dive.',
                  'Checks for a simple, visible return policy before deciding.',
                ],
                priorities: [
                  'Speed to a confident decision - her available time is genuinely limited, not a matter of preference.',
                  'Clear social proof: a rating and review count she can trust as a shortcut, without needing to verify it herself.',
                  'A visible safety net: a straightforward return/exchange policy in case her fast call turns out wrong.',
                ],
                whatWouldStopBuying: [
                  'A product page that leads with dense specs and no plain-language summary.',
                  'No visible rating, review count, or other quick "this is a safe choice" signal.',
                  'A return policy she can’t find without digging, or that isn’t gift-friendly.',
                ],
                whatEarnsTrust: [
                  'A prominent rating and review count, visible near the top of the page without scrolling.',
                  'A short, plain-language "why people choose this" summary positioned above the detailed specs.',
                  'A clear, simply stated, gift-friendly return/exchange policy.',
                ],
                designImplications: [
                  'Put social proof above the fold. Rating and review count need to be immediately visible - she won’t scroll or click to find them.',
                  'Layer a plain-language summary above the deep specs. The same page needs to serve both her quick scan and a deep-dive buyer like Victor.',
                  'State the return policy in simple, visible terms. It’s her primary safety net, not a secondary detail.',
                  'Design for a few seconds of engagement, not a research session. Every element she needs has to be legible at a glance.',
                ],
              },
            ],
          },
          {
            heading: 'Low-Fidelity Wireframes',
            body: 'Paper sketches first, to work out layout and information hierarchy before any visual design - where the hero and product-card grid sit, and which trust signals (manufacturing quick specs, pricing comparison, warranty/replacement info) surface directly on the landing page instead of being buried in an About page. The guiding note I kept writing in the margins: as a user, I don’t want to spend mental effort inferring the differences - tell me right away.',
            images: [
              { src: '/Low-Fidelity%20Wireframes/LF-LandingPage.jpg', caption: 'Landing Page' },
              { src: '/Low-Fidelity%20Wireframes/LF-AboutPage.jpg', caption: 'About Page' },
              { src: '/Low-Fidelity%20Wireframes/LF-catalog.jpg', caption: 'Catalog' },
              { src: '/Low-Fidelity%20Wireframes/LF-ProductDetail.jpg', caption: 'Product Detail' },
              { src: '/Low-Fidelity%20Wireframes/LF-Checkout.jpg', caption: 'Checkout' },
              { src: '/Low-Fidelity%20Wireframes/LF-CheckoutPage.jpg', caption: 'Checkout Page' },
              { src: '/Low-Fidelity%20Wireframes/LF-UniversalPage.jpg', caption: 'Universal Page' },
            ],
          },
          {
            heading: 'MVP Functional Requirements',
            intro: 'Basic functional requirements for each page - designed desktop-first, but extremely mobile (phone and tablet) friendly.',
            requirementGroups: [
              {
                number: '1',
                title: 'Persistent on All Pages',
                items: [
                  { id: '1.1', text: 'Thin page header. Display company name in the left corner.' },
                  { id: '1.2', text: 'In the page header, on the far right, display a cart icon. There should be a badge for count of items in the cart that updates dynamically as the user adds or removes items from the cart. Clicking should navigate the user to the cart view page.' },
                  { id: '1.3', text: 'Nav bar on the top immediately stacked underneath the header. Should contain product categories: toothbrushes, razors, bottles, recovery.' },
                  { id: '1.4', text: 'Footer with About, Contact, Privacy Policy, Return Policy, Terms, Social Links.' },
                ],
              },
              {
                number: '2',
                title: 'Home',
                items: [
                  { id: '2.1', text: 'Landing page for user when site is rendered initially.' },
                  { id: '2.2', text: 'Hero section with headline "Well-made, honestly priced." and subhead "Personal care essentials built on the same manufacturing standards as the brands you already know - minus the name."' },
                  { id: '2.3', text: 'Below the hero section, banner to display the difference: call out for quality, price (ex: "60% lower than name-brand products"), and return policy and warranty (focus on low-risk language).' },
                  { id: '2.4', text: 'Best-seller section to quickly highlight best-selling products. Arranged with 3 product cards across.' },
                  { id: '2.5', text: 'Clicking into a product card takes you to a quick modal view of the product details. Button for "See More" that navigates the user into the full product detail page.' },
                ],
              },
              {
                number: '3',
                title: 'Product Catalog',
                items: [
                  { id: '3.1', text: 'Products displayed in a grid-like format with 3 product cards across horizontally.' },
                  { id: '3.2', text: 'Product cards have a badge in the bottom right corner for a + for quick add to cart.' },
                  { id: '3.3', text: 'Product cards have a hover state. If the user hovers over the product card, put a white low-opacity, semi-transparent overlay on the card and display some quick specs.' },
                  { id: '3.4', text: 'Underneath the product card, there should be the product title, the price, and competitor’s price.' },
                  { id: '3.5', text: 'Clicking on a product card opens the full product detail page for that product.' },
                  { id: '3.6', text: 'Scrolling should load more product cards into view.' },
                  { id: '3.7', text: 'Add a filters button at the top. When clicked, it opens a styled drop-down menu with sort by newest, ascending price, descending price, highest rated.' },
                ],
              },
              {
                number: '4',
                title: 'Product Details',
                items: [
                  { id: '4.1', text: 'Product image is displayed in a large (but reasonable) size. No hover state.' },
                  { id: '4.2', text: 'At the bottom of the image, there should be "preview" image sizes of the other images the product has. Clicking on them swaps the focused large product image. Maintain a consistent order with the primary image first in that line.' },
                  { id: '4.3', text: 'Product name large and to the right of the image. Clicking will automatically scroll the user to the review section below the product image/description/specs section.' },
                  { id: '4.4', text: 'Stars and ratings should be immediately underneath and aligned on the x-axis of the start of the product title.' },
                  { id: '4.5', text: 'Show price and then competitor price comparison.' },
                  { id: '4.6', text: 'General product description.' },
                  { id: '4.7', text: 'Product spec breakdown with warranty.' },
                  { id: '4.8', text: 'Scroll down to see product review.' },
                ],
              },
              {
                number: '5',
                title: 'Cart View',
                items: [
                  { id: '5.1', text: 'On the left side, have a cart item display with a card list view for each product (with quantity, price).' },
                  { id: '5.2', text: 'There should be a remove or add quantity control for each item in the cart.' },
                  { id: '5.3', text: 'On the right side, show a cart summary section with estimated total cost with taxes and shipping.' },
                  { id: '5.4', text: 'In the cart summary section, include a Checkout button that navigates to the checkout page.' },
                  { id: '5.5', text: 'Top-level "keep shopping" button.' },
                ],
              },
              {
                number: '6',
                title: 'Checkout',
                items: [
                  { id: '6.1', text: 'List side on the right of cart items (not editable) and estimated total.' },
                  { id: '6.2', text: 'On the left side, have sections for order information (Shipping Address, Payment, Contact Info).' },
                  { id: '6.3', text: 'Once all required fields have been entered, have an enabled Order Now button.' },
                ],
              },
              {
                number: '7',
                title: 'About',
                items: [
                  { id: '7.1', text: 'Hero section with mission statement: "Premium everyday essentials. Factory-direct pricing."' },
                  { id: '7.2', text: 'Sections underneath for description on pricing, sourcing, and warranty/return policy (quality guarantee).' },
                ],
              },
            ],
          },
        ],
      },
      {
        heading: 'Building with Claude',
        intro: 'One of the hardest parts of building with AI isn’t the interface - it’s context engineering. It falls to the developer to communicate intent clearly enough that the model stays on track instead of drifting off of it. For LUREL, I used spec-driven development with the BMAD framework to keep Claude anchored to the research rather than guessing at it.',
        bullets: [
          'Installed BMAD into the project and fed it the completed research: the five personas, the challenge, the truth, the objective, and a written problem statement.',
          'BMAD used that context to ask clarifying questions and surface gaps or ambiguity before any code was written - catching misalignment early instead of after a prototype already existed.',
          'Only once we’d aligned on scope did it move into development, building the initial prototype from a shared, structured spec rather than a loose prompt.',
        ],
      },
      {
        heading: 'Feedback & Revisions',
        body: 'Once Claude had a working build, I annotated screenshots page by page against the original personas and flagged anything that didn’t hold up. The recurring theme: claims without evidence. A "Manufacturing-grade quality" badge on the landing page tested as meaningless to a skeptical shopper like Radhika, so it was replaced with the specific, checkable specs (ISO-certified factories, Dupont nylon bristles, medical-grade stainless steel) that show up in the final build. Other rounds tightened smaller gaps: the price-comparison card needed to stay sticky on scroll, star ratings needed a visible affordance that they were clickable, out-of-stock copy had to swap "Add to cart" for "Notify me," and the cart summary needed quantity moved ahead of the item name for faster scanning.',
        images: [
          { src: '/Mockup_Feedback/landingPageFeedback.jpeg', caption: 'Landing Page' },
          { src: '/Mockup_Feedback/landingPageFeedback2.jpeg', caption: 'Landing Page (2)' },
          { src: '/Mockup_Feedback/catalogPageFeedback.jpeg', caption: 'Catalog Page' },
          { src: '/Mockup_Feedback/categoryCatalogPageFeedback.jpeg', caption: 'Category Catalog Page' },
          { src: '/Mockup_Feedback/productDetailPageFeedback1.jpeg', caption: 'Product Detail Page (1)' },
          { src: '/Mockup_Feedback/productDetailPageFeedback2.jpeg', caption: 'Product Detail Page (2)' },
          { src: '/Mockup_Feedback/productDetailModalFeedback1.jpeg', caption: 'Product Detail Modal (1)' },
          { src: '/Mockup_Feedback/productDetailModalFeedback2.jpeg', caption: 'Product Detail Modal (2)' },
          { src: '/Mockup_Feedback/cartViewFeedback.jpeg', caption: 'Cart View' },
          { src: '/Mockup_Feedback/checkoutPageFeedback.jpeg', caption: 'Checkout Page' },
        ],
      },
      {
        heading: 'Final Design',
        body: 'The finished prototype carries the research and feedback all the way through six connected pages, plus the shared overlays (cart drawer, mobile filters, mobile nav) layered on top of them. Every trust mechanism from the research phase - factory transparency, dollar-for-dollar pricing math, open-parts and return guarantees - shows up as a concrete, on-page element rather than a marketing claim, and the reused Price Comparison Card keeps that math visible from the homepage through the cart.',
        screens: [
          {
            name: 'Home (index.html)',
            body: 'Leads with the "Same factories. Same materials. No logo." framing instead of a lifestyle shot, then backs it with the actual cost breakdown - 65% of a name-brand toothbrush’s price goes to marketing and markup, versus 80% of Lurel’s going into materials and manufacturing. A 2-Year Warranty / 30-Day Free Returns pair closes the trust loop before the "Browse Products" CTA.',
            image: '/screenshots/desktop/index.png',
          },
          {
            name: 'Catalog (2.2-product-catalog.html)',
            body: 'A straightforward 3-across grid across five product categories, each card carrying rating, strikethrough compare-price, and a "+" quick-add that expands into a stepper without leaving the grid. Sort and filter controls sit top-right, out of the way until needed.',
            image: '/screenshots/desktop/2.2-product-catalog.png',
          },
          {
            name: 'Product Detail (1.1-pdp.html)',
            body: 'The "our price" vs. name-brand comparison card sits directly under a "Why people choose this" trust line, with the underlying specs (motor/battery, bristle material, warranty length) laid out as plain fact rows rather than marketing copy - the same shift the feedback round pushed for.',
            image: '/screenshots/desktop/1.1-pdp.png',
          },
          {
            name: 'Cart (1.2-cart.html)',
            body: 'Line items on the left with per-item steppers, order summary on the right with subtotal, tax, and shipping broken out before the total - matching the itemized-transparency pattern used everywhere else in the prototype, right down to the receipt.',
            image: '/screenshots/desktop/1.2-cart.png',
          },
          {
            name: 'Checkout (1.3-checkout.html)',
            body: 'A single-page form - shipping address, payment, and contact info stacked top to bottom - with the order summary pinned alongside so the total stays visible as tax and shipping resolve. "Order Now" stays disabled until the required fields validate.',
            image: '/screenshots/desktop/1.3-checkout.png',
          },
          {
            name: 'Order Confirmation (1.4-order-confirmation.html)',
            body: 'Confirms the order number, itemized total, and delivery window in one glance, with a "Continue Shopping" exit back into the catalog - the natural end of the flow the site-navigation diagram below maps out in full.',
            image: '/screenshots/desktop/1.4-order-confirmation.png',
          },
        ],
        diagramCaption: 'Site navigation flow - page-to-page routes plus the overlays (cart drawer, mobile filters, mobile nav) that layer on top of them.',
        diagram: `flowchart LR
    Home["Home\\nindex.html"]
    Catalog["Catalog\\n2.2-product-catalog.html"]
    PDP["Product Detail\\n1.1-pdp.html"]
    Cart["Cart\\n1.2-cart.html"]
    Checkout["Checkout\\n1.3-checkout.html"]
    Confirm["Order Confirmation\\n1.4-order-confirmation.html"]
    Drawer(("Cart Drawer\\n(overlay, any page)"))
    FiltersOv(("Mobile Filters\\n(overlay, Catalog only)"))
    NavOv(("Mobile Nav Menu\\n(overlay, any page)"))

    Home -- "nav links / Browse Products CTA" --> Catalog
    Catalog -- "click a product card" --> PDP
    PDP -- "browser back\\n(scroll position restored)" --> Catalog
    PDP -- "breadcrumb category links" --> Catalog

    PDP -- "Add to cart" --> Drawer
    Drawer -- "View full cart" --> Cart
    Drawer -- "Checkout" --> Checkout

    Home -- "header cart icon" --> Cart
    Catalog -- "header cart icon" --> Cart
    PDP -- "header cart icon" --> Cart

    Cart -- "Checkout" --> Checkout
    Cart -- "Keep shopping / empty-state CTA" --> Catalog
    Checkout -- "Order Now (valid form)" --> Confirm
    Confirm -- "loaded with no order on record" --> Cart
    Confirm -- "Continue Shopping" --> Catalog

    Catalog -. "filters toggle, <900px" .-> FiltersOv
    Home -. "hamburger, <768px" .-> NavOv
    Catalog -. "hamburger, <768px" .-> NavOv
    PDP -. "hamburger, <768px" .-> NavOv
    Cart -. "hamburger, <768px" .-> NavOv
    Checkout -. "hamburger, <768px" .-> NavOv`,
      },
      {
        heading: 'Shared Components',
        intro: 'These live either in shared/base.css + shared/prototype-api.js (rendered/injected identically on every page) or are repeated patterns styled per-page from the same visual language.',
        components: [
          {
            name: 'App Header',
            body: 'Sticky, with rounded top corners that square off once the green top bar scrolls out of view (initHeaderCornerSquaring). Wordmark, nav links, and a cart icon with a bump-animated badge. Below 768px the nav collapses behind a hamburger toggle.',
            image: '/screenshots/components/app-header.png',
          },
          {
            name: 'Mobile Nav Menu',
            body: 'The collapsed header nav, opened by the hamburger toggle. Floats over the page - it doesn’t push content - as an absolutely-positioned panel anchored under the sticky header.',
            image: '/screenshots/components/mobile-nav-open.png',
          },
          {
            name: 'App Footer',
            body: 'Wordmark, a link list (About / Privacy Policy / Contact), and a copyright line. Present at the bottom of every page.',
            image: '/screenshots/components/app-footer.png',
          },
          {
            name: 'Cart Drawer',
            body: 'A single instance injected into <body> once by prototype-api.js (window.CartDrawer), shared across all pages. Opens from the PDP’s "Add to cart" button, slides in from the right with a dimmed backdrop, is focus-trapped, and closes on Escape, backdrop click, or the × button.',
            image: '/screenshots/components/cart-drawer-open.png',
          },
          {
            name: 'Filters Panel',
            body: 'Desktop is an inline, collapsible sidebar (width/opacity animate). Below 900px it becomes a full-screen right-side overlay drawer - mirroring the cart drawer, with its own backdrop, scroll lock, focus trap, header, and close button - instead of pushing the grid down. Category checkboxes flex-wrap into rows ("shelving") on mobile instead of stacking one per line.',
            image: '/screenshots/components/filters-overlay-open.png',
          },
          {
            name: 'Product Card (catalog grid)',
            body: 'Image, a "+" quick-add that expands in place into a +/− quantity stepper (auto-collapses after ~2.5s idle, or on outside click/scroll), title, star rating, and price with a strikethrough compare price.',
            image: '/screenshots/components/product-card.png',
          },
          {
            name: 'Price Comparison Card',
            body: '"Our price" vs. a name-brand compare price. Appears on the homepage, the PDP, and the cart’s quickview.',
            image: '/screenshots/components/price-comparison-card.png',
          },
          {
            name: 'Quantity Stepper',
            body: 'Three instances sharing one pill/circle-button visual language: the catalog card’s auto-collapsing stepper, the cart drawer’s stepper, and the cart page’s stepper.',
            images: [
              { src: '/screenshots/components/quantity-stepper-catalog.png', caption: 'Catalog card' },
              { src: '/screenshots/components/quantity-stepper-cart-drawer.png', caption: 'Cart drawer' },
              { src: '/screenshots/components/quantity-stepper-cart-page.png', caption: 'Cart page' },
            ],
          },
          {
            name: 'Sort Dropdown',
            body: 'A custom listbox, not a native <select>, so the open option list can be fully styled. Full keyboard support - arrows, Enter, Escape.',
            image: '/screenshots/components/sort-dropdown.png',
          },
          {
            name: 'Category Hero',
            body: 'Full-bleed banner above the catalog grid. Image, kicker, and tagline swap based on the resolved single category (or "All Products").',
            image: '/screenshots/components/category-hero.png',
          },
          {
            name: 'Review Modal / Notify-Me Modal',
            body: 'Focus-trapped dialogs on the PDP - one for submitting a review, one for out-of-stock restock notifications.',
            images: [
              { src: '/screenshots/components/review-modal.png', caption: 'Review modal' },
              { src: '/screenshots/components/notify-modal.png', caption: 'Notify-me modal' },
            ],
          },
          {
            name: 'Subscribe Toggle',
            body: 'The PDP’s subscribe-and-save switch - adjusts the displayed price when it’s on.',
            image: '/screenshots/components/subscribe-toggle.png',
          },
          {
            name: 'Page Loader',
            body: 'A full-page spinner overlay shown until every image on the page has loaded (tracked via a pending-API-calls counter plus a MutationObserver), and re-shown on click-through to another page so the transition reads as continuous rather than a hard cut.',
            image: '/screenshots/components/page-loader.png',
          },
          {
            name: 'Skeleton Loaders',
            body: 'Shimmer (PDP gallery) or pulse (catalog grid) placeholders shown while the fake API "fetch" is in flight.',
            images: [
              { src: '/screenshots/components/skeleton-catalog.png', caption: 'Catalog grid' },
              { src: '/screenshots/components/skeleton-pdp.png', caption: 'PDP gallery' },
            ],
          },
        ],
      },
    ],
  },
}
