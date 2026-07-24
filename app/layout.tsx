import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BRC-20 Explorer & Ledger",
  description: "A professional dashboard to explore BRC-20 tokens, inscriptions, and account ledgers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;

                // Wrap Object.defineProperty to catch wallet injection conflicts (e.g. ethereum, isZerion)
                var origDefineProperty = Object.defineProperty;
                Object.defineProperty = function(obj, prop, descriptor) {
                  try {
                    return origDefineProperty.call(this, obj, prop, descriptor);
                  } catch (err) {
                    if (
                      prop === 'ethereum' ||
                      prop === 'isZerion' ||
                      (err && err.message && (err.message.includes('Cannot redefine property') || err.message.includes('redefine')))
                    ) {
                      try {
                        if (obj && prop in obj) {
                          obj[prop] = descriptor.value;
                        }
                      } catch (_) {}
                      return obj;
                    }
                    throw err;
                  }
                };

                // Catch uncaught window errors related to property redefinitions
                window.addEventListener('error', function(event) {
                  if (
                    event &&
                    event.message &&
                    (event.message.includes('Cannot redefine property: ethereum') ||
                     event.message.includes('Cannot redefine property: isZerion') ||
                     event.message.includes('Cannot redefine property'))
                  ) {
                    if (typeof event.stopImmediatePropagation === 'function') {
                      event.stopImmediatePropagation();
                    }
                    if (typeof event.preventDefault === 'function') {
                      event.preventDefault();
                    }
                    return true;
                  }
                }, true);

                // Catch unhandled promise rejections related to property redefinitions
                window.addEventListener('unhandledrejection', function(event) {
                  if (
                    event &&
                    event.reason &&
                    event.reason.message &&
                    (event.reason.message.includes('Cannot redefine property: ethereum') ||
                     event.reason.message.includes('Cannot redefine property: isZerion') ||
                     event.reason.message.includes('Cannot redefine property'))
                  ) {
                    if (typeof event.stopImmediatePropagation === 'function') {
                      event.stopImmediatePropagation();
                    }
                    if (typeof event.preventDefault === 'function') {
                      event.preventDefault();
                    }
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

