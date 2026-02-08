import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Csharpnumerics',
  favicon: 'img/logo.png',

  future: {
    v4: true,
  },

  url: 'https://backlundtransform.github.io',
  baseUrl: '/csharpnumerics/',

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
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Csharpnumerics',
      logo: {
        alt: 'Csharpnumerics Logo',
        src: 'img/logo.png',
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
          title: 'Sponsor',
          items: [
            {
              label: 'Support this project',
              href: 'https://github.com/sponsors/backlundtransform', // <-- din sponsor-länk
            },
          ],
        },
        {
          title: 'Reprository',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/backlundtransform/CSharpNumerics',
            },
          ],
        },{
          title: 'Download',
          items: [
            {
              label: 'NuGet',
              href: 'https://www.nuget.org/packages/CSharpNumerics/',
            },
          ],
        },{
          title: 'Playlist',
          items: [
            {
              label: 'Youtube',
              href: 'https://www.youtube.com/playlist?list=PLwIMQE5NbK8_b5lJeoWmlip3WWG--cTqG',
            }
          ],
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Backlundtransform.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['csharp'],
      
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
