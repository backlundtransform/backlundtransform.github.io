import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: 'CSharpNumerics',
  tagline: 'A comprehensive numerical library for C#',
  favicon: 'img/logo.png',

  future: {
    v4: true,
  },

  url: 'https://csnumerics.com',
  baseUrl: '/',

  organizationName: 'backlundtransform',
  projectName: 'csharpnumerics',

  onBrokenLinks: 'throw',

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'algolia-site-verification',
        content: 'E78A9644AF2BBFF8',
      },
    },
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.28/dist/katex.min.css',
      type: 'text/css',
      crossorigin: 'anonymous',
    },
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        // Vi tar bort blog helt
        blog: false,
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/CsharpNumerics.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'CSharpNumerics',
      logo: {
        alt: 'CSharpNumerics Logo',
        src: 'img/logo.png',
        srcDark: 'img/logo.png',
        style: {borderRadius: '6px'},
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {
          to: '/changelog',
          label: 'Changelog',
          position: 'left',
        },
        {
          href: 'https://www.nuget.org/packages/CSharpNumerics/',
          label: 'NuGet',
          position: 'right',
        },
        {
          href: 'https://github.com/backlundtransform/CSharpNumerics',
          label: 'GitHub',
          position: 'right',
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Resources',
          items: [
          
            {
              label: '📦 NuGet',
              href: 'https://www.nuget.org/packages/CSharpNumerics/',
            },
            {
              label: '📂 GitHub',
              href: 'https://github.com/backlundtransform/CSharpNumerics',
            },
            {
              label: '🎬 YouTube',
              href: 'https://www.youtube.com/playlist?list=PLwIMQE5NbK8_b5lJeoWmlip3WWG--cTqG',
            },
          ],
        },
        {
          title: 'Projects',
          items: [
            {
              label: '🪐 Exoplanet Hunter',
              href: 'https://exoplanethunter.com/',
            },
                {
                  label: '☢️ Riskz',
                  href: 'https://riskz.labz.se/',
                }
          ],
        },
        {
          title: 'Connect',
          items: [
            {
              label: '💜 Sponsor',
              href: 'https://github.com/sponsors/backlundtransform',
            },
            {
              label: '💼 LinkedIn',
              href: 'https://www.linkedin.com/in/g%C3%B6ran-b%C3%A4cklund-b4343b3b/',
            },
            {
              label: ' 𝕏 Twitter',
              href: 'https://x.com/goran_backlund',
            },
           
          ],
        }, {
          title: 'Legal',
          items: [
           
            {
              label: '🔒 Privacy Policy',
              to: '/privacy',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} <a href="https://github.com/backlundtransform" target="_blank" rel="noopener noreferrer">Backlund Transform</a> — From theory to code.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['csharp'],
      
    },
    algolia: {
      appId: 'V9K0X7CSTJ',
      apiKey: 'c2f5fa260a4ab8caf4ada94d55b6c504',
      indexName: 'CsharpNumerics AI',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
