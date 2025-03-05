import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
// Import the static image so that its intrinsic dimensions are known by Next.js
import logo from '@/public/ouedpiece_logo.png'
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import burgerIcon from '@/public/icons/berger_icon.png'
import plusSignIcon from '@/public/icons/plus_sign.png'
import loudSpeakerIcon from '@/public/icons/loud_speaker_icon.png'
import SearchBar from './SearchBar'
import { translations } from '@/lib/translations'

function Header() {
  
  return (
  // Ensuring the h1 element is visible by adding appropriate styling and ensuring flex properties are correctly applied
  <div className='border-b'>
    <div className='flex flex-col items-center lg:flex-row lg:justify-between lg:h-[63px] bg-[#132530] py-4 px-4 gap-4'>
      {/* logo and sign in icon */}
      <div className='flex items-center h-full w-full lg:w-auto relative'>
        {/* burger menu button visible only on small screens */}
        <button className="relative bg-[#041A24] rounded-sm flex items-center justify-center lg:hidden">
          <Image 
            src={burgerIcon}
            alt="Menu"
            className="object-contain h-[16px] w-auto"
          />
        </button>

        {/* item 1 */}
        <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:left-0 lg:translate-x-0 order-first">
          <Image 
            src={logo}
            alt="Oued Piece Logo"
            className="object-contain h-[35px] lg:h-[35px] w-auto"
            priority
          />
        </Link>

        {/* item 2 - sign in icons for mobile */}
        <div className="flex items-center ml-auto lg:hidden">
          <SignedOut>
            <SignInButton mode='modal'>
              <button 
                className="relative w-[35px] h-[35px] bg-[#041A24] rounded-sm flex items-center justify-center"
                aria-label={translations.auth.signIn}
              >
                <Image 
                  src="/icons/account_icon.png"
                  alt={translations.auth.userProfile}
                  fill
                  className="object-cover"
                />
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>

      {/* search bar */}
      <div className='w-full max-w-xl mx-auto lg:max-w-2xl'>
        <SearchBar />
      </div>

      {/* create part request button */}
      <Link href="/create" className="hidden lg:block">
        <button className="h-[39px] bg-[#F85A00] rounded-[2px] text-[#E5EAED] flex items-center justify-center gap-2 px-2">
          <Image 
            src={plusSignIcon}
            alt={translations.post.create.title}
            className="object-contain h-[28px] w-auto"
          />
          {translations.post.create.title}
          <Image 
            src={loudSpeakerIcon}
            alt={translations.post.create.title}
            className="object-contain h-[24px] w-auto"
          />
        </button>
      </Link>

      {/* lg only: sign in icons positioned on the right */}
      <div className="hidden lg:flex items-center">
        <SignedOut>
          <SignInButton mode='modal'>
            <button 
              className="relative w-[35px] h-[35px] bg-[#041A24] rounded-sm flex items-center justify-center"
              aria-label={translations.auth.signIn}
            >
              <Image 
                src="/icons/account_icon.png"
                alt={translations.auth.userProfile}
                fill
                className="object-cover"
              />
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </div>

    <div className='py-4 flex items-center justify-center bg-[#041A24] lg:hidden shadow-lg'>
      {/* create part request button */}
      <Link href="/create" className="block lg:hidden">
        <button className="h-[39px] bg-[#F85A00] rounded-[2px] text-[#E5EAED] flex items-center justify-center gap-2 px-2">
          <Image 
            src={plusSignIcon}
            alt="Ajouter"
            className="object-contain h-[28px] w-auto"
          />
          Créer une demande de pièce
          <Image 
            src={loudSpeakerIcon}
            alt="Annonce"
            className="object-contain h-[24px] w-auto"
          />
        </button>
      </Link>
    </div>
  </div>
   
  )
}

export default Header