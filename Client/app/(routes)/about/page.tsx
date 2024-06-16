import Container from '@/components/ui/container';
import Link from 'next/link';
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "About us page for the coffee shop.",
}

const aboutSections = [
  {
    title: "Welcome to Our Coffee Shop",
    content: "We are a small business selling coffee from Ethiopia. We roast the coffee ourselves and offer both roasted and non-roasted coffee. Our selection includes dark and medium roasted coffee."
  },
  {
    title: "Our Mission",
    content: "Our mission is to provide the highest quality coffee to our customers while supporting the sustainable development of coffee communities in Ethiopia. We believe in fair trade and work directly with farmers to ensure they receive a fair price for their beans."
  },
  {
    title: "Our Team",
    content: "Our team is passionate about coffee. We are dedicated to roasting the best beans and providing exceptional customer service. We are always learning and improving to better serve our customers."
  },
  {
    title: "Our Journey",
    content: "We started our business in 2020 with a small coffee roaster and a dream. Since then, we have grown thanks to the support of our customers and the hard work of our team. We are grateful for the opportunity to share our love of coffee with you."
  }
];

export default function About() {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-screen py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aboutSections.map((section, index) => (
              <div key={index}>
                <h3 className="text-2xl font-semibold mb-4">{section.title}</h3>
                <p className="mb-6">{section.content}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
              Go back
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
};