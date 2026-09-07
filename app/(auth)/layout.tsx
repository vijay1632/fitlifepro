export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="landing-shell relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      <div className="landing-orb landing-orb-one" />
      <div className="landing-orb landing-orb-two" />
      {children}
    </div>
  );
}
