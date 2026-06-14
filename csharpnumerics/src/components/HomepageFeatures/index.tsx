import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
  href: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Numerical Analysis',
    Svg: require('@site/static/img/undraw_analysis.svg').default,
    href: '/docs/Csharpnumerics/Numerical analysis/',
    description: (
      <>
        Linear algebra, transforms, ordinary differential equations (ODEs), vector fields, numerical integration, and advanced computational methods.
      </>
    ),
  },
  {
    title: 'Statistics',
    Svg: require('@site/static/img/undraw_statistics.svg').default,
    href: '/docs/Csharpnumerics/Statistics/',
    description: (
      <>
        Descriptive and inferential statistics, probability distributions, stochastic processes, and Monte Carlo simulation.
      </>
    ),
  },
  {
    title: 'Machine Learning',
    Svg: require('@site/static/img/undraw_machine_learning.svg').default,
    href: '/docs/Csharpnumerics/Machine learning/',
    description: (
      <>
        Supervised, unsupervised and reinforcement learning, automated model selection, cross-validation, clustering, and model stability analysis.
      </>
    ),
  }, {
    title: 'Physics',
    Svg: require('@site/static/img/undraw_physics.svg').default,
    href: '/docs/Csharpnumerics/Physics/',
    description: (
      <>
        Classical mechanics, electromagnetics, heat transfer, environmental modeling, quantum computing, and astrophysics.
      </>
    ),
  },
];

function Feature({title, Svg, description, href}: FeatureItem) {
  return (
    <div>
      <Link to={href} className={styles.featureLink}>
        <div className={styles.featureCard}>
          <div className="text--center">
            <Svg className={styles.featureSvg} role="img" />
          </div>
          <div className="text--center padding-horiz--md">
            <Heading as="h3">{title}</Heading>
            <p>{description}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.featureGrid}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
