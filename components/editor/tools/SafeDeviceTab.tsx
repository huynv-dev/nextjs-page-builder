'use client';

import { withEditorContext } from '../wrappers/withEditorContext';
import { DeviceTab } from './DeviceTab';

/**
 * A version of DeviceTab that's safe to use outside of Editor context
 * This component will automatically be wrapped in an Editor context if needed
 */
export const SafeDeviceTab = withEditorContext(DeviceTab); 