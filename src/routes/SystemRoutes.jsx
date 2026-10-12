import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import SystemLayout from '../layouts/system/SystemLayout';

import { HomePage as SystemHome } from '../modules/system/home';
import { PlansPage as Plans } from '../modules/system/plans';
import { SubscriptionsPage as Subscriptions } from '../modules/system/subscriptions';
import { CompaniesPage as Companies } from '../modules/system/companies';
import { UsersPage as SystemUsers } from '../modules/system/users';
import { RolesPage as SystemRols } from '../modules/system/roles';
import { ParametersPage as SystemParameters } from '../modules/system/parameters';

const SystemRoutes = (
  <>
    <Route path="/system/home" element={
      <ProtectedRoute roleRequired="admin">
        <SystemLayout>
          <SystemHome />
        </SystemLayout>
      </ProtectedRoute>
    } />
    <Route path="/system/plans" element={
      <ProtectedRoute roleRequired="admin">
        <SystemLayout>
          <Plans />
        </SystemLayout>
      </ProtectedRoute>
    } />
    <Route path="/system/subscriptions" element={
      <ProtectedRoute roleRequired="admin">
        <SystemLayout>
          <Subscriptions />
        </SystemLayout>
      </ProtectedRoute>
    } />
    <Route path="/system/companies" element={
      <ProtectedRoute roleRequired="admin">
        <SystemLayout>
          <Companies />
        </SystemLayout>
      </ProtectedRoute>
    } />
    <Route path="/system/users" element={
      <ProtectedRoute roleRequired="admin">
        <SystemLayout>
          <SystemUsers />
        </SystemLayout>
      </ProtectedRoute>
    } />
    <Route path="/system/roles" element={
      <ProtectedRoute roleRequired="admin">
        <SystemLayout>
          <SystemRols />
        </SystemLayout>
      </ProtectedRoute>
    } />
    <Route path="/system/parameters" element={
      <ProtectedRoute roleRequired="admin">
        <SystemLayout>
          <SystemParameters />
        </SystemLayout>
      </ProtectedRoute>
    } />
  </>
);

export default SystemRoutes;
