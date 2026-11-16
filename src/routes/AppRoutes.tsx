import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Home } from '../pages/Home';
import { Shop } from '../pages/Shop';
import { FashionDepartment } from '../pages/FashionDepartment';
import { Collections } from '../pages/Collections';
import { ProductDetails } from '../pages/ProductDetails';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';

export const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/men" element={<FashionDepartment gender="men" />} />
        <Route path="/women" element={<FashionDepartment gender="women" />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Navigate to="/shop" replace />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};
