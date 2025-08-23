'use client';

import RouteOptions from './RouteOptions';

type Props = {
  onCollapse?: () => void;
  isCollapsed?: boolean;
};

export default function RouteOptionsClient(props: Props) {
  return <RouteOptions {...props} />;
}
