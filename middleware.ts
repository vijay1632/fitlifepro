import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/workout/:path*", "/nutrition/:path*", "/progress/:path*", "/membership/:path*"],
};
