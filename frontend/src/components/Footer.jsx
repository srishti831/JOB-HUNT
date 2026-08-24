import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
                J
              </div>
              <span className="text-xl font-bold text-white">JobHunt</span>
            </div>

            <p className="max-w-sm text-sm leading-6 text-gray-400">
              Find your next opportunity and build the career you've always
              wanted. Connect with great companies and discover jobs that fit
              your skills.
            </p>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Job Seekers
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <a href="/jobs" className="transition hover:text-blue-400">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a href="/companies" className="transition hover:text-blue-400">
                  Explore Companies
                </a>
              </li>
              <li>
                <a href="/saved-jobs" className="transition hover:text-blue-400">
                  Saved Jobs
                </a>
              </li>
              <li>
                <a href="/applications" className="transition hover:text-blue-400">
                  My Applications
                </a>
              </li>
              <li>
                <a href="/profile" className="transition hover:text-blue-400">
                  My Profile
                </a>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Employers
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <a href="/post-job" className="transition hover:text-blue-400">
                  Post a Job
                </a>
              </li>
              <li>
                <a href="/candidates" className="transition hover:text-blue-400">
                  Find Candidates
                </a>
              </li>
              <li>
                <a href="/employer/dashboard" className="transition hover:text-blue-400">
                  Employer Dashboard
                </a>
              </li>
              <li>
                <a href="/pricing" className="transition hover:text-blue-400">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <a href="/about" className="transition hover:text-blue-400">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="transition hover:text-blue-400">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="transition hover:text-blue-400">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="transition hover:text-blue-400">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/help" className="transition hover:text-blue-400">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-gray-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} JobHunt. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            {/* LinkedIn */}
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-gray-400 transition hover:text-blue-400"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.68H9.35V8.99h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM3.56 8.99h3.57v11.46H3.56V8.99z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="#"
              aria-label="GitHub"
              className="text-gray-400 transition hover:text-white"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.8 1.3 3.48.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6.01 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5z" />
              </svg>
            </a>

            {/* Twitter / X */}
            <a
              href="#"
              aria-label="Twitter"
              className="text-gray-400 transition hover:text-white"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.24-8.28L2.8 2h6.4l4.42 5.84L18.9 2zm-1.1 17.82h1.73L8.28 4.08H6.43L17.8 19.82z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;