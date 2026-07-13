import type {Metadata} from 'next';
import {Space_Grotesk, Inter, JetBrains_Mono} from 'next/font/google';
import './globals.css'; // Global styles

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jbMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export async function generateMetadata(): Promise<Metadata> {
  const url = process.env.APP_URL || "https://ais-dev-3ha42ql6od4ltyr7xb3efd-615601803900.asia-southeast1.run.app";
  return {
    title: 'Base BRC20 Launchpad',
    description: 'Fair launch BRC-20 style custom tokens instantly on the Base chain with zero code.',
    other: {
      'fc:miniapp': JSON.stringify({
        version: 'next',
        imageUrl: 'https://picsum.photos/seed/brc20hero/800/400',
        button: {
          title: 'Launch BRC20 Launchpad',
          action: {
            type: 'launch_miniapp',
            name: 'Base BRC20 Launchpad',
            url: url,
            splashImageUrl: 'https://picsum.photos/seed/brc20splash/400/400',
            splashBackgroundColor: '#09090b',
          },
        },
      }),
    },
  };
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jbMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var originalDefineProperty = Object.defineProperty;
                  Object.defineProperty = function(obj, prop, descriptor) {
                    try {
                      return originalDefineProperty(obj, prop, descriptor);
                    } catch (e) {
                      if (e instanceof TypeError && (
                        String(e.message).includes('redefine') || 
                        String(e.message).includes('isZerion') || 
                        String(e.message).includes('ethereum')
                      )) {
                        console.warn('Prevented fatal property redefinition error for:', prop, e.message);
                        try {
                          obj[prop] = descriptor.value;
                        } catch (_err) {}
                        return obj;
                      }
                      throw e;
                    }
                  };
                } catch (err) {
                  console.error('Failed to initialize wallet redefinition shield:', err);
                }
              })();
            `
          }}
        />
      </head>
      <body className="bg-[#02050a] text-white font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
