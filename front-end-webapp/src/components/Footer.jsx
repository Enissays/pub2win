import React from 'react';
import { FaEnvelope, FaPhone, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { useAide } from '../contexts/AideContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  // Utiliser le hook pour accéder au contexte partagé
  const { aide } = useAide();
  
  return (
    <div className="mt-24">
      <div className="dark:text-gray-200 text-gray-700 text-center m-20">
      <Link to="/">
        <img 
          src="p2w.png" 
          alt="P2W Logo" 
          className="h-16 mb-6 mx-auto drop-shadow-2xl brightness-125 filter" 
          style={{
            filter: "drop-shadow(0 0 8px #3cdbd9) drop-shadow(0 0 16px #3cdbd9)"
          }}
        />
      </Link>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-6 w-full">
            {aide?.email && (
              <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${aide.email}`} className="text-dark hover:text-[#3cdbd9] flex items-center">
                <FaEnvelope className="mr-2" size={20} />
              </a>
            )}
            {aide?.telephone && (
              <a href={`tel:${aide.telephone}`} className="text-dark hover:text-[#3cdbd9] flex items-center">
                <FaPhone className="mr-2" size={20} />
              </a>
            )}
            
            {aide?.facebook_url && (
              <a href={`https://facebook.com/${aide.facebook_url}`} className="text-dark hover:text-[#3cdbd9]">
                <FaFacebook size={24} />
              </a>
            )}

            {aide?.instagram_url && (
              <a href={`https://instagram.com/${aide.instagram_url}`} className="text-dark hover:text-[#3cdbd9]">
                <FaInstagram size={24} />
              </a>
            )}
            
            {aide?.twitter_url && (
              <a href={`https://twitter.com/${aide.twitter_url}`} className="text-dark hover:text-[#3cdbd9]">
                <FaTwitter size={24} />
              </a>
            )}
          </div>
          <div className="mt-4">
            © 2025 Tous droits réservés par pub2win
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;