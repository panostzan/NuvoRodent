# DocuSign JWT Grant Setup

## Step 1 — Create an Integration Key

1. Go to https://account-d.docusign.com/apps-and-keys (sandbox) or https://account.docusign.com/apps-and-keys (production)
2. Click **Add App & Integration Key**
3. Name it "Nuvo Rodent Guard"
4. Copy the **Integration Key** → paste as `DOCUSIGN_INTEGRATION_KEY`

## Step 2 — Generate an RSA Key Pair

1. On the Integration Key page, under **Authentication**, click **Add RSA Keypair**
2. DocuSign shows you the **private key once** — copy it immediately
3. Encode it to base64:
   - PowerShell: `[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Content private.key -Raw)))`
4. Paste the base64 string as `DOCUSIGN_PRIVATE_KEY`

## Step 3 — Grant Consent

The first time a user (you) uses JWT Grant, they must consent once in a browser:

```
https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature+impersonation&client_id=YOUR_INTEGRATION_KEY&redirect_uri=https://example.com
```

Replace `YOUR_INTEGRATION_KEY`. Visit the URL, log in, click Allow.
After that, the server generates tokens silently forever.

## Step 4 — Get Your User ID

1. Go to https://account-d.docusign.com/apps-and-keys
2. Copy **API Username (GUID)** → paste as `DOCUSIGN_USER_ID`

## Step 5 — Get Your Account ID

1. Same page as above — copy **API Account ID** → paste as `DOCUSIGN_ACCOUNT_ID`

## Step 6 — Create Your Template

1. Go to DocuSign → Templates → New Template
2. Upload your Rodent Guard contract PDF
3. Add a signer role named exactly: **Customer**
4. Place these text tabs (field names must match exactly):
   - `effective_date`
   - `customer_name`
   - `customer_address`
   - `city`
   - `pre_gst_price`
   - `price_with_gst`
   - `rep_name`
   - `rep_date`
   - `addon_details`
5. Copy the Template ID from the URL → paste as `DOCUSIGN_TEMPLATE_ID`

## Going to Production

- Change `DOCUSIGN_OAUTH_BASE_PATH` to `account.docusign.com`
- Change `DOCUSIGN_BASE_PATH` to your production base URL (e.g. `https://na4.docusign.net/restapi`)
- Repeat the consent step on production
