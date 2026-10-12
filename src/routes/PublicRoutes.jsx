import React from 'react';
import { Route } from 'react-router-dom';
import Layout from '../layouts/public/Layout';
import { HomePage as Home } from '../modules/public/home';
import { BlogPage as Blog } from '../modules/public/blog';

const PublicRoutes = (
  <>
    <Route path="/" element={
      <Layout>
        <Home />
      </Layout>
    } />
    <Route path="/blog" element={
      <Layout>
        <Blog />
      </Layout>
    } />
  </>
);

export default PublicRoutes;
