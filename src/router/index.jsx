import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";

const HomePage = lazy(() => import("@/components/pages/HomePage"));
const ProductDetailPage = lazy(() => import("@/components/pages/ProductDetailPage"));
const CartPage = lazy(() => import("@/components/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/components/pages/CheckoutPage"));
const OrderConfirmationPage = lazy(() => import("@/components/pages/OrderConfirmationPage"));
const OrdersPage = lazy(() => import("@/components/pages/OrdersPage"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto"></div>
      <p className="text-primary font-medium">Loading...</p>
    </div>
  </div>
);

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <HomePage />
      </Suspense>
    )
  },
  {
    path: "product/:id",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ProductDetailPage />
      </Suspense>
    )
  },
  {
    path: "cart",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <CartPage />
      </Suspense>
    )
  },
  {
    path: "checkout",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <CheckoutPage />
      </Suspense>
    )
  },
  {
    path: "order-confirmation/:id",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <OrderConfirmationPage />
      </Suspense>
    )
  },
  {
    path: "orders",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <OrdersPage />
      </Suspense>
    )
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    )
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);