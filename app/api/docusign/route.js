import { NextResponse } from 'next/server'
import docusign from 'docusign-esign'
import { getApiClient } from '@/lib/docusign'

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      clientName,
      clientEmail,
      address,
      city,
      preGST,
      priceWithGST,
      shortSides,
      longSides,
      stories,
      roofPitch,
      repName,
      repEmail,
      comments,
    } = body

    console.log('Received body:', JSON.stringify({ clientName, clientEmail, repName, repEmail }))

    if (!clientEmail?.trim()) throw new Error('clientEmail is empty')
    if (!repEmail?.trim()) throw new Error('repEmail is empty')
    if (!clientName?.trim()) throw new Error('clientName is empty')
    if (!repName?.trim()) throw new Error('repName is empty')

    const apiClient = await getApiClient()
    const envelopesApi = new docusign.EnvelopesApi(apiClient)

    const today = new Date().toLocaleDateString('en-CA')
    const fullAddress = city ? `${address}, ${city}` : address
    const addonDetails = `Rodent Guard: ${shortSides} short side${shortSides !== 1 ? 's' : ''}, ${longSides} long side${longSides !== 1 ? 's' : ''}, ${stories} ${stories !== 1 ? 'stories' : 'story'}${roofPitch > 0 ? `, pitch ${roofPitch}` : ''}`

    const envelopeDefinition = new docusign.EnvelopeDefinition()
    envelopeDefinition.templateId = process.env.DOCUSIGN_TEMPLATE_ID
    envelopeDefinition.status = 'created'
    envelopeDefinition.templateRoles = [
      docusign.TemplateRole.constructFromObject({ email: clientEmail, name: clientName, roleName: 'customer_role' }),
      docusign.TemplateRole.constructFromObject({ email: repEmail, name: repName, roleName: 'rep_role' }),
    ]

    const draft = await envelopesApi.createEnvelope(
      process.env.DOCUSIGN_ACCOUNT_ID,
      { envelopeDefinition }
    )
    const envelopeId = draft.envelopeId

    // Fill sender prefill tabs
    const docTabsResult = await envelopesApi.getDocumentTabs(
      process.env.DOCUSIGN_ACCOUNT_ID, envelopeId, '1'
    )

    const valuesByLabel = {
      effective_date: today,
      customer_name: clientName,
      customer_address: fullAddress,
      addon_details: addonDetails,
      pre_gst_price: `$${Number(preGST).toFixed(2)}`,
      price_with_gst: `$${Number(priceWithGST).toFixed(2)}`,
      rep_name: repName,
      rep_date: today,
      customer_date: today,
      signed_at: today,
      additional_comments: comments || '',
    }

    const tabUpdates = (docTabsResult?.prefillTabs?.textTabs ?? [])
      .filter(t => valuesByLabel[t.tabLabel] !== undefined)
      .map(t => ({ tabId: t.tabId, value: valuesByLabel[t.tabLabel] }))

    if (tabUpdates.length > 0) {
      const putRes = await fetch(
        `${process.env.DOCUSIGN_BASE_PATH}/v2.1/accounts/${process.env.DOCUSIGN_ACCOUNT_ID}/envelopes/${envelopeId}/documents/1/tabs`,
        {
          method: 'PUT',
          headers: {
            Authorization: apiClient.defaultHeaders?.['Authorization'],
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prefillTabs: { textTabs: tabUpdates } }),
        }
      )
      if (!putRes.ok) {
        const errBody = await putRes.json().catch(() => ({}))
        throw new Error(JSON.stringify(errBody))
      }
    }

    const updateResult = await envelopesApi.update(
      process.env.DOCUSIGN_ACCOUNT_ID, envelopeId,
      { envelope: docusign.Envelope.constructFromObject({ status: 'sent' }) }
    )
    console.log('Envelope update result:', JSON.stringify(updateResult, null, 2))

    const verifiedEnvelope = await envelopesApi.getEnvelope(
      process.env.DOCUSIGN_ACCOUNT_ID, envelopeId,
      { include: 'recipients' }
    )
    console.log('Verified envelope status:', verifiedEnvelope.status)

    const recipientsResult = await envelopesApi.listRecipients(
      process.env.DOCUSIGN_ACCOUNT_ID, envelopeId
    )
    const recipientSummary = (recipientsResult.signers ?? []).map(s => ({
      name: s.name,
      email: s.email,
      status: s.status,
      routingOrder: s.routingOrder,
    }))
    console.log('Recipients:', JSON.stringify(recipientSummary, null, 2))

    return NextResponse.json({ envelopeId, status: verifiedEnvelope.status, recipients: recipientSummary })
  } catch (err) {
    const detail = err?.response?.body ?? err?.response?.data ?? err.message
    console.error('DocuSign error:', JSON.stringify(detail, null, 2))
    return NextResponse.json({ error: detail }, { status: 500 })
  }
}
