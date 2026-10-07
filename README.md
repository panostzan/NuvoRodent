# Nuvo Rodent Guard

Nuvo Rodent Guard is a mobile-first sales tool for configuring a rodent-guard installation, calculating the estimate, and sending a prefilled DocuSign contract.

It was built for sales reps who need to move from a property assessment to a reviewed contract without carrying a laptop or manually rebuilding the quote.

## What it does

- Collects property, configuration, and customer details
- Calculates the estimate, GST, commission, and truck-roll total
- Gives the rep a review step before anything is sent
- Creates and sends a DocuSign envelope from a configured template
- Shows the resulting envelope and recipient status

## Stack

Next.js · React · Tailwind CSS · DocuSign eSignature API

## Architecture

The estimator and pricing calculation run in the browser. Representative details are stored locally on the device. Contract creation happens through a server-side Next.js route, keeping DocuSign credentials out of the client.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. A DocuSign developer account, template, and environment values are required to test the send flow. Never commit `.env.local` or private keys.

Checks used for the project:

```bash
npm run lint
npm run build
```

## Project structure

```text
app/
  api/docusign/       Server-side DocuSign envelope route
  confirm/            Review and send screen
  setup/              Representative setup screen
  success/            Completion and envelope status screen
  page.js             Main estimator form
lib/
  docusign.js         JWT authentication and API client setup
  pricing.js          Pure pricing calculation
```

## DocuSign template

The app expects a template with `customer_role` and `rep_role` recipient roles, plus prefill tabs for the customer, property, pricing, and representative fields.
