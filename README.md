# Portal Bioxxi — Case Study

> **JavaScript Member Portal** · Bioxxi B2B Platform · Client Dashboard · API-Driven Data

![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-Custom-1572B6?logo=css3&logoColor=white)

<!-- TODO: Add screenshot of the Portal Bioxxi dashboard here -->

---

## 1. Project Overview

Portal Bioxxi is a JavaScript-powered client portal delivering a private, authenticated dashboard experience to Bioxxi's B2B customer base. The portal provides clients with access to their account data, order history, product documentation, and communication tools — operating as a distinct, API-connected layer on top of the Bioxxi institutional WordPress site.

<!-- TODO: Add screenshot of the login flow or authenticated state here -->

---

## 2. The Problem

Bioxxi's B2B clients required a private digital workspace for managing their relationship with the company — accessing product documentation, tracking orders, and communicating with the Bioxxi team. Exposing this functionality within the public WordPress site would have mixed authenticated and public content in the same CMS, creating access control complexity and performance overhead. A separate, lightweight JavaScript portal was the appropriate architectural choice.

---

## 3. The Solution & Architecture

A standalone JavaScript application with session-based authentication, client-side routing, and REST API integration — served as a separate web application that authenticates against the Bioxxi backend and renders client-specific data dynamically.

### Architecture

- **Authentication** — Session/token-based login flow with protected route enforcement: unauthenticated users are redirected to login regardless of the URL accessed.
- **Client-side routing** — JavaScript-managed navigation without full page reloads, delivering an app-like experience within the browser.
- **REST API integration** — All client data (account details, order history, documents) is fetched from the Bioxxi backend API and rendered dynamically, with no hardcoded content.
- **Responsive dashboard layout** — A sidebar navigation pattern with content panels, optimized for both desktop and tablet use — the primary device profiles of B2B users.

---

## 4. Technologies Used

- **Frontend:** JavaScript (ES2022), HTML5, CSS3
- **Architecture:** SPA-like client-side routing, REST API integration
- **Authentication:** Token-based session management
- **Layout:** Responsive dashboard — sidebar navigation, content panels

---

## 5. Design Process & UI/UX

The portal was designed for efficiency over aesthetics — B2B users return repeatedly and value task completion speed over visual novelty. The dashboard surface area is organized around the most frequent actions (viewing the latest order, downloading a document, submitting a support request), with those tasks requiring the minimum number of clicks from any starting state.

<!-- TODO: Add screenshot of the order history or document download panel here -->
<!-- TODO: Add screenshot of the mobile responsive layout here -->

---

## 6. Project Outcomes

- **Client self-service:** B2B clients manage their own account interactions through the portal, reducing the support load on Bioxxi's customer service team.
- **Access control:** The authentication layer ensures that client-specific data is never accessible without valid credentials — a non-negotiable requirement for B2B document and order data.
- **Performance:** The lightweight JavaScript architecture (no heavy framework overhead) delivers fast initial load times and instant client-side navigation between portal sections.
