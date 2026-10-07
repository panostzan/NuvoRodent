# Nuvo Rodent Guard

Nuvo Rodent Guard is a small mobile-first sales tool for configuring a rodent-guard installation, calculating the estimate, and sending a prefilled DocuSign contract to the customer and sales representative.

The app is built for a narrow phone layout, but it also works in a desktop browser. It keeps the representative profile on the device, calculates pricing locally, and sends the final contract through a server-side DocuSign route so credentials never reach the browser.

## What it does

- Saves a representative name and email locally on the device.
- Collects the property, configuration, and customer details.
- Calculates the pre-GST price, GST-inclusive total, commission, and truck-roll estimate.
- Shows a review screen before anything is sent.
- Creates a DocuSign envelope from a template, fills its prefill tabs, sends it, and displays the resulting envelope status.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- DocuSign eSignature API
- DocuSign JWT authentication

## Run locally

Requirements: Node.js 20 or newer and a DocuSign developer or production account with a template configured for this workflow.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The first screen asks for the representative profile. The rest of the flow is available after saving it.

Run the checks used before deployment:

```bash
npm run lint
npm run build
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values for your DocuSign account. The private key is base64 encoded because it is passed to the DocuSign SDK at runtime.

- `DOCUSIGN_INTEGRATION_KEY`: DocuSign integration key (client ID)
- `DOCUSIGN_USER_ID`: API user ID to impersonate
- `DOCUSIGN_TEMPLATE_ID`: template used for the contract
- `DOCUSIGN_ACCOUNT_ID`: DocuSign account ID
- `DOCUSIGN_PRIVATE_KEY`: base64-encoded RSA private key
- `DOCUSIGN_OAUTH_BASE_PATH`: OAuth base path, such as `account-d.docusign.com`
- `DOCUSIGN_BASE_PATH`: API base path, such as `https://demo.docusign.net/restapi`

Never commit `.env.local`, private keys, or account credentials. The repository ignores environment files by default.

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

## DocuSign template requirements

The configured template needs recipient roles named `customer_role` and `rep_role`. The route fills prefill text tabs when their labels match the fields below:

`effective_date`, `customer_name`, `customer_address`, `addon_details`, `pre_gst_price`, `price_with_gst`, `rep_name`, `rep_date`, `customer_date`, `signed_at`, and `additional_comments`.

For local development, use DocuSign demo credentials and a demo template. Keep production credentials in the deployment provider’s secret manager.

## License

No license has been selected yet. Add one before accepting external contributions or reuse.
