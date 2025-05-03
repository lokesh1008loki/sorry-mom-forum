import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Privacy Policy</CardTitle>
          <p className="text-sm text-muted-foreground">Last Updated: May 3, 2025</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            We are committed to protecting your privacy. This policy explains how we handle your information.
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal details during registration: username, email, date of birth, country.</li>
              <li>Contributor info (if opted-in): bio, portfolio links.</li>
              <li>Metadata: IP address, browser type, activity logs.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and improve our platform.</li>
              <li>To personalize your experience and monitor usage.</li>
              <li>To moderate and link shortened URLs with user profiles.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. Cookies and Tracking</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We use cookies for login sessions, preferences, and analytics.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. Sharing of Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do not sell your data.</li>
              <li>We may share data with legal authorities if required by law.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Data Security</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We use industry-standard security practices to protect your data.</li>
              <li>However, no method of transmission is 100% secure.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">6. User Rights</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You can update or delete your profile information.</li>
              <li>You can request access to your data or account deletion.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">7. Changes to This Policy</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We may update these terms from time to time. Continued use implies acceptance.</li>
              <li>For any questions, please contact us via the support section of the website.</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  )
} 