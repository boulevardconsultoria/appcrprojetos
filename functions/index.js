const functions = require('firebase-functions/v2')
const admin = require('firebase-admin')
admin.initializeApp()

const db = admin.firestore()

exports.hotmartWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  try {
    const { data } = req.body

    const transaction = data?.transaction
    const buyer = data?.buyer

    if (!transaction || !buyer) {
      return res.status(400).send('Invalid payload')
    }

    const buyerEmail = buyer.email
    const status = transaction.status

    if (status !== 'approved' && status !== 'completed') {
      return res.status(200).send('Status not approved')
    }

    const usersSnapshot = await db
      .collection('users')
      .where('email', '==', buyerEmail)
      .limit(1)
      .get()

    if (usersSnapshot.empty) {
      return res.status(404).send('User not found')
    }

    const userId = usersSnapshot.docs[0].id

    const now = new Date()
    let premiumUntil = new Date(now)

    const product = transaction.product?.name?.toLowerCase() || ''
    if (product.includes('anual')) {
      premiumUntil.setFullYear(premiumUntil.getFullYear() + 1)
    } else {
      premiumUntil.setMonth(premiumUntil.getMonth() + 1)
    }

    await db.collection('users').doc(userId).update({
      premium: true,
      plan: product.includes('anual') ? 'premium_anual' : 'premium_mensal',
      premiumUntil: admin.firestore.Timestamp.fromDate(premiumUntil),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return res.status(500).send('Internal Server Error')
  }
})

exports.checkExpiredPremiums = functions.schedule
  .every('0 0 * * *')
  .onRun(async () => {
    const now = admin.firestore.Timestamp.now()
    const expiredQuery = await db
      .collection('users')
      .where('premium', '==', true)
      .where('premiumUntil', '<', now)
      .get()

    const batch = db.batch()
    expiredQuery.docs.forEach((doc) => {
      batch.update(doc.ref, {
        premium: false,
        plan: null,
        premiumUntil: null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      })
    })

    await batch.commit()
    console.log(`Revoked premium for ${expiredQuery.size} users`)
  })
