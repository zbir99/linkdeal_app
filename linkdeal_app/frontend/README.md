# 🎓 LinkDeal - AI-Powered Mentorship Platform

<div align="center">

![LinkDeal Logo](src/assets/landing_page/images/logo_light_mode.png)

**Coaching IA & Mentoring Humain**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.6-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

*Accelerate your learning with intelligence*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Documentation](#-documentation)

</div>

---

## 📖 About LinkDeal

LinkDeal is a modern, comprehensive mentorship platform that combines AI-powered coaching with human mentoring. The platform connects mentees with experienced mentors while providing AI-assisted learning tools to enhance the learning experience.

### 🎯 Key Highlights

- **Three Role-Based Applications**: Separate dashboards for Mentees, Mentors, and Admins
- **AI-Powered Chat**: Integrated AI assistant for instant learning support
- **Real-Time Video Calls**: Built-in video conferencing for mentorship sessions
- **Smart Booking System**: Intuitive session scheduling with availability management
- **Review & Rating System**: Quality assurance through peer reviews
- **Support Ticket System**: Comprehensive customer support with real-time chat
- **Progress Tracking**: Visual analytics and performance monitoring
- **Responsive Design**: Seamless experience across all devices

---

## ✨ Features

### 👥 For Mentees

- **🔍 Mentor Discovery**: Search and filter mentors by expertise, rating, and availability
- **📅 Session Booking**: Easy 4-step booking process with calendar integration
- **🤖 AI Chat Assistant**: 24/7 AI-powered learning companion
- **📊 Progress Dashboard**: Track learning goals, session history, and achievements
- **💬 Real-Time Support**: Instant support through integrated ticket system
- **⭐ Review System**: Rate and review mentors after sessions
- **💳 Payment History**: Track all transactions and invoices
- **🎥 Video Sessions**: High-quality video calls with screen sharing

### 👨‍🏫 For Mentors

- **📈 Analytics Dashboard**: Comprehensive statistics and performance metrics
- **📋 Mentee Management**: Track and manage all your mentees
- **🗓️ Availability Settings**: Flexible schedule management with time slots
- **💰 Pricing Control**: Set and manage session rates
- **📝 Session History**: Complete record of all mentorship sessions
- **⭐ Review Management**: View and respond to mentee feedback
- **🎯 Quick Actions**: Streamlined workflow with sidebar shortcuts
- **👥 Profile Management**: Showcase expertise, certifications, and experience

### 🔧 For Administrators

- **👥 User Management**: Complete control over user accounts and permissions
- **✅ Mentor Validation**: Review and approve mentor applications
- **🎫 Support Tickets**: Manage and respond to user support requests
- **⚙️ Platform Settings**: Configure financial settings and platform rules
- **📊 Dashboard Analytics**: Monitor platform metrics and user activity
- **🔒 Security Controls**: User verification and account management

---

## 🛠️ Tech Stack

### Core Technologies

- **Frontend Framework**: React 18.2.0
- **Language**: TypeScript 5.2.2
- **Build Tool**: Vite 5.0.8
- **Styling**: Tailwind CSS 3.3.6
- **State Management**: Zustand 4.4.7
- **Routing**: React Router DOM 6.20.0
- **Form Handling**: React Hook Form 7.48.2
- **HTTP Client**: Axios 1.6.2

### Development Tools

- **Linting**: ESLint with TypeScript support
- **Code Formatting**: Prettier 3.1.1
- **CSS Processing**: PostCSS & Autoprefixer
- **Type Checking**: TypeScript strict mode

### UI/UX Features

- **Design System**: Custom component library with Tailwind CSS
- **Animations**: CSS transitions and keyframe animations
- **Icons**: Custom SVG icon system
- **Responsive**: Mobile-first design approach
- **Dark Theme**: Custom purple-gradient dark theme
- **Accessibility**: WCAG compliant components

---

## 📁 Project Structure

```
linkdeal/
├── src/
│   ├── apps/                          # Role-based applications
│   │   ├── admin/                     # Admin dashboard
│   │   │   ├── components/           # Admin-specific components
│   │   │   ├── pages/               # Admin pages
│   │   │   └── routes.tsx           # Admin routing
│   │   ├── mentee/                   # Mentee dashboard
│   │   │   ├── components/          # Mentee-specific components
│   │   │   │   ├── dashboard/       # Dashboard components
│   │   │   │   ├── booking/         # Booking flow components
│   │   │   │   ├── ai_chat/         # AI chat interface
│   │   │   │   ├── my_tickets/      # Support tickets
│   │   │   │   └── ...
│   │   │   ├── pages/               # Mentee pages
│   │   │   └── routes.tsx           # Mentee routing
│   │   └── mentor/                   # Mentor dashboard
│   │       ├── components/          # Mentor-specific components
│   │       │   ├── dashboard/       # Dashboard components
│   │       │   ├── availability/    # Schedule management
│   │       │   ├── my_mentees/      # Mentee management
│   │       │   └── ...
│   │       ├── pages/               # Mentor pages
│   │       └── routes.tsx           # Mentor routing
│   ├── assets/                       # Static assets
│   │   ├── landing_page/
│   │   │   └── images/              # Images and logos
│   │   └── ...
│   ├── pages/                        # Shared pages
│   │   └── shared/                  # Login, Signup, Landing
│   ├── store/                        # Global state management
│   │   └── useAppStore.ts          # Zustand store
│   ├── styles/                       # Global styles
│   │   └── index.css               # Tailwind imports & custom CSS
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Application entry point
│   └── vite-env.d.ts               # Vite type declarations
├── public/                           # Public assets
├── .eslintrc.cjs                    # ESLint configuration
├── .prettierrc                      # Prettier configuration
├── index.html                       # HTML entry point
├── package.json                     # Dependencies and scripts
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite configuration
└── README.md                        # This file
```

---

## 🚀 Installation

### Prerequisites

- **Node.js**: >= 16.x
- **npm**: >= 8.x (or yarn/pnpm)
- **Git**: Latest version

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/linkdeal.git
   cd linkdeal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
   ```
   Navigate to: http://localhost:5173
   ```

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

---

## 🗺️ Application Routes

### 🏠 Public Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | User login |
| `/signup` | User registration |
| `/forgot-password` | Password recovery |

### 👤 Mentee Routes

| Route | Description |
|-------|-------------|
| `/mentee/dashboard` | Mentee dashboard |
| `/mentee/profile` | User profile |
| `/mentee/ai-chat` | AI chat assistant |
| `/mentee/find-mentor` | Browse mentors |
| `/mentee/description` | Mentor details |
| `/mentee/booking` | Session booking |
| `/mentee/tickets` | Support tickets list |
| `/mentee/contact-us` | Contact form |
| `/mentee/session-history` | Past sessions |
| `/mentee/video-call` | Video session |
| `/mentee/rate` | Rate session |
| `/mentee/notifications` | Notifications |
| `/mentee/payment-history` | Payment records |

### 👨‍🏫 Mentor Routes

| Route | Description |
|-------|-------------|
| `/mentor/dashboard` | Mentor dashboard |
| `/mentor/profile` | Mentor profile |
| `/mentor/availability` | Schedule management |
| `/mentor/pricing` | Pricing settings |
| `/mentor/my-mentees` | Mentees list |
| `/mentor/history-mentee/:id` | Mentee history |
| `/mentor/all-sessions` | All sessions |
| `/mentor/support-tickets` | Support system |
| `/mentor/notifications` | Notifications |
| `/mentor/video-call` | Video session |

### 🔧 Admin Routes

| Route | Description |
|-------|-------------|
| `/admin/dashboard` | Admin dashboard |
| `/admin/validation` | Mentor validation |
| `/admin/user-management` | User management |
| `/admin/support-tickets` | Support system |
| `/admin/settings` | Platform settings |

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--purple-primary: #7008E7;
--purple-light: #8E51FF;
--purple-lighter: #A684FF;

/* Background Gradients */
--bg-dark-1: #0a0a1a;
--bg-dark-2: #1a1a2e;
--bg-dark-3: #2a1a3e;

/* UI Elements */
--white-opacity-5: rgba(255, 255, 255, 0.05);
--white-opacity-10: rgba(255, 255, 255, 0.1);
--white-opacity-20: rgba(255, 255, 255, 0.2);
```

### Typography

- **Primary Font**: Inter (Headings, UI Elements)
- **Secondary Font**: Arimo (Body text, Descriptions)
- **Display Font**: Almarai (Buttons, CTAs)

### Responsive Breakpoints

```css
/* Tailwind CSS Breakpoints */
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large devices */
2xl: 1536px  /* 2X Extra large devices */
```

---

## 🔧 Key Components

### Shared Components

- **WelcomeHeader**: User greeting with notifications and profile menu
- **StatsCards**: Dashboard statistics display
- **QuickActions**: Sidebar navigation with quick actions
- **SessionDetailsModal**: Session information modal
- **NotificationsList**: Real-time notification feed

### Mentee Components

- **MentorList**: Browse and filter mentors
- **BookingFlow**: 4-step booking process
  - BookingStep1: Select mentor
  - BookingStep2: Choose date/time
  - BookingStep3: Add notes
  - BookingStep4: Review and confirm
- **AIChatButton**: Floating AI assistant button
- **ChatInterface**: AI chat conversation UI
- **SessionHistory**: Past sessions with filters

### Mentor Components

- **AvailabilityManager**: Schedule time slots
- **MenteesList**: View and manage mentees
- **SessionsChart**: Analytics visualization
- **RecentReviews**: Latest mentee feedback
- **PricingSettings**: Session rate configuration

### Admin Components

- **UserTable**: User management table
- **ValidationQueue**: Mentor approval workflow
- **SupportTickets**: Ticket management system
- **SettingsPanel**: Platform configuration

---

## 🎯 Features in Detail

### 1. AI Chat System

The AI chat system provides instant learning support with:

- **Conversation History**: Persistent chat sessions
- **File Upload**: Share documents with AI
- **Responsive Design**: Mobile-optimized interface
- **Sidebar Navigation**: Quick access to chat history
- **Context Menu**: Rename, delete, and share conversations

### 2. Booking System

4-step booking process:

1. **Select Mentor**: Browse and choose from available mentors
2. **Pick Date/Time**: Interactive calendar with availability
3. **Add Details**: Session notes and requirements
4. **Confirmation**: Review and complete booking

### 3. Video Call System

High-quality video conferencing with:

- **Screen Sharing**: Share your screen with mentor/mentee
- **Picture-in-Picture**: Swap between main and thumbnail view
- **Audio/Video Controls**: Mute and camera toggle
- **Custom Backgrounds**: Different backgrounds for each participant

### 4. Support Ticket System

Comprehensive support with:

- **Real-time Chat**: Live messaging with support team
- **File Attachments**: Upload documents and screenshots
- **Priority Levels**: High, Medium, Low priority
- **Status Tracking**: Open, In Progress, Resolved
- **Search & Filter**: Find tickets quickly

### 5. Availability Management

Flexible scheduling:

- **Time Slot Creation**: Add start and end times
- **Weekly Schedule**: Visual calendar view
- **Drag & Drop**: Easy slot management
- **Recurring Events**: Set repeating availability

---

## 🔐 Authentication & Authorization

### User Roles

1. **Mentee**: Students seeking mentorship
2. **Mentor**: Experts providing guidance
3. **Admin**: Platform administrators

### Route Protection

- Public routes: Landing, Login, Signup, Forgot Password
- Protected routes: All dashboard and application routes
- Role-based access: Each role has specific route permissions

---

## 📱 Responsive Design

### Mobile-First Approach

All components are designed with mobile-first principles:

- Touch-friendly interface elements
- Optimized layouts for small screens
- Responsive typography
- Adaptive navigation (hamburger menus)
- Swipeable carousels and lists

### Desktop Enhancements

- Side navigation bars
- Multi-column layouts
- Hover effects and animations
- Larger touch targets
- Enhanced data visualization

---

## 🎨 Custom Styling Features

### Animations

```css
/* Custom animations */
- fadeInUp: Fade in with upward motion
- float: Floating animation for decorative elements
- glow: Pulsing glow effect for buttons
- scale-in: Scale in animation for modals
- blob: Blob animation for backgrounds
```

### Custom Scrollbars

All scrollable areas feature custom purple scrollbars:

```css
[&::-webkit-scrollbar]:w-2
[&::-webkit-scrollbar-thumb]:bg-[#7008E7]
[&::-webkit-scrollbar-thumb]:rounded-full
```

### Glassmorphism

Extensive use of backdrop blur and transparency:

```css
bg-white/5 backdrop-blur-xl
border border-white/10
```

---

## 🧪 Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **Components**: Functional components with hooks
- **Props**: Typed interfaces for all props
- **Naming**: PascalCase for components, camelCase for functions
- **Files**: One component per file

### Component Structure

```typescript
import { FunctionComponent } from 'react';

interface ComponentProps {
  // Props definition
}

const Component: FunctionComponent<ComponentProps> = ({ props }) => {
  // Hooks
  // Functions
  // Return JSX
};

export default Component;
```

### State Management

- **Local State**: useState for component-specific state
- **Global State**: Zustand for shared state
- **Form State**: React Hook Form for forms
- **URL State**: React Router for navigation state

### Styling Conventions

- Tailwind CSS utility classes
- Custom classes in `styles/index.css`
- Responsive utilities (sm:, md:, lg:, xl:)
- Dark theme by default

---

## 📊 Performance Optimization

### Implemented Optimizations

- **Code Splitting**: Lazy loading for routes
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Tree shaking unused code
- **Memoization**: useMemo and useCallback where needed
- **Efficient Re-renders**: Proper component structure

### Build Optimization

```bash
# Production build with optimizations
npm run build

# Analyze bundle size
vite build --mode analyze
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: `npm install` fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Issue**: Port 5173 already in use
```bash
# Change port in vite.config.ts or kill the process
vite --port 3000
```

**Issue**: TypeScript errors
```bash
# Rebuild TypeScript types
npm run build
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**LinkDeal Team** - *Initial work and maintenance*

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vite team for the lightning-fast build tool
- All contributors and testers

---

## 📞 Support

For support and questions:

- **Email**: support@linkdeal.com
- **Documentation**: [docs.linkdeal.com](https://docs.linkdeal.com)
- **Discord**: [Join our community](https://discord.gg/linkdeal)
- **Twitter**: [@LinkDealApp](https://twitter.com/LinkDealApp)

---

## 🗺️ Roadmap

### Current Version (v1.0.0)

- ✅ Multi-role dashboard system
- ✅ AI-powered chat assistant
- ✅ Video conferencing
- ✅ Booking system
- ✅ Support tickets
- ✅ Review system

### Upcoming Features (v1.1.0)

- 🔄 Real-time notifications with WebSocket
- 🔄 Advanced analytics dashboard
- 🔄 Mobile app (React Native)
- 🔄 Integration with calendar apps
- 🔄 Group mentoring sessions
- 🔄 Gamification and badges

### Future Plans (v2.0.0)

- 📋 AI-powered mentor matching
- 📋 Live coding sessions
- 📋 Knowledge base and resources
- 📋 Community forums
- 📋 Certification system
- 📋 API for third-party integrations

---

<div align="center">

**Made with ❤️ by the LinkDeal Team**

⭐ Star us on GitHub — it motivates us a lot!

[Website](https://linkdeal.com) • [Documentation](https://docs.linkdeal.com) • [Support](mailto:support@linkdeal.com)

</div>
