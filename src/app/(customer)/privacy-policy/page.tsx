import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Famous Kitchen",
  description: "Privacy policy for Famous Kitchen food pre-ordering app.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#FC0003]">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Last updated: October 1, 2026
        </p>
      </div>

      <div className="prose prose-stone max-w-none space-y-8 text-sm text-stone-700 leading-relaxed">

        <section>
          <h2 className="text-base font-semibold text-stone-900 mb-2">1. Who we are</h2>
          <p>
            Famous Kitchen is a food pre-ordering service operating at NYSC Camp, Imo State, Nigeria.
            This privacy policy explains how we collect, use, and protect your personal information
            when you use our website at this domain.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900 mb-2">2. Information we collect</h2>
          <p>When you place an order, we collect:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Full name</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>NYSC state code</li>
            <li>Delivery location</li>
            <li>Payment receipt image (uploaded by you)</li>
            <li>Order details (items, quantities, total)</li>
          </ul>
          <p className="mt-3">
            We also collect standard web usage data (pages visited, browser type) through
            third-party analytics and advertising services.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900 mb-2">3. How we use your information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To process and fulfill your food order</li>
            <li>To verify your payment</li>
            <li>To contact you about your order via email or WhatsApp</li>
            <li>To improve our service</li>
          </ul>
          <p className="mt-3">
            We do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900 mb-2">4. Advertising</h2>
          <p>
            This website may display advertisements served by Google AdSense. Google may use
            cookies to serve ads based on your prior visits to this and other websites.
            You can opt out of personalised advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FC0003] hover:underline"
            >
              Google Ads Settings
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900 mb-2">5. Cookies</h2>
          <p>
            We use cookies to maintain your shopping cart between sessions. Third-party
            services (Google AdSense, analytics) may also set cookies. By using this site,
            you consent to the use of cookies.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900 mb-2">6. Data storage</h2>
          <p>
            Your order data is stored securely on Supabase (PostgreSQL database hosted on AWS).
            Payment receipt images are stored on ImageKit CDN. We retain order data for a
            minimum of 90 days after your order is completed.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900 mb-2">7. Your rights</h2>
          <p>You have the right to:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Request a copy of the data we hold about you</li>
            <li>Request deletion of your data after your order is complete</li>
            <li>Opt out of any future marketing communications</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, contact us at{" "}
            <a
              href="mailto:ayoadeokiki94@gmail.com"
              className="text-[#FC0003] hover:underline"
            >
              ayoadeokiki94@gmail.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900 mb-2">8. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. Any changes will be posted on this page
            with an updated date.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-stone-900 mb-2">9. Contact</h2>
          <p>
            For any privacy-related questions, contact us at{" "}
            <a
              href="mailto:ayoadeokiki94@gmail.com"
              className="text-[#FC0003] hover:underline"
            >
              ayoadeokiki94@gmail.com
            </a>{" "}
            or call{" "}
            <a href="tel:08164969794" className="text-[#FC0003] hover:underline">
              08164969794
            </a>
            .
          </p>
        </section>

      </div>
    </div>
  );
}
