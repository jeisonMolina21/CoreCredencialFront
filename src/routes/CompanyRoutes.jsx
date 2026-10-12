import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import CompanyLayout from '../layouts/company/CompanyLayout';

import { HomePage as CompanyHome } from '../modules/company/home';
import { AreasPage as Areas } from '../modules/company/areas';
import { RolesPage as Roles } from '../modules/company/roles';
import { UsersPage as CompanyUsers } from '../modules/company/users';
import { CarnetsPage as Carnets } from '../modules/company/carnets';
import { TemplatesPage as Templates } from '../modules/company/templates';
import { ParameterPage as CompanyParameter } from '../modules/company/parameter';
import { SubscriptionPage as CompanySubscription } from '../modules/company/subscription';
import { HeadquartersPage as Headquarters } from '../modules/company/headquarters';

const CompanyRoutes = (
  <>
    <Route path="/company/home" element={
      <ProtectedRoute>
        <CompanyLayout>
          <CompanyHome />
        </CompanyLayout>
      </ProtectedRoute>
    } />
    <Route path="/company/headquarters" element={
      <ProtectedRoute>
        <CompanyLayout>
          <Headquarters />
        </CompanyLayout>
      </ProtectedRoute>
    } />
    <Route path="/company/areas" element={
      <ProtectedRoute>
        <CompanyLayout>
          <Areas />
        </CompanyLayout>
      </ProtectedRoute>
    } />
    <Route path="/company/cargos" element={
      <ProtectedRoute>
        <CompanyLayout>
          <Roles />
        </CompanyLayout>
      </ProtectedRoute>
    } />
    <Route path="/company/users" element={
      <ProtectedRoute>
        <CompanyLayout>
          <CompanyUsers />
        </CompanyLayout>
      </ProtectedRoute>
    } />
    <Route path="/company/carnets" element={
      <ProtectedRoute>
        <CompanyLayout>
          <Carnets />
        </CompanyLayout>
      </ProtectedRoute>
    } />
    <Route path="/company/templates" element={
      <ProtectedRoute>
        <CompanyLayout>
          <Templates />
        </CompanyLayout>
      </ProtectedRoute>
    } />
    <Route path="/company/parameter" element={
      <ProtectedRoute>
        <CompanyLayout>
          <CompanyParameter />
        </CompanyLayout>
      </ProtectedRoute>
    } />
    <Route path="/company/subscription" element={
      <ProtectedRoute>
        <CompanyLayout>
          <CompanySubscription />
        </CompanyLayout>
      </ProtectedRoute>
    } />
  </>
);

export default CompanyRoutes;
