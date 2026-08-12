'use client'

import { Header } from '@/components/header'
import { Leaf, Shield, Truck } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-900">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">About myParaOnline.tn</h1>
          <p className="text-lg text-gray-600 dark:text-slate-400">
            Your trusted partner in health and wellness
          </p>
        </section>

        {/* Mission */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 dark:text-slate-300 mb-4">
            myParaOnline.tn is dedicated to providing premium parapharmacy products that support your health and wellness journey. We believe everyone deserves access to high-quality health products that are carefully selected and trusted by thousands of customers.
          </p>
          <p className="text-gray-700 dark:text-slate-300">
            Our mission is to make wellness accessible, affordable, and easy for everyone. We partner with leading brands and manufacturers to bring you the best products in vitamins, supplements, skincare, and other health essentials.
          </p>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold mb-8">Why Choose myParaOnline.tn?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quality */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600 dark:text-slate-400">
                All products are carefully selected and vetted to ensure they meet our high quality standards
              </p>
            </div>

            {/* Expertise */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Guidance</h3>
              <p className="text-gray-600 dark:text-slate-400">
                Our team of health experts can help you find the right products for your wellness goals
              </p>
            </div>

            {/* Fast Shipping */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-slate-400">
                We ensure quick and safe delivery of your orders to your doorstep
              </p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 border-t border-gray-200 dark:border-slate-700">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8">
              We&apos;re here to help! Contact our support team for any questions about our products or services.
            </p>
            <a
              href="mailto:support@myparaonline.tn"
              className="inline-block px-8 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>
    </>
  )
}
