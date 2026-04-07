export { auth as middleware } from "@/auth"

export const config = {
  // every time a route is matched with this, it runs this middleware
  matcher: ["/(protected)/:path*"]
}