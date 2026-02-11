import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

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
          href: 'https://www.nuget.org/packages/CSharpNumerics/',
          label: 'NuGet',
          position: 'right',
        },
        {
          href: 'https://github.com/backlundtransform/CSharpNumerics',
          label: 'GitHub',
          position: 'right',
        },
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
              label: '🔭 ExoplanetHunter 3D',
              href: 'https://exoplanethunter.com/astro3d',
            },
            {
              label: '🌍 ExoplanetHunter',
              href: 'https://exoplanethunter.com/',
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
              label: '🐙 GitHub',
              href: 'https://github.com/backlundtransform',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} Backlund Transform — From theory to code.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['csharp'],
      
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
