/**
 * legal.ts — Terms of Service + Privacy Policy content, written for Detour — Take Five.
 *
 * ✏️  EDIT the three constants below before launch (contact email, jurisdiction, date),
 *     then tweak any wording in `terms` / `privacy` as you like. This is general,
 *     plain-language boilerplate adapted to a local-first wellness app — have a lawyer
 *     review it if you need certainty for your jurisdiction.
 */

export const LEGAL = {
  appName: 'Detour — Take Five',
  // TODO(you): your real support email (shown on both pages).
  contactEmail: 'sklabs1905@gmail.com',
  // TODO(you): the jurisdiction whose laws govern your terms.
  governingLaw: 'India',
  // TODO(you): bump when you change either document.
  lastUpdated: 'June 3, 2026',
} as const

export type LegalBlock = { p: string } | { list: string[] } | { email: string }
export interface LegalSection {
  heading?: string
  blocks: LegalBlock[]
}
export interface LegalDoc {
  slug: 'terms' | 'privacy'
  title: string
  intro: string
  sections: LegalSection[]
}

const { appName, contactEmail, governingLaw } = LEGAL

export const terms: LegalDoc = {
  slug: 'terms',
  title: 'Terms of Service',
  intro: `Welcome to ${appName}. By accessing or using our application, you agree to be bound by these Terms of Service.`,
  sections: [
    {
      heading: '1. Acceptance of Terms',
      blocks: [
        {
          p: `By accessing or using ${appName}, you agree to these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the application.`,
        },
      ],
    },
    {
      heading: '2. Subscription and Payments',
      blocks: [
        {
          p: `${appName} is free to start and offers an optional paid subscription that unlocks premium features. By subscribing, you agree to pay all fees in accordance with the pricing displayed in the app. Subscriptions automatically renew unless cancelled at least 24 hours before the renewal date. You can manage and cancel your subscription through your device's App Store or Google Play settings.`,
        },
        {
          p: `Prices are subject to change. Any price changes will be communicated in advance. Refunds are handled in accordance with the App Store's or Google Play's policies.`,
        },
      ],
    },
    {
      heading: '3. No Account Required',
      blocks: [
        {
          p: `${appName} does not require account creation or sign-in. Your menu, check-ins, streaks, and preferences are stored locally on your device. We do not collect, store, or transmit any personal data or usage information to our servers.`,
        },
      ],
    },
    {
      heading: '4. Your Data',
      blocks: [
        {
          p: `All content you create within the application — including your menu items, check-ins, streaks, mood entries, and settings — is stored exclusively on your device. Because we do not maintain a database or cloud storage for your data, we are unable to recover data lost due to device failure, app deletion, or other loss events. We recommend backing up your device regularly.`,
        },
      ],
    },
    {
      heading: '5. Disclaimer of Warranties',
      blocks: [
        {
          p: `The app is provided "as is" and "as available" without warranties of any kind, whether expressed or implied. We do not warrant that the app will be error-free, uninterrupted, or free of harmful components. We are not responsible for any decisions you make based on the app's features or content.`,
        },
      ],
    },
    {
      heading: '6. Limitation of Liability',
      blocks: [
        {
          p: `To the maximum extent permitted by law, ${appName} and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation loss of profits, data, use, goodwill, or other intangible losses, resulting from:`,
        },
        {
          list: [
            'Your use of, or inability to use, the app',
            "Any decisions or actions you take based on the app's features or content",
            'Loss of locally stored data',
            'Any other matter relating to the app',
          ],
        },
      ],
    },
    {
      heading: '7. Wellness Disclaimer',
      blocks: [
        {
          p: `${appName} is a wellness and habit-building tool designed to help you choose small, real-life activities over compulsive screen use. It is intended for general well-being and is not medical, psychological, or mental-health advice, diagnosis, or treatment, and is not a substitute for professional care. If you are struggling with your mental health, screen dependency, or compulsive behavior, please consult a qualified healthcare professional.`,
        },
      ],
    },
    {
      heading: '8. User Responsibilities',
      blocks: [
        { p: 'You are responsible for:' },
        {
          list: [
            'Maintaining the security of your device',
            'Backing up your locally stored app data regularly',
            'Ensuring your use of the app complies with applicable laws',
          ],
        },
      ],
    },
    {
      heading: '9. Changes to Terms',
      blocks: [
        {
          p: 'We reserve the right to modify these terms at any time. Users will be notified of any material changes via in-app notifications. Continued use of the app after changes constitutes acceptance of the new terms.',
        },
      ],
    },
    {
      heading: '10. Governing Law',
      blocks: [
        {
          p: `These terms shall be governed by and construed in accordance with the laws of ${governingLaw}, without regard to its conflict of law provisions.`,
        },
      ],
    },
    {
      heading: '11. Contact',
      blocks: [
        { p: 'If you have any questions about these Terms of Service, please contact us at:' },
        { email: contactEmail },
      ],
    },
  ],
}

export const privacy: LegalDoc = {
  slug: 'privacy',
  title: 'Privacy Policy',
  intro: `At ${appName}, we take your privacy seriously. This Privacy Policy outlines our practices concerning the handling of your data.`,
  sections: [
    {
      heading: 'Data Collection and Storage',
      blocks: [
        {
          p: `${appName} is designed with privacy at its core. We do not collect, store, or transmit any personal data to external servers. There is no account creation, sign-in, or cloud database associated with this app.`,
        },
        {
          p: `All data generated within the app — including your menu, check-ins, streaks, mood entries, and preferences — is stored exclusively on your device using local storage. This data never leaves your device.`,
        },
      ],
    },
    {
      heading: 'Website Analytics',
      blocks: [
        {
          p: `Our website may use privacy-focused, cookieless analytics to collect anonymous usage data. This helps us understand how visitors interact with our website. The analytics data collected may include page views, referring websites, and general (country-level) location. This data is anonymized and cannot be used to identify individual users.`,
        },
      ],
    },
    {
      heading: 'Subscription and Payment Data',
      blocks: [
        {
          p: `When you purchase a subscription, payment processing is handled entirely by the App Store or Google Play. We do not store, process, or have access to your payment information or card details.`,
        },
        {
          p: `We only receive confirmation of your subscription status from the app store to validate your access to premium features. No payment data is stored by us.`,
        },
      ],
    },
    {
      heading: 'Data Usage',
      blocks: [
        { p: 'Because all data is stored locally on your device, it is used solely to:' },
        {
          list: [
            `Provide and maintain your ${appName} experience on your device`,
            'Show you a menu tailored to your mood and the time you have',
            'Track your check-ins, streaks, and stats such as your mood at open',
          ],
        },
      ],
    },
    {
      heading: 'Data Sharing',
      blocks: [
        {
          p: 'We do not share any personal data with third parties, because we do not collect any. Anonymous website analytics data may be processed by our analytics provider under strict privacy agreements to help us improve the app and the site.',
        },
      ],
    },
    {
      heading: 'Data Security',
      blocks: [
        {
          p: "Since all app data is stored locally on your device, its security depends on your device's own security settings. We recommend using a device passcode or biometric lock to protect your data. Because we do not operate a backend database, there is no central server that can be breached to expose your information.",
        },
      ],
    },
    {
      heading: "Children's Privacy",
      blocks: [
        {
          p: `Our service is not directed to children under 13 years of age. We do not knowingly collect any data from children under 13. If you are under 13, please do not use ${appName}.`,
        },
      ],
    },
    {
      heading: 'Your Rights',
      blocks: [
        { p: 'Because all data is stored locally on your device, you have full control over it at all times. You can:' },
        {
          list: [
            "Delete your app data at any time by clearing the app's local storage or uninstalling the app",
            'Opt out of website analytics by using a browser with tracking protection enabled',
          ],
        },
      ],
    },
    {
      heading: 'Changes to Privacy Policy',
      blocks: [
        {
          p: 'We may update this policy from time to time. Users will be notified of any changes via in-app notifications. We encourage you to review this policy periodically for any updates.',
        },
      ],
    },
    {
      heading: 'Contact Information',
      blocks: [
        { p: 'If you have any questions about this Privacy Policy, please contact us at:' },
        { email: contactEmail },
      ],
    },
  ],
}

export const legalDocs = { terms, privacy } as const
