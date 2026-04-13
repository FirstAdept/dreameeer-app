export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif', color: '#e2e8f0', backgroundColor: '#08081a', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Privacy Policy</h1>
      <p style={{ color: '#94a3b8', marginBottom: 8 }}>Last updated: April 14, 2026</p>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12 }}>1. Introduction</h2>
      <p>Dreameeer ("we", "our", "the app") is an AI-powered dream interpretation and visualization application. This Privacy Policy describes how we collect, use, and protect your information.</p>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12 }}>2. Data We Collect</h2>
      <ul style={{ paddingLeft: 20 }}>
        <li><strong>Dream descriptions</strong> — text you enter for analysis. Processed by AI and not stored permanently on our servers.</li>
        <li><strong>Device identifier</strong> — a randomly generated anonymous ID used to manage your subscription status. It is not linked to your personal identity.</li>
        <li><strong>Subscription status</strong> — whether you have an active subscription.</li>
      </ul>
      <p>We do <strong>not</strong> collect your name, email, phone number, location, contacts, or any other personal information.</p>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12 }}>3. How We Use Your Data</h2>
      <ul style={{ paddingLeft: 20 }}>
        <li>To analyze your dream text using AI and return interpretation results.</li>
        <li>To generate images and video visualizations of your dreams.</li>
        <li>To manage your subscription and free usage quota.</li>
      </ul>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12 }}>4. Data Storage</h2>
      <p>Dream diary entries are stored locally on your device using browser storage (localStorage). We do not have access to your diary data. Generated images and videos are stored temporarily on Cloudinary cloud storage.</p>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12 }}>5. Third-Party Services</h2>
      <ul style={{ paddingLeft: 20 }}>
        <li><strong>OpenAI</strong> — for dream text analysis (subject to OpenAI's privacy policy).</li>
        <li><strong>Cloudinary</strong> — for temporary media storage.</li>
        <li><strong>YooKassa</strong> — for payment processing (we do not store your payment details).</li>
      </ul>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12 }}>6. Children's Privacy</h2>
      <p>The app is not directed at children under 13. We do not knowingly collect data from children.</p>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12 }}>7. Your Rights</h2>
      <p>You can delete all your local data at any time by clearing the app's storage in your browser or device settings. Since we do not store personal data on our servers, there is no server-side data to delete.</p>

      <h2 style={{ fontSize: 20, marginTop: 32, marginBottom: 12 }}>8. Contact</h2>
      <p>If you have questions about this Privacy Policy, contact us at: <a href="mailto:dreameeer.app@gmail.com" style={{ color: '#7c3aed' }}>dreameeer.app@gmail.com</a></p>
    </div>
  );
}
