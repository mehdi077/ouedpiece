import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { translations } from '@/lib/translations';

// Footer component with essential elements and responsive design
const Footer = () => {
  return (
    <footer className="bg-[#132530] text-white mt-2">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="block">
              <Image 
                src="/ouedpiece_logo.png"
                alt="Oued Piece Logo"
                width={120}
                height={40}
                className="object-contain"
              />
            </Link>
            <p className="text-sm text-gray-300">
              {translations.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{translations.footer.quickLinks.title}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {translations.footer.quickLinks.about}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {translations.footer.quickLinks.contact}
                </Link>
              </li>
              <li>
                <Link href="/create" className="text-sm text-gray-300 hover:text-white transition-colors">
                  {translations.footer.quickLinks.createRequest}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{translations.footer.contact.title}</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-300">
                {translations.footer.contact.email}
              </li>
              <li className="text-sm text-gray-300">
                {translations.footer.contact.phone}
              </li>
              <li className="text-sm text-gray-300">
                {translations.footer.contact.address}
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{translations.footer.social.title}</h3>
            <div className="flex flex-col space-y-4">
              {/* Other Social Links */}
              <div className="flex space-x-4 mt-2">
                <a href="#" className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-full" aria-label={translations.footer.social.facebook}>
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-full" aria-label={translations.footer.social.instagram}>
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-full" aria-label={translations.footer.social.twitter}>
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
              {/* LinkedIn Profile Section */}
              <div className="mb-1">
                <p className="text-sm font-medium text-gray-300">{translations.footer.social.developedBy}</p>
              </div>
              
              <a 
                href="https://www.linkedin.com/in/mehdi-bechiche-443320208" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block"
              >
                <div className="relative group cursor-pointer">
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-all">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 group-hover:border-blue-400 transition-colors">
                      <Image
                        src="/linedIn_PP.jpeg"
                        alt="LinkedIn Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        <p className="text-sm font-medium text-gray-200 group-hover:text-white">LinkedIn</p>
                      </div>
                      <p className="text-xs text-gray-400 group-hover:text-gray-300">Mehdi Bechiche</p>
                    </div>
                  </div>
                </div>
              </a>

              
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">
              {translations.footer.legal.copyright(new Date().getFullYear())}
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-300 hover:text-white transition-colors">
                {translations.footer.legal.privacy}
              </Link>
              <Link href="/terms" className="text-sm text-gray-300 hover:text-white transition-colors">
                {translations.footer.legal.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 