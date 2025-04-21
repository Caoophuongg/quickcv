import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function Page() {
  return (
    <main className="prose dark:prose-invert mx-auto max-w-3xl px-3 py-6">
      <h1>Terms of Service</h1>
      <p>
        Welcome to AI Resume Builder! These Terms of Service (&quot;Terms&quot;)
        govern your use of our website and services. By accessing or using our
        website and services, you agree to be bound by these Terms.
      </p>
      <h2 className="text-xl font-semibold">1. Definitions</h2>
      <p>
        <strong>Service:</strong> The AI Resume Builder website platform and
        related services.
        <br />
        <strong>User:</strong> Any individual who accesses or uses the Service.
        <br />
        <strong>Content:</strong> Any information, data, text, or other
        materials uploaded, generated, or otherwise transmitted through the
        Service.
      </p>
      <h2 className="text-xl font-semibold">2. Account Registration</h2>
      <p>
        To use certain features of the Service, you may need to register for an
        account. You agree to provide accurate and complete information during
        the registration process and to keep your account credentials secure.
      </p>
      <h2 className="text-xl font-semibold">3. User Conduct</h2>
      <p>
        You agree not to use the Service for any unlawful purpose or in any way
        that could damage, disable, or impair the Service. You are solely
        responsible for all Content that you upload or generate through the
        Service.
      </p>
      <h2 className="text-xl font-semibold">4. Service Features</h2>
      <p>
        AI Resume Builder provides tools to create professional resumes with AI
        assistance. All features are available to all users without any
        restrictions.
      </p>
      <h2 className="text-xl font-semibold">5. Privacy</h2>
      <p>
        We collect and process personal information in accordance with our
        Privacy Policy. By using the Service, you consent to our collection and
        processing of your personal information as described.
      </p>
      <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
      <p>
        The Service and its content, features, and functionality are owned by AI
        Resume Builder and are protected by copyright, trademark, and other
        intellectual property laws. You retain ownership of any Content you
        create or upload to the Service.
      </p>
      <h2 className="text-xl font-semibold">7. Disclaimer of Warranties</h2>
      <p>
        THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
        WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
      </p>
      <h2 className="text-xl font-semibold">8. Limitation of Liability</h2>
      <p>
        IN NO EVENT SHALL AI RESUME BUILDER BE LIABLE FOR ANY INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
      </p>
      <h2 className="text-xl font-semibold">9. Changes to Terms</h2>
      <p>
        We reserve the right to modify these Terms at any time. Your continued
        use of the Service after any such changes constitutes your acceptance of
        the new Terms.
      </p>
      <h2 className="text-xl font-semibold">10. Contact Information</h2>
      <p>
        If you have any questions about these Terms, please contact us at
        support@airesumebuilder.com.
      </p>
      <p className="text-sm text-muted-foreground">
        Last updated: November 1, 2024
      </p>
    </main>
  );
}
