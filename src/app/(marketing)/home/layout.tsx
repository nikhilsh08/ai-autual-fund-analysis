/**
 * Home Page Layout - No global Navbar/Footer (uses its own custom components)
 */

import React from 'react';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
