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
    href: '/docs/Charpnumerics/Numerical analysis/',
    description: (
      <>
        Robust tools for root finding, integration, solving differential equations, 
        and linear algebra routines.
      </>
    ),
  },
  {
    title: 'Statistics & Data',
    Svg: require('@site/static/img/undraw_statistics.svg').default,
    href: '/docs/Charpnumerics/Statistics/',
    description: (
      <>
        Perform distributions, hypothesis testing, regression, and data analysis
        directly in CSharpNumerics.
      </>
    ),
  },
  {
    title: 'Machine Learning',
    Svg: require('@site/static/img/undraw_machine_learning.svg').default,
    href: '/docs/Charpnumerics/Machine learning/',
    description: (
      <>
        Foundations for crossvalidation, regression, classification and optimization designed for explainability and numerical stability.
      </>
    ),
  }, {
    title: 'Physics',
    Svg: require('@site/static/img/undraw_physics.svg').default,
    href: '/docs/Charpnumerics/Physics/',
    description: (
      <>
        Mathematical tools and models inspired by classical and computational physics applications.
      </>
    ),
  },
];

function Feature({title, Svg, description, href}: FeatureItem) {
  return (
    <div className={clsx('col col--3')}>
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
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
