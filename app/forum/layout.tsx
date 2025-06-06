export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="py-24 max-w-2xl mx-auto">{children}</div>;
}
