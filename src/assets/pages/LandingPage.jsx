import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { debounce } from 'lodash';
import { maindata } from '../datasets/all_services_list';
import HeaderPage from './HeaderPage';
import MiddlePage from './MiddlePage';
import FooterPage from './FooterPage';
import {
  FaSearch, FaTimes, FaHospital, FaMapMarkerAlt, FaRupeeSign, FaInfoCircle,
  FaCommentMedical, FaRegSmile, FaRegLightbulb, FaChevronRight, FaStar,
  FaRegStar, FaPhoneAlt, FaCalendarAlt, FaBone, FaTooth, FaArrowUp,
} from 'react-icons/fa';
import { IoMdPulse } from 'react-icons/io';
import { GiHealthNormal, GiBrain } from 'react-icons/gi';
import { BsHeartPulseFill } from 'react-icons/bs';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Constants
const SUGGESTED_QUESTIONS = [
  'Which hospitals are in Vijayawada?',
  'What Cardiology services are in Hyderabad?',
  'What’s the cost of a checkup in Guntur?',
  'Who are the doctors at Ramesh Hospital?',
  'Find Cardiology services under ₹60,000 in Ongole.',
  'I need a hospital for a checkup.',
];

const GENERAL_RESPONSES = {
 
  "hey": "Hey! What medical info are you looking for?",
  "good morning": "Good morning! How can I support your health journey today?",
  "good afternoon": "Good afternoon! Looking for a doctor or hospital?",
  "good evening": "Good evening! How may I assist you?",
  "what's up": "Not much! Ready to help you with any hospital or service info.",
  "how's it going": "Going well! Let me know how I can help you today.",
  "yo": "Yo! Searching for hospitals or doctors?",
  "sup": "Sup! I'm your healthcare guide—ask away!",
  "greetings": "Greetings! How may I assist your medical queries?",
  "namaste": "Namaste! I'm here to help with hospitals and services.",
  "hola": "Hola! Need help with anything health-related?",
  "bonjour": "Bonjour! I can help you find medical services.",
  "need help": "Of course! Tell me what you’re looking for.",
  "can you help me": "Sure! Just ask me about hospitals, doctors, or services.",
  "are you there": "Yes, I’m right here! How can I assist you?",
  "help me": "I’m ready to help—what would you like to know?",
  "i need help": "Sure! What service or hospital info do you need?",
  "please assist": "Absolutely! Just tell me what you’re looking for.",
  "hello assistant": "Hello! How can I assist with your health needs?",
  "hi assistant": "Hi there! I'm here to guide you.",
  "hey bot": "Hey! Need any healthcare info?",
  "hello bot": "Hello! Ask me anything related to hospitals and health.",
  "yo bot": "Yo! I'm your health assistant. What do you need?",
  "good to see you": "Good to see you too! How can I help today?",
  "it's me again": "Welcome back! How can I assist this time?",
  "i'm back": "Glad to see you again! Ready to help.",
  "start search": "Sure! What would you like to search for?",
  "begin": "Let’s go! What are you looking for?",
  "hello there": "Hey! What can I do for you?",
  "hello friend": "Hi! I’m here to guide you.",
  "hello again": "Welcome back! Let’s get started.",
  "hi there": "Hi! How can I support your healthcare query?",
  "get me help": "Sure! What help do you need?",
  "i want info": "What kind of information are you looking for?",
  "where do i start": "Start by asking about any hospital, service, or doctor!",
  "i have a question": "Go ahead! I’m ready to answer.",
  "who are you": "I'm your health assistant here to help you find hospitals and services.",
  "tell me something": "Sure! Ask about hospitals, services, or doctors.",
  "i'm not feeling well": "I’m here to help. Do you want to find a nearby hospital or doctor?",
  "i want to talk": "Of course! What would you like to discuss?",
  "how do you work": "Ask me anything health-related—I’ll find answers from hospital data.",
  "are you a bot": "Yes, but a helpful one! I assist with health and hospital queries.",
  "nice to meet you": "Nice to meet you too! How can I help today?",
  "you there": "Yes! Ask away, I’m listening.",
  "yo assistant": "Yo! What can I help you with?",
  "alright": "Alright! Let me know what you need.",
  "let's go": "Sure! What should we search first?",
  "hi": "Hey! Ready to help with hospital info or anything else. What’s up?",
  "hello": "Hi there! Need details on hospitals, costs, or services? Just ask!",
  "how are you": "Doing great, thanks! How about you? Looking for hospital info or something else?",
  "Ongole hospitals list": "Ongole hospitals: Alpha Hospital (NH-16, Kanakamamidi Center, cardiology ₹55,000), Sai Sanjeevani Multi-Specialty Hospital (Kurnool Rd, cardiology ₹50,000, neurology ₹33,000), Prasad Hospitals (MG Road, cardiology ₹59,000, neurology ₹43,000), Sai Sudha Hospital (Gandhi Nagar, cardiology ₹61,000, oncology ₹75,000), Medicover Hospitals (Kurnool Rd, oncology ₹71,000), Manipal Hospitals (MG Road, oncology ₹77,000), Vijaya Marie Hospital (Gandhi Nagar, oncology ₹74,000), Aakruthi Hospitals (Kurnool Rd, gastroenterology ₹71,000), Saveera Hospital (MG Road, gastroenterology ₹78,000).",
  "Guntur hospitals list": "Guntur hospitals: Saveera Hospital (Old Club Road, cardiology ₹68,000, oncology ₹69,000), Aakruthi Hospitals (Lakshmipuram, cardiology ₹63,500, general surgery ₹72,000), Suraksha Hospital (NTR Circle, neurology ₹35,000, oncology ₹78,000), Noble Hospitals (Pattabhipuram, neurology ₹41,100, oncology ₹80,000), Apollo Hospitals (Lakshmipuram, oncology ₹68,000), Sai Sanjeevani Multi-Specialty Hospital (Lakshmipuram, orthopedics ₹46,000), Prasad Hospitals (Pattabhipuram, orthopedics ₹52,000), Vijaya Marie Hospital (Pattabhipuram, nephrology ₹64,000), Ramesh Hospitals (Lakshmipuram, psychiatry ₹24,000).",
  "Hyderabad hospitals list": "Hyderabad hospitals: Apollo Hospitals (Jubilee Hills, neurology ₹39,500, obstetrics ₹56,000), Yashoda Hospitals (Jubilee Hills, orthopedics ₹45,000, general surgery ₹70,000), Continental Hospitals (Nanakramguda, neurology ₹30,000, infectious diseases ₹25,000), Bhaskara Hospital (Jubilee Hills, nephrology ₹55,000), Manipal Hospitals (Nanakramguda, general surgery ₹65,000).",
  "Nellore hospitals list": "Nellore hospitals: Bhaskara Hospital (Chinthareddypalem, neurology ₹34,000, nephrology ₹59,000), Alpha Hospital (Trunk Road, neurology ₹43,000, infectious diseases ₹27,000), Sai Sanjeevani Multi-Specialty Hospital (Dargamitta, neurology ₹33,000, ophthalmology ₹69,000), Prasad Hospitals (Vedayapalem, neurology ₹43,000, general surgery ₹69,000), Sai Sudha Hospital (Chinthareddypalem, orthopedics ₹48,000, nephrology ₹61,000), Medicover Hospitals (Dargamitta, orthopedics ₹50,000, infectious diseases ₹19,000), Manipal Hospitals (Trunk Road, orthopedics ₹47,000, infectious diseases ₹27,500), Continental Hospitals (Vedayapalem, gastroenterology ₹66,000), Apollo Hospitals (Vedayapalem, ophthalmology ₹61,000), Suraksha Hospital (Trunk Road, psychiatry ₹29,000).",
  "Secunderabad hospitals list": "Secunderabad hospitals: Yashoda Hospitals (SP Road, neurology ₹37,300, obstetrics ₹49,000), KIMS Hospitals (Minister Road, neurology ₹45,000, ophthalmology ₹59,000), Alpha Hospital (Minister Road, orthopedics ₹51,000, nephrology ₹65,000), Sai Sudha Hospital (Minister Road, general surgery ₹68,000), Medicover Hospitals (SP Road, general surgery ₹75,000), Noble Hospitals (Minister Road, psychiatry ₹31,000), Apollo Hospitals (SP Road, psychiatry ₹29,000).",
  "near hospitals": "Please share your city or area! For example, Sai Sanjeevani (Ongole, cardiology ₹50,000) or Apollo Hospitals (Hyderabad, neurology ₹39,500) might be nearby.",
  "best hospitals in Ongole": "Sai Sanjeevani Multi-Specialty Hospital (Kurnool Rd, cardiology ₹50,000, neurology ₹33,000) is top for its range of services and affordability. Alpha Hospital (NH-16, cardiology ₹55,000) is also reliable for heart care.",
  "best hospitals in Nellore": "Sai Sanjeevani Multi-Specialty Hospital (Dargamitta, neurology ₹33,000, ophthalmology ₹69,000) stands out for multi-specialty care. Medicover Hospitals (Dargamitta, infectious diseases ₹19,000) is great for low-cost services.",
  "best hospitals in Hyderabad": "Apollo Hospitals (Jubilee Hills, neurology ₹39,500, obstetrics ₹56,000) is renowned for advanced care. Yashoda Hospitals (Jubilee Hills, orthopedics ₹45,000) excels in multiple specialties.",
  "best hospitals in Secunderabad": "Yashoda Hospitals (SP Road, neurology ₹37,300, obstetrics ₹49,000) is a top choice for quality care. KIMS Hospitals (Minister Road, neurology ₹45,000) offers extensive facilities.",
  "best hospitals in Guntur": "Aakruthi Hospitals (Lakshmipuram, cardiology ₹63,500, general surgery ₹72,000) is excellent for heart and surgical care. Saveera Hospital (Old Club Road, cardiology ₹68,000) is also highly rated.",
  "low cost service provide hospitals": "Medicover Hospitals (Nellore, infectious diseases ₹19,000), Continental Hospitals (Hyderabad, infectious diseases ₹25,000), Suraksha Hospital (Nellore, psychiatry ₹25,000), and Sai Sanjeevani Multi-Specialty Hospital (Nellore, neurology ₹33,000) offer affordable services.",
  "cardiology provide best hospitals": "Sai Sanjeevani Multi-Specialty Hospital (Ongole, ₹50,000, Dr. Priya Reddy), Alpha Hospital (Ongole, ₹55,000), Saveera Hospital (Guntur, ₹68,000), Aakruthi Hospitals (Guntur, ₹63,500), and Manipal Hospitals (Vijayawada, ₹49,000) are top for cardiology.",
  "suggest best hospital in Ongole": "Sai Sanjeevani Multi-Specialty Hospital (Kurnool Rd, cardiology ₹50,000, neurology ₹33,000) is recommended for its affordability and multi-specialty services.",
  "suggest best hospital in Nellore": "Sai Sanjeevani Multi-Specialty Hospital (Dargamitta, neurology ₹33,000) or Medicover Hospitals (Dargamitta, infectious diseases ₹19,000) for cost-effective, quality care.",
  "suggest best hospital in Hyderabad": "Apollo Hospitals (Jubilee Hills, neurology ₹39,500, obstetrics ₹56,000) is ideal for advanced treatments across specialties.",
  "suggest best hospital in Secunderabad": "Yashoda Hospitals (SP Road, neurology ₹37,300) is a great pick for reliable, multi-specialty care.",
  "suggest best hospital in Guntur": "Aakruthi Hospitals (Lakshmipuram, cardiology ₹63,500) is recommended for heart care and surgical expertise.",
  "multiple services using hospitals": "Sai Sanjeevani Multi-Specialty Hospital (Ongole, cardiology ₹50,000, neurology ₹33,000), Apollo Hospitals (Hyderabad, neurology ₹39,500, obstetrics ₹56,000), Yashoda Hospitals (Secunderabad, neurology ₹37,300, orthopedics ₹45,000), and Medicover Hospitals (Nellore, oncology ₹71,000, infectious diseases ₹19,000) offer diverse specialties.",
  "cheapest heart checkup": "Manipal Hospitals (Vijayawada, cardiology ₹49,000) and Sai Sanjeevani Multi-Specialty Hospital (Ongole, cardiology ₹50,000) offer affordable heart checkups.",
  "cheapest cancer treatment": "Saveera Hospital (Vijayawada, oncology ₹69,000) and Medicover Hospitals (Ongole, oncology ₹71,000) provide cost-effective cancer care.",
  "cheapest knee surgery": "Yashoda Hospitals (Hyderabad, orthopedics ₹45,000) and Manipal Hospitals (Nellore, orthopedics ₹47,000) are affordable for knee surgeries.",
  "cheapest neurology checkup": "Continental Hospitals (Hyderabad, neurology ₹30,000) and Sai Sanjeevani Multi-Specialty Hospital (Nellore, neurology ₹33,000) offer low-cost neurology services.",
  "general checkup cost": "General checkups typically cost ₹5,000–₹10,000 at hospitals like Ramesh Hospitals (Vijayawada) or Apollo Hospitals (Hyderabad), depending on tests included.",
  "emergency hospitals": "Apollo Hospitals (Hyderabad, 24/7 ER), Saveera Hospital (Guntur, 24/7), and Yashoda Hospitals (Secunderabad, 24/7 ER) provide emergency care. Costs start at ₹8,000–₹12,000.",
  "kids hospitals": "Apollo Hospitals (Hyderabad, pediatric cardiology ₹56,000) and Noble Hospitals (Secunderabad, pediatric care ₹49,000) are great for children’s health.",
  "eye treatment cost": "Medicover Hospitals (Nellore, ophthalmology ₹63,000) and Yashoda Hospitals (Secunderabad, ophthalmology ₹58,000) offer eye treatments like cataract surgery.",
  "diabetes treatment cost": "Endocrinology services for diabetes cost around ₹30,000–₹35,000 at Apollo Hospitals (Hyderabad) or Yashoda Hospitals (Secunderabad), based on typical ranges.",
  "skin treatment cost": "Dermatology treatments (e.g., acne, eczema) cost ₹20,000–₹25,000 at Saveera Hospital (Guntur) or Noble Hospitals (Guntur), based on standard pricing.",
  "what’s a hospital": "A hospital is a place where doctors treat illnesses or injuries with services like cardiology (₹50,000+), surgeries (₹65,000+), or checkups (₹5,000+). Examples: Apollo, Yashoda.",
  "how pick good hospital": "Choose hospitals with skilled doctors, modern facilities, and good reviews. Check service costs (e.g., Sai Sanjeevani, cardiology ₹50,000) and specialties like neurology or oncology.",
  "cheapest dialysis cost": "Sai Sudha Hospital (Nellore, nephrology ₹61,000) and Medicover Hospitals (Nellore, nephrology ₹58,000) offer affordable dialysis services.",
  "best ENT hospitals": "Manipal Hospitals (Hyderabad, ENT ₹45,000, Dr. Vikram Seth) and Sai Sanjeevani Multi-Specialty Hospital (Nellore, ENT ₹69,000) are top for ear, nose, and throat care.",
  "cataract surgery cost": "Yashoda Hospitals (Secunderabad, ophthalmology ₹58,000) and Apollo Hospitals (Nellore, ophthalmology ₹61,000) provide cataract surgery at competitive rates.",
  "best pediatric hospitals": "Apollo Hospitals (Hyderabad, pediatric cardiology ₹56,000) and Noble Hospitals (Secunderabad, obstetrics with pediatric care ₹49,000) excel in pediatric services.",
  "cheapest appendicitis surgery": "Manipal Hospitals (Hyderabad, general surgery ₹65,000) and Sai Sudha Hospital (Secunderabad, general surgery ₹68,000) offer affordable appendicitis surgeries.",
  "hospitals with MRI facility": "Apollo Hospitals (Hyderabad, neurology ₹39,500), Yashoda Hospitals (Secunderabad, neurology ₹37,300), and Medicover Hospitals (Nellore, multi-specialty) likely have MRI facilities, typical for large hospitals.",
  "best hospitals for diabetes": "Yashoda Hospitals (Hyderabad, orthopedics ₹45,000, likely endocrinology) and Apollo Hospitals (Hyderabad, neurology ₹39,500) are reliable for diabetes management, with costs around ₹30,000–₹35,000.",
  "cheapest hernia surgery": "Sai Sudha Hospital (Secunderabad, general surgery ₹68,000) and Ramesh Hospitals (Nellore, general surgery ₹76,000) provide cost-effective hernia surgeries.",
  "hospitals for stroke treatment": "Continental Hospitals (Hyderabad, neurology ₹30,000, vascular neurology) and Sai Sanjeevani Multi-Specialty Hospital (Nellore, neurology ₹33,000) are ideal for stroke care.",
  "best hospitals for pregnancy": "Apollo Hospitals (Hyderabad, obstetrics ₹56,000, Dr. Anusha Rao) and Noble Hospitals (Secunderabad, obstetrics ₹49,000) offer excellent maternity care.",
  "cheapest C-section cost": "Noble Hospitals (Secunderabad, obstetrics ₹49,000) and Yashoda Hospitals (Nellore, obstetrics ₹49,000) provide affordable cesarean deliveries.",
  "hospitals with ICU": "Apollo Hospitals (Hyderabad, neurology ₹39,500), Saveera Hospital (Guntur, oncology ₹69,000), and KIMS Hospitals (Secunderabad, neurology ₹45,000) have ICU facilities, common in multi-specialty hospitals.",
  "best kidney treatment hospitals": "Bhaskara Hospital (Hyderabad, nephrology ₹55,000) and Medicover Hospitals (Nellore, nephrology ₹58,000) are top for kidney care, including dialysis.",
  "cheapest liver treatment": "Vijaya Marie Hospital (Ongole, gastroenterology ₹65,000) and Continental Hospitals (Nellore, gastroenterology ₹66,000) offer affordable liver treatments.",
  "hospitals with 24/7 pharmacy": "Large hospitals like Apollo Hospitals (Hyderabad), Yashoda Hospitals (Secunderabad), and Medicover Hospitals (Nellore) typically have 24/7 pharmacies for patient convenience.",
  "best hospitals for back pain": "Yashoda Hospitals (Hyderabad, orthopedics ₹45,000, spine surgery) and Manipal Hospitals (Nellore, orthopedics ₹47,000) are great for back pain treatment.",
  "cheapest thyroid treatment": "Ramesh Hospitals (Nellore, general surgery ₹76,000, likely endocrine surgery) and Manipal Hospitals (Hyderabad, general surgery ₹65,000) offer cost-effective thyroid care.",
  "hospitals for asthma treatment": "Sai Sanjeevani Multi-Specialty Hospital (Nellore, multi-specialty, likely pulmonology) and Apollo Hospitals (Hyderabad, neurology ₹39,500) can manage asthma, with costs around ₹20,000–₹30,000.",
  "best hospitals for joint replacement": "Yashoda Hospitals (Hyderabad, orthopedics ₹45,000, joint replacement) and Sai Sanjeevani Multi-Specialty Hospital (Guntur, orthopedics ₹46,000) excel in joint replacement surgeries.",
  "cheapest gallbladder surgery": "Manipal Hospitals (Hyderabad, general surgery ₹65,000) and Sai Sudha Hospital (Secunderabad, general surgery ₹68,000) are affordable for gallbladder surgeries.",
  "hospitals with cancer specialists": "Noble Hospitals (Guntur, oncology ₹80,000, Dr. Venkatesh) and Sai Sudha Hospital (Ongole, oncology ₹75,000) have skilled cancer specialists.",
  "best hospitals for mental health": "Suraksha Hospital (Nellore, psychiatry ₹25,000, Dr. Sonia Gupta) and Apollo Hospitals (Secunderabad, psychiatry ₹29,000) are top for mental health care.",
  "cheapest eye checkup": "Yashoda Hospitals (Secunderabad, ophthalmology ₹58,000) and KIMS Hospitals (Secunderabad, ophthalmology ₹59,000) offer affordable eye checkups, likely ₹2,000–₹5,000 for basic tests.",
  "hospitals with ambulance service": "Apollo Hospitals (Hyderabad), Saveera Hospital (Guntur), and Yashoda Hospitals (Secunderabad) provide 24/7 ambulance services, typical for multi-specialty hospitals.",
  "best hospitals for heart surgery": "Sai Sanjeevani Multi-Specialty Hospital (Ongole, cardiology ₹50,000, interventional cardiology) and Manipal Hospitals (Vijayawada, cardiology ₹49,000) are excellent for heart surgeries."
};

// Styled Components
const AppContainer = styled.div`
  background-color: ${({ theme }) => (theme === 'dark' ? '#1a202c' : '#f0f7ff')};
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
  transition: background-color 0.3s;
  color: ${({ theme }) => (theme === 'dark' ? '#F5F5F5' : '#333333')};
`;

const ChatbotIcon = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="rgba(110, 142, 251, 0.5)" /><circle cx="12" cy="12" r="4" fill="#6e8efb" /></svg>') 12 12, pointer;
  box-shadow: 
    0 4px 10px rgba(0, 0, 0, 0.2),
    0 0 0 0px rgba(110, 142, 251, 0.4);
  z-index: 1000;
  transition: 
    transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.3s ease,
    background 0.5s ease;
  will-change: transform, box-shadow, background; /* Optimize performance */

  /* Gradient animation */
  background-size: 200% 200%;
  animation: gradientFlow 6s ease infinite;

  /* Pulse animation when first rendered */
  animation: pulse 2s infinite;

  /* Hover effects with 3D rotation */
  &:hover {
    transform: scale(1.1) rotate3d(1, 1, 0, 10deg);
    box-shadow: 
      0 6px 15px rgba(0, 0, 0, 0.3),
      0 0 0 10px rgba(110, 142, 251, 0.15);
    background: linear-gradient(135deg, #7a9cff 0%, #b886f0 100%);
    background-position: 100% 100%;
  }

  /* Active/pressed state with ripple */
  &:active {
    transform: scale(0.95);
    box-shadow: 
      0 2px 5px rgba(0, 0, 0, 0.2),
      0 0 0 5px rgba(110, 142, 251, 0.3);
  }

  &:active::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 10%, transparent 10.01%);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s ease-out;
  }

  /* Focus state for accessibility */
  &:focus {
    outline: 3px solid ${({ theme }) => (theme === 'dark' ? '#a777e3' : '#6e8efb')};
    outline-offset: 2px;
    box-shadow: 
      0 0 0 5px rgba(110, 142, 251, 0.5),
      0 4px 10px rgba(0, 0, 0, 0.2);
    transform: scale(1.1) rotate3d(1, 1, 0, 10deg);
  }

  /* Dark mode support */
  ${({ theme }) => theme === 'dark' && `
    background: linear-gradient(135deg, #5d7de8 0%, #9666d6 100%);
    box-shadow: 
      0 4px 10px rgba(0, 0, 0, 0.4),
      0 0 0 0px rgba(93, 125, 232, 0.4);

    &:hover {
      background: linear-gradient(135deg, #6e8efb 0%, #a777e3 100%);
      background-position: 100% 100%;
      box-shadow: 
        0 6px 15px rgba(0, 0, 0, 0.5),
        0 0 0 10px rgba(110, 142, 251, 0.2);
    }

    &:focus {
      outline-color: #a777e3;
    }
  `}

  /* Tooltip */
  &::before {
    content: 'Chat with Health Assistant';
    position: absolute;
    bottom: 80px;
    right: 0;
    background: ${({ theme }) => (theme === 'dark' ? '#444' : '#333')};
    color: #fff;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0s linear 0.3s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 1001;
  }

  &:hover::before,
  &:focus::before {
    opacity: 1;
    visibility: visible;
    transition-delay: 0s;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    bottom: 15px;
    right: 15px;

    svg {
      font-size: 22px;
    }

    &::before {
      font-size: 10px;
      padding: 4px 8px;
      bottom: 70px;
    }
  }

  @media (max-width: 480px) {
    width: 45px;
    height: 45px;
    bottom: 10px;
    right: 10px;

    &:hover {
      transform: scale(1.05);
    }

    &::before {
      bottom: 65px;
    }
  }

  /* Respect reduced motion */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;

    &:hover,
    &:focus {
      transform: scale(1.1); /* Remove 3D rotation */
    }

    &:active::after {
      display: none; /* Disable ripple */
    }
  }

  /* Keyframes */
  @keyframes pulse {
    0% {
      box-shadow: 
        0 0 0 0px rgba(110, 142, 251, 0.4),
        0 4px 10px rgba(0, 0, 0, 0.2);
    }
    70% {
      box-shadow: 
        0 0 0 15px rgba(110, 142, 251, 0),
        0 4px 10px rgba(0, 0, 0, 0.2);
    }
    100% {
      box-shadow: 
        0 0 0 0px rgba(110, 142, 251, 0),
        0 4px 10px rgba(0, 0, 0, 0.2);
    }
  }

  @keyframes gradientFlow {
    0% { background-position: 0% 0%; }
    50% { background-position: 100% 0%; }
    100% { background-position: 0% 0%; }
  }

  @keyframes ripple {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }
`;

const ChatbotModal = styled.div`
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 380px;
  max-height: 80vh;
  background: ${({ theme }) => (theme === 'dark' ? '#2d3748' : '#fff')};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  color: ${({ theme }) => (theme === 'dark' ? '#F5F5F5' : '#333333')};
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: #fff;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
`;

const ModalBody = styled.div`
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background: ${({ theme }) => (theme === 'dark' ? '#1a202c' : '#f8fafc')};
  display: flex;
  flex-direction: column;
  gap: 8px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => (theme === 'dark' ? '#4a5568' : '#d1d8e0')};
    border-radius: 3px;
  }
`;

const MessageStyled = styled.div`
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 6px;
  background: ${({ sender, theme }) =>
    sender === 'bot' ? (theme === 'dark' ? '#4a5568' : '#f1f5fe') : 'linear-gradient(135deg, #6e8efb, #a777e3)'};
  color: ${({ sender, theme }) =>
    sender === 'bot' ? (theme === 'dark' ? '#F5F5F5' : '#333333') : '#fff'};
  align-self: ${({ sender }) => (sender === 'bot' ? 'flex-start' : 'flex-end')};
  border: ${({ sender, theme }) => (sender === 'bot' ? `1px solid ${theme === 'dark' ? '#718096' : '#e2e8f0'}` : 'none')};
  border-bottom-${({ sender }) => (sender === 'bot' ? 'left' : 'right')}-radius: 4px;
  &.is-suggestion {
    background: ${({ theme }) => (theme === 'dark' ? '#4c51bf' : '#e6e0ff')};
    cursor: pointer;
    border: 1px solid ${({ theme }) => (theme === 'dark' ? '#7f9cf5' : '#c7d2fe')};
    &:hover {
      background: ${({ theme }) => (theme === 'dark' ? '#5a67d8' : '#d1ccff')};
    }
  }
`;

const SearchContainer = styled.form`
  padding: 12px;
  border-top: 1px solid ${({ theme }) => (theme === 'dark' ? '#4a5568' : '#e2e8f0')};
  background: ${({ theme }) => (theme === 'dark' ? '#2d3748' : '#fff')};
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => (theme === 'dark' ? '#718096' : '#d1d8e0')};
  font-size: 13px;
  outline: none;
  margin-right: 8px;
  background: ${({ theme }) => (theme === 'dark' ? '#1a202c' : '#fff')};
  color: ${({ theme }) => (theme === 'dark' ? '#F5F5F5' : '#333333')};
  transition: border-color 0.2s;
  &:focus {
    border-color: #6e8efb;
  }
  white-space: pre-wrap; /* Preserve spaces in the input field */
`;

const SubmitButton = styled.button`
  padding: 10px 16px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  &:disabled {
    background: ${({ theme }) => (theme === 'dark' ? '#718096' : '#cbd5e0')};
    cursor: not-allowed;
  }
`;

const SearchResultStyled = styled.div`
  padding: 14px;
  background: ${({ theme }) => (theme === 'dark' ? '#2d3748' : '#fff')};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => (theme === 'dark' ? '#4a5568' : '#e2e8f0')};
  margin-bottom: 12px;
`;

const FilterButton = styled.button`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid ${({ theme }) => (theme === 'dark' ? '#718096' : '#d1d8e0')};
  background: ${({ active, theme }) =>
    active ? 'linear-gradient(135deg, #6e8efb, #a777e3)' : theme === 'dark' ? '#1a202c' : '#fff'};
  color: ${({ active, theme }) => (active ? '#fff' : theme === 'dark' ? '#F5F5F5' : '#333333')};
  display: flex;
  align-items: center;
  gap: 4px;
`;

// Utility Functions
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/[<>{}]/g, '').trim(); // Only remove harmful characters and trim edges
};

const parseCost = (chargeString) => {
  if (!chargeString || typeof chargeString !== 'string') return 0;
  const cost = parseFloat(chargeString.replace(/[^0-9.]/g, ''));
  return isNaN(cost) ? 0 : cost;
};

const formatTime = (date) => {
  return date instanceof Date
    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';
};

const getServiceIcon = (type) => {
  const typeLower = type?.toLowerCase() || '';
  if (typeLower.includes('cardio')) return <IoMdPulse />;
  if (typeLower.includes('dental')) return <FaTooth />;
  if (typeLower.includes('ortho')) return <FaBone />;
  if (typeLower.includes('neuro')) return <GiBrain />;
  return <GiHealthNormal />;
};

const getRandomHospitalTip = () => {
  const tips = [
    'Check if the hospital accepts your insurance.',
    'Book appointments online to save time.',
    'Carry medical records for consultations.',
    'Verify hospital accreditation for quality care.',
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};

// Components
const Message = memo(({ message, onSuggestionClick, isSubmitting, theme }) => (
  <MessageStyled
    sender={message.sender}
    theme={theme}
    className={message.isSuggestion ? 'is-suggestion' : ''}
    onClick={message.isSuggestion && !isSubmitting ? () => onSuggestionClick(null, message.text) : undefined}
    role={message.isSuggestion ? 'button' : 'article'}
    tabIndex={message.isSuggestion ? 0 : -1}
    aria-label={message.isSuggestion ? `Suggested question: ${message.text}` : message.text}
    onKeyDown={(e) => message.isSuggestion && !isSubmitting && e.key === 'Enter' && onSuggestionClick(null, message.text)}
  >
    <div className="message-header">
      {message.icon && <span className="message-icon">{message.icon}</span>}
      <span className="message-text">{message.text}</span>
    </div>
    <div className="message-time">{formatTime(message.timestamp)}</div>
  </MessageStyled>
));

const SearchResult = memo(({ item, theme }) => {
  if (!item) return null;

  const colors = {
    text: theme === 'dark' ? '#f8f9fa' : '#212529',
    background: theme === 'dark' ? '#343a40' : '#ffffff',
    secondaryText: theme === 'dark' ? '#adb5bd' : '#495057',
    icon: theme === 'dark' ? '#4dabf7' : '#228be6',
    ratingEmpty: theme === 'dark' ? '#718096' : '#CBD5E0',
  };

  const rowStyles = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    color: colors.text,
    marginBottom: '6px',
  };

  const iconStyles = {
    color: colors.icon,
    fontSize: '14px',
    marginTop: '2px',
    flexShrink: 0,
  };

  const actionButtonStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  };

  return (
    <SearchResultStyled theme={theme}>
      <div style={{ display: 'flex', gap: '12px' }}>
        {item.h_img ? (
          <img
            src={item.h_img}
            alt={`${item.h_name} logo`}
            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
            onError={(e) => (e.target.src = '/fallback-hospital.png')} // Fallback image
          />
        ) : (
          <FaHospital style={{ width: '80px', height: '80px', color: colors.icon }} />
        )}
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaHospital style={iconStyles} />
            {item.h_name || 'Unknown Hospital'}
          </h4>
          {item.s_name && (
            <div style={rowStyles}>
              <BsHeartPulseFill style={iconStyles} />
              <div style={{ fontSize: '14px' }}>
                <strong>Service:</strong> {item.s_name}
                {item.d_name && ` by Dr. ${item.d_name}`}
              </div>
            </div>
          )}
          {item.s_description && (
            <div style={rowStyles}>
              <FaInfoCircle style={iconStyles} />
              <div style={{ fontSize: '14px' }}>
                <strong>Details:</strong> {item.s_description}
              </div>
            </div>
          )}
          <div style={rowStyles}>
            <FaMapMarkerAlt style={iconStyles} />
            <div style={{ fontSize: '14px' }}>
              <strong>Location:</strong> {item.h_address || 'N/A'}
            </div>
          </div>
          {item.s_charge && (
            <div style={rowStyles}>
              <FaRupeeSign style={iconStyles} />
              <div style={{ fontSize: '14px' }}>
                <strong>Charge:</strong> {item.s_charge}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0', fontSize: '14px' }}>
            <strong>Rating:</strong>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[...Array(5)].map((_, i) => (
                i < 4 ? (
                  <FaStar key={i} style={{ color: '#FFD700', fontSize: '16px' }} />
                ) : (
                  <FaRegStar key={i} style={{ color: colors.ratingEmpty, fontSize: '16px' }} />
                )
              ))}
            </div>
            <span style={{ color: colors.secondaryText }}>4.0</span>
          </div>
          {Array.isArray(item.types) && item.types.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {item.types.map((t, i) => t?.type && (
                <span key={i} className="service-type">
                  {getServiceIcon(t.type)}
                  {t.type}
                </span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <a href="tel:+911234567890" style={{ ...actionButtonStyles, backgroundColor: '#2ecc71', color: 'white' }}>
              <FaPhoneAlt /> Call
            </a>
            <a href="#" style={{ ...actionButtonStyles, backgroundColor: theme === 'dark' ? '#495057' : '#e9ecef', color: colors.text }}>
              <FaCalendarAlt /> Book
            </a>
          </div>
        </div>
      </div>
    </SearchResultStyled>
  );
});

const SkeletonLoader = ({ count }) => (
  <>
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="skeleton-loader"
        style={{
          height: '100px',
          marginBottom: '12px',
          background: '#e2e8f0',
          borderRadius: '10px',
          animation: 'pulse 1.5s infinite',
        }}
      />
    ))}
  </>
);

// Main Component
const LandingPage = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [theme, setTheme] = useState('light');
  const messagesEndRef = useRef(null);
  const modalRef = useRef(null);

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Health Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      icon: <FaRegSmile className="message-icon" />,
    },
    {
      id: 2,
      text: 'Try one of these questions or type your own:',
      sender: 'bot',
      timestamp: new Date(),
      icon: <FaRegLightbulb className="message-icon" />,
    },
    ...SUGGESTED_QUESTIONS.map((q, i) => ({
      id: 3 + i,
      text: q,
      sender: 'bot',
      timestamp: new Date(),
      icon: <FaChevronRight className="message-icon" />,
      isSuggestion: true,
    })),
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, searchResults, typingIndicator]);

  useEffect(() => {
    if (!Array.isArray(maindata) || maindata.length === 0) {
      toast.warn('Hospital data is unavailable. Some queries may not return results.', { toastId: 'data-warning' });
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChatbot = () => {
    setIsChatbotOpen((prev) => !prev);
    if (!isChatbotOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setActiveFilter('all');
      setTimeout(() => modalRef.current?.focus(), 100);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: 1,
        text: "Hello! I'm your Health Assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
        icon: <FaRegSmile className="message-icon" />,
      },
      {
        id: 2,
        text: 'Try one of these questions or type your own:',
        sender: 'bot',
        timestamp: new Date(),
        icon: <FaRegLightbulb className="message-icon" />,
      },
      ...SUGGESTED_QUESTIONS.map((q, i) => ({
        id: 3 + i,
        text: q,
        sender: 'bot',
        timestamp: new Date(),
        icon: <FaChevronRight className="message-icon" />,
        isSuggestion: true,
      })),
    ]);
    setSearchResults([]);
    toast.info('Chat history cleared.', { toastId: 'clear-chat' });
  };

  const addMessage = useCallback((text, sender, icon = null, isSuggestion = false) => {
    setChatMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text,
        sender,
        timestamp: new Date(),
        icon: icon || (sender === 'bot' ? <GiHealthNormal className="message-icon" /> : null),
        isSuggestion,
      },
    ]);
  }, []);

  const processQueryLocally = useCallback((query) => {
    if (!query) {
      return { response: 'Please enter a valid query.', results: [] };
    }

    const lowerQuery = query.toLowerCase().trim();
    let response = '';
    let results = [];

    // Check GENERAL_RESPONSES with case-insensitive exact match
    for (const [question, answer] of Object.entries(GENERAL_RESPONSES)) {
      if (lowerQuery === question.toLowerCase()) {
        return { response: answer, results: [] };
      }
    }

    // Try a more flexible match (partial match for key phrases)
    for (const [question, answer] of Object.entries(GENERAL_RESPONSES)) {
      const lowerQuestion = question.toLowerCase();
      if (lowerQuery.includes(lowerQuestion) || lowerQuestion.includes(lowerQuery)) {
        return { response: answer, results: [] };
      }
    }

    // Parse query for filters
    const filters = {
      city: null,
      service: null,
      cost: { max: null, min: null },
      doctor: null,
      hospital: null,
    };

    const cities = ['vijayawada', 'hyderabad', 'guntur', 'ongole', 'nellore', 'secunderabad'];
    filters.city = cities.find((city) => lowerQuery.includes(city));

    const services = [
      'cardiology', 'dental', 'orthopedic', 'neurology', 'oncology', 'gastroenterology',
      'nephrology', 'ophthalmology', 'psychiatry', 'obstetrics', 'ent', 'pediatric',
      'general surgery', 'infectious diseases'
    ];
    filters.service = services.find((service) => lowerQuery.includes(service));

    const costMatch = lowerQuery.match(/under ₹?(\d+)|₹?(\d+) or less|cost of.*₹?(\d+)/i);
    if (costMatch) {
      const cost = parseInt(costMatch[1] || costMatch[2] || costMatch[3]);
      filters.cost.max = cost * 1000; // Assuming input in thousands
    }

    if (lowerQuery.includes('doctors at')) {
      filters.hospital = lowerQuery.split('doctors at')[1]?.trim();
    } else if (lowerQuery.includes('hospital')) {
      const hospitalMatch = lowerQuery.match(/(\w+\s*hospital)/i);
      if (hospitalMatch) filters.hospital = hospitalMatch[1];
    }

    // Filter maindata
    if (Array.isArray(maindata) && maindata.length > 0) {
      results = maindata.filter((item) => {
        if (!item || typeof item !== 'object') return false;
        const itemCost = parseCost(item.s_charge);
        const addressLower = item.h_address?.toLowerCase() || '';
        const nameLower = item.h_name?.toLowerCase() || '';
        const serviceLower = item.s_name?.toLowerCase() || '';
        const doctorLower = item.d_name?.toLowerCase() || '';

        const cityMatch = !filters.city || addressLower.includes(filters.city);
        const serviceMatch = !filters.service || serviceLower.includes(filters.service);
        const doctorMatch = !filters.doctor || doctorLower.includes(filters.doctor);
        const hospitalMatch = !filters.hospital || nameLower.includes(filters.hospital);
        const costMatch = filters.cost.max !== null ? itemCost <= filters.cost.max && itemCost > 0 : true;

        return cityMatch && serviceMatch && doctorMatch && hospitalMatch && costMatch;
      });
    }

    // Generate response
    if (results.length > 0) {
      response = `Found ${results.length} result(s) for "${query}".`;
    } else if (filters.city || filters.service || filters.hospital || filters.cost.max !== null) {
      response = `No results found for "${query}". Try different keywords or ask something like "best hospitals in Hyderabad" or "cheapest heart checkup".`;
    } else {
      response = 'I can help with hospital searches or general questions. Try something like "hospitals in Hyderabad" or "cheapest heart checkup".';
    }

    return { response, results };
  }, []);

  const handleSearchSubmit = useCallback(
    async (e, suggestion = null, retryCount = 0) => {
      if (e) e.preventDefault();
      if (isSubmitting) return;

      const currentQuery = sanitizeInput(suggestion || searchQuery);
      console.log('Raw Input:', suggestion || searchQuery); // Debug raw input
      console.log('Sanitized Input:', currentQuery); // Debug sanitized input

      if (!currentQuery) {
        toast.error('Please enter a valid search term or question.', { toastId: 'invalid-query' });
        return;
      }

      if (!isChatbotOpen) {
        setIsChatbotOpen(true);
      }

      addMessage(currentQuery, 'user');
      if (!suggestion) setSearchQuery('');
      setIsLoading(true);
      setTypingIndicator(true);
      setIsSubmitting(true);
      setSearchResults([]);
      setActiveFilter('all');

      try {
        const { response, results } = processQueryLocally(currentQuery);
        setTimeout(() => {
          setSearchResults(results);
          setIsLoading(false);
          setTypingIndicator(false);
          setIsSubmitting(false);
          addMessage(response, 'bot', results.length > 0 ? <BsHeartPulseFill /> : <FaInfoCircle />);
          toast.success('Search completed!', { toastId: 'search-success' });
        }, 500);
      } catch (error) {
        console.error('Search error:', error);
        if (retryCount < 2) {
          toast.warn(`Retrying search... Attempt ${retryCount + 2}`, { toastId: 'retry-search' });
          setTimeout(() => handleSearchSubmit(e, suggestion, retryCount + 1), 1000);
        } else {
          toast.error('An error occurred during search. Please try again.', { toastId: 'search-error' });
          setIsLoading(false);
          setTypingIndicator(false);
          setIsSubmitting(false);
          addMessage('Sorry, an error occurred. Please try again.', 'bot', <FaInfoCircle />);
        }
      }
    },
    [addMessage, processQueryLocally, isSubmitting, searchQuery, isChatbotOpen]
  );

  const debouncedSearchSubmit = useMemo(
    () => debounce((e, suggestion) => handleSearchSubmit(e, suggestion), 500, { leading: false, trailing: true }),
    [handleSearchSubmit]
  );

  const filterResults = useCallback((type) => {
    setActiveFilter(type);
    toast.info(`Filtered to ${type} services.`, { toastId: `filter-${type}` });
  }, []);

  const filteredResults = useMemo(() => {
    if (activeFilter === 'all') return searchResults;
    return searchResults.filter((item) =>
      Array.isArray(item?.types) && item.types.some((t) => t?.type?.toLowerCase() === activeFilter.toLowerCase())
    );
  }, [searchResults, activeFilter]);

  const scrollToTop = () => {
    modalRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      <AppContainer theme={theme}>
        <ToastContainer position="top-right" autoClose={3000} theme={theme} />
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
            * { box-sizing: border-box; }
            .message-header { display: flex; align-items: flex-start; gap: 6px; }
            .message-icon { font-size: 14px; color: #6e8efb; }
            .user-message .message-icon { display: none; }
            .message-time {
              font-size: 10px;
              opacity: 0.7;
              margin-top: 4px;
              text-align: right;
              color: ${theme === 'dark' ? '#F5F5F5' : '#333333'};
            }
            .bot-message .message-time { text-align: left; }
            .result-icon { color: #6e8efb; font-size: 14px; margin-top: 2px; }
            .service-type {
              display: inline-flex;
              align-items: center;
              background: ${theme === 'dark' ? '#4a5568' : '#eef2ff'};
              color: ${theme === 'dark' ? '#F5F5F5' : '#333333'};
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 11px;
              margin-right: 6px;
              margin-bottom: 6px;
              gap: 4px;
            }
            .action-button {
              padding: 8px 14px;
              background: #6e8efb;
              color: #fff;
              border-radius: 6px;
              font-size: 12px;
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              gap: 6px;
            }
            .action-button:hover { background: #5d7de8; }
            .health-tip {
              padding: 12px;
              background: ${theme === 'dark' ? '#4a5568' : '#f0f7ff'};
              border-radius: 10px;
              display: flex;
              gap: 8px;
              margin-bottom: 12px;
            }
            .tip-icon { color: #6e8efb; font-size: 16px; }
            .tip-content {
              font-size: 12px;
              color: ${theme === 'dark' ? '#F5F5F5' : '#333333'};
            }
            .results-count {
              font-size: 12px;
              color: ${theme === 'dark' ? '#F5F5F5' : '#333333'};
              margin-bottom: 12px;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            .typing-indicator {
              display: flex;
              align-items: center;
              padding: 10px 14px;
              background: ${theme === 'dark' ? '#4a5568' : '#f1f5fe'};
              border-radius: 16px;
              align-self: flex-start;
              border: 1px solid ${theme === 'dark' ? '#718096' : '#e2e8f0'};
              border-bottom-left-radius: 4px;
              margin-bottom: 6px;
            }
            .typing-text {
              margin-left: 8px;
              font-size: 13px;
              color: ${theme === 'dark' ? '#F5F5F5' : '#333333'};
            }
            .typing-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #6e8efb;
              margin: 0 2px;
              animation: typingAnimation 1.2s infinite;
            }
            @keyframes typingAnimation {
              0%, 80%, 100% { opacity: 0.4; }
              40% { opacity: 1; }
            }
            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }
            .no-results {
              text-align: center;
              padding: 16px;
              color: ${theme === 'dark' ? '#F5F5F5' : '#333333'};
              font-size: 13px;
              background: ${theme === 'dark' ? '#2d3748' : '#f8fafc'};
              border-radius: 10px;
              border: 1px dashed ${theme === 'dark' ? '#718096' : '#e2e8f0'};
            }
            @keyframes pulse {
              0% { opacity: 0.6; }
              50% { opacity: 1; }
              100% { opacity: 0.6; }
            }
          `}
        </style>

        <HeaderPage />
        <MiddlePage />
        <FooterPage />

        <ChatbotIcon onClick={toggleChatbot} role="button" aria-label="Toggle Health Assistant">
          {isChatbotOpen ? <FaTimes style={{ color: '#fff', fontSize: '24px' }} /> : <FaCommentMedical style={{ color: '#fff', fontSize: '26px' }} />}
        </ChatbotIcon>

        {isChatbotOpen && (
          <ChatbotModal theme={theme} ref={modalRef} tabIndex={-1}>
            <ModalHeader>
              <ModalTitle>
                <IoMdPulse style={{ fontSize: '18px' }} /> Health Assistant
              </ModalTitle>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  onClick={toggleTheme}
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <button
                  onClick={clearChat}
                  aria-label="Clear chat history"
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  Clear
                </button>
                <span
                  className="close-icon"
                  onClick={toggleChatbot}
                  role="button"
                  aria-label="Close Chat"
                  style={{ cursor: 'pointer', padding: '4px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <FaTimes />
                </span>
              </div>
            </ModalHeader>

            <ModalBody theme={theme}>
              {chatMessages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  onSuggestionClick={debouncedSearchSubmit}
                  isSubmitting={isSubmitting}
                  theme={theme}
                />
              ))}

              {typingIndicator && (
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                  <span className="typing-text">Assistant is typing...</span>
                </div>
              )}

              {!isLoading && !typingIndicator && filteredResults.length > 0 && (
                <>
                  <div className="health-tip">
                    <FaRegLightbulb className="tip-icon" />
                    <div className="tip-content">{getRandomHospitalTip()}</div>
                  </div>
                  <div className="results-count">
                    <FaInfoCircle /> Showing {filteredResults.length} service(s)
                  </div>
                  <div className="filters-container" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <FilterButton theme={theme} active={activeFilter === 'all'} onClick={() => filterResults('all')}>
                      All
                    </FilterButton>
                    <FilterButton theme={theme} active={activeFilter === 'cardiology'} onClick={() => filterResults('cardiology')}>
                      <IoMdPulse /> Cardiology
                    </FilterButton>
                    <FilterButton theme={theme} active={activeFilter === 'dental'} onClick={() => filterResults('dental')}>
                      <FaTooth /> Dental
                    </FilterButton>
                    <FilterButton theme={theme} active={activeFilter === 'orthopedic'} onClick={() => filterResults('orthopedic')}>
                      <FaBone /> Orthopedic
                    </FilterButton>
                    <FilterButton theme={theme} active={activeFilter === 'neurology'} onClick={() => filterResults('neurology')}>
                      <GiBrain /> Neurology
                    </FilterButton>
                  </div>
                </>
              )}

              {isLoading && <SkeletonLoader count={3} />}
              {filteredResults.map((item) => (
                <SearchResult key={item.id} item={item} theme={theme} />
              ))}

              {!isLoading && !typingIndicator && filteredResults.length === 0 && chatMessages.length > 2 && (
                <div className="no-results">
                  <FaInfoCircle style={{ fontSize: '24px', marginBottom: '8px', color: '#a777e3' }} />
                  <p>No services found.</p>
                  <p>Try different search terms or check predefined questions.</p>
                </div>
              )}

              <div ref={messagesEndRef} />
              {filteredResults.length > 3 && (
                <button
                  onClick={scrollToTop}
                  style={{
                    position: 'sticky',
                    bottom: '10px',
                    alignSelf: 'flex-end',
                    background: '#6e8efb',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label="Scroll to top"
                >
                  <FaArrowUp />
                </button>
              )}
            </ModalBody>

            <SearchContainer
              onSubmit={(e) => {
                e.preventDefault();
                debouncedSearchSubmit(e);
              }}
              theme={theme}
            >
              <SearchInput
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const rawInput = e.target.value;
                  console.log('Raw Input onChange:', rawInput); // Debug raw input
                  setSearchQuery(rawInput); // Store raw input for display
                }}
                placeholder="Search hospitals, services, or ask a question..."
                disabled={isLoading || typingIndicator || isSubmitting}
                aria-label="Search hospitals or services"
                theme={theme}
                autoFocus
              />
              <SubmitButton
                type="submit"
                disabled={isLoading || typingIndicator || isSubmitting || !searchQuery.trim()}
                aria-label="Submit search"
                theme={theme}
              >
                <FaSearch /> {isLoading || typingIndicator ? 'Searching...' : 'Search'}
              </SubmitButton>
            </SearchContainer>
          </ChatbotModal>
        )}
      </AppContainer>
    </ErrorBoundary>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', background: '#fff', minHeight: '100vh', color: '#333333' }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message || 'An unexpected error occurred.'}</p>
          <button
            onClick={this.resetError}
            style={{ padding: '10px 20px', cursor: 'pointer', background: '#6e8efb', color: '#fff', border: 'none', borderRadius: '5px' }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default LandingPage;