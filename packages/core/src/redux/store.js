/*
 * Axelor Business Solutions
 *
 * Copyright (C) 2025 Axelor (<http://axelor.com>).
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License, version 3,
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {configureStore} from '@reduxjs/toolkit';
import * as coreReducers from '../features';

export const configGlobalStore = externalReducers => {
  return configureStore({
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        immutableCheck: {
          // Increase timeout threshold from default 32ms to 128ms
          warnAfter: 128,
          // Ignore paths with large, trusted data that don't need mutation checking
          ignoredPaths: [
            // Add specific paths to large state slices you trust
            // Example: 'project.fullProjectList', 'cache.largeDataSet'
          ],
        },
        serializableCheck: {
          // Increase timeout for serializable checks
          warnAfter: 128,
          // Ignore specific action types that might contain non-serializable data
          ignoredActions: [
            // Add action types that contain functions, dates, etc.
            // Example: 'form/SET_FIELD_DEPENDENCY'
          ],
          ignoredActionsPaths: [
            // Ignore specific paths in actions
            // Example: 'payload.callback', 'meta.timestamp'
          ],
          ignoredPaths: [
            // Ignore state paths with non-serializable data
            // Example: 'form.fieldValidators', 'ui.componentRefs'
          ],
        },
      }),
    // Enable Redux DevTools in development only
    devTools: process.env.NODE_ENV !== 'production' && {
      // Limit the number of actions stored in DevTools to prevent memory issues
      maxAge: 50,
      // Collapse actions by default to improve performance
      actionsBlacklist: [],
      // Serialize action and state sanitizers
      actionSanitizer: action => ({
        ...action,
        // Remove large payloads from DevTools display
        payload:
          action.payload &&
          typeof action.payload === 'object' &&
          Object.keys(action.payload).length > 20
            ? '[Large Object]'
            : action.payload,
      }),
    },
    reducer: {
      ...coreReducers,
      ...externalReducers,
    },
  });
};
