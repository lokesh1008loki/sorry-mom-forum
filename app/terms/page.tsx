import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Terms and Conditions</CardTitle>
          <p className="text-sm text-muted-foreground">Last Updated: May 3, 2025</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            By registering on SorryMomForum ("we", "our", "us"), you agree to abide by the following terms and conditions:
          </p>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">1. Eligibility</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be at least 18 years old to access and use this website.</li>
              <li>By using the platform, you confirm that you meet the age requirement and that all the information provided is accurate.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">2. Content Submission</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Users may post external video links, screenshots, and GIFs. Hosting of actual videos is not allowed.</li>
              <li>You are solely responsible for the content you share.</li>
              <li>You must not post illegal, abusive, or copyrighted material without permission.</li>
              <li>All URLs submitted will be shortened by our service and associated with your user account.</li>
              <li>We do not own any type of post or video. All content linked or referenced is publicly available on the internet.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">3. Contributor Content</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contributors grant us non-exclusive rights to display submitted links, images, and media on the platform.</li>
              <li>Admins reserve the right to approve or remove any content.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">4. User Conduct</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>No spam, harassment, hate speech, or abusive behavior is permitted.</li>
              <li>Violators may be banned or have content removed without notice.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">5. Moderation and Termination</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We reserve the right to moderate, delete, or block any content or user account at our discretion.</li>
              <li>Users found to be underage will be banned immediately.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">6. Limitation of Liability</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>SorryMomForum is not responsible for user-submitted content.</li>
              <li>We are not liable for any damages or losses resulting from your use of this site.</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  )
} 